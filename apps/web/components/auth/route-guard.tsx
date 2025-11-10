'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/lib/hooks/use-auth';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, error } = useMe();

  useEffect(() => {
    if (!isLoading) {
      const token = localStorage.getItem('accessToken');
      if (!token || error) {
        router.push('/login');
      }
    }
  }, [isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

