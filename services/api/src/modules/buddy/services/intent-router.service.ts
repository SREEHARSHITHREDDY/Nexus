import { Injectable } from '@nestjs/common';
import { BuddyMode } from '@nexus/types';
import { LoggerService } from '../../../core/logging/logger.service';
import { ContextRetrievalService } from './context-retrieval.service';

export interface IntentClassification {
  mode: BuddyMode;
  confidence: number;
  entities: Record<string, unknown>;
  requiresConfirmation: boolean;
}

@Injectable()
export class IntentRouterService {
  constructor(
    private readonly logger: LoggerService,
    private readonly contextRetrieval: ContextRetrievalService,
  ) {}

  async classify(
    message: string,
    userId: string,
    sessionContext: Record<string, unknown>,
  ): Promise<IntentClassification> {
    this.logger.debug(`Classifying intent for user ${userId}`, 'IntentRouter');
    // Calls AI microservice for LLM-based intent classification
    // Returns mode, confidence, extracted entities, and whether user confirmation is needed
    throw new Error('Not implemented — calls AI microservice');
  }

  async route(classification: IntentClassification, userId: string): Promise<unknown> {
    this.logger.log(`Routing to mode: ${classification.mode}`, 'IntentRouter');
    const modeHandlers: Record<BuddyMode, () => Promise<unknown>> = {
      [BuddyMode.CAPTURE]:   () => this.handleCapture(userId),
      [BuddyMode.CLARIFY]:   () => this.handleClarify(userId),
      [BuddyMode.DECISION]:  () => this.handleDecision(userId),
      [BuddyMode.PLANNING]:  () => this.handlePlanning(userId),
      [BuddyMode.SCHEDULING]:() => this.handleScheduling(userId),
      [BuddyMode.EXECUTE]:   () => this.handleExecute(userId),
      [BuddyMode.REFLECT]:   () => this.handleReflect(userId),
      [BuddyMode.LEARN]:     () => this.handleLearn(userId),
    };
    return modeHandlers[classification.mode]();
  }

  private async handleCapture(userId: string)   { throw new Error('Not implemented'); }
  private async handleClarify(userId: string)   { throw new Error('Not implemented'); }
  private async handleDecision(userId: string)  { throw new Error('Not implemented'); }
  private async handlePlanning(userId: string)  { throw new Error('Not implemented'); }
  private async handleScheduling(userId: string){ throw new Error('Not implemented'); }
  private async handleExecute(userId: string)   { throw new Error('Not implemented'); }
  private async handleReflect(userId: string)   { throw new Error('Not implemented'); }
  private async handleLearn(userId: string)     { throw new Error('Not implemented'); }
}
