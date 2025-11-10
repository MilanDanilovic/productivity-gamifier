'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/lib/hooks/use-auth';
import { useTodayMissions, useCompleteMission } from '@/lib/hooks/use-missions';
import { useQuests } from '@/lib/hooks/use-quests';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { XpBar } from '@/components/dashboard/xp-bar';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading, error } = useMe();
  const { data: missions, isLoading: missionsLoading } = useTodayMissions();
  const { data: quests } = useQuests('MAIN', 'ACTIVE');
  const { data: subQuests } = useQuests('SUB', 'ACTIVE');
  const completeMission = useCompleteMission();
  const { toast } = useToast();

  useEffect(() => {
    if (!userLoading) {
      const token = localStorage.getItem('accessToken');
      if (!token || error) {
        router.push('/login');
      }
    }
  }, [userLoading, error, router]);

  const handleCompleteMission = async (missionId: string) => {
    try {
      await completeMission.mutateAsync(missionId);
      toast({
        title: 'Mission completed!',
        description: 'XP and streak updated',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'Failed to complete mission',
        variant: 'destructive',
      });
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto p-4">Loading...</div>
      </div>
    );
  }

  if (!user && !userLoading) {
    return null;
  }

  const openMissions = missions?.filter((m) => m.status === 'OPEN') || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4 space-y-6">
        {/* Stats Header */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{user?.level || 1}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold">{user?.totalXp || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{user?.streakCount || 0} days</p>
              </div>
            </div>
            {user && <XpBar currentXp={user.totalXp} level={user.level} />}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Missions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Missions</CardTitle>
                  <CardDescription>Complete your daily tasks</CardDescription>
                </div>
                <Link href="/today">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {missionsLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : openMissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No missions for today</p>
              ) : (
                <div className="space-y-2">
                  {openMissions.slice(0, 5).map((mission) => (
                    <div
                      key={mission._id}
                      className="flex items-center space-x-2 p-2 rounded border"
                    >
                      <Checkbox
                        checked={mission.status === 'DONE'}
                        onChange={() => handleCompleteMission(mission._id)}
                        disabled={completeMission.isPending}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{mission.title}</p>
                        {mission.description && (
                          <p className="text-xs text-muted-foreground">
                            {mission.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">{mission.xpValue} XP</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Quests</CardTitle>
                  <CardDescription>Your main quests and sub-quests</CardDescription>
                </div>
                <Link href="/quests">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {quests && quests.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Main Quest</p>
                  {quests.map((quest) => (
                    <div key={quest._id} className="p-3 rounded border mb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{quest.title}</p>
                          {quest.bossFight?.isBoss && (
                            <Badge variant="destructive" className="mt-1">
                              Boss Fight
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {subQuests && subQuests.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Sub-quests</p>
                  {subQuests.slice(0, 3).map((quest) => (
                    <div key={quest._id} className="p-3 rounded border mb-2">
                      <p className="text-sm font-medium">{quest.title}</p>
                    </div>
                  ))}
                </div>
              )}
              {(!quests || quests.length === 0) &&
                (!subQuests || subQuests.length === 0) && (
                  <p className="text-sm text-muted-foreground">No active quests</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

