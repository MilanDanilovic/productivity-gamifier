import { useQuery } from '@tanstack/react-query';
import api from '../api';

export interface Achievement {
  _id: string;
  userId: string;
  code: string;
  title: string;
  description: string;
  awardedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await api.get('/achievements');
      return response.data.data;
    },
  });
}

