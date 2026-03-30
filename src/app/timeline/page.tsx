'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FeedItem } from '@/components/feed/FeedItem';
import { feedItems } from '@/lib/mock/data';

const tabs = [
  { id: 'for-you', label: '推荐' },
  { id: 'following', label: '关注' },
];

export default function TimelinePage() {
  const [activeTab, setActiveTab] = useState('for-you');

  return (
    <div>
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
        }}
      >
        {/* Title */}
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>首页</h1>
          <button
            className="p-2 rounded-full hover-bg transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            <Sparkles size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex">
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
      </div>

      {/* Feed */}
      <div>
        {feedItems.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
