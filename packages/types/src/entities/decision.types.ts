import { DecisionStatus } from '../enums/decision-status.enum';

export interface DecisionAssumption {
  id: string;
  decisionId: string;
  assumption: string;
  riskLevel: 'low' | 'medium' | 'high';
  measurableSignal: string;
  validated: boolean | null;
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
  confidence: number; // 1-10
  expectedOutcome: string;
  reviewAt: Date;
  actualOutcome: string | null;
  postMortemDelta: string | null;
  status: DecisionStatus;
  createdAt: Date;
  updatedAt: Date;
}
