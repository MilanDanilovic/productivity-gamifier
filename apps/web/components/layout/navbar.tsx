'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLogout } from '@/lib/hooks/use-auth';
import { useMe } from '@/lib/hooks/use-auth';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const logout = useLogout();
  const { data: user } = useMe();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render dynamic content after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠', color: '#22c55e' },
    { href: '/today', label: 'Today', icon: '📅', color: '#3b82f6' },
    { href: '/recurring', label: 'Daily', icon: '🔄', color: '#8b5cf6' },
    { href: '/quests', label: 'Quests', icon: '⚔️', color: '#ef4444' },
    { href: '/rewards', label: 'Rewards', icon: '🎁', color: '#f59e0b' },
    { href: '/avatar', label: 'Avatar', icon: '👤', color: '#ec4899' },
    { href: '/achievements', label: 'Trophies', icon: '🏆', color: '#facc15' },
  ];

  const xpPercentage = user ? ((user.totalXp % 100) / 100) * 100 : 0;

  if (!mounted) {
    // Return a skeleton navbar during SSR to avoid hydration issues
    return (
      <nav className="border-b-4 border-primary/30 bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-md retro-card sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-4">
            <Link 
              href="/dashboard" 
              className="retro-text text-base sm:text-xl text-primary hover:scale-110 transition-all relative group flex-shrink-0"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="animate-pulse-retro">⚔️</span>
                <span className="hidden sm:inline">GAMIFY</span>
                <span className="animate-pulse-retro">⚔️</span>
              </span>
            </Link>
            <div className="h-8 w-32" /> {/* Placeholder for user stats */}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b-4 border-primary/30 bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-md retro-card sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            href="/dashboard" 
            className="retro-text text-base sm:text-xl text-primary hover:scale-110 transition-all relative group flex-shrink-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="animate-pulse-retro">⚔️</span>
              <span className="hidden sm:inline">GAMIFY</span>
              <span className="animate-pulse-retro">⚔️</span>
            </span>
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative retro-text text-xs font-medium transition-all px-3 py-2 rounded group ${
                  pathname === item.href
                    ? 'text-primary bg-primary/10 scale-105'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base transition-transform group-hover:scale-125">{item.icon}</span>
                  <span className="hidden xl:inline">{item.label.toUpperCase()}</span>
                </span>
                {pathname === item.href && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 glow-animation"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden retro-button px-3 py-2 text-primary"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          {/* User Stats */}
          {user && (
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
              <div className="retro-card bg-card/80 px-3 py-1.5 space-y-1 min-w-[120px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="retro-text text-primary">LV.{user.level}</span>
                  <span className="text-xs text-muted-foreground">{user.totalXp % 100}/100</span>
                </div>
                <div className="relative h-1.5 bg-background/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 xp-bar-fill rounded-full"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="retro-text text-xs bg-destructive/10 border-destructive/30">
                  🔥 {user.streakCount}
                </Badge>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout} 
                className="retro-button text-xs hover:bg-destructive/20 hover:border-destructive"
              >
                EXIT
              </Button>
            </div>
          )}

          {/* Mobile User Info */}
          {user && (
            <div className="sm:hidden flex items-center gap-2">
              <Badge variant="outline" className="retro-text text-xs">
                LV.{user.level}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout} 
                className="retro-button text-xs px-2"
              >
                EXIT
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-primary/20 animate-slide-up">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`retro-card p-3 text-center transition-all ${
                    pathname === item.href
                      ? 'bg-primary/20 border-primary/50 scale-105'
                      : 'bg-card/50 hover:bg-primary/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="retro-text text-xs">{item.label.toUpperCase()}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

