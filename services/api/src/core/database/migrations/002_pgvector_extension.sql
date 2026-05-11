-- ============================================================
-- NEXUS — Migration 002: pgvector for semantic memory search
-- ============================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns
ALTER TABLE memories ADD COLUMN embedding vector(1536);
ALTER TABLE ideas    ADD COLUMN embedding vector(1536);

-- IVFFlat indexes for approximate nearest neighbor search
CREATE INDEX idx_memories_embedding
  ON memories USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_ideas_embedding
  ON ideas USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);