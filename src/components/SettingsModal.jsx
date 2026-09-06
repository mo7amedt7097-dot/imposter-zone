import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Smartphone, Timer, RotateCcw, Users, Trash2, Settings } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function SettingsModal({
  isOpen,
  onClose,
  isHost = true,
  soundEnabled,
  setSoundEnabled,
  vibrationEnabled,
  setVibrationEnabled,
  timerEnabled,
  setTimerEnabled,
  onEditGroup,
  onResetScores,
  onResetAll
}) {
  const [confirmType, setConfirmType] = useState(null); // 'RESET_SCORES' | 'RESET_ALL' | null

  if (!isOpen) return null;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next, vibrationEnabled);
    if (next) soundManager.playTap();
  };

  const toggleVibration = () => {
    soundManager.playTap();
    const next = !vibrationEnabled;
    setVibrationEnabled(next);
    soundManager.setEnabled(soundEnabled, next);
  };

  const toggleTimer = () => {
    soundManager.playTap();
    setTimerEnabled(!timerEnabled);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-sm glass-panel rounded-3xl p-6 relative border border-[#D92772]/40 shadow-2xl text-[#F4F0E8]"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#D92772]/20 mb-5">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#E5B91A]" /> الإعدادات
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

          <div className="space-y-4">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1B0E19] border border-white/5">
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-[#E5B91A]" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
                <span className="font-semibold text-sm">المؤثرات الصوتية</span>
              </div>
              <button
                onClick={toggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${soundEnabled ? 'bg-[#D92772]' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-[-24px]' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Vibration Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1B0E19] border border-white/5">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#D92772]" />
                <span className="font-semibold text-sm">الاهتزاز والتفاعل</span>
              </div>
              <button
                onClick={toggleVibration}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${vibrationEnabled ? 'bg-[#D92772]' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${vibrationEnabled ? 'translate-x-[-24px]' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Timer Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1B0E19] border border-white/5">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-sm">مؤقت التلميحات</span>
              </div>
              <button
                onClick={toggleTimer}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${timerEnabled ? 'bg-[#D92772]' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${timerEnabled ? 'translate-x-[-24px]' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  soundManager.playTap();
                  onClose();
                  onEditGroup();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#2A102E] hover:bg-[#4A1E55] border border-[#D92772]/30 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all text-[#E5B91A]"
              >
                <Users className="w-4 h-4" />
                تعديل أسماء الشلة
              </button>

              <button
                disabled={!isHost}
                onClick={() => {
                  if (!isHost) return;
                  soundManager.playTap();
                  setConfirmType('RESET_ALL');
                }}
                className={`w-full py-3 px-4 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isHost
                    ? 'bg-red-950/40 hover:bg-red-900/60 border-red-500/30 text-red-400 active:scale-95'
                    : 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                {isHost ? 'مسح كل حاجة من الأول' : 'مسح اللعبة (مسموح للـ Host فقط)'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Inner Custom Confirmation Modal */}
        {confirmType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 rounded-3xl border border-red-500/40 shadow-2xl max-w-xs w-full text-center space-y-4 bg-gradient-to-b from-[#2A102E] to-[#120A12]"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#F4F0E8]">
                  أكيد عاوز تمسح كل حاجة من الأول؟
                </h3>
                <p className="text-xs font-bold text-[#F4F0E8]/70 leading-relaxed">
                  سيتم إعادة اللعبة لحالتها الإفتراضية كأنها جديدة!
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setConfirmType(null)}
                  className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F4F0E8] font-extrabold text-xs"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    soundManager.playTap();
                    onResetAll();
                    setConfirmType(null);
                    onClose();
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                  <span>تأكيد</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
