'use client';

import { useState } from 'react';
import { useTodayMissions, useCompleteMission, useCreateMission } from '@/lib/hooks/use-missions';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const { data: missions, isLoading } = useTodayMissions(selectedDate);
  const completeMission = useCompleteMission();
  const createMission = useCreateMission();
  const { toast } = useToast();

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

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionTitle.trim()) return;

    try {
      await createMission.mutateAsync({
        title: newMissionTitle,
        scheduledFor: selectedDate,
        xpValue: 10,
      });
      setNewMissionTitle('');
      setShowCreateForm(false);
      toast({
        title: 'Mission created!',
        description: 'New mission added to your list',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'Failed to create mission',
        variant: 'destructive',
      });
    }
  };

  const openMissions = missions?.filter((m) => m.status === 'OPEN') || [];
  const doneMissions = missions?.filter((m) => m.status === 'DONE') || [];

  return (
    <div className="min-h-screen bg-background bg-gradient-to-b from-background via-background/95 to-background/90 particle-effect">
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        <Card className="retro-card bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="retro-text text-lg sm:text-2xl text-primary">📋 DAILY MISSIONS 📋</CardTitle>
                <CardDescription className="text-xs">Manage your daily tasks</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border-2 retro-button bg-background text-xs"
                />
                <Button onClick={() => setShowCreateForm(!showCreateForm)} className="retro-button text-xs">
                  {showCreateForm ? 'CANCEL' : '+ ADD MISSION'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showCreateForm && (
              <form onSubmit={handleCreateMission} className="mb-4 p-4 retro-card bg-card/50">
                <div className="space-y-2">
                  <Label htmlFor="title" className="retro-text text-xs">MISSION TITLE</Label>
                  <Input
                    id="title"
                    value={newMissionTitle}
                    onChange={(e) => setNewMissionTitle(e.target.value)}
                    placeholder="Enter mission title"
                    className="retro-button"
                  />
                </div>
                <Button type="submit" className="mt-4 retro-button w-full text-xs" disabled={createMission.isPending}>
                  {createMission.isPending ? 'CREATING...' : 'CREATE MISSION'}
                </Button>
              </form>
            )}

              {isLoading ? (
                <p className="text-sm text-muted-foreground retro-text text-center">Loading...</p>
              ) : (
                <div className="space-y-4">
                  {openMissions.length > 0 && (
                    <div>
                      <h3 className="retro-text text-xs font-medium mb-2 text-primary">OPEN MISSIONS</h3>
                      <div className="space-y-2">
                        {openMissions.map((mission) => (
                          <div
                            key={mission._id}
                            className="retro-card bg-card/50 p-3 hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => !completeMission.isPending && handleCompleteMission(mission._id)}
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={false}
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
                              <Badge variant="secondary" className="retro-text text-xs flex-shrink-0">
                                +{mission.xpValue} XP
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {doneMissions.length > 0 && (
                    <div>
                      <h3 className="retro-text text-xs font-medium mb-2 text-primary">COMPLETED MISSIONS</h3>
                      <div className="space-y-2">
                        {doneMissions.map((mission) => (
                          <div
                            key={mission._id}
                            className="retro-card bg-card/50 p-3 opacity-60"
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox checked={true} disabled className="flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="retro-text text-xs font-medium line-through truncate">
                                  {mission.title}
                                </p>
                                {mission.description && (
                                  <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {mission.description}
                                  </p>
                                )}
                              </div>
                              <Badge variant="secondary" className="retro-text text-xs flex-shrink-0">
                                +{mission.xpValue} XP
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {openMissions.length === 0 && doneMissions.length === 0 && (
                    <p className="text-sm text-muted-foreground retro-text text-center py-8">
                      No missions for this date
                    </p>
                  )}
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

