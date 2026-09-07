import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderWinnerView(container, state, navigate, onResetScores, onContinuePlaying, onGoHome) {
  const winner = state.winnerPlayer;

  soundManager.playWinFanfare();

  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-between items-center px-4 py-6 max-w-md mx-auto w-full text-center text-[#F4F0E8] relative overflow-hidden h-full">
      <div class="my-auto space-y-6 z-10 w-full">
        <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D92772] via-[#E5B91A] to-[#D92772] border-4 border-[#E5B91A] flex items-center justify-center mx-auto shadow-2xl">
          <span class="text-black">${ICONS.Crown}</span>
        </div>

        <div class="space-y-2">
          <h1 class="text-4xl font-black text-[#E5B91A]">
            خلصت يا معلم
          </h1>
          <h2 class="text-3xl font-black text-[#F4F0E8]">
            <span class="text-[#D92772]">${winner?.name || 'اللاعب'}</span> وصل 50 نقطة
          </h2>
          <p class="text-sm font-extrabold text-[#F4F0E8]/70">
            الباقي يراجع نفسه
          </p>
        </div>

        <div class="glass-panel p-6 rounded-3xl border border-[#E5B91A]/50 inline-block shadow-2xl bg-gradient-to-b from-[#2A102E] to-[#120A12]">
          <span class="text-7xl font-black text-[#E5B91A] tracking-tight">
            50
          </span>
          <span class="block text-xs font-black text-[#F4F0E8]/80 mt-1">
            نقطة الفوز الساحق
          </span>
        </div>
      </div>

      <div class="w-full space-y-2.5 z-10 mt-auto">
        <button id="btn-reset-scores" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
          <span class="text-[#E5B91A]">${ICONS.RotateCcw}</span>
          نلعب من الأول
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button id="btn-continue-playing" class="py-3 px-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-xs text-[#F4F0E8] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer">
            <span class="text-[#E5B91A]">${ICONS.Zap}</span>
            نكمل هزار
          </button>

          <button id="btn-winner-home" class="py-3 px-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-[#E5B91A]/30 font-bold text-xs text-[#E5B91A] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer">
            <span class="text-[#E5B91A]">${ICONS.ArrowRight}</span>
            الرئيسية
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-reset-scores').onclick = () => {
    soundManager.playTap();
    if (onResetScores) onResetScores();
  };

  document.getElementById('btn-continue-playing').onclick = () => {
    soundManager.playTap();
    if (onContinuePlaying) onContinuePlaying();
  };

  document.getElementById('btn-winner-home').onclick = () => {
    soundManager.playTap();
    if (onGoHome) onGoHome();
  };
}
