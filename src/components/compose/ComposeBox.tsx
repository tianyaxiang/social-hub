'use client';

import { useState } from 'react';
import { Image, Film, Smile, MapPin, CalendarClock, AlertCircle } from 'lucide-react';
import { platforms as allPlatforms } from '@/lib/mock/data';
import { PlatformName } from '@/lib/types';

export function ComposeBox() {
  const [text, setText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformName[]>(['twitter', 'jike', 'linkedin']);
  const [dryRun, setDryRun] = useState(true);
  const [needsReview, setNeedsReview] = useState(true);

  const activePlatforms = allPlatforms.filter((p) => p.enabled && p.sessionValid);
  const maxLength = 280;
  const charCount = text.length;

  const togglePlatform = (name: PlatformName) => {
    setSelectedPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex gap-3 px-4 pt-4">
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          L
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="有什么新鲜事？"
            className="w-full bg-transparent outline-none resize-none text-xl leading-relaxed min-h-[120px]"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="px-4 py-2 ml-[52px]">
        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>发布到：</div>
        <div className="flex flex-wrap gap-2">
          {activePlatforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.name);
            return (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border"
                style={{
                  borderColor: isSelected ? platform.color : 'var(--border)',
                  backgroundColor: isSelected ? platform.color + '20' : 'transparent',
                  color: isSelected ? platform.color : 'var(--text-secondary)',
                }}
              >
                <span className="text-xs">{platform.icon}</span>
                {platform.displayName}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-4 ml-[52px] border-b" style={{ borderColor: 'var(--border)' }} />

      <div className="flex items-center justify-between px-4 py-2 ml-[52px]">
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover-bg transition-colors" style={{ color: 'var(--accent)' }}>
            <Image size={20} />
          </button>
          <button className="p-2 rounded-full hover-bg transition-colors" style={{ color: 'var(--accent)' }}>
            <Film size={20} />
          </button>
          <button className="p-2 rounded-full hover-bg transition-colors" style={{ color: 'var(--accent)' }}>
            <Smile size={20} />
          </button>
          <button className="p-2 rounded-full hover-bg transition-colors" style={{ color: 'var(--accent)' }}>
            <MapPin size={20} />
          </button>
          <button className="p-2 rounded-full hover-bg transition-colors" style={{ color: 'var(--accent)' }}>
            <CalendarClock size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {text.length > 0 && (
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <circle cx="12" cy="12" r="10" fill="none" strokeWidth="2" style={{ stroke: 'var(--border)' }} />
                <circle
                  cx="12" cy="12" r="10"
                  fill="none"
                  strokeWidth="2"
                  strokeDasharray={`${(charCount / maxLength) * 62.83} 62.83`}
                  strokeLinecap="round"
                  transform="rotate(-90 12 12)"
                  style={{
                    stroke: charCount > maxLength ? '#F91880' : charCount > maxLength * 0.8 ? '#FFD400' : 'var(--accent)',
                  }}
                />
              </svg>
              <span
                className="text-sm"
                style={{ color: charCount > maxLength ? '#F91880' : 'var(--text-secondary)' }}
              >
                {charCount > maxLength * 0.8 ? maxLength - charCount : ''}
              </span>
            </div>
          )}

          <button
            className="px-5 py-2 rounded-full font-bold text-sm text-white transition-opacity"
            style={{
              backgroundColor: 'var(--accent)',
              opacity: text.length === 0 || selectedPlatforms.length === 0 ? 0.5 : 1,
            }}
            disabled={text.length === 0 || selectedPlatforms.length === 0}
          >
            {dryRun ? '预览发布' : '发布'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-2 ml-[52px] mb-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          <AlertCircle size={14} />
          Dry-run（不会真实发布）
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={needsReview}
            onChange={(e) => setNeedsReview(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          需要人工审核
        </label>
      </div>
    </div>
  );
}
