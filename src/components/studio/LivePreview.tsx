import React from 'react';
import { CodePreview } from '../CodePreview';

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ html, css, js }) => {
  return (
    <div className="h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
        <span className="text-xs font-mono text-zinc-400 uppercase">Preview</span>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="flex-1 bg-black relative">
          <CodePreview html={html} css={css} js={js} interactive={true} />
      </div>
    </div>
  );
};
