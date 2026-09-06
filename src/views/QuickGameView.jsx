import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, Trash2, Zap } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function QuickGameView({ onStartQuickGame, onNavigate }) {
  const [players, setPlayers] = useState([
    { id: 'q1', name: 'أحمد' },
    { id: 'q2', name: 'محمد' },
    { id: 'q3', name: 'علي' },
    { id: 'q4', name: 'عمر' },
    { id: 'q5', name: 'يوسف' },
    { id: 'q6', name: 'كريم' }
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPlayer = () => {
    soundManager.playTap();
    if (players.length >= 10) {
      setErrorMsg('أقصى عدد للاعيبين 10 لاعبين!');
      return;
    }
    const newId = 'q_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 4);
    setPlayers([...players, { id: newId, name: `لاعب ${players.length + 1}` }]);
    setErrorMsg('');
  };

  const handleRemovePlayer = (id) => {
    soundManager.playTap();
    if (players.length <= 3) {
      setErrorMsg('الحد الأدنى 3 لاعيبين!');
      return;
    }
    setPlayers(players.filter(p => p.id !== id));
    setErrorMsg('');
  };

  const handlePlayerNameChange = (id, newName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundManager.playTap();

    const cleanedPlayers = players.map(p => ({
      ...p,
      name: p.name.trim() || 'لاعب'
    }));

    if (cleanedPlayers.length < 3) {
      setErrorMsg('لازم 3 لاعيبين على الأقل!');
      return;
    }

    const quickGroup = {
      code: 'QUICK',
      name: 'لعب سريع',
      hostUserId: cleanedPlayers[0].id,
      players: cleanedPlayers,
      isQuick: true
    };

    onStartQuickGame(quickGroup);
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
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>لعب سريع</span>
        </span>
      </div>

      <div className="space-y-4 my-auto">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
            <Zap className="w-7 h-7 text-[#E5B91A] fill-current" />
            <span>لعب سريع</span>
          </h2>
          <p className="text-xs font-medium text-[#F4F0E8]/70">
            أدخل أسماء اللاعيبين وابدأ اللعبة فوراً (بدون حفظ الجروب)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-panel p-4 rounded-3xl border border-[#D92772]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#F4F0E8]">
                اللاعيبين ({players.length}/10)
              </span>
              <button
                type="button"
                onClick={handleAddPlayer}
                className="px-3 py-1.5 rounded-xl bg-[#D92772]/20 border border-[#D92772]/50 text-[#D92772] font-black text-xs flex items-center gap-1 hover:bg-[#D92772]/30 active:scale-95 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                زود حد
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {players.map((player, idx) => (
                <div key={player.id} className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#2A102E] text-xs font-black flex items-center justify-center text-[#E5B91A] border border-[#D92772]/20">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                    placeholder={`اسم لاعب ${idx + 1}`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1B0E19] border border-white/10 text-sm font-bold text-[#F4F0E8] focus:outline-none focus:border-[#D92772]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player.id)}
                    disabled={players.length <= 3}
                    className="w-10 h-10 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 flex items-center justify-center text-red-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-red-400 text-center bg-red-950/50 p-2 rounded-xl border border-red-500/30">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] via-[#4A1E55] to-[#D92772] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all glow-pink"
          >
            <Zap className="w-5 h-5 text-[#E5B91A] fill-current" />
            <span>ابدأ اللعبة السريعة</span>
          </button>
        </form>
      </div>
    </div>
  );
}
