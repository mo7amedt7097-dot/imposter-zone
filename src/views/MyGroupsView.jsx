import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Play, Edit3, PlusCircle, LogIn, ArrowRight, Crown, Copy, Check, Trash2, Armchair, Shield, Trophy } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function MyGroupsView({
  groups,
  currentUserId,
  scores = {},
  onSelectGroup,
  onEditGroup,
  onDeleteGroup,
  onNavigate
}) {
  const [copiedCodeMap, setCopiedCodeMap] = useState({});
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState(null);

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    soundManager.playTap();
    if (code && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCodeMap((prev) => ({ ...prev, [code]: true }));
      setTimeout(() => {
        setCopiedCodeMap((prev) => ({ ...prev, [code]: false }));
      }, 2000);
    }
  };

  const handleDelete = (group, e) => {
    e.stopPropagation();
    soundManager.playTap();
    setDeleteConfirmGroup(group);
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
          className="p-2.5 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowRight className="w-4 h-4 text-[#E5B91A]" />
          الرئيسية
        </button>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          جروباتي
        </span>
      </div>

      <div className="space-y-4 my-auto">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
            <Users className="w-7 h-7 text-[#D92772]" />
            جروباتي المفضلة
          </h2>
          <p className="text-xs font-medium text-[#F4F0E8]/70">
            اختر الشلة اللي عاوز تلعب معاها أو امسح الجروبات القديمة
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#4A1E55] flex items-center justify-center mx-auto text-[#E5B91A]">
              <Armchair className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-[#F4F0E8]/70">
              لسه ما انضميتش لأي جروب.. اعمل جروب جديد أو انضم بكود الشلة!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {groups.map((group) => {
              const isHost = group.hostUserId === currentUserId;
              const isCopied = copiedCodeMap[group.code];
              return (
                <motion.div
                  key={group.code}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 rounded-3xl border border-[#D92772]/30 space-y-3 text-right relative group"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div>
                      <h3 className="text-xl font-black text-[#F4F0E8] flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#D92772]" /> {group.name}
                        {isHost && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] font-extrabold flex items-center gap-1">
                            <Crown className="w-3 h-3 text-[#E5B91A]" /> HOST
                          </span>
                        )}
                      </h3>

                      {/* Group Code Display & Copy */}
                      <button
                        onClick={(e) => handleCopyCode(group.code, e)}
                        className="mt-1 px-2.5 py-1 rounded-xl bg-[#1B0E19] border border-[#D92772]/40 text-[#E5B91A] text-xs font-mono font-black flex items-center gap-1.5 hover:border-[#E5B91A] transition-colors"
                      >
                        <span>GROUP ID: {group.code}</span>
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#D92772]" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 rounded-xl bg-[#4A1E55] text-xs font-black text-[#E5B91A]">
                        {group.players.length} لاعبين
                      </span>

                      {/* Delete Group Button */}
                      <button
                        onClick={(e) => handleDelete(group, e)}
                        className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/30 text-red-400 text-xs flex items-center gap-1 transition-all"
                        title="مسح الجروب"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>مسح</span>
                      </button>
                    </div>
                  </div>

                  {/* Player Names & Scores Preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {group.players.map((p) => {
                      const pScore = (group?.scores && group.scores[p.id]) || scores[p.id] || 0;
                      return (
                        <span
                          key={p.id}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1 ${
                            p.id === group.hostUserId
                              ? 'bg-[#E5B91A]/10 border-[#E5B91A]/30 text-[#E5B91A]'
                              : 'bg-[#1B0E19] border-white/5 text-[#F4F0E8]/80'
                          }`}
                        >
                          {p.name} {p.id === group.hostUserId ? <Crown className="w-3 h-3 text-[#E5B91A]" /> : ''}
                          <span className="text-[#E5B91A] font-black text-[11px] flex items-center gap-0.5">
                            (<Trophy className="w-3 h-3 text-[#E5B91A]" /> {pScore})
                          </span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        soundManager.playTap();
                        onSelectGroup(group);
                      }}
                      className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-sm text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-[#D92772]/20"
                    >
                      <Play className="w-4 h-4 fill-current text-[#E5B91A]" />
                      العب
                    </button>

                    {isHost ? (
                      <button
                        onClick={() => {
                          soundManager.playTap();
                          onEditGroup(group);
                        }}
                        className="py-3 px-4 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-sm text-[#F4F0E8] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Edit3 className="w-4 h-4 text-[#E5B91A]" />
                        تعديل
                      </button>
                    ) : (
                      <div className="py-3 px-4 rounded-2xl bg-[#1B0E19]/40 border border-white/5 font-bold text-xs text-[#F4F0E8]/40 flex items-center justify-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        عضو بالجروب
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 space-y-2 mt-auto">
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

        <button
          onClick={() => {
            soundManager.playTap();
            onNavigate('JOIN_GROUP');
          }}
          className="w-full py-3.5 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <LogIn className="w-4 h-4 text-[#D92772]" />
          دخول لجروب بكود
        </button>
      </div>

      {/* Custom Game Deletion Confirmation Modal */}
      {deleteConfirmGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 rounded-3xl border border-red-500/40 shadow-2xl max-w-sm w-full text-center space-y-4 bg-gradient-to-b from-[#2A102E] to-[#120A12]"
          >
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#F4F0E8]">
                حذف جروب "{deleteConfirmGroup.name}"؟
              </h3>
              <p className="text-xs font-bold text-[#F4F0E8]/70 leading-relaxed">
                مسح الجروب هيطلعك منه وهيتحذف من قائمتك!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmGroup(null)}
                className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F4F0E8] font-extrabold text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  soundManager.playTap();
                  onDeleteGroup(deleteConfirmGroup.code);
                  setDeleteConfirmGroup(null);
                }}
                className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
                <span>تأكيد الحذف</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

