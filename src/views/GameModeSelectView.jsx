import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Users, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/sound';


export default function GameModeSelectView({ onSelectGameMode, onBack }) {
  const handleSelect = (mode) => {
    soundManager.playTap();
    onSelectGameMode(mode);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto">
      {/* Header back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            soundManager.playTap();
            onBack();
          }}
          className="p-2.5 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1 text-xs font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          اللوبي
        </button>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5" />
          <span>طريقة اللعب</span>
        </span>
      </div>

      <div className="space-y-2 my-2">
        <h2 className="text-3xl font-black text-[#F4F0E8]">
          هتلعبوا إزاي؟
        </h2>
        <p className="text-xs font-bold text-[#F4F0E8]/70">
          اختار هل كل اللعيبة على موبايل واحد ولا كل واحد من موبايله
        </p>
      </div>

      <div className="space-y-4 my-auto">
        {/* Option 1: One Phone / Pass & Play */}
        <motion.div
          whileTap={{ scale: 0.96 }}
          onClick={() => handleSelect('ONE_PHONE')}
          className="glass-card-interactive p-6 rounded-3xl border border-[#D92772]/40 text-right cursor-pointer group hover:border-[#D92772]"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-[#D92772]" />
              <span>هاتف واحد</span>
            </h3>
            <span className="px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] font-black text-xs">
              Pass & Play
            </span>
          </div>
          <p className="text-sm font-semibold text-[#F4F0E8]/70">
            مرروا الموبايل بينكم.. كل واحد يتأكد من دوره في السر وينقل للي بعده
          </p>
        </motion.div>

        {/* Option 2: Multi Phone / Realtime */}
        <motion.div
          whileTap={{ scale: 0.96 }}
          onClick={() => handleSelect('MULTI_PHONE')}
          className="glass-card-interactive p-6 rounded-3xl border border-[#E5B91A]/40 text-right cursor-pointer group hover:border-[#E5B91A]"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
              <Users className="w-6 h-6 text-[#E5B91A]" />
              <span>عدة هواتف</span>
            </h3>
            <span className="px-3 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] font-black text-xs">
              Realtime Sync
            </span>
          </div>
          <p className="text-sm font-semibold text-[#F4F0E8]/70">
            كل واحد يلعب من موبايله الشخصي.. كل الشاشات متزامنة في نفس الوقت!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
