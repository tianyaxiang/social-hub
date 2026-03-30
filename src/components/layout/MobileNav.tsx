'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, PenSquare, Settings } from 'lucide-react';

const mobileNavItems = [
  { href: '/timeline', icon: Home },
  { href: '/search', icon: Search },
  { href: '/compose', icon: PenSquare },
  { href: '/notifications', icon: Bell },
  { href: '/sources', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center justify-around py-3 border-t"
      style={{
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--border)',
      }}
    >
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-center p-2 rounded-full"
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 1.5}
              style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
