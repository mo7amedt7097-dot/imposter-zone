import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, ArrowRight, Save, Users } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function GroupSetupView({ onSaveGroup, onBack }) {
  const [groupName, setGroupName] = useState('WANTED');
  const [players, setPlayers] = useState([
    { id: '1', name: 'أحمد' },
    { id: '2', name: 'محمد' },
    { id: '3', name: 'علي' },
    { id: '4', name: 'عمر' },
    { id: '5', name: 'يوسف' },
    { id: '6', name: 'كريم' }
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPlayer = () => {
    soundManager.playTap();
    if (players.length >= 12) {
      setErrorMsg('12 لعيب كتير أوي على موبايل واحد! خليهم أقل شويتين.');
      return;
    }
    const newId = Date.now().toString();
    setPlayers([...players, { id: newId, name: `لاعب ${players.length + 1}` }]);
    setErrorMsg('');
  };

  const handleRemovePlayer = (id) => {
    soundManager.playTap();
    if (players.length <= 3) {
      setErrorMsg('الحد الأدنى 3 لاعيبين يا نجم عشان نعرف نلعب!');
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

    const cleanedGroupName = groupName.trim() || 'WANTED';
    const cleanedPlayers = players.map(p => ({
      ...p,
      name: p.name.trim() || 'لاعب'
    }));

    if (cleanedPlayers.length < 3) {
      setErrorMsg('لازم 3 لاعيبين على الأقل!');
      return;
    }

    onSaveGroup({
      name: cleanedGroupName,
      players: cleanedPlayers
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto">
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
          رجوع
        </button>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772]">
          الخطوة 1 من 2
        </span>
      </div>

      <div className="space-y-4 my-auto">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-[#F4F0E8] drop-shadow-md">
            اعمل شلتك
          </h2>
          <p className="text-xs font-medium text-[#F4F0E8]/70">
            اكتب اسم الشلة وأسماء اللاعيبين اللي معاك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group name input */}
          <div className="glass-panel p-4 rounded-3xl border border-[#D92772]/30 space-y-2">
            <label className="block text-xs font-extrabold text-[#E5B91A] flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              اسم الشلة
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="اسم الشلة (مثلاً: WANTED)"
              className="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-white/10 text-[#F4F0E8] font-black text-lg focus:outline-none focus:border-[#D92772]"
              required
            />
          </div>

          {/* Players List */}
          <div className="glass-panel p-4 rounded-3xl border border-[#D92772]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#F4F0E8]">
                اللاعيبين ({players.length})
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

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
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
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Save className="w-5 h-5 text-[#E5B91A]" />
            حفظ الشلة
          </button>
        </form>
      </div>
    </div>
  );
}
