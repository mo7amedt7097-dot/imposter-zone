import React from 'react';
import { motion } from 'framer-motion';
import { Play, Users, PlusCircle, LogIn, Zap, QrCode, Sparkles, Flame, Film, Trophy, Utensils } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function HomeView({
  savedGroupsCount,
  onNavigate
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-4 py-6 max-w-md mx-auto w-full text-center relative overflow-hidden">
      {/* Floating Animated Category Vector Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-8 text-[#D92772]"
        >
          <Utensils className="w-10 h-10" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 left-6 text-[#E5B91A]"
        >
          <Film className="w-10 h-10" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 right-10 text-emerald-400"
        >
          <Trophy className="w-10 h-10" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-20 left-10 text-purple-400"
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>
      </div>

      {/* Main Brand Title Section */}
      <div className="my-auto space-y-3 z-10 w-full pt-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-block"
        >
          <span className="px-4 py-1.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] text-xs font-black tracking-wider uppercase flex items-center gap-1.5 mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            لعبة الشلة الأولى في مصر
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black tracking-tighter text-[#F4F0E8] drop-shadow-2xl"
        >
          IMPOSTER
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-extrabold text-[#E5B91A] text-glow-yellow flex items-center justify-center gap-2"
        >
          <span>مين فيكم مش عارف؟</span>
          <Flame className="w-6 h-6 text-[#D92772] animate-pulse" />
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-semibold text-[#F4F0E8]/70 max-w-xs mx-auto leading-relaxed"
        >
          موبايل واحد أو عدة هواتف • شلة واحدة • شك في الكل
        </motion.p>
      </div>

      {/* Entry Actions Menu */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full space-y-3 z-10 mt-auto"
      >
        {/* Quick Game Button */}
        <button
          onClick={() => {
            soundManager.playTap();
            onNavigate('QUICK_GAME');
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] via-[#4A1E55] to-[#D92772] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all glow-pink"
        >
          <Zap className="w-5 h-5 text-[#E5B91A] fill-current" />
          لعب سريع
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          {/* My Groups */}
          <button
            onClick={() => {
              soundManager.playTap();
              onNavigate('MY_GROUPS');
            }}
            className="py-3.5 px-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-extrabold text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all relative"
          >
            <Users className="w-4 h-4 text-[#E5B91A]" />
            جروباتي
            {savedGroupsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D92772] text-[10px] font-black text-white flex items-center justify-center">
                {savedGroupsCount}
              </span>
            )}
          </button>

          {/* Join Group */}
          <button
            onClick={() => {
              soundManager.playTap();
              onNavigate('JOIN_GROUP');
            }}
            className="py-3.5 px-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-extrabold text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4 text-[#D92772]" />
            دخول لجروب
          </button>
        </div>

        {/* Create Group */}
        <button
          onClick={() => {
            soundManager.playTap();
            onNavigate('CREATE_GROUP');
          }}
          className="w-full py-3.5 rounded-2xl bg-[#2A102E] hover:bg-[#4A1E55] border border-[#D92772]/40 font-black text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-[#E5B91A]" />
          إنشاء جروب جديد
        </button>

        {/* Card Play Gateway */}
        <button
          onClick={() => {
            soundManager.playTap();
            onNavigate('CARD_GATEWAY');
          }}
          className="w-full py-2 text-xs font-bold text-[#F4F0E8]/50 hover:text-[#E5B91A] flex items-center justify-center gap-1.5 transition-colors pt-1"
        >
          <QrCode className="w-3.5 h-3.5" />
          لعب بالكروت (سكان QR)
        </button>
      </motion.div>
    </div>
  );
}

