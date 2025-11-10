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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Missions</CardTitle>
                <CardDescription>Manage your daily tasks</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                />
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                  {showCreateForm ? 'Cancel' : '+ Add Mission'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showCreateForm && (
              <form onSubmit={handleCreateMission} className="mb-4 p-4 border rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="title">Mission Title</Label>
                  <Input
                    id="title"
                    value={newMissionTitle}
                    onChange={(e) => setNewMissionTitle(e.target.value)}
                    placeholder="Enter mission title"
                  />
                </div>
                <Button type="submit" className="mt-4" disabled={createMission.isPending}>
                  {createMission.isPending ? 'Creating...' : 'Create Mission'}
                </Button>
              </form>
            )}

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {openMissions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Open Missions</h3>
                    <div className="space-y-2">
                      {openMissions.map((mission) => (
                        <div
                          key={mission._id}
                          className="flex items-center space-x-2 p-3 rounded border"
                        >
                          <Checkbox
                            checked={false}
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
                  </div>
                )}

                {doneMissions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Completed Missions</h3>
                    <div className="space-y-2">
                      {doneMissions.map((mission) => (
                        <div
                          key={mission._id}
                          className="flex items-center space-x-2 p-3 rounded border opacity-60"
                        >
                          <Checkbox checked={true} disabled />
                          <div className="flex-1">
                            <p className="text-sm font-medium line-through">
                              {mission.title}
                            </p>
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
                  </div>
                )}

                {openMissions.length === 0 && doneMissions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
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

