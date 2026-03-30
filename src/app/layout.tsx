'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/theme';
import { LeftRail } from '@/components/layout/LeftRail';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import '@/app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <html lang="zh-CN" className={theme}>
      <head>
        <title>Social Hub</title>
        <meta name="description" content="社交媒体管理工具" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
        <div className="mx-auto flex max-w-[1280px] min-h-screen">
          {/* Left Rail - Navigation */}
          <aside className="hidden md:flex sticky top-0 h-screen w-[68px] xl:w-rail flex-col border-r"
            style={{ borderColor: 'var(--border)' }}>
            <LeftRail />
          </aside>

          {/* Center Content */}
          <main className="flex-1 max-w-feed w-full min-h-screen border-r"
            style={{ borderColor: 'var(--border)' }}>
            {children}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block w-sidebar sticky top-0 h-screen overflow-y-auto">
            <RightSidebar />
          </aside>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
