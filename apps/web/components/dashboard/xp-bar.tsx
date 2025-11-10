'use client';

interface XpBarProps {
  currentXp: number;
  level: number;
}

export function XpBar({ currentXp, level }: XpBarProps) {
  // Level formula: level = floor(sqrt(totalXp / 100))
  // So for level N: totalXp >= N^2 * 100
  // For level N+1: totalXp >= (N+1)^2 * 100
  
  // XP needed for current level
  const xpForCurrentLevel = Math.pow(level, 2) * 100;
  // XP needed for next level
  const xpForNextLevel = Math.pow(level + 1, 2) * 100;
  // XP progress in current level
  const xpInCurrentLevel = Math.max(0, currentXp - xpForCurrentLevel);
  // XP needed to reach next level
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
  // Progress percentage
  const progress = xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 0;
  const xpRemaining = Math.max(0, xpNeededForNext - xpInCurrentLevel);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Level {level}</span>
        <span>{currentXp} XP</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary rounded-full h-2 transition-all"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground text-center">
        {Math.ceil(xpRemaining)} XP to Level {level + 1}
      </div>
    </div>
  );
}

