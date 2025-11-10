'use client';

import { useState, useEffect } from 'react';
import { useRecurringMissions, useCompleteMission, useCreateMission, useResetRecurringMissions } from '@/lib/hooks/use-missions';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function RecurringPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionDescription, setNewMissionDescription] = useState('');
  const [newMissionXp, setNewMissionXp] = useState(10);
  
  const { data: missions, isLoading } = useRecurringMissions();
  const completeMission = useCompleteMission();
  const createMission = useCreateMission();
  const resetRecurring = useResetRecurringMissions();
  const { toast } = useToast();

  // Auto-reset recurring missions when page loads
  useEffect(() => {
    resetRecurring.mutate();
  }, []);

  const handleCompleteMission = async (missionId: string) => {
    try {
      await completeMission.mutateAsync(missionId);
      toast({
        title: '🎉 MISSION COMPLETE! 🎉',
        description: 'XP gained! Mission will reset tomorrow.',
      });
    } catch (error: any) {
      toast({
        title: '❌ ERROR',
        description: error.response?.data?.error?.message || 'Failed to complete mission',
        variant: 'destructive',
      });
    }
  };

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionTitle.trim()) return;

    try {
      await createMission.mutateAsync({
        title: newMissionTitle,
        description: newMissionDescription,
        xpValue: newMissionXp,
        isRecurring: true,
        recurringType: 'DAILY',
      });
      setNewMissionTitle('');
      setNewMissionDescription('');
      setNewMissionXp(10);
      setShowCreateForm(false);
      toast({
        title: '✅ RECURRING MISSION CREATED!',
        description: 'This mission will repeat daily',
      });
    } catch (error: any) {
      toast({
        title: '❌ ERROR',
        description: error.response?.data?.error?.message || 'Failed to create mission',
        variant: 'destructive',
      });
    }
  };

  const isMissionCompletedToday = (mission: any) => {
    if (!mission.lastCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastCompleted = new Date(mission.lastCompleted);
    lastCompleted.setHours(0, 0, 0, 0);
    return today.getTime() === lastCompleted.getTime();
  };

  const sortedMissions = missions?.sort((a, b) => {
    const aCompleted = isMissionCompletedToday(a);
    const bCompleted = isMissionCompletedToday(b);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  }) || [];

  return (
    <div className="min-h-screen bg-background bg-gradient-to-b from-background via-background/95 to-background/90 particle-effect">
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6 max-w-4xl">
        <Card className="retro-card bg-card/80 backdrop-blur-sm border-primary/50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="retro-text text-lg sm:text-2xl text-primary flex items-center gap-2">
                  <span className="animate-pulse-retro">🔄</span>
                  DAILY QUESTS
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Complete these tasks every day to earn XP and maintain your streak
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                variant={showCreateForm ? 'destructive' : 'default'}
                className="retro-button text-xs"
              >
                {showCreateForm ? '❌ CANCEL' : '➕ NEW QUEST'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showCreateForm && (
              <form onSubmit={handleCreateMission} className="retro-card bg-card/50 p-4 space-y-3 border-primary/30">
                <div>
                  <Label htmlFor="title" className="retro-text text-xs">Quest Name</Label>
                  <Input
                    id="title"
                    value={newMissionTitle}
                    onChange={(e) => setNewMissionTitle(e.target.value)}
                    placeholder="e.g., Morning Workout"
                    required
                    className="retro-card mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="retro-text text-xs">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={newMissionDescription}
                    onChange={(e) => setNewMissionDescription(e.target.value)}
                    placeholder="e.g., 30 minutes of exercise"
                    className="retro-card mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="xp" className="retro-text text-xs">XP Reward</Label>
                  <Input
                    id="xp"
                    type="number"
                    value={newMissionXp}
                    onChange={(e) => setNewMissionXp(Number(e.target.value))}
                    min="1"
                    className="retro-card mt-1"
                  />
                </div>
                <Button type="submit" disabled={createMission.isPending} className="retro-button w-full">
                  {createMission.isPending ? '⏳ CREATING...' : '✨ CREATE DAILY QUEST'}
                </Button>
              </form>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4 animate-pulse-retro">⏳</div>
                <p className="retro-text text-xs text-muted-foreground">Loading quests...</p>
              </div>
            ) : missions?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-float">🎯</div>
                <p className="retro-text text-sm text-muted-foreground mb-2">No daily quests yet</p>
                <p className="text-xs text-muted-foreground">Create recurring tasks to build your daily routine!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedMissions.map((mission) => {
                  const isCompleted = isMissionCompletedToday(mission);
                  return (
                    <div
                      key={mission._id}
                      className={`retro-card p-4 transition-all duration-300 relative overflow-hidden group ${
                        isCompleted
                          ? 'bg-primary/20 border-primary/50'
                          : 'bg-card/50 hover:scale-102 hover:shadow-xl cursor-pointer'
                      }`}
                      onClick={() => !isCompleted && !completeMission.isPending && handleCompleteMission(mission._id)}
                    >
                      {/* Animated background shimmer */}
                      {!isCompleted && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      )}
                      
                      <div className="flex items-start gap-3 relative z-10">
                        <div className="flex-shrink-0 mt-1">
                          <Checkbox
                            checked={isCompleted}
                            disabled={isCompleted || completeMission.isPending}
                            className={isCompleted ? 'opacity-50' : ''}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={`retro-text text-xs sm:text-sm font-medium ${
                                isCompleted ? 'line-through opacity-70' : ''
                              }`}>
                                {mission.title}
                              </p>
                              {mission.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {mission.description}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <Badge 
                                variant={isCompleted ? 'secondary' : 'default'} 
                                className="retro-text text-xs"
                              >
                                +{mission.xpValue} XP
                              </Badge>
                              {isCompleted && (
                                <Badge variant="outline" className="retro-text text-xs bg-primary/20 animate-pulse-retro">
                                  ✓ DONE
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              🔄 Daily Quest
                            </span>
                            {mission.completionCount && mission.completionCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  🏆 Completed {mission.completionCount}x
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {missions && missions.length > 0 && (
              <div className="retro-card bg-primary/10 p-4 border-primary/30">
                <p className="retro-text text-xs text-center text-muted-foreground">
                  💡 TIP: Recurring quests reset daily at midnight. Complete them every day to build consistency!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        {missions && missions.length > 0 && (
          <Card className="retro-card bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="retro-text text-sm text-primary">📊 QUEST STATS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="retro-card bg-card/50 p-3 text-center">
                  <div className="text-2xl mb-1 animate-pulse-retro">🎯</div>
                  <p className="retro-text text-xs text-muted-foreground">Total Quests</p>
                  <p className="retro-text text-lg text-primary">{missions.length}</p>
                </div>
                <div className="retro-card bg-card/50 p-3 text-center">
                  <div className="text-2xl mb-1 animate-pulse-retro">✅</div>
                  <p className="retro-text text-xs text-muted-foreground">Done Today</p>
                  <p className="retro-text text-lg text-primary">
                    {missions.filter(m => isMissionCompletedToday(m)).length}
                  </p>
                </div>
                <div className="retro-card bg-card/50 p-3 text-center">
                  <div className="text-2xl mb-1 animate-pulse-retro">⏳</div>
                  <p className="retro-text text-xs text-muted-foreground">Remaining</p>
                  <p className="retro-text text-lg text-primary">
                    {missions.filter(m => !isMissionCompletedToday(m)).length}
                  </p>
                </div>
                <div className="retro-card bg-card/50 p-3 text-center">
                  <div className="text-2xl mb-1 animate-pulse-retro">⚡</div>
                  <p className="retro-text text-xs text-muted-foreground">Total XP</p>
                  <p className="retro-text text-lg text-primary">
                    {missions.reduce((sum, m) => sum + (m.xpValue || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

