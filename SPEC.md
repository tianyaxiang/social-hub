# Social Hub — 社交媒体管理工具

## 概述

一个 Twitter 风格的社交媒体管理工具，支持一键发布到多平台、聚合多平台互动信息（评论/点赞/转发/通知）。UI 一比一复刻 Twitter 的三栏布局，支持亮/暗主题切换。

## 技术栈

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 (最新版)
- **Database**: SQLite via better-sqlite3 (轻量，无需外部服务)
- **ORM**: Drizzle ORM (type-safe, 轻量)
- **Automation**: Playwright (headless 浏览器自动化)
- **CDP**: chrome-remote-interface (读取 Chrome 登录态)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 架构设计

### Platform Adapter 模式

每个社交平台实现统一的 `PlatformAdapter` 接口：

```typescript
interface PlatformAdapter {
  name: string;
  icon: string;
  color: string;
  
  // 登录态管理
  validateSession(session: PlatformSession): Promise<boolean>;
  
  // 内容发布
  createPost(content: PostContent, session: PlatformSession): Promise<PostResult>;
  
  // 数据抓取
  getFeed(session: PlatformSession, cursor?: string): Promise<FeedResult>;
  getNotifications(session: PlatformSession, cursor?: string): Promise<NotificationResult>;
  getPost(postId: string, session: PlatformSession): Promise<PostDetail>;
  
  // 互动
  likePost(postId: string, session: PlatformSession): Promise<void>;
  repostPost(postId: string, session: PlatformSession): Promise<void>;
  commentOnPost(postId: string, content: string, session: PlatformSession): Promise<void>;
  
  // 搜索
  search(query: string, session: PlatformSession, cursor?: string): Promise<SearchResult>;
  
  // 用户
  getProfile(userId: string, session: PlatformSession): Promise<UserProfile>;
}

interface PlatformSession {
  platformId: string;
  cookies: Record<string, string>;
  localStorage?: Record<string, string>;
  headers?: Record<string, string>;
  userAgent?: string;
  validUntil?: Date;
}

interface PostContent {
  text: string;
  media?: { type: 'image' | 'video'; url: string; file?: Buffer }[];
  replyTo?: string; // 回复某条帖子
}

interface FeedItem {
  id: string;
  platform: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  content: {
    text: string;
    media?: { type: string; url: string; thumbnail?: string }[];
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
  createdAt: Date;
  url: string; // 原始链接
}
```

### 支持平台（全部）

1. **Twitter/X** — 推文发布、Timeline、通知、搜索
2. **即刻 (Jike)** — 动态发布、关注动态、消息、话题
3. **LinkedIn** — 帖子发布、Feed、通知
4. **微博 (Weibo)** — 微博发布、首页、通知、热搜
5. **小红书 (Xiaohongshu)** — 笔记发布、推荐流、消息

每个平台适配器放在 `src/lib/platforms/<name>/` 目录下。

### 登录态管理

通过 CDP (Chrome DevTools Protocol) 读取用户浏览器的登录态：

1. 用户在 Chrome 中正常登录各平台
2. Social Hub 通过 CDP 连接到运行中的 Chrome 实例
3. 读取对应域名的 cookies 和 localStorage
4. 存储到本地数据库（加密）
5. 数据抓取时注入到 Playwright headless 浏览器

**CDP Bridge 流程：**
```
Chrome (已登录) → CDP → 读取 cookies/localStorage → 存储到 DB → 注入 Playwright → Headless 抓取
```

## 数据库设计 (SQLite + Drizzle)

```typescript
// schema.ts

// 平台数据源
export const platforms = sqliteTable('platforms', {
  id: text('id').primaryKey(), // uuid
  name: text('name').notNull(), // twitter, jike, linkedin, weibo, xiaohongshu
  displayName: text('display_name').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).default(true),
  sessionData: text('session_data'), // JSON: encrypted cookies/localStorage
  sessionValid: integer('session_valid', { mode: 'boolean' }).default(false),
  lastSyncAt: integer('last_sync_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// 聚合帖子（从各平台抓取的内容）
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  platformId: text('platform_id').references(() => platforms.id),
  platformPostId: text('platform_post_id').notNull(), // 平台原始 ID
  authorName: text('author_name'),
  authorHandle: text('author_handle'),
  authorAvatar: text('author_avatar'),
  authorVerified: integer('author_verified', { mode: 'boolean' }).default(false),
  content: text('content'), // 文本内容
  media: text('media'), // JSON array of media objects
  stats: text('stats'), // JSON: { likes, reposts, comments, views }
  interactions: text('interactions'), // JSON: { liked, reposted, bookmarked }
  originalUrl: text('original_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// 通知/互动
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  platformId: text('platform_id').references(() => platforms.id),
  type: text('type').notNull(), // like, repost, comment, mention, follow
  actorName: text('actor_name'),
  actorHandle: text('actor_handle'),
  actorAvatar: text('actor_avatar'),
  content: text('content'), // 通知内容摘要
  targetPostId: text('target_post_id'), // 关联的帖子
  originalUrl: text('original_url'),
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// 待发布内容（草稿 + 审核）
export const drafts = sqliteTable('drafts', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  media: text('media'), // JSON array
  targetPlatforms: text('target_platforms'), // JSON array of platform ids
  status: text('status').default('draft'), // draft, pending_review, approved, published, failed
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  publishResults: text('publish_results'), // JSON: per-platform results
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});
```

## UI 设计 — Twitter 风格

### 三栏布局

```
┌──────────────┬─────────────────────────────┬──────────────────┐
│  Left Rail   │      Center Content          │  Right Sidebar   │
│  (240px)     │      (flex-1, max-600px)     │  (350px)         │
│              │                              │                  │
│  Logo        │  Tab Bar:                    │  搜索框           │
│  Home        │  [Timeline] [通知] [发布]     │  数据源状态       │
│  Search      │  [数据源] [设置]              │  平台命令列表     │
│  Notifications│                             │  登录态预览       │
│  Messages    │  Content Area:               │                  │
│  Bookmarks   │  (根据当前 Tab 显示)          │                  │
│  Publish     │                              │                  │
│  Settings    │                              │                  │
│              │                              │                  │
│  Theme Toggle│                              │                  │
│  User Avatar │                              │                  │
└──────────────┴─────────────────────────────┴──────────────────┘
```

### 关键页面

1. **Timeline** — 聚合各平台 Feed，按时间排序，每条显示平台图标
2. **通知 (Notifications)** — 聚合各平台互动（点赞/评论/转发/关注），可按平台筛选
3. **发布 (Compose)** — 类似 Twitter 的发推框，底部显示目标平台选择器，支持 dry-run 和人工审核
4. **数据源 (Sources)** — 管理各平台连接状态、登录态有效性、手动刷新/同步
5. **设置 (Settings)** — 主题切换、CDP 连接配置、自动同步间隔

### 主题

- **暗色 (默认)**: 背景 #000000，卡片 #16181C，边框 #2F3336，文字 #E7E9EA，强调色 #1D9BF0
- **亮色**: 背景 #FFFFFF，卡片 #F7F9F9，边框 #EFF3F4，文字 #0F1419，强调色 #1D9BF0

### 响应式

- Desktop: 三栏布局
- Tablet: 隐藏右侧栏
- Mobile: 只显示中间内容区 + 底部导航栏

## API 路由设计

```
/api/platforms
  GET    — 列出所有平台及状态
  POST   — 添加平台

/api/platforms/[id]
  GET    — 平台详情
  PUT    — 更新平台配置
  DELETE — 删除平台

/api/platforms/[id]/session
  POST   — 通过 CDP 刷新登录态
  GET    — 验证当前登录态

/api/platforms/[id]/sync
  POST   — 触发同步（抓取 feed + 通知）

/api/feed
  GET    — 聚合 Timeline（支持 ?platform= 筛选，?cursor= 分页）

/api/notifications
  GET    — 聚合通知（支持 ?platform= 筛选，?type= 筛选）
  PUT    — 标记已读

/api/posts/[id]
  GET    — 帖子详情
  POST   — 互动（like/repost/comment）

/api/drafts
  GET    — 草稿列表
  POST   — 创建草稿
  PUT    — 更新草稿
  DELETE — 删除草稿

/api/drafts/[id]/publish
  POST   — 发布到目标平台（支持 dry_run 参数）

/api/cdp
  GET    — CDP 连接状态
  POST   — 连接到 Chrome 实例
```

## 项目结构

```
social-hub/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (三栏结构)
│   │   ├── page.tsx                  # Home → redirect to /timeline
│   │   ├── timeline/
│   │   │   └── page.tsx              # 聚合 Timeline
│   │   ├── notifications/
│   │   │   └── page.tsx              # 聚合通知
│   │   ├── compose/
│   │   │   └── page.tsx              # 发布/草稿
│   │   ├── sources/
│   │   │   └── page.tsx              # 数据源管理
│   │   ├── settings/
│   │   │   └── page.tsx              # 设置
│   │   └── api/                      # API routes (见上方)
│   │       ├── platforms/
│   │       ├── feed/
│   │       ├── notifications/
│   │       ├── posts/
│   │       ├── drafts/
│   │       └── cdp/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── LeftRail.tsx          # 左侧导航栏
│   │   │   ├── RightSidebar.tsx      # 右侧信息栏
│   │   │   └── MobileNav.tsx         # 移动端底部导航
│   │   ├── feed/
│   │   │   ├── FeedItem.tsx          # 单条 Feed（Twitter 推文样式）
│   │   │   ├── FeedList.tsx          # Feed 列表 + 无限滚动
│   │   │   └── PlatformBadge.tsx     # 平台来源标识
│   │   ├── compose/
│   │   │   ├── ComposeBox.tsx        # 发布框
│   │   │   ├── PlatformSelector.tsx  # 目标平台选择
│   │   │   ├── MediaUpload.tsx       # 媒体上传
│   │   │   └── DryRunToggle.tsx      # Dry-run 开关
│   │   ├── notifications/
│   │   │   ├── NotificationItem.tsx
│   │   │   └── NotificationList.tsx
│   │   ├── sources/
│   │   │   ├── SourceCard.tsx        # 数据源卡片
│   │   │   ├── SessionStatus.tsx     # 登录态状态
│   │   │   └── CommandList.tsx       # 平台支持的命令列表
│   │   └── common/
│   │       ├── ThemeToggle.tsx
│   │       ├── Avatar.tsx
│   │       ├── Button.tsx
│   │       ├── TabBar.tsx
│   │       └── FilterBar.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts             # DB 连接
│   │   │   ├── schema.ts            # Drizzle schema
│   │   │   └── migrations/
│   │   ├── platforms/
│   │   │   ├── adapter.ts           # PlatformAdapter 接口定义
│   │   │   ├── registry.ts          # 平台注册表
│   │   │   ├── twitter/
│   │   │   │   ├── index.ts         # Twitter adapter
│   │   │   │   └── selectors.ts     # DOM 选择器
│   │   │   ├── jike/
│   │   │   │   ├── index.ts
│   │   │   │   └── selectors.ts
│   │   │   ├── linkedin/
│   │   │   │   ├── index.ts
│   │   │   │   └── selectors.ts
│   │   │   ├── weibo/
│   │   │   │   ├── index.ts
│   │   │   │   └── selectors.ts
│   │   │   └── xiaohongshu/
│   │   │       ├── index.ts
│   │   │       └── selectors.ts
│   │   ├── cdp/
│   │   │   ├── bridge.ts            # CDP 连接管理
│   │   │   └── session-extractor.ts # Cookie/localStorage 提取
│   │   ├── playwright/
│   │   │   ├── browser.ts           # Playwright 实例管理
│   │   │   └── inject-session.ts    # 登录态注入
│   │   └── store/
│   │       ├── theme.ts             # 主题状态
│   │       ├── feed.ts              # Feed 状态
│   │       └── platforms.ts         # 平台状态
│   │
│   └── styles/
│       └── globals.css              # Tailwind + Twitter 风格变量
│
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── .env.example
├── .gitignore
└── SPEC.md
```

## 开发优先级

### Phase 1 — 基础框架 + UI
1. 项目初始化（Next.js + Tailwind + Drizzle）
2. Twitter 风格三栏布局（亮/暗主题）
3. 所有页面骨架（Timeline, Notifications, Compose, Sources, Settings）
4. 组件库（FeedItem, ComposeBox, SourceCard 等）

### Phase 2 — 平台适配器
5. PlatformAdapter 接口 + 注册表
6. CDP Bridge（连接 Chrome、提取 cookies）
7. Playwright 实例管理 + 登录态注入
8. Twitter adapter（第一个完整实现）
9. 其余平台 adapter（Jike, LinkedIn, Weibo, Xiaohongshu）

### Phase 3 — 核心功能
10. Feed 聚合 + 无限滚动
11. 通知聚合 + 筛选
12. 发布功能（ComposeBox → 多平台发布 + dry-run）
13. 数据源管理（添加/删除/刷新/同步）

### Phase 4 — 完善
14. 草稿系统 + 定时发布
15. 搜索功能
16. 响应式适配
17. 自动同步（定时轮询）

## 注意事项

- 所有平台 adapter 先用 mock 数据跑通 UI，再接入真实抓取
- 登录态存储要加密（用环境变量中的密钥）
- 默认 dry-run 模式，不会真实发布
- 发布需要人工审核确认
- CDP 连接需要 Chrome 以 --remote-debugging-port 启动
