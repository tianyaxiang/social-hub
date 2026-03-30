'use client';

import { Heart, MessageCircle, Repeat2, BarChart3, Share, Bookmark } from 'lucide-react';
import { FeedItem as FeedItemType } from '@/lib/types';
import { formatNumber, formatTimeAgo, getPlatformIcon, getPlatformColor } from '@/lib/mock/data';
import { useState } from 'react';

interface FeedItemProps {
  item: FeedItemType;
}

export function FeedItem({ item }: FeedItemProps) {
  const [liked, setLiked] = useState(item.interactions.liked);
  const [reposted, setReposted] = useState(item.interactions.reposted);
  const [bookmarked, setBookmarked] = useState(item.interactions.bookmarked);
  const [likeCount, setLikeCount] = useState(item.stats.likes);
  const [repostCount, setRepostCount] = useState(item.stats.reposts);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setRepostCount(reposted ? repostCount - 1 : repostCount + 1);
  };

  return (
    <article
      className="flex gap-3 px-4 py-3 hover-bg cursor-pointer transition-colors border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            src={item.author.avatar}
            alt={item.author.name}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author.name)}&background=1D9BF0&color=fff`;
            }}
          />
          {/* Platform Badge */}
          <span
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2"
            style={{
              backgroundColor: getPlatformColor(item.platform),
              borderColor: 'var(--bg)',
              color: item.platform === 'jike' ? '#000' : '#fff',
            }}
          >
            {getPlatformIcon(item.platform)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Author line */}
        <div className="flex items-center gap-1 text-sm">
          <span className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {item.author.name}
          </span>
          {item.author.verified && (
            <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] flex-shrink-0" fill="var(--accent)">
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.893.143.636-.13 1.22-.436 1.69-.882.445-.47.749-1.055.878-1.69.13-.634.075-1.293-.148-1.9.586-.27 1.084-.7 1.438-1.24.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
            </svg>
          )}
          <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
            {item.author.handle}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>·</span>
          <span className="text-sm whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
            {formatTimeAgo(item.createdAt)}
          </span>
        </div>

        {/* Text content */}
        <div className="mt-1 text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
          {item.content.text}
        </div>

        {/* Media */}
        {item.content.media && item.content.media.length > 0 && (
          <div
            className={`mt-3 rounded-2xl overflow-hidden border grid gap-0.5 ${
              item.content.media.length === 1
                ? 'grid-cols-1'
                : item.content.media.length === 2
                ? 'grid-cols-2'
                : item.content.media.length === 3
                ? 'grid-cols-2'
                : 'grid-cols-2'
            }`}
            style={{ borderColor: 'var(--border)' }}
          >
            {item.content.media.map((media, idx) => (
              <div
                key={idx}
                className={`overflow-hidden ${
                  item.content.media!.length === 3 && idx === 0 ? 'row-span-2' : ''
                }`}
              >
                <img
                  src={media.url}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{
                    maxHeight: item.content.media!.length === 1 ? '510px' : '286px',
                    minHeight: '143px',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between mt-3 max-w-[425px] -ml-2">
          {/* Comment */}
          <button className="flex items-center gap-1 group">
            <div className="p-2 rounded-full action-comment transition-colors">
              <MessageCircle size={18} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <span className="text-sm group-hover:text-[var(--accent)]" style={{ color: 'var(--text-secondary)' }}>
              {item.stats.comments > 0 ? formatNumber(item.stats.comments) : ''}
            </span>
          </button>

          {/* Repost */}
          <button className="flex items-center gap-1 group" onClick={handleRepost}>
            <div className={`p-2 rounded-full action-repost transition-colors ${reposted ? 'active' : ''}`}>
              <Repeat2
                size={18}
                strokeWidth={1.5}
                style={{ color: reposted ? '#00BA7C' : 'var(--text-secondary)' }}
              />
            </div>
            <span
              className="text-sm"
              style={{ color: reposted ? '#00BA7C' : 'var(--text-secondary)' }}
            >
              {repostCount > 0 ? formatNumber(repostCount) : ''}
            </span>
          </button>

          {/* Like */}
          <button className="flex items-center gap-1 group" onClick={handleLike}>
            <div className={`p-2 rounded-full action-like transition-colors ${liked ? 'active' : ''}`}>
              <Heart
                size={18}
                strokeWidth={1.5}
                fill={liked ? '#F91880' : 'none'}
                style={{ color: liked ? '#F91880' : 'var(--text-secondary)' }}
              />
            </div>
            <span
              className="text-sm"
              style={{ color: liked ? '#F91880' : 'var(--text-secondary)' }}
            >
              {likeCount > 0 ? formatNumber(likeCount) : ''}
            </span>
          </button>

          {/* Views */}
          {item.stats.views !== undefined && (
            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full action-view transition-colors">
                <BarChart3 size={18} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <span className="text-sm group-hover:text-[var(--accent)]" style={{ color: 'var(--text-secondary)' }}>
                {formatNumber(item.stats.views)}
              </span>
            </button>
          )}

          {/* Share / Bookmark */}
          <div className="flex items-center">
            <button
              className="p-2 rounded-full hover-bg transition-colors"
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark
                size={18}
                strokeWidth={1.5}
                fill={bookmarked ? 'var(--accent)' : 'none'}
                style={{ color: bookmarked ? 'var(--accent)' : 'var(--text-secondary)' }}
              />
            </button>
            <button className="p-2 rounded-full hover-bg transition-colors">
              <Share size={18} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
