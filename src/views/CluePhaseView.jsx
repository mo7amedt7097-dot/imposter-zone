import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, Plus, Vote, MessageSquare } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function CluePhaseView({ timerEnabled, gameMode = 'ONE_PHONE', isHost = true, onStartVoting }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(true);
  const isMultiPhone = gameMode === 'MULTI_PHONE';

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          soundManager.playTick();
          // Auto-trigger voting when timer finishes!
          setTimeout(() => {
            onStartVoting();
          }, 800);
          return 0;
        }
        if (prev <= 6) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onStartVoting]);

  const handleAddSeconds = () => {
    soundManager.playTap();
    setTimeLeft((prev) => prev + 30);
  };

  const togglePause = () => {
    soundManager.playTap();
    setIsRunning(!isRunning);
  };

  const handleProceed = () => {
    soundManager.playTap();
    onStartVoting();
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto">
      {/* Title */}
      <div className="space-y-2 my-2">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3.5 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] text-xs font-black inline-flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          مرحلة التلميحات والأدلة
        </motion.span>

        <h2 className="text-3xl font-black text-[#F4F0E8]">
          وقت الكلام والأسئلة
        </h2>

        <p className="text-xs font-bold text-[#F4F0E8]/70 max-w-xs mx-auto leading-relaxed">
          كل واحد يقول تلميح واسألوا بعض… من غير ما تجيبوا الكلمة على البلاطة!
        </p>
      </div>

      {/* Timer Section */}
      <div className="my-auto space-y-4">
        <div className="glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-2 text-[#D92772] text-xs font-black">
            <Timer className="w-4 h-4 animate-spin" />
            <span>الوقت المتبقي للمناقشة</span>
          </div>

          <div className="text-6xl font-black font-mono text-[#E5B91A] text-glow-yellow mb-4">
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>

          {(isHost || !isMultiPhone) && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={togglePause}
                className="px-4 py-2.5 rounded-xl bg-[#2A102E] border border-white/10 text-xs font-bold flex items-center gap-1.5 hover:bg-[#4A1E55] transition-colors"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" /> إيقاف مؤقت
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" /> استئناف
                  </>
                )}
              </button>

              <button
                onClick={handleAddSeconds}
                className="px-4 py-2.5 rounded-xl bg-[#D92772]/20 border border-[#D92772]/40 text-xs font-bold text-[#D92772] flex items-center gap-1 hover:bg-[#D92772]/30 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                +30 ثانية
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Start Voting Button */}
      <div className="mt-auto pt-4">
        {isMultiPhone && !isHost ? (
          <div className="py-4 rounded-2xl bg-[#1B0E19] border border-white/10 text-xs font-bold text-[#E5B91A] text-center animate-pulse flex items-center justify-center gap-2">
            <Timer className="w-4 h-4 animate-spin" /> في انتظار الـ Host لبداية التصويت السرّي...
          </div>
        ) : (
          <button
            onClick={handleProceed}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all glow-pink"
          >
            <Vote className="w-6 h-6 text-[#E5B91A]" />
            <span>ابدأ التصويت الآن</span>
          </button>
        )}
      </div>
    </div>
  );
}
