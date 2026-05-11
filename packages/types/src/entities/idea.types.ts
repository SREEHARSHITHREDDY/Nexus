import { IdeaStatus } from '../enums/idea-status.enum';
import { Domain } from '../enums/domain.enum';

export interface Idea {
  id: string;
  userId: string;
  title: string | null;
  rawInput: string;
  summary: string | null;
  domain: Domain | null;
  status: IdeaStatus;
  priority: number;
  tags: string[];
  relatedMemoryIds: string[];
  relatedIdeaIds: string[];
  fromVoice: boolean;
  audioUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateIdeaInput {
  rawInput: string;
  domain?: Domain;
  tags?: string[];
  fromVoice?: boolean;
  audioUrl?: string;
}

export interface UpdateIdeaInput {
  title?: string;
  summary?: string;
  domain?: Domain;
  status?: IdeaStatus;
  priority?: number;
  tags?: string[];
}

export interface IdeaEnrichmentResult {
  title: string;
  summary: string;
  domain: Domain;
  tags: string[];
  followUpQuestion: string | null;
  relatedMemoryIds: string[];
  relatedIdeaIds: string[];
}