import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, Copy, Check, Users, Sparkles } from 'lucide-react';
import { generateRoomCode } from '../utils/roomCode';
import { soundManager } from '../utils/sound';

export default function CreateGroupView({ currentUser, onCreateGroup, onNavigate }) {
  const [groupName, setGroupName] = useState('الشلة');
  const [playerName, setPlayerName] = useState(currentUser?.name || 'محمد');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    soundManager.playTap();

    const cleanedGroupName = groupName.trim() || 'الشلة';
    const cleanedPlayerName = playerName.trim() || 'محمد';

    if (!cleanedPlayerName) {
      setErrorMsg('من فضلك ادخل اسمك!');
      return;
    }

    const userId = currentUser?.id || ('user_' + Date.now().toString(36));
    const roomCode = generateRoomCode();
    const newGroup = {
      code: roomCode,
      name: cleanedGroupName,
      hostUserId: userId,
      createdAt: Date.now(),
      players: [
        { id: userId, name: cleanedPlayerName }
      ],
      scores: {
        [userId]: 0
      }
    };

    onCreateGroup(newGroup, cleanedPlayerName);
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
          <Crown className="w-3.5 h-3.5" />
          انت الـ Host
        </span>
      </div>

      <div className="space-y-4 my-auto">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-[#D92772]" />
            إنشاء جروب جديد
          </h2>
          <p className="text-xs font-medium text-[#F4F0E8]/70">
            أدخل اسم الجروب واسمك عشان تبقى الأدمن بتاع الشلة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-[#D92772]/30 space-y-4">
            {/* Group Name input */}
            <div>
              <label className="block text-xs font-extrabold text-[#E5B91A] mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                اسم الجروب
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="مثلاً: الشلة"
                className="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-white/10 text-[#F4F0E8] font-black text-lg focus:outline-none focus:border-[#D92772]"
                required
              />
            </div>

            {/* Player Name input */}
            <div>
              <label className="block text-xs font-extrabold text-[#F4F0E8]/80 mb-1.5 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#E5B91A]" />
                اسمك (الـ Host)
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="مثلاً: محمد"
                className="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-white/10 text-[#F4F0E8] font-bold text-base focus:outline-none focus:border-[#D92772]"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-red-400 text-center bg-red-950/50 p-2 rounded-xl border border-red-500/30">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all glow-pink"
          >
            <Sparkles className="w-5 h-5 text-[#E5B91A]" />
            إنشاء الجروب ودخول اللوبي
          </button>
        </form>
      </div>
    </div>
  );
}
