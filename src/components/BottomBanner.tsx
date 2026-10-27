import React from 'react';
import { BOTTOM_SLIDER_IMAGE } from '../data/products';

export const BottomBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black py-4 border-t border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden border border-white/15 bg-zinc-950 group">
          <img
            src={BOTTOM_SLIDER_IMAGE}
            alt="cia4w Lookbook Slide"
            loading="lazy"
            className="w-full h-auto object-cover filter brightness-95 group-hover:brightness-105 transition-all duration-700"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute bottom-3 right-4 text-[10px] font-mono uppercase tracking-widest text-zinc-400 bg-black/70 px-2.5 py-1 border border-white/10 backdrop-blur-sm">
            cia4w archive // drop 01
          </div>
        </div>
      </div>
    </section>
  );
};
