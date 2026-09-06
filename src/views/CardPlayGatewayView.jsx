import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, ArrowRight, PlusCircle, LogIn, Zap, Layers, Globe } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function CardPlayGatewayView({ onNavigate }) {
  const [selectedType, setSelectedType] = useState(null); // null | 'CARDS' | 'DIGITAL'

  const handleSelectType = (type) => {
    soundManager.playTap();
    setSelectedType(type);
    if (type === 'DIGITAL') {
      onNavigate('HOME');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto">
      {/* Header back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            soundManager.playTap();
            onNavigate('HOME');
          }}
          className="p-2.5 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1 text-xs font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          الرئيسية
        </button>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] flex items-center gap-1">
          <QrCode className="w-3.5 h-3.5" />
          <span>بوابة الكروت</span>
        </span>
      </div>

      {!selectedType ? (
        <div className="my-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-[#F4F0E8]">
              هتلعبوا إزاي؟
            </h2>
            <p className="text-xs font-bold text-[#F4F0E8]/70">
              اختار طريق اللعب المناسب لشلتكم دلوقتي
            </p>
          </div>

          <div className="space-y-4">
            {/* Cards mode */}
            <motion.div
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectType('CARDS')}
              className="glass-card-interactive p-6 rounded-3xl border border-[#E5B91A]/40 text-right cursor-pointer group hover:border-[#E5B91A]"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
                  <Layers className="w-6 h-6 text-[#E5B91A]" />
                  <span>مع الكروت</span>
                </h3>
                <span className="text-xs font-black text-[#E5B91A] bg-[#E5B91A]/10 px-2.5 py-1 rounded-full border border-[#E5B91A]/30">
                  كروت فيزيائية
                </span>
              </div>
              <p className="text-xs font-semibold text-[#F4F0E8]/70">
                معاكم علبة وكروت IMPOSTER وبياخدوا الموبايل للمساعد الرقمي والتصويت
              </p>
            </motion.div>

            {/* Digital Mode */}
            <motion.div
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectType('DIGITAL')}
              className="glass-card-interactive p-6 rounded-3xl border border-[#D92772]/40 text-right cursor-pointer group hover:border-[#D92772]"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-black text-[#F4F0E8] group-hover:text-[#D92772] transition-colors flex items-center gap-2">
                  <Globe className="w-6 h-6 text-[#D92772]" />
                  <span>بدون كروت</span>
                </h3>
                <span className="text-xs font-black text-[#D92772] bg-[#D92772]/10 px-2.5 py-1 rounded-full border border-[#D92772]/30">
                  ديجيتال 100%
                </span>
              </div>
              <p className="text-xs font-semibold text-[#F4F0E8]/70">
                المرجع الكامل، الكلمات السرية، الأدوار والتصويت كله داخل الأبلكيشن
              </p>
            </motion.div>
          </div>
        </div>
      ) : (
        /* Group prompt for card play */
        <div className="my-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-[#F4F0E8]">
              عندكم جروب؟
            </h2>
            <p className="text-xs font-bold text-[#F4F0E8]/70">
              تقدر تلعب فوراً أو تنشئ جروب للشلة
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                soundManager.playTap();
                onNavigate('QUICK_GAME');
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] via-[#4A1E55] to-[#D92772] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all glow-pink"
            >
              <Zap className="w-5 h-5 text-[#E5B91A] fill-current" />
              <span>لعب سريع بدون حفظ</span>
            </button>

            <button
              onClick={() => {
                soundManager.playTap();
                onNavigate('CREATE_GROUP');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#2A102E] hover:bg-[#4A1E55] border border-[#D92772]/40 font-black text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-[#E5B91A]" />
              <span>إنشاء جروب جديد</span>
            </button>

            <button
              onClick={() => {
                soundManager.playTap();
                onNavigate('JOIN_GROUP');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4 text-[#D92772]" />
              <span>انضم لجروب موجود</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
