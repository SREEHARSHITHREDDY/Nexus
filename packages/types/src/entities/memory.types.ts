import { MemoryType } from '../enums/memory-type.enum';

export interface Memory {
  id: string;
  userId: string;
  memoryType: MemoryType;
  content: string;
  summary: string | null;
  salienceScore: number;
  freshnessScore: number;
  accessCount: number;
  lastAccessedAt: Date | null;
  sourceType: string | null;
  sourceId: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryEdge {
  id: string;
  fromMemoryId: string;
  toMemoryId: string;
  relationType: string;
  weight: number;
  createdAt: Date;
}

export interface MemorySearchResult {
  memory: Memory;
  similarity: number;
  relevanceScore: number;
}

export interface MemoryContext {
  workingMemory: Memory[];
  episodicMemories: Memory[];
  semanticMemories: MemorySearchResult[];
  proceduralMemories: Memory[];
  totalTokenEstimate: number;
}