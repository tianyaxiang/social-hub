import { PlatformName } from '@/lib/types';

export interface PlatformSession {
  platformId: string;
  cookies: Record<string, string>;
  localStorage?: Record<string, string>;
  headers?: Record<string, string>;
  userAgent?: string;
  validUntil?: Date;
}

export interface PostContent {
  text: string;
  media?: { type: 'image' | 'video'; url: string; file?: Buffer }[];
  replyTo?: string;
}

export interface PostResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export interface FeedResult {
  items: any[];
  cursor?: string;
  hasMore: boolean;
}

export interface NotificationResult {
  items: any[];
  cursor?: string;
  hasMore: boolean;
}

export interface SearchResult {
  items: any[];
  cursor?: string;
  hasMore: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
  followersCount?: number;
  followingCount?: number;
}

export interface PlatformAdapter {
  name: string;
  displayName: string;
  icon: string;
  color: string;

  validateSession(session: PlatformSession): Promise<boolean>;
  
  createPost(content: PostContent, session: PlatformSession): Promise<PostResult>;
  
  getFeed(session: PlatformSession, cursor?: string): Promise<FeedResult>;
  getNotifications(session: PlatformSession, cursor?: string): Promise<NotificationResult>;
  getPost(postId: string, session: PlatformSession): Promise<any>;
  
  likePost(postId: string, session: PlatformSession): Promise<void>;
  repostPost(postId: string, session: PlatformSession): Promise<void>;
  commentOnPost(postId: string, content: string, session: PlatformSession): Promise<void>;
  
  search(query: string, session: PlatformSession, cursor?: string): Promise<SearchResult>;
  getProfile(userId: string, session: PlatformSession): Promise<UserProfile>;
}

export const platformRegistry: Partial<Record<PlatformName, PlatformAdapter>> = {};

export function registerPlatform(name: PlatformName, adapter: PlatformAdapter) {
  platformRegistry[name] = adapter;
}

export function getPlatform(name: PlatformName): PlatformAdapter | undefined {
  return platformRegistry[name];
}

export function getAllPlatforms(): PlatformAdapter[] {
  return Object.values(platformRegistry) as PlatformAdapter[];
}
