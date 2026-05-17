'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ArtCardProps {
  image: string;
  id: string;
  title: string;
}

const ArtCard: React.FC<ArtCardProps> = ({ image, id, title }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-4 p-4 md:p-6"
    >
      {/* Artwork Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900 ring-1 ring-white/5">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-expo-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle Inner Glow on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 shadow-[inset_0_0_100px_rgba(255,79,163,0.5)] transition-opacity duration-700 pointer-events-none" />
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-brand-text-secondary uppercase">
          {id}
        </span>
        <h4 className="text-[12px] md:text-[14px] font-medium tracking-[0.1em] text-brand-text uppercase">
          {title}
        </h4>
      </div>
    </motion.div>
  );
};

export default ArtCard;
