'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/lib/hooks/use-auth';
import { useMe } from '@/lib/hooks/use-auth';

export function Navbar() {
  const pathname = usePathname();
  const logout = useLogout();
  const { data: user } = useMe();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/today', label: 'Today' },
    { href: '/quests', label: 'Quests' },
    { href: '/rewards', label: 'Rewards' },
    { href: '/achievements', label: 'Achievements' },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-xl font-bold">
            Gamify
          </Link>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-sm text-muted-foreground">
              {user.displayName} (Lv.{user.level})
            </span>
          )}
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

