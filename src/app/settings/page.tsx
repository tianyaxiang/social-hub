'use client';

import { Settings, Sun, Moon, Monitor, Wifi, WifiOff, RefreshCw, Shield, Database } from 'lucide-react';
import { useThemeStore } from '@/lib/store/theme';

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();

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
        <div className="flex items-center gap-3">
          <Settings size={24} style={{ color: 'var(--text-primary)' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>设置</h1>
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {/* Theme */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>外观</h2>
          <div className="space-y-2">
            {[
              { id: 'dark', label: '暗色主题', icon: Moon },
              { id: 'light', label: '亮色主题', icon: Sun },
              { id: 'system', label: '跟随系统', icon: Monitor },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id as 'dark' | 'light')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover-bg transition-colors"
                  style={{ backgroundColor: theme === item.id ? 'var(--card)' : 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} style={{ color: 'var(--text-primary)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                  </div>
                  {theme === item.id && (
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CDP Connection */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>CDP 连接</h2>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Wifi size={20} style={{ color: '#00BA7C' }} />
                <div>
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>已连接</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    localhost:9222
                  </div>
                </div>
              </div>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                style={{ backgroundColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <RefreshCw size={14} />
                重连
              </button>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              提示：请确保 Chrome 以 <code className="px-1 rounded" style={{ backgroundColor: 'var(--bg)' }}>--remote-debugging-port=9222</code> 启动
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>同步设置</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex items-center gap-3">
                <RefreshCw size={20} style={{ color: 'var(--accent)' }} />
                <div>
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>自动同步</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    每 15 分钟同步一次
                  </div>
                </div>
              </div>
              <select
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
              >
                <option>5 分钟</option>
                <option selected>15 分钟</option>
                <option>30 分钟</option>
                <option>1 小时</option>
                <option>手动</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>安全</h2>
          <div
            className="p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <Shield size={20} style={{ color: '#00BA7C' }} />
            <div>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Session 数据加密</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                登录态数据使用 AES-256 加密存储
              </div>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>数据存储</h2>
          <div
            className="p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <Database size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>本地数据库</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                ./data/social-hub.db • SQLite
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
