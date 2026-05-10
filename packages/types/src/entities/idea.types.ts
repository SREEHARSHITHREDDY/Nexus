import { IdeaStatus } from '../enums/idea-status.enum';

export interface Idea {
  id: string;
  userId: string;
  title: string;
  rawInput: string;
  summary: string | null;
  domain: string | null;
  status: IdeaStatus;
  priority: number;
  tags: string[];
  relatedMemoryIds: string[];
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateIdeaInput {
  rawInput: string;
  domain?: string;
  tags?: string[];
  fromVoice?: boolean;
}
