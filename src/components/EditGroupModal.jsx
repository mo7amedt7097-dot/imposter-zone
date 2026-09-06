import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Check, UserPlus, Users } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function EditGroupModal({ isOpen, onClose, group, onSaveGroup }) {
  const [groupName, setGroupName] = useState('');
  const [players, setPlayers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (group) {
      setGroupName(group.name || 'WANTED');
      setPlayers(group.players || []);
    }
  }, [group, isOpen]);

  if (!isOpen) return null;

  const handleAddPlayer = () => {
    soundManager.playTap();
    if (players.length >= 12) {
      setErrorMsg('أخّرنا 12 لعيب عشان متبقاش زحمة أوي!');
      return;
    }
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setPlayers([...players, { id: newId, name: `لاعب ${players.length + 1}` }]);
    setErrorMsg('');
  };

  const handleRemovePlayer = (id) => {
    soundManager.playTap();
    if (players.length <= 3) {
      setErrorMsg('الحد الأدنى 3 لاعيبين يا نجم!');
      return;
    }
    setPlayers(players.filter(p => p.id !== id));
    setErrorMsg('');
  };

  const handlePlayerNameChange = (id, newName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleSave = () => {
    soundManager.playTap();
    const trimmedGroupName = groupName.trim() || 'WANTED';
    const cleanedPlayers = players.map(p => ({
      ...p,
      name: p.name.trim() || 'لاعب مجهول'
    }));

    if (cleanedPlayers.length < 3) {
      setErrorMsg('لازم على الأقل 3 لاعيبين!');
      return;
    }

    const updatedScores = { ...(group?.scores || {}) };
    cleanedPlayers.forEach((p) => {
      if (updatedScores[p.id] === undefined) {
        updatedScores[p.id] = 0;
      }
    });

    onSaveGroup({
      ...group,
      name: trimmedGroupName,
      players: cleanedPlayers,
      scores: updatedScores
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md glass-panel rounded-3xl p-6 relative border border-[#D92772]/40 shadow-2xl text-[#F4F0E8] max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#D92772]/20 mb-4 shrink-0">
            <h2 className="text-xl font-black flex items-center gap-2 text-[#E5B91A]">
              <Users className="w-5 h-5 text-[#D92772]" />
              تعديل أسماء الشلة
            </h2>
            <button
              onClick={() => {
                soundManager.playTap();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-[#2A102E] flex items-center justify-center text-[#F4F0E8]/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Scrollable */}
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Group Name input */}
            <div>
              <label className="block text-xs font-bold text-[#F4F0E8]/70 mb-1.5">اسم الشلة</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="أدخل اسم الشلة (مثلاً: WANTED)"
                className="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-[#D92772]/30 text-[#F4F0E8] font-extrabold focus:outline-none focus:border-[#D92772] transition-colors"
              />
            </div>

            {/* Players list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#F4F0E8]/70">
                  اللاعيبين ({players.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddPlayer}
                  className="px-3 py-1.5 rounded-xl bg-[#D92772]/20 border border-[#D92772]/50 text-[#D92772] font-black text-xs flex items-center gap-1.5 active:scale-95 transition-all hover:bg-[#D92772]/30"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  زود حد
                </button>
              </div>

              <div className="space-y-2">
                {players.map((player, idx) => (
                  <div key={player.id} className="flex items-center gap-2 p-2 rounded-2xl bg-[#1B0E19] border border-white/5">
                    <span className="w-6 h-6 rounded-lg bg-[#2A102E] text-xs font-black flex items-center justify-center text-[#E5B91A]">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                      placeholder="غيّر الاسم"
                      className="flex-1 px-3 py-2 rounded-xl bg-[#120A12] border border-white/10 text-sm font-bold text-[#F4F0E8] focus:outline-none focus:border-[#D92772]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(player.id)}
                      disabled={players.length <= 3}
                      className="w-9 h-9 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/20 flex items-center justify-center text-red-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all"
                      title="شيل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/40 text-red-300 font-bold text-xs text-center">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#D92772]/20 mt-3 shrink-0">
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-base text-white shadow-lg shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-5 h-5 text-[#E5B91A]" />
              تمام كده
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
