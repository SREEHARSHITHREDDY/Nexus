-- ============================================================
-- NEXUS — Migration 001: Initial Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ────────────────────────────────────────────────────
CREATE TYPE user_plan AS ENUM ('free','pro','founder','team','enterprise');

CREATE TABLE users (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                TEXT NOT NULL UNIQUE,
  name                 TEXT NOT NULL,
  avatar_url           TEXT,
  password_hash        TEXT,
  provider             TEXT DEFAULT 'email',
  provider_id          TEXT,
  timezone             TEXT NOT NULL DEFAULT 'UTC',
  plan                 user_plan NOT NULL DEFAULT 'free',
  email_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ
);

CREATE TABLE user_profiles (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  deep_work_hours             INTEGER[] DEFAULT '{}',
  avg_task_duration_accuracy  FLOAT NOT NULL DEFAULT 1.0,
  energy_pattern_by_day       JSONB NOT NULL DEFAULT '{}',
  preferred_session_duration  INTEGER NOT NULL DEFAULT 90,
  buffer_percentage           INTEGER NOT NULL DEFAULT 20,
  behavioral_model            JSONB NOT NULL DEFAULT '{}',
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_settings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  reflection_day        SMALLINT NOT NULL DEFAULT 0,
  reflection_hour       SMALLINT NOT NULL DEFAULT 20,
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  voice_enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  voice_id              TEXT,
  theme                 TEXT NOT NULL DEFAULT 'system',
  week_starts_on        SMALLINT NOT NULL DEFAULT 1,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked     BOOLEAN NOT NULL DEFAULT FALSE,
  device_info JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── IDEAS ─────────────────────────────────────────────────────
CREATE TYPE idea_status AS ENUM ('raw','enriching','enriched','grouped','decided','archived','promoted');

CREATE TABLE ideas (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             TEXT,
  raw_input         TEXT NOT NULL,
  summary           TEXT,
  domain            TEXT,
  status            idea_status NOT NULL DEFAULT 'raw',
  priority          SMALLINT NOT NULL DEFAULT 5,
  tags              TEXT[] DEFAULT '{}',
  related_memory_ids UUID[] DEFAULT '{}',
  related_idea_ids  UUID[] DEFAULT '{}',
  from_voice        BOOLEAN NOT NULL DEFAULT FALSE,
  audio_url         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

-- ── DECISIONS ─────────────────────────────────────────────────
CREATE TYPE decision_status AS ENUM ('draft','committed','in_review','closed');

CREATE TABLE decisions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  context             TEXT NOT NULL,
  options_considered  TEXT[] NOT NULL DEFAULT '{}',
  chosen_option       TEXT NOT NULL,
  rationale           TEXT NOT NULL,
  confidence          SMALLINT NOT NULL CHECK (confidence BETWEEN 1 AND 10),
  expected_outcome    TEXT NOT NULL,
  review_at           DATE NOT NULL,
  actual_outcome      TEXT,
  post_mortem_delta   TEXT,
  outcome_recorded_at TIMESTAMPTZ,
  status              decision_status NOT NULL DEFAULT 'draft',
  related_idea_ids    UUID[] DEFAULT '{}',
  related_plan_ids    UUID[] DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

CREATE TABLE decision_assumptions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id       UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  assumption        TEXT NOT NULL,
  risk_level        TEXT NOT NULL CHECK (risk_level IN ('low','medium','high')),
  measurable_signal TEXT NOT NULL,
  validated         BOOLEAN,
  validated_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── PLANS & TASKS ─────────────────────────────────────────────
CREATE TYPE plan_horizon AS ENUM ('day','week','month','quarter','year');
CREATE TYPE plan_status  AS ENUM ('draft','active','on_hold','completed','archived');

CREATE TABLE plans (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                TEXT NOT NULL,
  objective            TEXT NOT NULL,
  horizon              plan_horizon NOT NULL DEFAULT 'week',
  domain               TEXT,
  status               plan_status NOT NULL DEFAULT 'draft',
  related_decision_ids UUID[] DEFAULT '{}',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ
);

CREATE TABLE milestones (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id      UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  due_date     DATE,
  completed_at TIMESTAMPTZ,
  sort_order   SMALLINT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE task_status AS ENUM ('planned','scheduled','active','blocked','done','slipped','cancelled');

CREATE TABLE tasks (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id               UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  milestone_id          UUID REFERENCES milestones(id) ON DELETE SET NULL,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  description           TEXT,
  status                task_status NOT NULL DEFAULT 'planned',
  effort_estimate_hours FLOAT NOT NULL DEFAULT 1.0,
  actual_hours          FLOAT,
  cognitive_load        SMALLINT NOT NULL DEFAULT 3 CHECK (cognitive_load BETWEEN 1 AND 5),
  dependency_ids        UUID[] DEFAULT '{}',
  scheduled_date        DATE,
  scheduled_start       TIMESTAMPTZ,
  scheduled_end         TIMESTAMPTZ,
  actual_start          TIMESTAMPTZ,
  actual_end            TIMESTAMPTZ,
  completion_quality    SMALLINT CHECK (completion_quality BETWEEN 1 AND 5),
  sort_order            SMALLINT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── MEMORY ────────────────────────────────────────────────────
CREATE TYPE memory_type AS ENUM ('working','episodic','semantic','procedural');

CREATE TABLE memories (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory_type      memory_type NOT NULL DEFAULT 'episodic',
  content          TEXT NOT NULL,
  summary          TEXT,
  salience_score   FLOAT NOT NULL DEFAULT 0.5,
  freshness_score  FLOAT NOT NULL DEFAULT 1.0,
  access_count     INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  source_type      TEXT,
  source_id        UUID,
  tags             TEXT[] DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE memory_edges (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  to_memory_id   UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  relation_type  TEXT NOT NULL,
  weight         FLOAT NOT NULL DEFAULT 0.5,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(from_memory_id, to_memory_id, relation_type)
);

-- ── REFLECTIONS ───────────────────────────────────────────────
CREATE TABLE reflections (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL,
  period_type       TEXT NOT NULL DEFAULT 'weekly',
  summary           TEXT NOT NULL,
  wins              TEXT[] DEFAULT '{}',
  misses            TEXT[] DEFAULT '{}',
  insights          JSONB NOT NULL DEFAULT '[]',
  recommendations   TEXT[] DEFAULT '{}',
  execution_score   FLOAT NOT NULL DEFAULT 0,
  planning_accuracy FLOAT NOT NULL DEFAULT 0,
  focus_score       FLOAT NOT NULL DEFAULT 0,
  consistency_score FLOAT NOT NULL DEFAULT 0,
  tasks_planned     INTEGER NOT NULL DEFAULT 0,
  tasks_completed   INTEGER NOT NULL DEFAULT 0,
  decisions_logged  INTEGER NOT NULL DEFAULT 0,
  ideas_captured    INTEGER NOT NULL DEFAULT 0,
  generated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  viewed_at         TIMESTAMPTZ
);

-- ── NOTIFICATIONS ─────────────────────────────────────────────
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  payload    JSONB DEFAULT '{}',
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── UPDATED_AT TRIGGERS ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE t TEXT;
BEGIN FOR t IN SELECT unnest(ARRAY[
  'users','user_profiles','user_settings','ideas','decisions',
  'plans','milestones','tasks','memories','reflections'
]) LOOP
  EXECUTE format(
    'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
    t, t
  );
END LOOP; END $$;