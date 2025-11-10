'use client';

import { useState } from 'react';
import { useQuests, useCompleteQuest, useCreateQuest } from '@/lib/hooks/use-quests';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<'MAIN' | 'SUB'>('MAIN');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDescription, setNewQuestDescription] = useState('');
  const { data: mainQuests } = useQuests('MAIN');
  const { data: subQuests } = useQuests('SUB');
  const completeQuest = useCompleteQuest();
  const createQuest = useCreateQuest();
  const { toast } = useToast();

  const handleCompleteQuest = async (questId: string) => {
    try {
      await completeQuest.mutateAsync(questId);
      toast({
        title: 'Quest completed!',
        description: 'XP awarded',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'Failed to complete quest',
        variant: 'destructive',
      });
    }
  };

  const handleCreateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;

    try {
      await createQuest.mutateAsync({
        type: activeTab,
        title: newQuestTitle,
        description: newQuestDescription || undefined,
      });
      setNewQuestTitle('');
      setNewQuestDescription('');
      setShowCreateForm(false);
      toast({
        title: 'Quest created!',
        description: 'New quest added',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'Failed to create quest',
        variant: 'destructive',
      });
    }
  };

  const activeMainQuests = mainQuests?.filter((q) => q.status === 'ACTIVE') || [];
  const activeSubQuests = subQuests?.filter((q) => q.status === 'ACTIVE') || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quests</CardTitle>
                <CardDescription>Manage your main quests and sub-quests</CardDescription>
              </div>
              <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Cancel' : '+ Add Quest'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showCreateForm && (
              <form onSubmit={handleCreateQuest} className="mb-4 p-4 border rounded-md">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quest Title</Label>
                    <Input
                      id="title"
                      value={newQuestTitle}
                      onChange={(e) => setNewQuestTitle(e.target.value)}
                      placeholder="Enter quest title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      value={newQuestDescription}
                      onChange={(e) => setNewQuestDescription(e.target.value)}
                      placeholder="Enter quest description"
                    />
                  </div>
                  <Button type="submit" disabled={createQuest.isPending}>
                    {createQuest.isPending ? 'Creating...' : 'Create Quest'}
                  </Button>
                </div>
              </form>
            )}

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'MAIN' | 'SUB')}>
              <TabsList>
                <TabsTrigger value="MAIN">Main Quests</TabsTrigger>
                <TabsTrigger value="SUB">Sub-quests</TabsTrigger>
              </TabsList>
              <TabsContent value="MAIN">
                <div className="space-y-2 mt-4">
                  {activeMainQuests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No main quests</p>
                  ) : (
                    activeMainQuests.map((quest) => (
                      <Card key={quest._id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-medium">{quest.title}</h3>
                                {quest.bossFight?.isBoss && (
                                  <Badge variant="destructive">Boss Fight</Badge>
                                )}
                              </div>
                              {quest.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {quest.description}
                                </p>
                              )}
                              {quest.bossFight?.deadline && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Deadline: {new Date(quest.bossFight.deadline).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleCompleteQuest(quest._id)}
                              disabled={completeQuest.isPending}
                            >
                              Complete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="SUB">
                <div className="space-y-2 mt-4">
                  {activeSubQuests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No sub-quests</p>
                  ) : (
                    activeSubQuests.map((quest) => (
                      <Card key={quest._id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium">{quest.title}</h3>
                              {quest.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {quest.description}
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleCompleteQuest(quest._id)}
                              disabled={completeQuest.isPending}
                            >
                              Complete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

