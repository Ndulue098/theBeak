'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: boolean;
  style?: React.CSSProperties;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className, trigger, style }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const chars = "!@#$%^&*()_+{}:\"<>?|1234567890qwertyuiopasdfghjklzxcvbnm";

  useEffect(() => {
    if (!textRef.current || !trigger) return;

    const split = new SplitType(textRef.current, { types: 'chars' });
    const characters = split.chars;

    if (!characters) return;

    // Reset styles
    gsap.set(characters, { opacity: 0, blur: 5 });

    const tl = gsap.timeline();

    characters.forEach((char, index) => {
      const originalText = char.innerText;
      
      tl.to(char, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.1,
        onStart: () => {
          const scrambleInterval = setInterval(() => {
            char.innerText = chars[Math.floor(Math.random() * chars.length)];
          }, 50);

          gsap.delayedCall(0.5, () => {
            clearInterval(scrambleInterval);
            char.innerText = originalText;
          });
        }
      }, index * 0.03);
    });

    return () => {
      split.revert();
    };
  }, [trigger, text]);

  return (
    <div ref={textRef} className={className} style={style}>
      {text}
    </div>
  );
};

export default ScrambleText;
