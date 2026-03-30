// Core types for Social Hub

export type PlatformName = 'twitter' | 'jike' | 'linkedin' | 'weibo' | 'xiaohongshu';

export interface Platform {
  id: string;
  name: PlatformName;
  displayName: string;
  icon: string;
  color: string;
  enabled: boolean;
  sessionValid: boolean;
  lastSyncAt: Date | null;
  commands: string[];
}

export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  platform: PlatformName;
}

export interface MediaItem {
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface FeedItem {
  id: string;
  platform: PlatformName;
  author: Author;
  content: {
    text: string;
    media?: MediaItem[];
    links?: { url: string; title?: string; image?: string }[];
  };
  stats: {
    likes: number;
    reposts: number;
    comments: number;
    views?: number;
  };
  interactions: {
    liked: boolean;
    reposted: boolean;
    bookmarked: boolean;
  };
  createdAt: string;
  url: string;
}

export interface NotificationItem {
  id: string;
  platform: PlatformName;
  type: 'like' | 'repost' | 'comment' | 'mention' | 'follow';
  actor: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  targetPostContent?: string;
  originalUrl: string;
  read: boolean;
  createdAt: string;
}

export interface Draft {
  id: string;
  content: string;
  media?: MediaItem[];
  targetPlatforms: PlatformName[];
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'failed';
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
}
