import React from "react";
import { Eye, Tag, Heart } from "lucide-react";
import { Effect } from "../types/Effect";
import { CodePreview } from "./CodePreview";


const categoryColors: Record<string, string> = {
  text: "border-cyan-500/30 hover:border-cyan-500/50",
  scroll: "border-pink-500/30 hover:border-pink-500/50",
  bg: "border-purple-500/30 hover:border-purple-500/50",
  gallery: "border-green-500/30 hover:border-green-500/50",
  button: "border-orange-500/30 hover:border-orange-500/50",
  loading: "border-blue-500/30 hover:border-blue-500/50",
  others: "border-yellow-500/30 hover:border-yellow-500/50",
};

const categoryBadgeColors: Record<string, string> = {
  text: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  scroll: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  bg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  gallery: "bg-green-500/20 text-green-300 border-green-500/30",
  button: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  loading: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  others: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

interface EffectCardProps {
  effect: Effect;
  isCodeMode: boolean;
  onPreview: (effect: Effect) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (effectId: string) => void;
}

export const EffectCard: React.FC<EffectCardProps> = ({
  effect,
  isCodeMode,
  onPreview,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(effect.id);
  };
  
  const hasValidVideo = effect.video && !effect.video.includes('path/to/video');
  const hasValidThumbnail = effect.thumbnail && !effect.thumbnail.includes('path/to/thumbnail');

  return (
    <div
      className={`bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition-all duration-300 group border cursor-pointer ${
        categoryColors[effect.category] || "border-zinc-500/30"
      }`}
      onClick={() => onPreview(effect)}
    >
      <div className="aspect-video bg-zinc-800 relative overflow-hidden">
        {!isCodeMode ? (
          hasValidVideo ? (
            <div className="relative w-full h-full">
              <video
                src={effect.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Eye className="w-12 h-12 text-white" />
              </div>
            </div>
          ) : hasValidThumbnail ? (
            <div className="relative w-full h-full">
              <img
                src={effect.thumbnail}
                alt={effect.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Eye className="w-12 h-12 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative group-hover:opacity-80 transition-opacity text-black">
               <div className="absolute inset-0 pointer-events-none">
                  <CodePreview 
                    html={effect.code.html} 
                    css={effect.code.css} 
                    js={effect.code.js} 
                    className="w-full h-full" 
                  />
               </div>
               {/* Overlay for detecting clicks since iframe eats events */}
               <div className="absolute inset-0 bg-transparent" />
            </div>
          )
        ) : (
          <div className="p-4 h-full overflow-hidden">
            <pre className="text-xs text-white font-mono leading-relaxed overflow-hidden">
              <code>
                {effect.code.js || effect.code.css || effect.code.html}
              </code>
            </pre>
          </div>
        )}

        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />

        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 ${
              isFavorite
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-white transition-colors">
            {effect.title}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full border capitalize font-secondary ${
              categoryBadgeColors[effect.category] || "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
            }`}
          >
            {effect.category}
          </span>
        </div>

        <p className="text-white text-sm mb-4 leading-relaxed font-secondary">
          {effect.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {effect.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-zinc-800 text-white text-xs rounded-md"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-700">
          <p className="text-xs text-zinc-500 font-secondary">
            Created by{" "}
            <span className={`font-semibold ${(effect as any).authorRole === 'admin' ? 'status-big-boss' : 'text-zinc-400'}`}>
              {effect.author}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
