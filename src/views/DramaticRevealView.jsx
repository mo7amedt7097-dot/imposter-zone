import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, AlertTriangle, ArrowLeft, Trophy, Vote, Eye, User } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function DramaticRevealView({ players, imposterIds, votes, onProceed }) {
  const [stage, setStage] = useState('suspense'); // 'suspense' | 'countdown' | 'reveal'
  const [countdown, setCountdown] = useState(3);

  // Calculate vote tallies
  const voteTallies = {};
  players.forEach((p) => {
    voteTallies[p.id] = 0;
  });

  Object.values(votes).forEach((targetId) => {
    if (voteTallies[targetId] !== undefined) {
      voteTallies[targetId] += 1;
    }
  });

  // Identify caught imposters (if votes cast against them > 0 and they have maximum or high votes)
  // Find highest vote count
  const maxVotes = Math.max(...Object.values(voteTallies));

  // Players with maximum votes
  const topVotedIds = Object.keys(voteTallies).filter(id => voteTallies[id] === maxVotes && maxVotes > 0);

  // Caught imposters are imposters who are among the top voted!
  const caughtImposterIds = imposterIds.filter(id => topVotedIds.includes(id));

  const imposters = players.filter((p) => imposterIds.includes(p.id));

  useEffect(() => {
    if (stage === 'suspense') {
      soundManager.playDramaticSuspense();
      const timer = setTimeout(() => {
        setStage('countdown');
      }, 2500);
      return () => clearTimeout(timer);
    }

    if (stage === 'countdown') {
      soundManager.playTick();
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            soundManager.playTick();
            return prev - 1;
          } else {
            clearInterval(interval);
            soundManager.playRevealBoom();
            setStage('reveal');
            return 0;
          }
        });
      }, 800);
      return () => clearInterval(interval);
    }

    if (stage === 'reveal') {
      const autoTimer = setTimeout(() => {
        onProceed(caughtImposterIds, voteTallies);
      }, 4500);
      return () => clearTimeout(autoTimer);
    }
  }, [stage]);

  const handleNext = () => {
    soundManager.playTap();
    onProceed(caughtImposterIds, voteTallies);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-6 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-hidden relative">
      <AnimatePresence mode="wait">
        {stage === 'suspense' && (
          <motion.div
            key="suspense"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="my-auto space-y-6 animate-pulse-blur"
          >
            <AlertTriangle className="w-16 h-16 text-[#D92772] animate-bounce mx-auto" />
            <h2 className="text-4xl font-black text-[#E5B91A] text-glow-yellow">
              طب نشوف بقى…
            </h2>
            <p className="text-sm font-bold text-[#F4F0E8]/70">
              مين اللي كان بيهبد ومين اللي اتكشف؟
            </p>
          </motion.div>
        )}

        {stage === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="my-auto space-y-4"
          >
            <span className="text-[#E5B91A] font-black text-xl flex items-center justify-center gap-1.5">
              <Eye className="w-6 h-6 text-[#E5B91A]" />
              <span>كشف الحقيقة</span>
            </span>
            <div className="text-9xl font-black text-[#D92772] text-glow-pink drop-shadow-2xl">
              {countdown}
            </div>
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="my-auto space-y-5 w-full"
          >
            {/* Main Imposter Reveal Box */}
            <div className="glass-panel p-6 rounded-3xl border border-[#D92772] glow-pink space-y-4 bg-gradient-to-b from-[#2A102E] to-[#120A12]">
              <span className="px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] text-xs font-black">
                {imposters.length === 1 ? 'الـ IMPOSTER هو…' : 'الإمبوسترز هما…'}
              </span>

              <div className="space-y-2">
                {imposters.map((imp) => (
                  <motion.div
                    key={imp.id}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="p-4 rounded-2xl bg-[#1B0E19] border border-[#D92772]/50"
                  >
                    <h3 className="text-3xl font-black text-[#E5B91A] text-glow-yellow">
                      {imp.name}
                    </h3>
                  </motion.div>
                ))}
              </div>

              <p className="text-base font-extrabold text-[#D92772]">
                {imposters.length === 1 ? 'اتقفشت يا نجم' : 'يا سلام على العصابة'}
              </p>
            </div>

            {/* Vote Counts Breakdown */}
            <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-2">
              <h4 className="text-xs font-black text-[#F4F0E8]/70 text-right flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Vote className="w-3.5 h-3.5 text-[#E5B91A]" />
                  <span>توزيع الأصوات</span>
                </span>
                <span>الأصوات</span>
              </h4>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {players
                  .slice()
                  .sort((a, b) => voteTallies[b.id] - voteTallies[a.id])
                  .map((player) => {
                    const count = voteTallies[player.id];
                    const isImp = imposterIds.includes(player.id);
                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-bold border ${
                          isImp
                            ? 'bg-[#D92772]/20 border-[#D92772]/40 text-[#F4F0E8]'
                            : 'bg-[#120A12] border-white/5 text-[#F4F0E8]/80'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {isImp ? <Skull className="w-4 h-4 text-[#D92772]" /> : <User className="w-4 h-4 text-[#F4F0E8]/60" />}
                          {player.name}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#2A102E] text-xs text-[#E5B91A] font-black">
                          {count === 1 ? 'صوت واحد' : count === 2 ? 'صوتين' : `${count} أصوات`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>التالي</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
