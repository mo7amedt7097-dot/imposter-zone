import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Target, Sparkles, ShieldAlert, Award, Flame, BarChart3, Smartphone, Lock, Trophy } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function FinalGuessView({
  caughtImposterIds = [],
  imposterIds = [],
  players = [],
  secretWordObj = {},
  gameMode = 'ONE_PHONE',
  currentUserId,
  isHost,
  guessResults = {},
  onGuessSubmit,
  onComplete
}) {
  const isMultiPhone = gameMode === 'MULTI_PHONE';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // ONE_PHONE privacy gate step: 'PRIVACY_HANDOFF' | 'GUESSING' | 'RESULT'
  const [onePhoneStep, setOnePhoneStep] = useState('PRIVACY_HANDOFF');

  // Fallback to imposterIds if caughtImposterIds is empty
  const imposterListToUse = (caughtImposterIds && caughtImposterIds.length > 0)
    ? caughtImposterIds
    : (imposterIds && imposterIds.length > 0 ? imposterIds : []);

  const currentImposterId = imposterListToUse[currentIndex];
  const currentImposter = players.find((p) => String(p.id) === String(currentImposterId))
    || players.find((p) => imposterIds.includes(p.id))
    || players[0];

  const choices = secretWordObj?.choices || [secretWordObj?.secretWord || 'كلمة', 'بيتزا', 'شاورما', 'كشري'];
  const correctWord = secretWordObj?.secretWord || '';

  const isMyTurnToGuess = isMultiPhone
    ? Boolean(currentImposter?.id) && String(currentImposter.id) === String(currentUserId)
    : true;
  const hasGuessed = guessResults[currentImposter?.id] !== undefined;

  const handleSelectChoice = (word) => {
    if (isAnswered || !currentImposter) return;
    setSelectedWord(word);
    setIsAnswered(true);

    const isCorrect = word === correctWord;
    if (isCorrect) {
      soundManager.playCorrectGuess();
    } else {
      soundManager.playWrongGuess();
    }

    if (onGuessSubmit) {
      onGuessSubmit(currentImposter.id, isCorrect);
    }

    if (isMultiPhone) {
      setTimeout(() => {
        handleNextImposter();
      }, 2400);
    }
  };

  const handleNextImposter = () => {
    soundManager.playTap();
    setIsAnswered(false);
    setSelectedWord(null);
    setOnePhoneStep('PRIVACY_HANDOFF');

    if (currentIndex < imposterListToUse.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (onComplete) {
        onComplete(guessResults);
      }
    }
  };

  // Auto transition for non-imposters when imposter guesses
  useEffect(() => {
    if (isMultiPhone && hasGuessed && !isMyTurnToGuess) {
      const timer = setTimeout(() => {
        handleNextImposter();
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [hasGuessed, isMultiPhone, isMyTurnToGuess]);

  if (!currentImposter) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto w-full text-[#F4F0E8] text-center">
        <div className="glass-panel p-8 rounded-3xl border border-[#E5B91A]/40 shadow-2xl space-y-4 w-full bg-gradient-to-b from-[#2A102E] to-[#120A12]">
          <div className="w-16 h-16 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/50 flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-[#E5B91A]" />
          </div>
          <h2 className="text-2xl font-black text-[#E5B91A] flex items-center justify-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#E5B91A]" />
            <span>جاري تجهيز نتائج الجولة...</span>
          </h2>
          <p className="text-xs font-bold text-[#F4F0E8]/70">جاري الانتقال لحساب النقاط والترتيب!</p>
        </div>
      </div>
    );
  }

  const isGuessCorrect = guessResults[currentImposter.id] === true;

  // ==========================================
  // RENDER: MULTI_PHONE MODE (Separate Devices)
  // ==========================================
  if (isMultiPhone) {
    return (
      <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <span className="text-xs font-bold text-[#E5B91A] flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#E5B91A]" /> الفرصة الأخيرة
          </span>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772]">
            ({currentIndex + 1} من {imposterListToUse.length})
          </span>
        </div>

        <AnimatePresence mode="wait">
          {isMyTurnToGuess ? (
            /* MY PHONE: I am the imposter! Show the 4 word choices */
            !isAnswered && !hasGuessed ? (
              <motion.div
                key="my-guess-choices"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="my-auto space-y-4 w-full"
              >
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-[#E5B91A] uppercase tracking-wider flex items-center justify-center gap-1">
                    <Target className="w-4 h-4 text-[#E5B91A]" /> دورك يا {currentImposter.name}
                  </span>
                  <h2 className="text-2xl font-black text-[#F4F0E8]">
                    لسه عندك فرصة تخمين الكلمة!
                  </h2>
                  <p className="text-xs text-[#F4F0E8]/70">
                    أمامك 4 خيارات.. اختار الكلمة الصح وكسب نقاط!
                  </p>
                </div>

                {/* Choices Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {choices.map((word, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectChoice(word)}
                      className="p-5 rounded-2xl glass-card-interactive border border-white/10 hover:border-[#D92772] text-xl font-black text-[#F4F0E8] shadow-lg flex items-center justify-center min-h-[90px]"
                    >
                      {word}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* MY PHONE: Feedback Result */
              <motion.div
                key="my-guess-result"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl"
              >
                {selectedWord === correctWord || isGuessCorrect ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto">
                      <Flame className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-black text-emerald-400">
                      يا ابن اللعيبة
                    </h3>
                    <p className="text-lg font-extrabold text-[#E5B91A]">
                      عرفتها صح! (+3 نقاط)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto">
                      <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-3xl font-black text-red-400">
                      لأ يا معلم
                    </h3>
                    <p className="text-sm font-bold text-[#F4F0E8]/80">
                      الكلمة كانت: <span className="text-[#E5B91A] font-black text-xl">{correctWord}</span>
                    </p>
                  </div>
                )}

                <div className="text-xs font-extrabold text-[#E5B91A] animate-pulse py-2">
                  جاري الانتقال لجدول النتائج وحساب النقاط...
                </div>
              </motion.div>
            )
          ) : (
            /* ALL OTHER PHONES (HOST & REGULAR PLAYERS): Short, Punchy Slang Waiting Screen */
            <motion.div
              key="others-waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="my-auto space-y-5 glass-panel p-6 rounded-3xl border border-[#E5B91A]/50 shadow-2xl bg-gradient-to-b from-[#2A102E] via-[#1B0E19] to-[#120A12] glow-yellow"
            >
              <div className="w-16 h-16 rounded-full bg-[#E5B91A]/20 border-2 border-[#E5B91A]/60 flex items-center justify-center mx-auto shadow-lg shadow-[#E5B91A]/20 animate-pulse">
                <Target className="w-8 h-8 text-[#E5B91A]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-[#E5B91A] uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#E5B91A]" /> الفرصة الأخيرة للمحتال!
                </span>
                <h2 className="text-2xl font-black text-[#F4F0E8] leading-tight">
                  <span className="text-[#E5B91A] text-glow-yellow">{currentImposter.name}</span> قدّامه 4 كلمات وبيحاول ينقذ نفسه!
                </h2>
                <p className="text-xs font-bold text-[#F4F0E8]/80 leading-relaxed bg-[#120A12]/80 p-3 rounded-2xl border border-white/10">
                  الاختيارات نازلة سرّي على موبايله دلوقتي.. نشوف هيحزرها ولا هيهبد وتضيع النقط!
                </p>
              </div>

              {hasGuessed ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="p-4 rounded-2xl bg-[#120A12] border border-white/10 space-y-1 shadow-inner"
                >
                  {isGuessCorrect ? (
                    <div className="text-emerald-400 font-black text-lg flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" /> يا ابن اللعيبة سلك وعرفها صح! (+3 نقاط)
                    </div>
                  ) : (
                    <div className="text-red-400 font-black text-lg flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5 text-red-400" /> لبس في الحيط ومعرفش الكلمة! (0 نقاط)
                    </div>
                  )}
                  <p className="text-xs font-bold text-[#E5B91A] animate-pulse pt-1 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 animate-spin" /> جاري الانتقال لجدول الترتيب...
                  </p>
                </motion.div>
              ) : (
                <div className="py-3 px-4 rounded-2xl bg-[#120A12]/90 border border-[#E5B91A]/40 text-xs font-black text-[#E5B91A] text-center animate-pulse flex items-center justify-center gap-2 shadow-md">
                  <Clock className="w-4 h-4 text-[#E5B91A] animate-spin shrink-0" />
                  <span>مستنيين المعلم {currentImposter.name} يختار الكلمة...</span>
                </div>
              )}
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
      {/* Title */}
      <div className="space-y-2 my-2">
        <span className="px-3.5 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] text-xs font-black inline-block">
          الفرصة الأخيرة ({currentIndex + 1} من {caughtImposterIds.length})
        </span>

        <h2 className="text-3xl font-black text-[#F4F0E8]">
          لسه عندك فرصة
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {onePhoneStep === 'PRIVACY_HANDOFF' && (
          /* ONE_PHONE: Step 1 - Privacy Handoff */
          <motion.div
            key={`handoff-${currentIndex}`}
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
                <Target className="w-4 h-4 text-[#E5B91A]" /> الفرصة الأخيرة
              </span>
              <h2 className="text-3xl font-black text-[#F4F0E8]">
                سلّم الموبايل لـ {currentImposter.name}
              </h2>
              <p className="text-xs font-bold text-[#F4F0E8]/70">
                تأكد إن محدش باصص في الشاشة عشان يختار الكلمة السرية!
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playTap();
                setOnePhoneStep('GUESSING');
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Lock className="w-5 h-5 text-white" />
              <span>أنا {currentImposter.name} - جاهز أحزر</span>
            </button>
          </motion.div>
        )}

        {onePhoneStep === 'GUESSING' && (
          /* ONE_PHONE: Step 2 - Choices Grid */
          <motion.div
            key="choices"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="my-auto space-y-3 w-full"
          >
            <p className="text-sm font-extrabold text-[#D92772] mb-2">
              {currentImposter.name}… تقدر تعرف الكلمة كانت إيه؟
            </p>
            <div className="grid grid-cols-2 gap-3">
              {choices.map((word, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleSelectChoice(word);
                    setOnePhoneStep('RESULT');
                  }}
                  className="p-5 rounded-2xl glass-card-interactive border border-white/10 hover:border-[#D92772] text-xl font-black text-[#F4F0E8] shadow-lg flex items-center justify-center min-h-[90px]"
                >
                  {word}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {onePhoneStep === 'RESULT' && (
          /* ONE_PHONE: Step 3 - Result Feedback */
          <motion.div
            key="result"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl"
          >
            {selectedWord === correctWord ? (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto">
                  <Flame className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black text-emerald-400">
                  يا ابن اللعيبة
                </h3>
                <p className="text-lg font-extrabold text-[#E5B91A]">
                  عرفتها صح! (+3 نقاط)
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-3xl font-black text-red-400">
                  لأ يا معلم
                </h3>
                <p className="text-sm font-bold text-[#F4F0E8]/80">
                  الكلمة كانت: <span className="text-[#E5B91A] font-black text-xl">{correctWord}</span>
                </p>
              </div>
            )}

            <button
              onClick={handleNextImposter}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {currentIndex < caughtImposterIds.length - 1 ? 'التالي' : 'عرض نتائج الجولة'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

