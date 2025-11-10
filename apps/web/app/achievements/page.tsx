'use client';

import { useAchievements } from '@/lib/hooks/use-achievements';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const achievementIcons: Record<string, string> = {
  FIRST_BLOOD: '🩸',
  CONSISTENCY_I: '🔥',
  CONSISTENCY_II: '⚡',
  CONSISTENCY_III: '💎',
  BUG_SLAYER: '🐛',
  SHIP_IT: '🚀',
};

const achievementColors: Record<string, string> = {
  FIRST_BLOOD: '#ef4444',
  CONSISTENCY_I: '#f59e0b',
  CONSISTENCY_II: '#3b82f6',
  CONSISTENCY_III: '#8b5cf6',
  BUG_SLAYER: '#10b981',
  SHIP_IT: '#ec4899',
};

export default function AchievementsPage() {
  const { data: achievements, isLoading } = useAchievements();

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
            <CardTitle className="retro-text text-lg sm:text-2xl text-primary">🏆 ACHIEVEMENTS 🏆</CardTitle>
            <CardDescription className="text-xs">Your unlocked achievements</CardDescription>
          </CardHeader>
          <CardContent>
            {achievements && achievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {achievements.map((achievement) => {
                  const icon = achievementIcons[achievement.code] || '🏅';
                  const color = achievementColors[achievement.code] || '#3b82f6';
                  
                  return (
                    <Card
                      key={achievement._id}
                      className="retro-card bg-card/80 backdrop-blur-sm hover:scale-105 transition-transform glow-animation"
                      style={{ borderColor: color }}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-5xl">{icon}</div>
                          <Badge variant="default" className="retro-text text-xs" style={{ backgroundColor: color }}>
                            UNLOCKED
                          </Badge>
                        </div>
                        <CardTitle className="retro-text text-sm" style={{ color }}>
                          {achievement.title}
                        </CardTitle>
                        <CardDescription className="text-xs mt-2">
                          {achievement.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground retro-text">
                          Awarded: {new Date(achievement.awardedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground retro-text text-center py-8">
                No achievements unlocked yet. Complete missions to earn achievements!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
