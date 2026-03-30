'use client';

import { RefreshCw, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { Platform } from '@/lib/types';

interface SourceCardProps {
  platform: Platform;
}

export function SourceCard({ platform }: SourceCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--card)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ backgroundColor: platform.color + '20', color: platform.color }}
          >
            {platform.icon}
          </span>
          <div>
            <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              {platform.displayName}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {platform.commands.length} 个可用命令
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{
              backgroundColor: !platform.enabled
                ? 'var(--border)'
                : platform.sessionValid
                ? '#00BA7C20'
                : '#F9188020',
              color: !platform.enabled
                ? 'var(--text-secondary)'
                : platform.sessionValid
                ? '#00BA7C'
                : '#F91880',
            }}
          >
            {!platform.enabled ? 'Disabled' : platform.sessionValid ? 'Session Valid' : 'Session Invalid'}
          </span>

          {/* Enable toggle */}
          <button className="p-1" style={{ color: platform.enabled ? '#00BA7C' : 'var(--text-secondary)' }}>
            {platform.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
      </div>

      {/* Commands */}
      <div className="px-4 pb-3">
        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
          支持的命令：
        </div>
        <div className="flex flex-wrap gap-1.5">
          {platform.commands.map((cmd) => (
            <span
              key={cmd}
              className="text-xs px-2.5 py-1 rounded-md font-mono"
              style={{
                backgroundColor: platform.color + '15',
                color: platform.color,
              }}
            >
              {cmd}
            </span>
          ))}
        </div>
      </div>

      {/* Session preview placeholder */}
      {platform.enabled && (
        <div
          className="mx-4 mb-3 rounded-lg overflow-hidden border"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="h-32 flex items-center justify-center text-sm"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}
          >
            {platform.sessionValid ? (
              <span>📷 登录态截图预览</span>
            ) : (
              <span>⚠️ 请通过 CDP 连接刷新登录态</span>
            )}
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div
        className="flex items-center justify-between px-4 py-3 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {platform.lastSyncAt
            ? `上次同步: ${new Date(platform.lastSyncAt).toLocaleString('zh-CN')}`
            : '从未同步'}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover-bg transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            <RefreshCw size={14} />
            刷新登录态
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover-bg transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            <ExternalLink size={14} />
            同步数据
          </button>
        </div>
      </div>
    </div>
  );
}
