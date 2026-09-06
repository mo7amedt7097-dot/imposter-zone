import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Users, ShieldAlert } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function ImposterCountView({ playerCount, onSelectImposterCount }) {
  const handleSelect = (count) => {
    soundManager.playTap();
    onSelectImposterCount(count);
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-6 max-w-md mx-auto w-full text-[#F4F0E8] text-center space-y-6">
      <div className="space-y-2">
        <span className="px-3.5 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] text-xs font-black inline-flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>عدد اللاعيبين {playerCount}</span>
        </span>
        <h2 className="text-3xl font-black text-[#F4F0E8] drop-shadow-md">
          تحبوا تلعبوها إزاي؟
        </h2>
        <p className="text-xs font-bold text-[#F4F0E8]/70">
          بما إن عددكم أكتر من 6.. تقدروا تختاروا عدد الإمبوسترز
        </p>
      </div>

      <div className="space-y-4 my-auto">
        {/* Option 1: 1 Imposter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => handleSelect(1)}
          className="glass-card-interactive p-6 rounded-3xl border border-[#D92772]/40 text-right cursor-pointer group hover:border-[#D92772]"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#D92772]" />
              <span>إمبوستر واحد</span>
            </h3>
            <span className="w-8 h-8 rounded-full bg-[#D92772]/20 flex items-center justify-center text-[#D92772] font-black text-sm">
              1
            </span>
          </div>
          <p className="text-sm font-semibold text-[#F4F0E8]/70">
            كلاسيك… واحد بس بيحاول ينجو
          </p>
        </motion.div>

        {/* Option 2: 2 Imposters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => handleSelect(2)}
          className="glass-card-interactive p-6 rounded-3xl border border-[#E5B91A]/40 text-right cursor-pointer group hover:border-[#E5B91A]"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#E5B91A]" />
              <span>إمبوسترين (2)</span>
            </h3>
            <span className="w-8 h-8 rounded-full bg-[#E5B91A]/20 flex items-center justify-center text-[#E5B91A] font-black text-sm">
              2
            </span>
          </div>
          <p className="text-sm font-semibold text-[#F4F0E8]/70">
            فوضى أكتر… وشك في الكل
          </p>
        </motion.div>
      </div>
    </div>
  );
}
