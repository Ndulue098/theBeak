'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ArtworkCardProps {
  image: string;
  title: string;
  index: string;
  isCenter?: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ image, title, index, isCenter }) => {
  return (
    <div className="artwork-card relative w-[80vw] sm:w-[70vw] md:w-[55vw] lg:w-[45vw] max-h-[70vh] aspect-[4/5] md:aspect-[16/10] flex-shrink-0 group">
      {/* Frame / Matte */}
      <div className="absolute -inset-[1px] bg-white/10 dark:bg-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="artwork-card-inner relative w-full h-full overflow-hidden bg-[#111] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5">
        {/* Artwork Image */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out contrast-[1.1] brightness-[0.9]"
            referrerPolicy="no-referrer"
          />
          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </div>

        {/* Metadata Label - Top Left */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-brand-pink/60" />
            <span className="text-[10px] md:text-[12px] tracking-[0.25em] text-brand-text font-bold uppercase transition-colors group-hover:text-brand-pink">
              ARCHIVE — {index}
            </span>
          </div>
        </div>

        {/* Title & Link - Bottom */}
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 right-10 z-20">
          <h3 className="text-[20px] md:text-[32px] font-heading font-bold text-white uppercase tracking-tight mb-4 leading-none">
            {title}
          </h3>
          
          <motion.button 
            whileHover={{ x: 8 }}
            className="flex items-center gap-4 text-[10px] md:text-[11px] tracking-[0.18em] text-brand-text-secondary uppercase font-bold group/link"
          >
            <span className="border-b border-white/10 pb-1 group-hover/link:border-brand-pink group-hover/link:text-brand-text transition-colors">
              ENTER THE ARCHIVE
            </span>
            <span className="text-brand-pink">&rarr;</span>
          </motion.button>
        </div>

        {/* Grain overlay for the card itself */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
      </div>

      {/* Depth Shadow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-black/40 blur-[60px] pointer-events-none" />
    </div>
  );
};

export default ArtworkCard;
