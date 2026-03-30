'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { notifications, getPlatformColor } from '@/lib/mock/data';
import { PlatformName } from '@/lib/types';

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'mentions', label: '提及' },
  { id: 'verified', label: '认证' },
];

const platforms: { id: PlatformName | 'all'; label: string; color: string }[] = [
  { id: 'all', label: '全部', color: '#888' },
  { id: 'twitter', label: 'Twitter', color: getPlatformColor('twitter') },
  { id: 'jike', label: '即刻', color: getPlatformColor('jike') },
  { id: 'linkedin', label: 'LinkedIn', color: getPlatformColor('linkedin') },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformName | 'all'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (selectedPlatform === 'all') return true;
    return n.platform === selectedPlatform;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>通知</h1>
          {unreadCount > 0 && (
            <button
              className="text-sm hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              标记全部已读
            </button>
          )}
        </div>
      </div>

      {/* Platform filter */}
      <div
        className="flex gap-2 px-4 py-3 border-b overflow-x-auto"
        style={{ borderColor: 'var(--border)' }}
      >
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatform(p.id as PlatformName | 'all')}
            className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            style={{
              backgroundColor: selectedPlatform === p.id ? p.color + '20' : 'var(--card)',
              color: selectedPlatform === p.id ? p.color : 'var(--text-secondary)',
              border: selectedPlatform === p.id ? `1px solid ${p.color}40` : `1px solid var(--border)`,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Notification tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 relative py-4 text-sm font-medium transition-colors"
            style={{
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 rounded-full"
                style={{ backgroundColor: 'var(--accent)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div>
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Bell size={48} style={{ color: 'var(--text-secondary)' }} />
            <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
              暂无通知
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <NotificationItem key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
