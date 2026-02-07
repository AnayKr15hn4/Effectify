import React, { useState } from 'react';
import { X, Code, Eye, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { Effect } from '../types/Effect';
import { CodePreview } from './CodePreview';

interface EffectModalProps {
  effect: Effect | null;
  onClose: () => void;
}

export const EffectModal: React.FC<EffectModalProps> = ({ effect, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!effect) return null;

  const copyToClipboard = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const tabs = [
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'html', label: 'HTML', icon: Code, content: effect.code.html },
    { id: 'css', label: 'CSS', icon: Code, content: effect.code.css },
    { id: 'js', label: 'JavaScript', icon: Code, content: effect.code.js },
  ].filter(tab => tab.id === 'preview' || tab.content);

  if (isFullscreen && activeTab === 'preview') {
    return (
      <div className="fixed inset-0 z-[100] bg-black">
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
        >
          <Minimize2 className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 right-16 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        {effect.preview ? (
          <iframe
            src={effect.preview}
            className="w-full h-full border-none"
            title={`${effect.title} Preview`}
          />
        ) : (
          <div className="w-full h-full">
             <CodePreview 
              html={effect.code.html}
              css={effect.code.css}
              js={effect.code.js}
              interactive={true}
            />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <div>
            <h2 className="text-2xl font-black text-white">{effect.title}</h2>
            <p className="text-white mt-1 font-secondary">{effect.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {activeTab === 'preview' && (
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-zinc-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                   ? 'text-white border-b-2 border-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
               <span className="font-secondary">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="h-[500px] overflow-auto">
          {activeTab === 'preview' ? (
            <div className="h-full flex items-center justify-center bg-zinc-800">
              {effect.preview ? (
                <iframe
                  src={effect.preview}
                  className="w-full h-full border-none"
                  title={`${effect.title} Preview`}
                  allow="fullscreen"
                />
              ) : (
                <div className="w-full h-full bg-black">
                   <CodePreview 
                    html={effect.code.html}
                    css={effect.code.css}
                    js={effect.code.js}
                    interactive={true}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  const content = activeTab === 'html' ? effect.code.html :
                                activeTab === 'css' ? effect.code.css :
                                effect.code.js;
                  copyToClipboard(content, activeTab);
                }}
                className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-2 bg-white text-black hover:bg-gray-100 hover:scale-105 hover:shadow-lg rounded-lg transition-all duration-200 z-10 font-medium transform active:scale-95"
              >
                {copiedTab === activeTab ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
              <pre className="p-6 text-sm font-mono leading-relaxed overflow-auto bg-zinc-800 text-white">
                <code>
                  {activeTab === 'html' && effect.code.html}
                  {activeTab === 'css' && effect.code.css}
                  {activeTab === 'js' && effect.code.js}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};