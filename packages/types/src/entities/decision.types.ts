import { DecisionStatus } from '../enums/decision-status.enum';
import { RiskLevel } from '../enums/risk-level.enum';

export interface DecisionAssumption {
  id: string;
  decisionId: string;
  assumption: string;
  riskLevel: RiskLevel;
  measurableSignal: string;
  validated: boolean | null;
  validatedAt: Date | null;
}

export interface Decision {
  id: string;
  userId: string;
  title: string;
  context: string;
  optionsConsidered: string[];
  chosenOption: string;
  rationale: string;
  assumptions: DecisionAssumption[];
  confidence: number;
  expectedOutcome: string;
  reviewAt: Date;
  actualOutcome: string | null;
  postMortemDelta: string | null;
  outcomeRecordedAt: Date | null;
  status: DecisionStatus;
  relatedIdeaIds: string[];
  relatedPlanIds: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateDecisionInput {
  title: string;
  context: string;
  optionsConsidered: string[];
  chosenOption: string;
  rationale: string;
  assumptions: Array<Omit<DecisionAssumption, 'id' | 'decisionId' | 'validated' | 'validatedAt'>>;
  confidence: number;
  expectedOutcome: string;
  reviewAt: Date;
  relatedIdeaIds?: string[];
}

export interface RecordOutcomeInput {
  actualOutcome: string;
  assumptionValidations: Array<{ id: string; validated: boolean }>;
}