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
        title: '🎉 MISSION COMPLETE! 🎉',
        description: 'XP and streak updated!',
      });
      // Add shake animation to the mission card
      const missionElement = document.getElementById(`mission-${missionId}`);
      if (missionElement) {
        missionElement.classList.add('shake');
        setTimeout(() => {
          missionElement.classList.remove('shake');
        }, 300);
      }
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
    <div className="min-h-screen bg-background bg-gradient-to-b from-background via-background/95 to-background/90 particle-effect">
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {/* Stats Header */}
        <Card className="retro-card bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="retro-text text-lg sm:text-2xl text-primary">YOUR PROGRESS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="retro-card bg-primary/20 p-4 text-center hover:scale-105 transition-all stagger-item cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <p className="text-xs text-muted-foreground mb-2 relative z-10">LEVEL</p>
                <p className="retro-text text-3xl text-primary pulse-retro relative z-10">{user?.level || 1}</p>
              </div>
              <div className="retro-card bg-primary/20 p-4 text-center hover:scale-105 transition-all stagger-item cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <p className="text-xs text-muted-foreground mb-2 relative z-10">TOTAL XP</p>
                <p className="retro-text text-3xl text-primary relative z-10">{user?.totalXp || 0}</p>
              </div>
              <div className="retro-card bg-primary/20 p-4 text-center hover:scale-105 transition-all stagger-item cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-destructive/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <p className="text-xs text-muted-foreground mb-2 relative z-10">🔥 STREAK</p>
                <p className="retro-text text-3xl text-destructive animate-pulse-retro relative z-10">{user?.streakCount || 0} DAYS</p>
              </div>
            </div>
            {user && <XpBar currentXp={user.totalXp} level={user.level} />}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Today's Missions */}
          <Card className="retro-card bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="retro-text text-sm sm:text-lg text-primary">📋 TODAY MISSIONS</CardTitle>
                  <CardDescription className="text-xs">Complete your daily tasks</CardDescription>
                </div>
                <Link href="/today">
                  <Button variant="outline" size="sm" className="retro-button text-xs">
                    VIEW ALL
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {missionsLoading ? (
                <p className="text-sm text-muted-foreground retro-text">Loading...</p>
              ) : openMissions.length === 0 ? (
                <p className="text-sm text-muted-foreground retro-text text-center py-8">No missions for today</p>
              ) : (
                <div className="space-y-3">
                  {openMissions.slice(0, 5).map((mission, index) => (
                    <div
                      key={mission._id}
                      id={`mission-${mission._id}`}
                      className="retro-card bg-card/50 p-3 hover:scale-105 transition-all cursor-pointer hover:border-primary/50 hover:shadow-lg stagger-item relative overflow-hidden group"
                      onClick={() => !completeMission.isPending && handleCompleteMission(mission._id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className="flex items-center space-x-3 relative z-10">
                        <Checkbox
                          checked={mission.status === 'DONE'}
                          onChange={() => handleCompleteMission(mission._id)}
                          disabled={completeMission.isPending}
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="retro-text text-xs font-medium truncate">{mission.title}</p>
                          {mission.description && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {mission.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary" className="retro-text text-xs flex-shrink-0 animate-pulse-retro">
                          +{mission.xpValue} XP
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quests */}
          <Card className="retro-card bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="retro-text text-sm sm:text-lg text-primary">⚔️ ACTIVE QUESTS</CardTitle>
                  <CardDescription className="text-xs">Your main quests and sub-quests</CardDescription>
                </div>
                <Link href="/quests">
                  <Button variant="outline" size="sm" className="retro-button text-xs">
                    VIEW ALL
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {quests && quests.length > 0 && (
                <div>
                  <p className="retro-text text-xs font-medium mb-2 text-primary">MAIN QUEST</p>
                  {quests.map((quest) => (
                    <div key={quest._id} className="retro-card bg-card/50 p-3 mb-2 hover:scale-105 transition-transform">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="retro-text text-xs font-medium">{quest.title}</p>
                          {quest.bossFight?.isBoss && (
                            <Badge variant="destructive" className="mt-1 retro-text text-xs pulse-retro">
                              👹 BOSS FIGHT
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
                  <p className="retro-text text-xs font-medium mb-2 text-primary">SUB-QUESTS</p>
                  {subQuests.slice(0, 3).map((quest) => (
                    <div key={quest._id} className="retro-card bg-card/50 p-3 mb-2 hover:scale-105 transition-transform">
                      <p className="retro-text text-xs font-medium">{quest.title}</p>
                    </div>
                  ))}
                </div>
              )}
              {(!quests || quests.length === 0) &&
                (!subQuests || subQuests.length === 0) && (
                  <p className="text-sm text-muted-foreground retro-text text-center py-8">No active quests</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

