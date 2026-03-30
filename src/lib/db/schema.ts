import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const platforms = sqliteTable('platforms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  displayName: text('display_name').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).default(true),
  sessionData: text('session_data'),
  sessionValid: integer('session_valid', { mode: 'boolean' }).default(false),
  lastSyncAt: integer('last_sync_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  platformId: text('platform_id').references(() => platforms.id),
  platformPostId: text('platform_post_id').notNull(),
  authorName: text('author_name'),
  authorHandle: text('author_handle'),
  authorAvatar: text('author_avatar'),
  authorVerified: integer('author_verified', { mode: 'boolean' }).default(false),
  content: text('content'),
  media: text('media'),
  stats: text('stats'),
  interactions: text('interactions'),
  originalUrl: text('original_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  platformId: text('platform_id').references(() => platforms.id),
  type: text('type').notNull(),
  actorName: text('actor_name'),
  actorHandle: text('actor_handle'),
  actorAvatar: text('actor_avatar'),
  content: text('content'),
  targetPostId: text('target_post_id'),
  originalUrl: text('original_url'),
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const drafts = sqliteTable('drafts', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  media: text('media'),
  targetPlatforms: text('target_platforms'),
  status: text('status').default('draft'),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  publishResults: text('publish_results'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});
