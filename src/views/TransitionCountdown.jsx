import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Eye } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function TransitionCountdown({ onComplete }) {
  const [count, setCount] = useState(3);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    soundManager.playTick();
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) {
          soundManager.playTick();
          return prev - 1;
        } else {
          clearInterval(interval);
          setShowWarning(true);
          soundManager.playRoleReveal();
          setTimeout(() => {
            onComplete();
          }, 1400);
          return 0;
        }
      });
    }, 900);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-md mx-auto w-full text-center text-[#F4F0E8] overflow-hidden">
      <AnimatePresence mode="wait">
        {!showWarning ? (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-[#E5B91A]">
              <Rocket className="w-6 h-6 text-[#E5B91A]" />
              <span>جاهزين؟</span>
            </div>
            <div className="text-8xl font-black text-[#D92772] text-glow-pink drop-shadow-2xl">
              {count}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="warning"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4 p-6 glass-panel rounded-3xl border border-[#D92772]/50 glow-pink"
          >
            <div className="flex justify-center">
              <Eye className="w-14 h-14 text-[#E5B91A] animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-[#E5B91A]">
              محدش يفضح نفسه
            </h2>
            <p className="text-xs font-bold text-[#F4F0E8]/80">
              باظت اللعبة لو حد بَص في شاشة غيره!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
