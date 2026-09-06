import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, ShieldAlert, Sparkles, Lock, Users, Clock, HelpCircle, ArrowRight, Smartphone } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function RoleRevealView({
  players = [],
  secretWord,
  imposterIds = [],
  gameMode = 'ONE_PHONE',
  currentUserId,
  rolesRevealed = {},
  onRoleRevealed,
  onComplete
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasConfirmedRead, setHasConfirmedRead] = useState(false);
  const [allFinished, setAllFinished] = useState(false);

  const isMultiPhone = gameMode === 'MULTI_PHONE';
  const myPlayer = players.find(p => p.id === currentUserId) || players[0];
  const isMyImposter = imposterIds.includes(myPlayer?.id);

  const currentPlayer = players[currentIndex] || players[0];
  const isImposter = imposterIds.includes(currentPlayer?.id);

  const revealedCount = Object.keys(rolesRevealed).length;
  const totalCount = players.length;
  const hasMyRoleBeenRevealed = isMultiPhone && (hasConfirmedRead || Boolean(rolesRevealed[myPlayer?.id]));

  const handleRevealRole = () => {
    soundManager.playTap();
    const imposterCheck = isMultiPhone ? isMyImposter : isImposter;
    if (imposterCheck) {
      soundManager.playImposterAlert();
    } else {
      soundManager.playRoleReveal();
    }
    setIsRevealed(true);
  };

  const handleConfirmMultiRole = () => {
    soundManager.playTap();
    setHasConfirmedRead(true);
    if (onRoleRevealed && myPlayer) {
      onRoleRevealed(myPlayer.id);
    }
  };

  const handleHideAndPass = () => {
    soundManager.playTap();
    setIsRevealed(false);
    if (currentIndex < players.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setAllFinished(true);
    }
  };

  const handleStartClues = () => {
    soundManager.playTap();
    if (onComplete) onComplete();
  };

  // MULTI_PHONE MODE: Individual phone role reveal + gated waiting screen
  if (isMultiPhone) {
    return (
      <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto">
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <span className="text-xs font-bold text-[#E5B91A] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#E5B91A]" /> دورك السرّي على موبايلك
          </span>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772]">
            {myPlayer?.name || 'أنت'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!isRevealed && !hasMyRoleBeenRevealed ? (
            <motion.div
              key="multi-prep"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/30 shadow-2xl"
            >
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#E5B91A] uppercase tracking-wider flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" /> أهلاً {myPlayer?.name}
                </span>
                <h2 className="text-3xl font-black text-[#F4F0E8]">
                  جاهز تكتشف دورك؟
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B0E19] border border-white/5 space-y-1">
                <p className="text-xs text-[#F4F0E8]/70">
                  تأكد إن محدش باصص في شاشة موبايلك واضغط إظهار!
                </p>
              </div>

              <button
                onClick={handleRevealRole}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Eye className="w-5 h-5 text-[#E5B91A]" />
                إظهار دوري السرّي
              </button>
            </motion.div>
          ) : isRevealed && !hasMyRoleBeenRevealed ? (
            <motion.div
              key="multi-revealed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="my-auto space-y-6"
            >
              {!isMyImposter ? (
                <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 bg-gradient-to-b from-[#1B0E19] to-[#2A102E]">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">
                      <Sparkles className="w-4 h-4" /> إنت لاعب عادي
                    </span>
                    <h3 className="text-sm font-bold text-[#F4F0E8]/70">
                      الكلمة السرية هي:
                    </h3>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#120A12] border border-emerald-500/30 shadow-inner">
                    <span className="text-4xl font-black text-[#E5B91A] text-glow-yellow block">
                      {secretWord}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#F4F0E8]/80 flex items-center justify-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#E5B91A]" /> احفظ الكلمة في سرّك ومتفضحناش
                  </p>

                  <button
                    onClick={handleConfirmMultiRole}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    فهمت دوري وجاهز للتلميحات
                  </button>
                </div>
              ) : (
                <div className="glass-panel p-8 rounded-3xl border border-[#D92772] shadow-2xl space-y-6 bg-gradient-to-b from-[#2A102E] to-[#120A12] glow-pink">
                  <div className="space-y-2">
                    <motion.h2
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-3xl font-black text-[#D92772] text-glow-pink flex items-center justify-center gap-2"
                    >
                      <ShieldAlert className="w-8 h-8 text-[#D92772]" />
                      إنت الـ IMPOSTER
                    </motion.h2>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#1B0E19] border border-[#D92772]/40 text-right space-y-2">
                    <p className="text-sm font-extrabold text-[#E5B91A]">
                      ملكش كلمة!
                    </p>
                    <p className="text-xs font-semibold text-[#F4F0E8]/80 leading-relaxed">
                      ركز في تلميحات الشلة وحاول تفهم الكلمة من كلامهم من غير ما يشكوا فيك!
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmMultiRole}
                    className="w-full py-4 rounded-2xl bg-[#D92772] hover:bg-[#b01e5b] font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    فهمت دوري وجاهز للتلميحات
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* Multi-Phone Waiting Screen until ALL players reveal roles */
            <motion.div
              key="multi-gated-waiting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="my-auto space-y-6 glass-panel p-6 rounded-3xl border border-[#E5B91A]/40 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/50 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-[#E5B91A] animate-spin" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#E5B91A] flex items-center justify-center gap-2">
                  <Lock className="w-6 h-6 text-[#E5B91A]" />
                  <span>عرفت كلمتك وبقيت جاهز</span>
                </h2>
                <p className="text-xs font-bold text-[#F4F0E8]/70">
                  في انتظار باقي الشلة يقرأوا أدوارهم على هواتفهم...
                </p>
              </div>

              <div className="bg-[#1B0E19]/80 rounded-2xl p-3 border border-white/10 space-y-2 text-right">
                <div className="flex items-center justify-between text-xs text-[#F4F0E8]/60 font-bold border-b border-white/10 pb-1.5">
                  <span>حالة استكشاف الكلمات</span>
                  <span>({revealedCount} من {totalCount} استكشفوا)</span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  {players.map((p) => {
                    const isDone = Boolean(rolesRevealed[p.id]);
                    return (
                      <div
                        key={p.id}
                        className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                          isDone
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-white/50'
                        }`}
                      >
                        <span className="font-bold truncate max-w-[90px]">{p.name}</span>
                        {isDone ? (
                          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400">
                            جاهز <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-white/40">
                            يقرأ... <Clock className="w-3 h-3 animate-spin" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ONE_PHONE MODE: Pass the phone flow
  if (allFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-md mx-auto w-full text-center text-[#F4F0E8] space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl space-y-4 w-full"
        >
          <div className="w-16 h-16 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/50 flex items-center justify-center mx-auto text-3xl">
            <Users className="w-8 h-8 text-[#E5B91A]" />
          </div>

          <h2 className="text-3xl font-black text-[#F4F0E8]">
            الكل عرف دوره!
          </h2>
          <p className="text-xs font-semibold text-[#F4F0E8]/70 leading-relaxed">
            الموبايل يرجع في نص الترابيزة دلوقتي.. كل واحد هيقول تلميح ذكي عن الكلمة!
          </p>

          <button
            onClick={handleStartClues}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#E5B91A] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>بدء التلميحات والمناقشة</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto">
      <div className="flex items-center justify-between py-2 border-b border-white/10">
        <span className="text-xs font-bold text-[#E5B91A] flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> كشف الدور السرّي
        </span>
        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772]">
          اللاعب {currentIndex + 1} من {players.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="one-prep"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/30 shadow-2xl"
          >
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[#E5B91A] uppercase tracking-wider flex items-center justify-center gap-1">
                <Smartphone className="w-4 h-4" /> سلّم الموبايل لـ:
              </span>
              <h2 className="text-4xl font-black text-[#F4F0E8]">
                {currentPlayer?.name}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-[#1B0E19] border border-white/5 space-y-1">
              <p className="text-xs text-[#F4F0E8]/70">
                تأكد إن باقي الشلة مش باصين في الموبايل!
              </p>
            </div>

            <button
              onClick={handleRevealRole}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Eye className="w-5 h-5 text-[#E5B91A]" />
              <span>أنا {currentPlayer?.name} - إظهار دوري</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="one-revealed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="my-auto space-y-6"
          >
            {!isImposter ? (
              <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 bg-gradient-to-b from-[#1B0E19] to-[#2A102E]">
                <div className="space-y-1">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Sparkles className="w-4 h-4" /> إنت لاعب عادي
                  </span>
                  <h3 className="text-sm font-bold text-[#F4F0E8]/70">
                    الكلمة السرية هي:
                  </h3>
                </div>

                <div className="p-6 rounded-2xl bg-[#120A12] border border-emerald-500/30 shadow-inner">
                  <span className="text-4xl font-black text-[#E5B91A] text-glow-yellow block">
                    {secretWord}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#F4F0E8]/80 flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#E5B91A]" /> احفظ الكلمة في سرّك ومتفضحناش
                </p>

                <button
                  onClick={handleHideAndPass}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <EyeOff className="w-5 h-5" />
                  <span>إخفاء الدور والتمرير للي بعدي</span>
                </button>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-3xl border border-[#D92772] shadow-2xl space-y-6 bg-gradient-to-b from-[#2A102E] to-[#120A12] glow-pink">
                <div className="space-y-2">
                  <motion.h2
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-3xl font-black text-[#D92772] text-glow-pink flex items-center justify-center gap-2"
                  >
                    <ShieldAlert className="w-8 h-8 text-[#D92772]" />
                    إنت الـ IMPOSTER
                  </motion.h2>
                </div>

                <div className="p-5 rounded-2xl bg-[#1B0E19] border border-[#D92772]/40 text-right space-y-2">
                  <p className="text-sm font-extrabold text-[#E5B91A]">
                    ملكش كلمة!
                  </p>
                  <p className="text-xs font-semibold text-[#F4F0E8]/80 leading-relaxed">
                    ركز في تلميحات الشلة وحاول تفهم الكلمة من كلامهم من غير ما يشكوا فيك!
                  </p>
                </div>

                <button
                  onClick={handleHideAndPass}
                  className="w-full py-4 rounded-2xl bg-[#D92772] hover:bg-[#b01e5b] font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <EyeOff className="w-5 h-5" />
                  <span>إخفاء الدور والتمرير للي بعدي</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
