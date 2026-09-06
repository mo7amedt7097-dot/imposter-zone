import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Film, Trophy, Sparkles, Dices, ChevronLeft } from 'lucide-react';
import { CATEGORIES, getRandomSecretWord } from '../data/dictionary';
import { soundManager } from '../utils/sound';

const ICON_MAP = {
  Utensils: Utensils,
  Film: Film,
  Trophy: Trophy,
  Sparkles: Sparkles,
  Dices: Dices
};

export default function CategoryView({ recentWords, isHost, onSelectCategory }) {
  const categoriesList = Object.values(CATEGORIES);

  const handleCategoryClick = (catId) => {
    soundManager.playTap();
    const wordObj = getRandomSecretWord(catId, recentWords);
    onSelectCategory(catId, wordObj);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto">
      {/* Title */}
      <div className="text-center space-y-1 my-2">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-[#F4F0E8]"
        >
          هنلعب في إيه؟
        </motion.h2>
        <p className="text-xs font-semibold text-[#F4F0E8]/70">
          اختر الفئة وابدأ الجولة فوراً لجميع الأجهزة (100 كلمة لكل قسم)
        </p>
      </div>

      {/* Category Cards with Vector Icons */}
      <div className="space-y-3 my-auto py-2">
        {categoriesList.map((cat, index) => {
          const IconComponent = ICON_MAP[cat.iconName] || Sparkles;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 15 }}
              onClick={() => handleCategoryClick(cat.id)}
              className={`glass-card-interactive p-4.5 rounded-3xl cursor-pointer border ${cat.borderColor} flex items-center justify-between group relative overflow-hidden`}
            >
              {/* Background Accent Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${cat.color} opacity-40 group-hover:opacity-70 transition-opacity`} />

              <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#1B0E19] border border-white/10 flex items-center justify-center text-[#E5B91A] group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#F4F0E8]/70 mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black group-hover:bg-[#D92772] group-hover:text-white transition-colors z-10">
                <ChevronLeft className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
