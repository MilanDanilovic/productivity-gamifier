'use client';

import { useRewards, useClaimReward } from '@/lib/hooks/use-rewards';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, Check } from 'lucide-react';

export default function RewardsPage() {
  const { data: rewards, isLoading } = useRewards();
  const claimReward = useClaimReward();
  const { toast } = useToast();

  const handleClaimReward = async (rewardId: string) => {
    try {
      await claimReward.mutateAsync(rewardId);
      toast({
        title: 'Reward claimed!',
        description: 'Enjoy your reward!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'Failed to claim reward',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto p-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Rewards</CardTitle>
            <CardDescription>Unlock rewards by reaching XP thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards?.map((reward) => (
                <Card
                  key={reward._id}
                  className={
                    reward.isLocked
                      ? 'opacity-60'
                      : reward.isClaimed
                      ? 'border-green-500'
                      : ''
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                      {reward.isLocked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : reward.isClaimed ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : null}
                    </div>
                    <CardDescription>
                      Unlock at {reward.xpThreshold} XP
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reward.isLocked ? (
                      <Badge variant="secondary">Locked</Badge>
                    ) : reward.isClaimed ? (
                      <Badge variant="default" className="bg-green-500">
                        Claimed
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleClaimReward(reward._id)}
                        disabled={claimReward.isPending}
                        className="w-full"
                      >
                        Claim Reward
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

