'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  PenSquare,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useThemeStore } from '@/lib/store/theme';

const navItems = [
  { href: '/timeline', label: '首页', icon: Home },
  { href: '/search', label: '搜索', icon: Search },
  { href: '/notifications', label: '通知', icon: Bell },
  { href: '/messages', label: '消息', icon: Mail },
  { href: '/bookmarks', label: '书签', icon: Bookmark },
  { href: '/compose', label: '发布', icon: PenSquare },
  { href: '/sources', label: '数据源', icon: Settings },
  { href: '/settings', label: '设置', icon: Settings },
];

export function LeftRail() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex flex-col h-full py-3 px-2">
      {/* Logo */}
      <Link href="/timeline" className="flex items-center justify-center xl:justify-start xl:px-3 py-3 mb-1">
        <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>S</span>
        <span className="hidden xl:inline text-xl font-bold ml-1" style={{ color: 'var(--text-primary)' }}>
          Social Hub
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center xl:justify-start gap-4 px-3 py-3 rounded-full hover-bg transition-colors"
              style={{
                fontWeight: isActive ? 700 : 400,
                color: 'var(--text-primary)',
              }}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="hidden xl:inline text-xl">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center xl:justify-start gap-4 px-3 py-3 rounded-full hover-bg transition-colors mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        <span className="hidden xl:inline text-lg">
          {theme === 'dark' ? '切换亮色' : '切换暗色'}
        </span>
      </button>

      {/* User Avatar */}
      <div className="flex items-center justify-center xl:justify-start gap-3 px-3 py-3 rounded-full hover-bg cursor-pointer">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          L
        </div>
        <div className="hidden xl:block">
          <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>亮亮</div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>@liangliang</div>
        </div>
      </div>
    </div>
  );
}
