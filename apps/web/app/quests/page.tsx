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

function getUrgencyColor(daysRemaining: number): string {
  if (daysRemaining < 0) return 'bg-destructive text-destructive-foreground';
  if (daysRemaining <= 1) return 'bg-destructive text-destructive-foreground pulse-retro';
  if (daysRemaining <= 3) return 'bg-orange-500 text-white';
  if (daysRemaining <= 7) return 'bg-yellow-500 text-black';
  return 'bg-muted text-muted-foreground';
}

function getUrgencyIcon(daysRemaining: number | null): string {
  if (daysRemaining === null) return '';
  if (daysRemaining < 0) return '🚨';
  if (daysRemaining <= 1) return '⚡';
  if (daysRemaining <= 3) return '🔥';
  if (daysRemaining <= 7) return '⏰';
  return '📅';
}

function getDaysRemaining(deadline?: string): number | null {
  if (!deadline) return null;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<'MAIN' | 'SUB'>('MAIN');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDescription, setNewQuestDescription] = useState('');
  const [selectedMainQuest, setSelectedMainQuest] = useState<string>('');
  const { data: mainQuests } = useQuests('MAIN', 'ACTIVE');
  const { data: subQuests } = useQuests('SUB', 'ACTIVE');
  const completeQuest = useCompleteQuest();
  const createQuest = useCreateQuest();
  const { toast } = useToast();

  const handleCompleteQuest = async (questId: string) => {
    try {
      await completeQuest.mutateAsync(questId);
      toast({
        title: '🎉 QUEST COMPLETE! 🎉',
        description: 'XP awarded!',
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
        questId: activeTab === 'SUB' && selectedMainQuest ? selectedMainQuest : undefined,
      });
      setNewQuestTitle('');
      setNewQuestDescription('');
      setSelectedMainQuest('');
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

  // Group sub-quests by main quest
  const subQuestsByMainQuest = activeSubQuests.reduce((acc, subQuest) => {
    const mainQuestId = subQuest.questId || 'unassigned';
    if (!acc[mainQuestId]) {
      acc[mainQuestId] = [];
    }
    acc[mainQuestId].push(subQuest);
    return acc;
  }, {} as Record<string, typeof activeSubQuests>);

  return (
    <div className="min-h-screen bg-background bg-gradient-to-b from-background via-background/95 to-background/90 particle-effect">
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        <Card className="retro-card bg-card/80 backdrop-blur-sm">
          <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="retro-text text-lg sm:text-2xl text-primary">⚔️ QUESTS ⚔️</CardTitle>
                  <CardDescription className="text-xs">Manage your main quests and sub-quests</CardDescription>
                </div>
                <Button onClick={() => setShowCreateForm(!showCreateForm)} className="retro-button text-xs">
                  {showCreateForm ? 'CANCEL' : '+ ADD QUEST'}
                </Button>
              </div>
          </CardHeader>
          <CardContent>
            {showCreateForm && (
              <form onSubmit={handleCreateQuest} className="mb-4 p-4 retro-card bg-card/50">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="retro-text text-xs">QUEST TITLE</Label>
                    <Input
                      id="title"
                      value={newQuestTitle}
                      onChange={(e) => setNewQuestTitle(e.target.value)}
                      placeholder="Enter quest title"
                      className="retro-button"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="retro-text text-xs">DESCRIPTION (OPTIONAL)</Label>
                    <Input
                      id="description"
                      value={newQuestDescription}
                      onChange={(e) => setNewQuestDescription(e.target.value)}
                      placeholder="Enter quest description"
                      className="retro-button"
                    />
                  </div>
                  {activeTab === 'SUB' && activeMainQuests.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="mainQuest" className="retro-text text-xs">LINK TO MAIN QUEST (OPTIONAL)</Label>
                      <select
                        id="mainQuest"
                        value={selectedMainQuest}
                        onChange={(e) => setSelectedMainQuest(e.target.value)}
                        className="w-full h-10 px-3 border-2 border-input bg-background retro-button"
                      >
                        <option value="">None</option>
                        {activeMainQuests.map((quest) => (
                          <option key={quest._id} value={quest._id}>
                            {quest.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <Button type="submit" disabled={createQuest.isPending} className="retro-button w-full">
                    {createQuest.isPending ? 'CREATING...' : 'CREATE QUEST'}
                  </Button>
                </div>
              </form>
            )}

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'MAIN' | 'SUB')}>
              <TabsList className="retro-button">
                <TabsTrigger value="MAIN" className="retro-text text-xs">MAIN QUESTS</TabsTrigger>
                <TabsTrigger value="SUB" className="retro-text text-xs">SUB-QUESTS</TabsTrigger>
              </TabsList>
              <TabsContent value="MAIN">
                <div className="space-y-3 mt-4">
                  {activeMainQuests.length === 0 ? (
                    <p className="text-sm text-muted-foreground retro-text text-center py-8">No main quests</p>
                  ) : (
                    activeMainQuests.map((quest) => {
                      const daysRemaining = quest.bossFight?.deadline
                        ? getDaysRemaining(quest.bossFight.deadline)
                        : quest.dueDate
                        ? getDaysRemaining(quest.dueDate)
                        : null;
                      const xpReward = quest.bossFight?.isBoss ? 100 : 100;
                      const bonusXp = quest.bossFight?.isBoss && quest.bossFight.deadline ? 50 : 0;

                      return (
                        <Card key={quest._id} className="retro-card bg-card/50 hover:scale-105 transition-transform">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="retro-text text-sm font-medium">{quest.title}</h3>
                                  {quest.bossFight?.isBoss && (
                                    <Badge variant="destructive" className="retro-text text-xs pulse-retro">
                                      👹 BOSS FIGHT
                                    </Badge>
                                  )}
                                </div>
                                {quest.description && (
                                  <p className="text-xs text-muted-foreground mb-2">{quest.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="secondary" className="retro-text text-xs">
                                    +{xpReward} XP
                                  </Badge>
                                  {bonusXp > 0 && (
                                    <Badge variant="default" className="retro-text text-xs bg-primary">
                                      +{bonusXp} BONUS XP
                                    </Badge>
                                  )}
                                  {daysRemaining !== null && (
                                    <Badge
                                      className={`retro-text text-xs ${getUrgencyColor(daysRemaining)} border-2`}
                                    >
                                      {getUrgencyIcon(daysRemaining)} {daysRemaining < 0
                                        ? `OVERDUE ${Math.abs(daysRemaining)} DAYS`
                                        : daysRemaining === 0
                                        ? 'DUE TODAY!'
                                        : `${daysRemaining} DAYS LEFT`}
                                    </Badge>
                                  )}
                                </div>
                                {quest.bossFight?.deadline && (
                                  <div className={`mt-2 p-2 retro-card ${getUrgencyColor(daysRemaining || 0)}`}>
                                    <p className="retro-text text-xs font-bold">
                                      {getUrgencyIcon(daysRemaining)} DEADLINE: {new Date(quest.bossFight.deadline).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                                {/* Show linked sub-quests */}
                                {subQuestsByMainQuest[quest._id] && subQuestsByMainQuest[quest._id].length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-primary/20">
                                    <p className="text-xs text-muted-foreground mb-2 retro-text">SUB-QUESTS:</p>
                                    {subQuestsByMainQuest[quest._id].map((subQuest) => (
                                      <div
                                        key={subQuest._id}
                                        className="text-xs text-muted-foreground ml-2 mb-1 flex items-center gap-2"
                                      >
                                        <span>•</span>
                                        <span>{subQuest.title}</span>
                                        <Badge variant="secondary" className="retro-text text-xs">
                                          +25 XP
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleCompleteQuest(quest._id)}
                                disabled={completeQuest.isPending}
                                className="retro-button flex-shrink-0 text-xs w-full sm:w-auto"
                              >
                                COMPLETE
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
              <TabsContent value="SUB">
                <div className="space-y-3 mt-4">
                  {activeSubQuests.length === 0 ? (
                    <p className="text-sm text-muted-foreground retro-text text-center py-8">No sub-quests</p>
                  ) : (
                    activeSubQuests.map((quest) => {
                      const mainQuest = quest.questId
                        ? activeMainQuests.find((mq) => mq._id === quest.questId)
                        : null;

                      return (
                        <Card key={quest._id} className="retro-card bg-card/50 hover:scale-105 transition-transform">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                              <div className="flex-1">
                                {mainQuest && (
                                  <div className="mb-2">
                                    <Badge variant="outline" className="retro-text text-xs mb-1">
                                      📌 {mainQuest.title}
                                    </Badge>
                                  </div>
                                )}
                                <h3 className="retro-text text-sm font-medium mb-2">{quest.title}</h3>
                                {quest.description && (
                                  <p className="text-xs text-muted-foreground mb-2">{quest.description}</p>
                                )}
                                <Badge variant="secondary" className="retro-text text-xs">
                                  +25 XP
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleCompleteQuest(quest._id)}
                                disabled={completeQuest.isPending}
                                className="retro-button flex-shrink-0 text-xs w-full sm:w-auto"
                              >
                                COMPLETE
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
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
