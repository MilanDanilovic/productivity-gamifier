import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface Quest {
  _id: string;
  userId: string;
  type: 'MAIN' | 'SUB';
  title: string;
  description?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  startDate?: string;
  dueDate?: string;
  questId?: string; // For sub-quests to link to main quest
  bossFight?: {
    isBoss: boolean;
    deadline?: string;
    completedOnTime?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export function useQuests(type?: 'MAIN' | 'SUB', status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED') {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (status) params.append('status', status);

  return useQuery<Quest[]>({
    queryKey: ['quests', type, status],
    queryFn: async () => {
      const response = await api.get(`/quests?${params.toString()}`);
      return response.data.data;
    },
  });
}

export function useCreateQuest() {
  const queryClient = useQueryClient();

  return useMutation<Quest, Error, Partial<Quest>>({
    mutationFn: async (questData) => {
      const response = await api.post('/quests', questData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
}

export function useCompleteQuest() {
  const queryClient = useQueryClient();

  return useMutation<Quest, Error, string>({
    mutationFn: async (questId) => {
      const response = await api.post(`/quests/${questId}/complete`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

