'use client';

import { Heart, Repeat2, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import { NotificationItem as NotificationType } from '@/lib/types';
import { formatTimeAgo, getPlatformIcon, getPlatformColor } from '@/lib/mock/data';

interface NotificationItemProps {
  item: NotificationType;
}

const typeConfig = {
  like: { icon: Heart, color: '#F91880', label: '赞了' },
  repost: { icon: Repeat2, color: '#00BA7C', label: '转发了' },
  comment: { icon: MessageCircle, color: '#1D9BF0', label: '评论了' },
  mention: { icon: AtSign, color: '#1D9BF0', label: '提到了' },
  follow: { icon: UserPlus, color: '#1D9BF0', label: '关注了' },
};

export function NotificationItem({ item }: NotificationItemProps) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <div
      className="flex gap-3 px-4 py-3 hover-bg cursor-pointer transition-colors border-b"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: item.read ? 'transparent' : 'rgba(29, 155, 240, 0.03)',
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 pt-1">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.color + '20' }}
        >
          <Icon size={16} style={{ color: config.color }} fill={item.type === 'like' ? config.color : 'none'} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <img
            src={item.actor.avatar}
            alt={item.actor.name}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.actor.name)}&background=1D9BF0&color=fff&size=32`;
            }}
          />
          {/* Platform badge */}
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold -ml-4 mt-4"
            style={{
              backgroundColor: getPlatformColor(item.platform),
              color: item.platform === 'jike' ? '#000' : '#fff',
            }}
          >
            {getPlatformIcon(item.platform)}
          </span>
        </div>

        <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
          <span className="font-bold">{item.actor.name}</span>
          <span style={{ color: 'var(--text-secondary)' }}> {item.content}</span>
        </div>

        {item.targetPostContent && (
          <div
            className="mt-1 text-sm line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {item.targetPostContent}
          </div>
        )}

        <div className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {formatTimeAgo(item.createdAt)}
        </div>
      </div>

      {/* Unread indicator */}
      {!item.read && (
        <div className="flex-shrink-0 pt-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
        </div>
      )}
    </div>
  );
}
