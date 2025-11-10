import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '../api';

export interface User {
  _id: string;
  email: string;
  displayName: string;
  totalXp: number;
  level: number;
  streakCount: number;
  lastActivityAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export function useMe() {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data.data;
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, { email: string; password: string }>(
    {
      mutationFn: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data.data;
      },
      onSuccess: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        queryClient.setQueryData(['me'], data.user);
        router.push('/dashboard');
      },
    },
  );
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<
    AuthResponse,
    Error,
    { email: string; password: string; displayName: string }
  >({
    mutationFn: async (userData) => {
      const response = await api.post('/auth/register', userData);
      return response.data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.setQueryData(['me'], data.user);
      router.push('/dashboard');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    queryClient.clear();
    router.push('/login');
  };
}

