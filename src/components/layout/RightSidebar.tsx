'use client';

import { Search } from 'lucide-react';
import { platforms } from '@/lib/mock/data';

export function RightSidebar() {
  const activePlatforms = platforms.filter((p) => p.enabled);

  return (
    <div className="p-4 space-y-4">
      {/* Search Box */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-full"
        style={{ backgroundColor: 'var(--card)' }}
      >
        <Search size={18} style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="搜索"
          className="bg-transparent outline-none flex-1 text-sm"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* Platform Status */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--card)' }}
      >
        <h3 className="text-xl font-bold px-4 pt-3 pb-2" style={{ color: 'var(--text-primary)' }}>
          数据源状态
        </h3>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="px-4 py-3 hover-bg cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: platform.color + '20', color: platform.color }}
                  >
                    {platform.icon}
                  </span>
                  <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    {platform.displayName}
                  </span>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: platform.sessionValid ? '#00BA7C20' : '#F9188020',
                    color: platform.sessionValid ? '#00BA7C' : '#F91880',
                  }}
                >
                  {!platform.enabled ? 'Disabled' : platform.sessionValid ? 'Valid' : 'Invalid'}
                </span>
              </div>
              {platform.lastSyncAt && (
                <div className="text-xs mt-1 ml-10" style={{ color: 'var(--text-secondary)' }}>
                  上次同步: {formatRelativeTime(platform.lastSyncAt)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Commands Preview */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--card)' }}
      >
        <h3 className="text-xl font-bold px-4 pt-3 pb-2" style={{ color: 'var(--text-primary)' }}>
          支持的命令
        </h3>
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {Array.from(new Set(activePlatforms.flatMap((p) => p.commands))).map((cmd) => (
            <span
              key={cmd}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: 'var(--accent)' + '20',
                color: 'var(--accent)',
              }}
            >
              {cmd}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs px-4 space-y-2" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span className="hover:underline cursor-pointer">关于</span>
          <span className="hover:underline cursor-pointer">帮助</span>
          <span className="hover:underline cursor-pointer">隐私</span>
          <span className="hover:underline cursor-pointer">开源</span>
        </div>
        <div>© 2026 Social Hub</div>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  return `${Math.floor(hours / 24)}天前`;
}
