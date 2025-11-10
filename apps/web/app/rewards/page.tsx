'use client';

import { useRewards, useClaimReward } from '@/lib/hooks/use-rewards';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, Check } from 'lucide-react';

const itemTypeLabels: Record<string, string> = {
  SKIN: 'Skin',
  HAT: 'Hat',
  WEAPON: 'Weapon',
  SHIELD: 'Shield',
  ACCESSORY: 'Accessory',
};

export default function RewardsPage() {
  const { data: rewards, isLoading } = useRewards();
  const claimReward = useClaimReward();
  const { toast } = useToast();

  const handleClaimReward = async (rewardId: string) => {
    try {
      await claimReward.mutateAsync(rewardId);
      toast({
        title: '🎉 REWARD CLAIMED! 🎉',
        description: 'Avatar item unlocked!',
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-4">
          <p className="retro-text text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-gradient-to-b from-background via-background/95 to-background/90 particle-effect">
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        <Card className="retro-card bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="retro-text text-lg sm:text-2xl text-primary">🎁 AVATAR ITEMS 🎁</CardTitle>
            <CardDescription className="text-xs">Unlock avatar customization items by reaching XP thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {rewards?.map((reward) => (
                <Card
                  key={reward._id}
                  className={`retro-card bg-card/80 backdrop-blur-sm transition-all ${
                    reward.isLocked
                      ? 'opacity-60 grayscale'
                      : reward.isClaimed
                      ? 'border-primary/50 glow-animation'
                      : 'hover:scale-105'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-4xl">{reward.icon || '🎁'}</div>
                      {reward.isLocked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : reward.isClaimed ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : null}
                    </div>
                    <CardTitle className="retro-text text-sm text-primary">{reward.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {reward.itemType && (
                        <Badge variant="secondary" className="retro-text text-xs mr-2">
                          {itemTypeLabels[reward.itemType]}
                        </Badge>
                      )}
                      Unlock at {reward.xpThreshold} XP
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reward.isLocked ? (
                      <Badge variant="secondary" className="retro-text text-xs w-full justify-center">
                        🔒 LOCKED
                      </Badge>
                    ) : reward.isClaimed ? (
                      <Badge variant="default" className="retro-text text-xs w-full justify-center bg-primary">
                        ✓ CLAIMED
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleClaimReward(reward._id)}
                        disabled={claimReward.isPending}
                        className="w-full retro-button"
                        style={reward.color ? { borderColor: reward.color } : {}}
                      >
                        CLAIM ITEM
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
