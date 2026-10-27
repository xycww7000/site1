import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Flame } from 'lucide-react';

export const HeroVideo: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // YouTube Loop video ID from nosoul4life
  const videoId = 'pSBo0dL-Xuk';
  const posterUrl = 'https://img.youtube.com/vi_webp/pSBo0dL-Xuk/maxresdefault.webp';

  return (
    <section className="relative w-full overflow-hidden bg-black select-none border-b border-white/10">
      <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[85vh] min-h-[320px] bg-black">
        {/* YouTube Video Player Embed */}
        {isPlaying ? (
          <iframe
            className="w-full h-full object-cover scale-[1.12] pointer-events-none"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${
              isMuted ? 1 : 0
            }&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            title="cia4w loop visual video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={posterUrl}
              alt="cia4w Visual Drop"
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-sm font-mono tracking-widest uppercase text-white/80">
                Pausado
              </span>
            </div>
          </div>
        )}

        {/* Ambient Film Noir Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

        {/* Floating Brand Badge & Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-auto z-10">
          <div className="bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-sm text-xs font-mono text-zinc-300 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
            <span className="uppercase tracking-widest text-[10px] text-zinc-200">
              DROP 01 • SÃO PAULO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-black/75 hover:bg-black/95 text-white/80 hover:text-white rounded border border-white/20 backdrop-blur-md transition-all active:scale-95"
              aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-black/75 hover:bg-black/95 text-white/80 hover:text-white rounded border border-white/20 backdrop-blur-md transition-all active:scale-95"
              aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
