'use client';

import { useEffect, useState } from 'react';

interface XpBarProps {
  currentXp: number;
  level: number;
}

export function XpBar({ currentXp, level }: XpBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
      setIsAnimating(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="space-y-3 p-4 retro-card bg-card/50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="retro-text text-lg text-primary">LV.{level}</span>
          <div className="flex items-center gap-1">
            <span className="text-xs">⚡</span>
            <span className="retro-text text-sm">{currentXp}</span>
            <span className="text-xs">XP</span>
          </div>
        </div>
        {xpRemaining > 0 && (
          <span className="text-xs text-muted-foreground">
            {Math.ceil(xpRemaining)} XP to LV.{level + 1}
          </span>
        )}
      </div>
      <div className="relative w-full h-6 bg-secondary border-2 border-foreground/20 overflow-hidden">
        <div
          className={`xp-bar-fill h-full bg-gradient-to-r from-primary via-primary/90 to-primary transition-all duration-1000 ${
            isAnimating ? 'glow-animation' : ''
          }`}
          style={{ 
            width: `${Math.min(Math.max(displayProgress, 0), 100)}%`,
            boxShadow: progress > 0 ? '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))' : 'none'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="retro-text text-xs text-foreground/80">
            {Math.round(displayProgress)}%
          </span>
        </div>
      </div>
    </div>
  );
}

