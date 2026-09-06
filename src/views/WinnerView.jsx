import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Crown, RotateCcw, Play, Home } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function WinnerView({ winner, onResetScores, onContinuePlaying, onGoHome }) {
  useEffect(() => {
    soundManager.playWinFanfare();

    // Trigger rich confetti animation
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D92772', '#E5B91A', '#4A1E55', '#FFFFFF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D92772', '#E5B91A', '#4A1E55', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between items-center px-4 py-6 max-w-md mx-auto w-full text-center text-[#F4F0E8] relative overflow-hidden">
      {/* Background Glow & Sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#D92772] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#E5B91A] rounded-full blur-3xl" />
      </div>

      <div className="my-auto space-y-6 z-10 w-full">
        {/* Crown & Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D92772] via-[#E5B91A] to-[#D92772] border-4 border-[#E5B91A] flex items-center justify-center mx-auto shadow-2xl shadow-[#E5B91A]/40 glow-yellow"
        >
          <Crown className="w-14 h-14 text-black fill-current" />
        </motion.div>

        {/* Victory Messages */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-black text-[#E5B91A] text-glow-yellow">
            خلصت يا معلم
          </h1>
          <h2 className="text-3xl font-black text-[#F4F0E8]">
            <span className="text-[#D92772]">{winner?.name}</span> وصل 50 نقطة
          </h2>
          <p className="text-sm font-extrabold text-[#F4F0E8]/70">
            الباقي يراجع نفسه
          </p>
        </motion.div>

        {/* Big 50 Badge */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="glass-panel p-6 rounded-3xl border border-[#E5B91A]/50 inline-block shadow-2xl bg-gradient-to-b from-[#2A102E] to-[#120A12]"
        >
          <span className="text-7xl font-black text-[#E5B91A] text-glow-yellow tracking-tight">
            50
          </span>
          <span className="block text-xs font-black text-[#F4F0E8]/80 mt-1">
            نقطة الفوز الساحق
          </span>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5 z-10 mt-auto">
        <button
          onClick={() => {
            soundManager.playTap();
            onResetScores();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all glow-pink"
        >
          <RotateCcw className="w-5 h-5 text-[#E5B91A]" />
          نلعب من الأول
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              soundManager.playTap();
              onContinuePlaying();
            }}
            className="py-3 px-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-xs text-[#F4F0E8] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 text-[#E5B91A]" />
            نكمل هزار
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              if (onGoHome) onGoHome();
            }}
            className="py-3 px-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-[#E5B91A]/30 font-bold text-xs text-[#E5B91A] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 text-[#E5B91A]" />
            الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}
