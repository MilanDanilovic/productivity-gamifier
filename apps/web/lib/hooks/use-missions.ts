import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface Mission {
  _id: string;
  userId: string;
  questId?: string;
  title: string;
  description?: string;
  status: 'OPEN' | 'DONE';
  scheduledFor: string;
  xpValue: number;
  createdAt: string;
  updatedAt: string;
}

export function useTodayMissions(day?: string) {
  const date = day || new Date().toISOString().split('T')[0];
  return useQuery<Mission[]>({
    queryKey: ['missions', 'today', date],
    queryFn: async () => {
      const response = await api.get(`/missions?day=${date}`);
      return response.data.data;
    },
  });
}

export function useMissions(day?: string, status?: 'OPEN' | 'DONE') {
  const params = new URLSearchParams();
  if (day) params.append('day', day);
  if (status) params.append('status', status);

  return useQuery<Mission[]>({
    queryKey: ['missions', day, status],
    queryFn: async () => {
      const response = await api.get(`/missions?${params.toString()}`);
      return response.data.data;
    },
  });
}

export function useCreateMission() {
  const queryClient = useQueryClient();

  return useMutation<Mission, Error, Partial<Mission>>({
    mutationFn: async (missionData) => {
      const response = await api.post('/missions', missionData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

export function useCompleteMission() {
  const queryClient = useQueryClient();

  return useMutation<Mission, Error, string>({
    mutationFn: async (missionId) => {
      const response = await api.post(`/missions/${missionId}/done`);
      return response.data.data;
    },
    onMutate: async (missionId) => {
      await queryClient.cancelQueries({ queryKey: ['missions'] });

      const previousMissions = queryClient.getQueriesData({ queryKey: ['missions'] });

      queryClient.setQueriesData<Mission[]>({ queryKey: ['missions'] }, (old) => {
        if (!old) return old;
        return old.map((mission) =>
          mission._id === missionId ? { ...mission, status: 'DONE' as const } : mission,
        );
      });

      return { previousMissions };
    },
    onError: (err, missionId, context) => {
      if (context?.previousMissions) {
        context.previousMissions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

