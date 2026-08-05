'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { uiSounds } from '@/lib/audio/ui-sounds';

// 1. Page Transition Wrapper (Crossfade + Slide)
export function PageTransition({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// 2. Animated Button with Sounds
interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  soundType?: 'click' | 'none';
}

export function AnimatedButton({ children, soundType = 'click', onClick, ...props }: AnimatedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (soundType === 'click') uiSounds.playClick();
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      onHoverStart={() => {
        if (soundType === 'click') uiSounds.playHover();
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// 3. CountUp Statistic
interface NumberCounterProps {
  value: number;
  duration?: number;
  format?: (val: number) => string;
}

export function NumberCounter({ value, duration = 1.5, format = (v) => v.toString() }: NumberCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const end = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{format(count)}</span>;
}
