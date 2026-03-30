'use client';

import { Settings2 } from 'lucide-react';
import { SourceCard } from '@/components/sources/SourceCard';
import { platforms } from '@/lib/mock/data';

export default function SourcesPage() {
  return (
    <div>
      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b px-4 py-3"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings2 size={24} style={{ color: 'var(--text-primary)' }} />
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>数据源</h1>
          </div>
          <button
            className="px-4 py-2 rounded-full text-sm font-medium hover-bg transition-colors"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--text-primary)',
            }}
          >
            + 添加平台
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          筛选：
        </span>
        <button className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
          全部
        </button>
        <button
          className="px-3 py-1 rounded-full text-sm hover-bg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          已启用
        </button>
        <button
          className="px-3 py-1 rounded-full text-sm hover-bg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          Session 有效
        </button>
        <button
          className="px-3 py-1 rounded-full text-sm hover-bg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          需要刷新
        </button>
      </div>

      {/* Platform cards */}
      <div className="p-4 space-y-4">
        {platforms.map((platform) => (
          <SourceCard key={platform.id} platform={platform} />
        ))}
      </div>
    </div>
  );
}
