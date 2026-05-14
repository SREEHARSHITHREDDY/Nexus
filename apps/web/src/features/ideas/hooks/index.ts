import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys }  from '@/lib/query/queryKeys';
import { apiClient }  from '@/lib/api/client';
import { ENDPOINTS }  from '@/lib/api/endpoints';
import type { Idea, CreateIdeaInput, UpdateIdeaInput, ApiResponse, PaginatedResponse } from '@nexus/types';

// ── List ──────────────────────────────────────────────────────
export function useIdeas(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.ideas.all(filters),
    queryFn:  async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Idea>>>(
        ENDPOINTS.ideas.list,
        { params: filters },
      );
      return data.data;
    },
  });
}

// ── Single ────────────────────────────────────────────────────
export function useIdea(id: string) {
  return useQuery({
    queryKey: queryKeys.ideas.detail(id),
    queryFn:  async () => {
      const { data } = await apiClient.get<ApiResponse<Idea>>(
        ENDPOINTS.ideas.detail(id),
      );
      return data.data;
    },
    enabled: Boolean(id),
  });
}

// ── Create ────────────────────────────────────────────────────
export function useCreateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateIdeaInput) => {
      const { data } = await apiClient.post<ApiResponse<Idea>>(
        ENDPOINTS.ideas.create,
        input,
      );
      return data.data;
    },
    onSuccess: (idea) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ideas.all() });
      toast.success('Idea captured', {
        description: idea.fromVoice
          ? 'Voice note saved — enriching in background...'
          : 'Enriching in the background...',
      });
    },
    onError: () => {
      toast.error('Failed to capture idea', { description: 'Please try again.' });
    },
  });
}

// ── Update ────────────────────────────────────────────────────
export function useUpdateIdea(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateIdeaInput) => {
      const { data } = await apiClient.put<ApiResponse<Idea>>(
        ENDPOINTS.ideas.update(id),
        input,
      );
      return data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ideas.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.ideas.all() });
      toast.success('Idea updated');
    },
    onError: () => {
      toast.error('Failed to update idea');
    },
  });
}

// ── Delete ────────────────────────────────────────────────────
export function useDeleteIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(ENDPOINTS.ideas.delete(id));
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: queryKeys.ideas.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.ideas.all() });
      toast.success('Idea deleted');
    },
    onError: () => {
      toast.error('Failed to delete idea');
    },
  });
}