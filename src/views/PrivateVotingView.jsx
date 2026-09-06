import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, CheckCircle2, Clock, Lock, Smartphone, Vote } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function PrivateVotingView({
  players = [],
  gameMode = 'ONE_PHONE',
  currentUserId,
  isHost,
  votes = {},
  onCastVote,
  onVotingComplete
}) {
  const isMultiPhone = gameMode === 'MULTI_PHONE';

  // --- MULTI_PHONE MODE STATE & LOGIC ---
  const myPlayer = players.find((p) => p.id === currentUserId) || players[0];
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);

  const hasMyVoteBeenCast = isMultiPhone && myPlayer && Boolean(votes[myPlayer.id]);
  const votedCount = Object.keys(votes).length;
  const totalPlayersCount = players.length;

  // Auto-transition to dramatic reveal as soon as ALL players in MULTI_PHONE mode finish voting
  useEffect(() => {
    if (isMultiPhone && votedCount >= totalPlayersCount && totalPlayersCount > 0) {
      const timer = setTimeout(() => {
        if (onVotingComplete) onVotingComplete(votes);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [votedCount, totalPlayersCount, isMultiPhone, votes, onVotingComplete]);

  // --- ONE_PHONE MODE STATE & LOGIC ---
  const [voterIndex, setVoterIndex] = useState(0);
  // 'PRIVACY_HANDOFF' | 'CAST_VOTE' | 'VOTE_CONFIRMED'
  const [onePhoneStep, setOnePhoneStep] = useState('PRIVACY_HANDOFF');

  const currentVoter = players[voterIndex] || players[0];

  // Handler for selecting suspect
  const handleSelectSuspect = (suspectId) => {
    soundManager.playTap();
    setSelectedSuspectId(suspectId);
  };

  // Handler for confirming vote in MULTI_PHONE mode
  const handleConfirmMultiVote = () => {
    if (!selectedSuspectId || !myPlayer) return;
    soundManager.playVotingLock();
    if (onCastVote) {
      onCastVote(myPlayer.id, selectedSuspectId);
    }
  };

  // Handlers for ONE_PHONE mode
  const handleStartOnePhoneVote = () => {
    soundManager.playTap();
    setSelectedSuspectId(null);
    setOnePhoneStep('CAST_VOTE');
  };

  const handleConfirmOnePhoneVote = () => {
    if (!selectedSuspectId || !currentVoter) return;
    soundManager.playVotingLock();
    if (onCastVote) {
      onCastVote(currentVoter.id, selectedSuspectId);
    }
    setOnePhoneStep('VOTE_CONFIRMED');
  };

  const handlePassToNextVoter = () => {
    soundManager.playTap();
    setSelectedSuspectId(null);

    if (voterIndex < players.length - 1) {
      setVoterIndex(voterIndex + 1);
      setOnePhoneStep('PRIVACY_HANDOFF');
    } else {
      // All players in ONE_PHONE mode finished voting
      if (onVotingComplete) {
        onVotingComplete(votes);
      }
    }
  };

  // ==========================================
  // RENDER: MULTI_PHONE MODE (Separate Devices)
  // ==========================================
  if (isMultiPhone) {
    return (
      <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <span className="text-xs font-bold text-[#E5B91A] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#E5B91A]" /> تصويت سري على موبايلك
          </span>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772]">
            {myPlayer?.name || 'أنت'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!hasMyVoteBeenCast ? (
            /* MULTI_PHONE: Step A - Cast Secret Vote */
            <motion.div
              key="multi-voting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="my-auto space-y-4 w-full"
            >
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-[#E5B91A] flex items-center justify-center gap-1">
                  <Vote className="w-4 h-4" /> صوّت بصفتك: {myPlayer?.name}
                </span>
                <h2 className="text-2xl font-black text-[#F4F0E8]">
                  شايف مين الإمبوستر يا {myPlayer?.name}؟
                </h2>
                <p className="text-xs text-[#F4F0E8]/60">
                  صوتك سري ومحدش هيشوفه غير لما التصويت يخلص!
                </p>
              </div>

              {/* Suspects Grid */}
              <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-1">
                {players
                  .filter((p) => p.id !== myPlayer?.id)
                  .map((suspect) => {
                    const isSelected = selectedSuspectId === suspect.id;
                    return (
                      <motion.div
                        key={suspect.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectSuspect(suspect.id)}
                        className={`p-3.5 rounded-2xl cursor-pointer text-right transition-all border ${
                          isSelected
                            ? 'bg-[#D92772]/30 border-[#D92772] shadow-lg shadow-[#D92772]/20'
                            : 'bg-[#1B0E19] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-base text-[#F4F0E8]">
                            {suspect.name}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#D92772] border-[#D92772] text-white'
                                : 'border-white/30'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>

              <button
                onClick={handleConfirmMultiVote}
                disabled={!selectedSuspectId}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Lock className="w-5 h-5 text-white" />
                <span>تأكيد الصوت</span>
              </button>
            </motion.div>
          ) : (
            /* MULTI_PHONE: Step B - Vote Cast Waiting Screen */
            <motion.div
              key="multi-waiting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="my-auto space-y-6 glass-panel p-6 rounded-3xl border border-[#D92772]/40 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#D92772]/20 border border-[#D92772]/50 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-[#D92772]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#E5B91A]">
                  تم تسجيل صوتك بنجاح
                </h2>
                <p className="text-xs font-bold text-[#F4F0E8]/70">
                  اختيارك محفوظ في السر.. في انتظار باقي اللعيبة تصوّت!
                </p>
              </div>

              {/* Status List of Players Voting */}
              <div className="bg-[#1B0E19]/80 rounded-2xl p-3 border border-white/10 space-y-2 text-right">
                <div className="flex items-center justify-between text-xs text-[#F4F0E8]/60 font-bold border-b border-white/10 pb-1.5">
                  <span>حالة التصويت</span>
                  <span>({votedCount} من {totalPlayersCount} صوّتوا)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  {players.map((p) => {
                    const playerVoted = Boolean(votes[p.id]);
                    return (
                      <div
                        key={p.id}
                        className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                          playerVoted
                            ? 'bg-[#E5B91A]/10 border-[#E5B91A]/30 text-[#E5B91A]'
                            : 'bg-white/5 border-white/10 text-white/50'
                        }`}
                      >
                        <span className="font-bold truncate max-w-[90px]">{p.name}</span>
                        {playerVoted ? (
                          <span className="flex items-center gap-1 text-[10px] font-black text-[#E5B91A]">
                            صوّت <CheckCircle2 className="w-3 h-3 text-[#E5B91A]" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-white/40">
                            يفكر... <Clock className="w-3 h-3 animate-spin" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Auto-transition status for all players */}
              <div className="py-3.5 px-4 rounded-2xl bg-[#120A12]/90 border border-[#E5B91A]/30 text-xs font-extrabold text-[#E5B91A] text-center animate-pulse flex items-center justify-center gap-2 shadow-md">
                <Clock className="w-4 h-4 text-[#E5B91A] animate-spin shrink-0" />
                <span>
                  {votedCount >= totalPlayersCount
                    ? 'اكتمل التصويت للجميع! جاري كشف الحقيقة الآن...'
                    : 'في انتظار باقي الشلة يكملوا التصويت...'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ==========================================
  // RENDER: ONE_PHONE MODE (Single Device Passed)
  // ==========================================
  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto">
      {/* Top progress indicator */}
      <div className="flex items-center justify-between py-2 border-b border-white/10">
        <span className="text-xs font-bold text-[#F4F0E8]/60">
          التصويت السري ({voterIndex + 1} من {players.length})
        </span>
        <div className="flex gap-1">
          {players.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === voterIndex
                  ? 'w-6 bg-[#D92772]'
                  : i < voterIndex
                  ? 'w-2 bg-[#E5B91A]'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {onePhoneStep === 'PRIVACY_HANDOFF' && (
          /* ONE_PHONE: Step 1 - Privacy Gate Handoff */
          <motion.div
            key={`handoff-${voterIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-[#D92772]/20 border border-[#D92772]/50 flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 text-[#D92772]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-[#E5B91A] flex items-center justify-center gap-1">
                <Vote className="w-4 h-4" /> دور في التصويت
              </span>
              <h2 className="text-3xl font-black text-[#F4F0E8]">
                سلّم الموبايل لـ {currentVoter.name}
              </h2>
              <p className="text-xs font-bold text-[#F4F0E8]/70">
                تأكد إن محدش باصص في الشاشة قبل ما تفتح قائمة التصويت!
              </p>
            </div>

            <button
              onClick={handleStartOnePhoneVote}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Lock className="w-5 h-5 text-white" />
              <span>أنا {currentVoter.name} - جاهز أصوّت</span>
            </button>
          </motion.div>
        )}

        {onePhoneStep === 'CAST_VOTE' && (
          /* ONE_PHONE: Step 2 - Cast Secret Vote */
          <motion.div
            key={`voter-${voterIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="my-auto space-y-4 w-full"
          >
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#E5B91A] flex items-center justify-center gap-1">
                <Vote className="w-4 h-4" /> دور {currentVoter.name} في التصويت
              </span>
              <h2 className="text-2xl font-black text-[#F4F0E8]">
                {currentVoter.name}… مين اللي مش فاهم حاجة؟
              </h2>
            </div>

            {/* List of Suspects (excluding current voter) */}
            <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-1">
              {players
                .filter((p) => p.id !== currentVoter.id)
                .map((suspect) => {
                  const isSelected = selectedSuspectId === suspect.id;
                  return (
                    <motion.div
                      key={suspect.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectSuspect(suspect.id)}
                      className={`p-3.5 rounded-2xl cursor-pointer text-right transition-all border ${
                        isSelected
                          ? 'bg-[#D92772]/30 border-[#D92772] shadow-lg shadow-[#D92772]/20'
                          : 'bg-[#1B0E19] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-base text-[#F4F0E8]">
                          {suspect.name}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#D92772] border-[#D92772] text-white'
                              : 'border-white/30'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            <button
              onClick={handleConfirmOnePhoneVote}
              disabled={!selectedSuspectId}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Lock className="w-5 h-5 text-white" />
              <span>تأكيد الصوت</span>
            </button>
          </motion.div>
        )}

        {onePhoneStep === 'VOTE_CONFIRMED' && (
          /* ONE_PHONE: Step 3 - Lock Vote & Pass Phone */
          <motion.div
            key={`locked-${voterIndex}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/50 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-[#D92772]/20 border border-[#D92772]/50 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-[#D92772]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#E5B91A]">
                اتقفل صوتك
              </h2>
              <p className="text-xs font-bold text-[#F4F0E8]/70">
                اختيارك محفوظ في السر وماحدش هيعرف انت اخترت مين غير لما النتيجة تظهر!
              </p>
            </div>

            <button
              onClick={handlePassToNextVoter}
              className="w-full py-4 rounded-2xl bg-[#D92772] hover:bg-[#b01e5b] font-black text-lg text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {voterIndex < players.length - 1
                ? 'ادّي الموبايل للي بعدك'
                : 'عرض نتائج التصويت'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

