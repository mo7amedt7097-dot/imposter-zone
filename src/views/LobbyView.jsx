import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Copy, Check, Users, Play, Edit3, ArrowRight, Key, Share2, Link as LinkIcon, UserPlus, User, AlertCircle, Sparkles, LogOut } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function LobbyView({
  group,
  gameMode = 'ONE_PHONE',
  currentUserId,
  scores = {},
  hostTransferMessage,
  onStartGame,
  onOpenEditGroup,
  onUpdateOwnName,
  onLeaveGroup,
  onNavigate
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingOwnName, setIsEditingOwnName] = useState(false);
  const [ownNameInput, setOwnNameInput] = useState('');

  if (!group) return null;

  const isHost = group.hostUserId === currentUserId;
  const players = group.players || [];
  const isFull = players.length >= 10;
  const myPlayerObj = players.find(p => p.id === currentUserId);
  const isOnePhone = gameMode === 'ONE_PHONE';

  const handleCopyCode = () => {
    soundManager.playTap();
    if (group.code && navigator.clipboard) {
      navigator.clipboard.writeText(group.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleCopyDirectLink = async () => {
    soundManager.playTap();
    const shareableUrl = `${window.location.origin}${window.location.pathname}?code=${group.code}`;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareableUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch (err) {}
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `انضم لجروب ${group.name} - IMPOSTER`,
          text: `تعالى العب معانا في لعبة إمبوستر\nكود الجروب: ${group.code}`,
          url: shareableUrl
        });
      } catch (err) {}
    }
  };

  const handleStartEditOwnName = () => {
    soundManager.playTap();
    setOwnNameInput(myPlayerObj?.name || '');
    setIsEditingOwnName(true);
  };

  const handleSaveOwnName = () => {
    soundManager.playTap();
    if (ownNameInput.trim()) {
      onUpdateOwnName(ownNameInput.trim());
      setIsEditingOwnName(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => {
            soundManager.playTap();
            onNavigate('MY_GROUPS');
          }}
          className="p-2 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1 text-xs font-bold"
        >
          <ArrowRight className="w-4 h-4 text-[#E5B91A]" />
          جروباتي
        </button>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] flex items-center gap-1">
          <Users className="w-3 h-3" />
          {isOnePhone ? 'هاتف واحد' : 'لوبي الشلة'}
        </span>

        <button
          onClick={() => {
            soundManager.playTap();
            if (onLeaveGroup) onLeaveGroup(group.code);
          }}
          className="px-2.5 py-1 rounded-2xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-[11px] font-extrabold flex items-center gap-1 transition-all active:scale-95 shadow-md"
        >
          <LogOut className="w-3.5 h-3.5" />
          خروج
        </button>
      </div>

      {/* Mode Guidance Banner */}
      {isOnePhone ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#D92772]/20 via-[#4A1E55]/30 to-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#F4F0E8] text-xs font-bold text-center flex items-center justify-between gap-2 shadow-lg mb-2"
        >
          <div className="text-right space-y-0.5">
            <span className="font-black text-[#E5B91A] flex items-center gap-1.5">
              نلعب الآن على هاتف واحد (جهاز {players.find(p => p.id === group.hostUserId)?.name || 'الـ Host'})
            </span>
            <p className="text-[11px] text-[#F4F0E8]/80">الموبايل بيتمسّك وبيتمرّر بين الشلة دلوقتي على نفس الجهاز!</p>
          </div>
          {isHost && (
            <button
              onClick={() => {
                soundManager.playTap();
                onOpenEditGroup();
              }}
              className="px-3 py-2 rounded-xl bg-[#D92772] hover:bg-[#b01e5b] text-white text-xs font-black shrink-0 flex items-center gap-1 active:scale-95 transition-all shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5" />
              أضف/عدّل الأسماء
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-2xl bg-gradient-to-r from-[#D92772]/20 via-[#E5B91A]/20 to-emerald-500/20 border border-[#E5B91A]/40 text-[#F4F0E8] text-xs font-black text-center flex items-center justify-between gap-2 shadow-lg mb-2"
        >
          <span className="flex items-center gap-1.5 text-right">
            <Sparkles className="w-4 h-4 text-[#E5B91A] shrink-0" />
            <span>شارك كود الجروب <strong className="text-[#E5B91A]">{group.code}</strong> مع أصحابك للدخول من هواتفهم.</span>
          </span>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1 rounded-xl bg-[#D92772] hover:bg-[#b01e5b] text-white text-[11px] font-bold shrink-0 transition-all active:scale-95 shadow-md"
          >
            {copiedCode ? 'تم النسخ!' : 'نسخ الكود'}
          </button>
        </motion.div>
      )}

      {/* Host Transfer Notification if any */}
      {hostTransferMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2.5 rounded-2xl bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] font-extrabold text-xs text-center flex items-center justify-center gap-2 mb-2"
        >
          <Crown className="w-4 h-4 text-[#E5B91A]" />
          {hostTransferMessage}
        </motion.div>
      )}

      {/* Group Name Header */}
      <div className="text-center space-y-1 my-2">
        <h2 className="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
          <Users className="w-7 h-7 text-[#D92772]" />
          {group.name}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-[#F4F0E8]/70 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#E5B91A]" />
            {players.length} / 10 لاعبين
          </span>
          {isFull && (
            <span className="px-2 py-0.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] font-black flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              الجروب كامل
            </span>
          )}
        </div>
      </div>

      {/* Prominent GROUP ID & Share Card */}
      {!isOnePhone && (
        <div className="my-2 p-4 rounded-3xl glass-panel border border-[#D92772]/50 text-center space-y-3 glow-pink">
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#E5B91A]">
            <Key className="w-4 h-4" />
            <span>كود الجروب (GROUP ID)</span>
          </div>

          <div className="text-4xl font-black font-mono tracking-widest text-[#F4F0E8] text-glow-yellow py-0.5">
            {group.code}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyCode}
              className={`py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md ${
                copiedCode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#D92772] hover:bg-[#b01e5b] text-white shadow-[#D92772]/30'
              }`}
            >
              {copiedCode ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              {copiedCode ? 'تم النسخ!' : 'نسخ الكود'}
            </button>

            <button
              onClick={handleCopyDirectLink}
              className={`py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#4A1E55] hover:bg-[#5c256b] text-[#E5B91A] border border-[#E5B91A]/30'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4 text-white" /> : <LinkIcon className="w-4 h-4" />}
              {copiedLink ? 'تم نسخ الرابط!' : 'مشاركة الرابط'}
            </button>
          </div>
        </div>
      )}

      {/* Players List Card with Scores */}
      <div className="my-auto space-y-3">
        <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-[#F4F0E8]/70 border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#E5B91A]" />
              اللاعيبة في الجروب ({players.length})
            </span>
            <button
              onClick={() => {
                soundManager.playTap();
                onOpenEditGroup();
              }}
              className="text-[#E5B91A] text-[11px] font-bold hover:underline flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              تعديل / إضافة أعضاء
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {players.map((p, index) => {
              const isPlayerHost = p.id === group.hostUserId;
              const isMe = p.id === currentUserId;
              const playerScore = (group?.scores && group.scores[p.id]) || scores[p.id] || 0;

              return (
                <div
                  key={p.id || index}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isPlayerHost
                      ? 'bg-gradient-to-r from-[#D92772]/25 via-[#4A1E55]/40 to-[#E5B91A]/20 border-[#E5B91A]/60 text-[#E5B91A]'
                      : isMe
                      ? 'bg-[#4A1E55]/30 border-[#D92772]/50 text-[#F4F0E8]'
                      : 'bg-[#1B0E19] border-white/10 text-[#F4F0E8]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="font-extrabold text-sm flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {isMe && <span className="px-1.5 py-0.5 rounded-md bg-[#D92772] text-white text-[10px] font-black">أنت</span>}
                    </span>
                    {isPlayerHost && (
                      <span className="px-2 py-0.5 rounded-md bg-[#E5B91A]/20 text-[#E5B91A] text-[10px] font-black flex items-center gap-0.5 border border-[#E5B91A]/50 shadow-sm">
                        <Crown className="w-3 h-3 text-[#E5B91A]" /> HOST
                      </span>
                    )}
                    {!isPlayerHost && !isMe && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#F4F0E8]/70 text-[10px] font-bold border border-white/10">
                        لاعب
                      </span>
                    )}
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-[#E5B91A]/15 border border-[#E5B91A]/30 text-[#E5B91A] text-xs font-black flex items-center gap-1 shadow-sm shrink-0">
                    <Trophy className="w-3.5 h-3.5 text-[#E5B91A]" />
                    <span>{playerScore} {playerScore === 1 ? 'نقطة' : 'نقاط'}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Own Name Section */}
        <div>
          {!isEditingOwnName ? (
            <button
              onClick={handleStartEditOwnName}
              className="w-full py-2.5 rounded-2xl bg-[#1B0E19] border border-white/10 text-xs font-bold text-[#E5B91A] flex items-center justify-center gap-1.5 hover:bg-[#2A102E] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              تعديل اسمي في الجروب
            </button>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#1B0E19] border border-[#D92772]/40">
              <input
                type="text"
                value={ownNameInput}
                onChange={(e) => setOwnNameInput(e.target.value)}
                placeholder="اسمك الجديد"
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#120A12] border border-white/10 text-xs font-bold text-[#F4F0E8] focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveOwnName}
                className="px-3 py-1.5 rounded-xl bg-[#D92772] text-xs font-black text-white hover:bg-[#b01e5b]"
              >
                حفظ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Room Controls (Available for All Players) */}
      <div className="pt-3 space-y-2 mt-auto">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              soundManager.playTap();
              onOpenEditGroup();
            }}
            className="py-3 px-4 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-black text-sm text-[#F4F0E8] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Edit3 className="w-4 h-4 text-[#E5B91A]" />
            تعديل وتزويد أعضاء
          </button>

          <button
            onClick={handleCopyDirectLink}
            className="py-3 px-4 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-black text-sm text-[#E5B91A] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4 text-[#D92772]" />
            مشاركة الرابط
          </button>
        </div>

        {!isOnePhone && !isHost ? (
          <div className="py-4 rounded-2xl bg-[#1B0E19] border border-[#E5B91A]/30 text-xs font-extrabold text-[#E5B91A] text-center animate-pulse flex items-center justify-center gap-2">
            <Crown className="w-4 h-4 text-[#E5B91A] shrink-0" />
            <span>في انتظار الـ Host لبدء اللعبة واختيار الفئة...</span>
          </div>
        ) : (
          <button
            onClick={() => {
              soundManager.playTap();
              onStartGame();
            }}
            disabled={players.length < 3}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] via-[#4A1E55] to-[#D92772] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed glow-pink"
          >
            <Play className="w-6 h-6 fill-current text-[#E5B91A]" />
            <span>بدء اللعبة الآن للجميع</span>
          </button>
        )}
      </div>
    </div>
  );
}


