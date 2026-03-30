'use client';

import { PenSquare } from 'lucide-react';
import { ComposeBox } from '@/components/compose/ComposeBox';

export default function ComposePage() {
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
        <div className="flex items-center gap-3">
          <PenSquare size={24} style={{ color: 'var(--text-primary)' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>发布</h1>
        </div>
      </div>

      {/* Compose Box */}
      <ComposeBox />

      {/* Placeholder for preview/drafts */}
      <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
        <p className="text-lg mb-2">草稿和发布预览将显示在这里</p>
        <p className="text-sm">撰写内容后点击"预览发布"查看各平台效果</p>
      </div>
    </div>
  );
}
