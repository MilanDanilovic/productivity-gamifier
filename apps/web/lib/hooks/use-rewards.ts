import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface Reward {
  _id: string;
  userId: string;
  title: string;
  xpThreshold: number;
  itemType?: 'SKIN' | 'HAT' | 'WEAPON' | 'SHIELD' | 'ACCESSORY';
  icon?: string;
  color?: string;
  claimedAt?: string;
  isClaimable?: boolean;
  isLocked?: boolean;
  isClaimed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useRewards() {
  return useQuery<Reward[]>({
    queryKey: ['rewards'],
    queryFn: async () => {
      const response = await api.get('/rewards');
      return response.data.data;
    },
  });
}

export function useClaimReward() {
  const queryClient = useQueryClient();

  return useMutation<Reward, Error, string>({
    mutationFn: async (rewardId) => {
      const response = await api.post(`/rewards/${rewardId}/claim`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });
}

