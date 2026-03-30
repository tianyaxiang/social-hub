import { FeedItem, NotificationItem, Platform } from '@/lib/types';

export const platforms: Platform[] = [
  {
    id: 'twitter',
    name: 'twitter',
    displayName: 'Twitter / X',
    icon: '𝕏',
    color: '#1D9BF0',
    enabled: true,
    sessionValid: true,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 5),
    commands: ['feed', 'post', 'like', 'repost', 'comment', 'search', 'notifications', 'user', 'topic', 'create'],
  },
  {
    id: 'jike',
    name: 'jike',
    displayName: '即刻',
    icon: '⚡',
    color: '#FFE411',
    enabled: true,
    sessionValid: true,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 12),
    commands: ['feed', 'post', 'like', 'comment', 'search', 'notifications', 'user', 'topic', 'create', 'repost'],
  },
  {
    id: 'linkedin',
    name: 'linkedin',
    displayName: 'LinkedIn',
    icon: 'in',
    color: '#0A66C2',
    enabled: true,
    sessionValid: true,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 30),
    commands: ['feed', 'post'],
  },
  {
    id: 'weibo',
    name: 'weibo',
    displayName: '微博',
    icon: '微',
    color: '#E6162D',
    enabled: true,
    sessionValid: false,
    lastSyncAt: null,
    commands: ['feed', 'post', 'like', 'repost', 'comment', 'search', 'notifications', 'user', 'topic', 'create'],
  },
  {
    id: 'xiaohongshu',
    name: 'xiaohongshu',
    displayName: '小红书',
    icon: '📕',
    color: '#FF2442',
    enabled: false,
    sessionValid: false,
    lastSyncAt: null,
    commands: ['feed', 'post', 'like', 'comment', 'search', 'notifications', 'user', 'create'],
  },
];

export const feedItems: FeedItem[] = [
  {
    id: 'tw-1',
    platform: 'twitter',
    author: {
      id: 'elonmusk',
      name: 'Elon Musk',
      handle: '@elonmusk',
      avatar: 'https://pbs.twimg.com/profile_images/1845482317838229504/DGkEKIFo_normal.jpg',
      verified: true,
      platform: 'twitter',
    },
    content: {
      text: 'The thing I love most about the future is that it hasn\'t happened yet. Every day is a blank page waiting to be written. 🚀',
    },
    stats: { likes: 142300, reposts: 18700, comments: 9800, views: 28500000 },
    interactions: { liked: false, reposted: false, bookmarked: false },
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    url: 'https://x.com/elonmusk/status/1234567890',
  },
  {
    id: 'jk-1',
    platform: 'jike',
    author: {
      id: 'jike-user-1',
      name: '产品沉思录',
      handle: '@pmthinking',
      avatar: 'https://picsum.photos/seed/jk1/200',
      verified: false,
      platform: 'jike',
    },
    content: {
      text: '最近在思考一个问题：为什么很多产品经理都陷入了「功能思维」，而不是「问题思维」？用户要的从来不是功能，而是解决方案。\n\n一个好的产品经理应该花 80% 的时间理解问题，20% 的时间设计方案。但现实中往往反过来了。',
    },
    stats: { likes: 328, reposts: 45, comments: 67 },
    interactions: { liked: true, reposted: false, bookmarked: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    url: 'https://web.okjike.com/originalPost/abc123',
  },
  {
    id: 'li-1',
    platform: 'linkedin',
    author: {
      id: 'satyanadella',
      name: 'Satya Nadella',
      handle: '@satyanadella',
      avatar: 'https://picsum.photos/seed/li1/200',
      verified: true,
      platform: 'linkedin',
    },
    content: {
      text: 'Excited to share that Microsoft is making AI accessible to every developer, every organization, and every person on the planet. The next era of computing is here.\n\n#AI #Microsoft #Innovation',
    },
    stats: { likes: 45200, reposts: 3100, comments: 1200, views: 8900000 },
    interactions: { liked: false, reposted: false, bookmarked: false },
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    url: 'https://linkedin.com/posts/satyanadella/abc123',
  },
  {
    id: 'tw-2',
    platform: 'twitter',
    author: {
      id: 'kaborsky',
      name: 'Andrej Karpathy',
      handle: '@karpathy',
      avatar: 'https://picsum.photos/seed/tw2/200',
      verified: true,
      platform: 'twitter',
    },
    content: {
      text: 'Hot take: the best way to learn programming is to build something you actually want to use. Tutorials are fine for syntax, but real learning happens when you hit problems that no tutorial anticipated.',
      media: [
        {
          type: 'image',
          url: 'https://picsum.photos/seed/code1/800/400',
          width: 800,
          height: 400,
        },
      ],
    },
    stats: { likes: 28900, reposts: 4300, comments: 890, views: 5200000 },
    interactions: { liked: true, reposted: true, bookmarked: false },
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    url: 'https://x.com/karpathy/status/9876543210',
  },
  {
    id: 'wb-1',
    platform: 'weibo',
    author: {
      id: 'weibo-tech',
      name: '36氪',
      handle: '@36氪',
      avatar: 'https://picsum.photos/seed/wb1/200',
      verified: true,
      platform: 'weibo',
    },
    content: {
      text: '【AI编程工具大比拼】最新评测显示，Claude Code 在复杂项目重构任务中表现最佳，而 Cursor 在日常编码中效率最高。你更喜欢哪个？ #AI编程 #开发者工具',
    },
    stats: { likes: 1520, reposts: 340, comments: 230 },
    interactions: { liked: false, reposted: false, bookmarked: false },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    url: 'https://weibo.com/1234567890/abcdef',
  },
  {
    id: 'jk-2',
    platform: 'jike',
    author: {
      id: 'jike-user-2',
      name: '少楠 Plidezus',
      handle: '@plidezus',
      avatar: 'https://picsum.photos/seed/jk2/200',
      verified: false,
      platform: 'jike',
    },
    content: {
      text: '重新思考了一下笔记工具的本质：不是记录，而是思考的脚手架。\n\n好的笔记工具应该帮你「想清楚」，而不仅仅是「记下来」。这是 Notion 和 Obsidian 的根本区别——前者是组织信息，后者是连接想法。',
    },
    stats: { likes: 567, reposts: 89, comments: 112 },
    interactions: { liked: false, reposted: false, bookmarked: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    url: 'https://web.okjike.com/originalPost/def456',
  },
  {
    id: 'xhs-1',
    platform: 'xiaohongshu',
    author: {
      id: 'xhs-user-1',
      name: '设计师小林',
      handle: '@designerlin',
      avatar: 'https://picsum.photos/seed/xhs1/200',
      verified: false,
      platform: 'xiaohongshu',
    },
    content: {
      text: '分享一下我用 AI 做的 UI 设计流程 ✨\n\n1. 先用 ChatGPT 做需求分析\n2. 用 Midjourney 生成灵感图\n3. 在 Figma 中细化\n4. 用 Cursor 直接生成前端代码\n\n效率提升了 300% 不夸张！',
      media: [
        { type: 'image', url: 'https://picsum.photos/seed/xhs-a/400/500', width: 400, height: 500 },
        { type: 'image', url: 'https://picsum.photos/seed/xhs-b/400/500', width: 400, height: 500 },
        { type: 'image', url: 'https://picsum.photos/seed/xhs-c/400/500', width: 400, height: 500 },
      ],
    },
    stats: { likes: 2340, reposts: 178, comments: 89 },
    interactions: { liked: false, reposted: false, bookmarked: false },
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    url: 'https://www.xiaohongshu.com/explore/abc123',
  },
  {
    id: 'tw-3',
    platform: 'twitter',
    author: {
      id: 'levelsio',
      name: 'Pieter Levels',
      handle: '@levelsio',
      avatar: 'https://picsum.photos/seed/tw3/200',
      verified: true,
      platform: 'twitter',
    },
    content: {
      text: '🚀 Just crossed $100k/mo revenue on my latest AI project\n\nBuilt it solo. No team. No funding. No meetings.\n\nThe playbook:\n- Find a pain point\n- Build fast (2 weeks)\n- Ship and iterate\n- Let users tell you what to build next\n\nStop overthinking, start shipping.',
    },
    stats: { likes: 67800, reposts: 12400, comments: 3200, views: 15000000 },
    interactions: { liked: false, reposted: false, bookmarked: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    url: 'https://x.com/levelsio/status/1111111111',
  },
];

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    platform: 'twitter',
    type: 'like',
    actor: { name: 'Sam Altman', handle: '@sama', avatar: 'https://picsum.photos/seed/n1/200' },
    content: '赞了你的推文',
    targetPostContent: 'AI coding tools are changing how we build software...',
    originalUrl: 'https://x.com/notifications',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: 'n2',
    platform: 'jike',
    type: 'comment',
    actor: { name: '互联网产品观察', handle: '@pm-observer', avatar: 'https://picsum.photos/seed/n2/200' },
    content: '评论了你的动态：「说得太对了，问题思维才是核心」',
    targetPostContent: '为什么很多产品经理都陷入了功能思维...',
    originalUrl: 'https://web.okjike.com/notifications',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'n3',
    platform: 'linkedin',
    type: 'repost',
    actor: { name: 'Sarah Chen', handle: '@sarahchen', avatar: 'https://picsum.photos/seed/n3/200' },
    content: '转发了你的帖子',
    targetPostContent: 'Excited about the future of AI in enterprise...',
    originalUrl: 'https://linkedin.com/notifications',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'n4',
    platform: 'twitter',
    type: 'follow',
    actor: { name: 'Naval Ravikant', handle: '@naval', avatar: 'https://picsum.photos/seed/n4/200' },
    content: '关注了你',
    originalUrl: 'https://x.com/notifications',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'n5',
    platform: 'jike',
    type: 'like',
    actor: { name: 'flomo 少楠', handle: '@plidezus', avatar: 'https://picsum.photos/seed/n5/200' },
    content: '赞了你的动态',
    targetPostContent: '笔记工具的本质不是记录...',
    originalUrl: 'https://web.okjike.com/notifications',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'n6',
    platform: 'twitter',
    type: 'mention',
    actor: { name: 'Guillermo Rauch', handle: '@rauchg', avatar: 'https://picsum.photos/seed/n6/200' },
    content: '在推文中提到了你：「@you great thread on AI tooling」',
    originalUrl: 'https://x.com/notifications',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'n7',
    platform: 'weibo',
    type: 'comment',
    actor: { name: '科技前沿', handle: '@tech-frontier', avatar: 'https://picsum.photos/seed/n7/200' },
    content: '评论了你的微博：「这个对比很有参考价值」',
    targetPostContent: 'AI编程工具大比拼...',
    originalUrl: 'https://weibo.com/notifications',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'n8',
    platform: 'xiaohongshu',
    type: 'like',
    actor: { name: 'UI设计日记', handle: '@uidiary', avatar: 'https://picsum.photos/seed/n8/200' },
    content: '赞了你的笔记',
    targetPostContent: 'AI 做 UI 设计流程分享...',
    originalUrl: 'https://www.xiaohongshu.com/notifications',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟`;
  if (hours < 24) return `${hours}小时`;
  if (days < 7) return `${days}天`;
  return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    twitter: '𝕏',
    jike: '⚡',
    linkedin: 'in',
    weibo: '微',
    xiaohongshu: '📕',
  };
  return icons[platform] || '?';
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    twitter: '#1D9BF0',
    jike: '#FFE411',
    linkedin: '#0A66C2',
    weibo: '#E6162D',
    xiaohongshu: '#FF2442',
  };
  return colors[platform] || '#888';
}
