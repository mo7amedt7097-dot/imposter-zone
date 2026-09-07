import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderCluePhaseView(container, state, navigate, onStartVoting) {
  let timeLeft = 60;
  let isRunning = true;
  const gameMode = state.gameMode || 'ONE_PHONE';
  const isMultiPhone = gameMode === 'MULTI_PHONE';
  const isHost = state.activeGroup?.hostUserId === state.user?.id;

  let timerInterval = null;

  const updateTimerDisplay = () => {
    const display = document.getElementById('timer-display');
    if (display) {
      display.textContent = `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`;
    }
  };

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!isRunning) return;
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        soundManager.playTick();
        setTimeout(() => {
          if (onStartVoting) onStartVoting();
        }, 800);
        return;
      }
      if (timeLeft <= 6) {
        soundManager.playTick();
      }
      updateTimerDisplay();
    }, 1000);
  };

  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto h-full">
      <div class="space-y-2 my-2">
        <span class="px-3.5 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] text-xs font-black inline-flex items-center justify-center gap-1.5 mx-auto">
          ${ICONS.Sparkles}
          مرحلة التلميحات والأدلة
        </span>
        <h2 class="text-3xl font-black text-[#F4F0E8]">
          وقت الكلام والأسئلة
        </h2>
        <p class="text-xs font-bold text-[#F4F0E8]/70 max-w-xs mx-auto leading-relaxed">
          كل واحد يقول تلميح واسألوا بعض… من غير ما تجيبوا الكلمة على البلاطة!
        </p>
      </div>

      <div class="my-auto space-y-4">
        <div class="glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl relative overflow-hidden">
          <div class="flex items-center justify-center gap-2 mb-2 text-[#D92772] text-xs font-black">
            ${ICONS.Zap}
            <span>الوقت المتبقي للمناقشة</span>
          </div>

          <div id="timer-display" class="text-6xl font-black font-mono text-[#E5B91A] text-glow-yellow mb-4">
            00:60
          </div>

          ${(isHost || !isMultiPhone) ? `
            <div class="flex items-center justify-center gap-3">
              <button id="btn-toggle-pause" class="px-4 py-2.5 rounded-xl bg-[#2A102E] border border-white/10 text-xs font-bold flex items-center gap-1.5 hover:bg-[#4A1E55] transition-colors cursor-pointer">
                إيقاف مؤقت
              </button>
              <button id="btn-add-seconds" class="px-4 py-2.5 rounded-xl bg-[#D92772]/20 border border-[#D92772]/40 text-xs font-bold text-[#D92772] flex items-center gap-1 hover:bg-[#D92772]/30 active:scale-95 transition-all cursor-pointer">
                +30 ثانية
              </button>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="mt-auto pt-4">
        ${(isMultiPhone && !isHost) ? `
          <div class="py-4 rounded-2xl bg-[#1B0E19] border border-white/10 text-xs font-bold text-[#E5B91A] text-center animate-pulse flex items-center justify-center gap-2">
            في انتظار الـ Host لبداية التصويت السرّي...
          </div>
        ` : `
          <button id="btn-start-voting-now" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
            <span class="text-[#E5B91A]">${ICONS.Check}</span>
            <span>ابدأ التصويت الآن</span>
          </button>
        `}
      </div>
    </div>
  `;

  const btnPause = document.getElementById('btn-toggle-pause');
  if (btnPause) {
    btnPause.onclick = () => {
      soundManager.playTap();
      isRunning = !isRunning;
      btnPause.textContent = isRunning ? 'إيقاف مؤقت' : 'استئناف';
    };
  }

  const btnAddSec = document.getElementById('btn-add-seconds');
  if (btnAddSec) {
    btnAddSec.onclick = () => {
      soundManager.playTap();
      timeLeft += 30;
      updateTimerDisplay();
    };
  }

  const btnVoting = document.getElementById('btn-start-voting-now');
  if (btnVoting) {
    btnVoting.onclick = () => {
      soundManager.playTap();
      if (timerInterval) clearInterval(timerInterval);
      if (onStartVoting) onStartVoting();
    };
  }

  startTimer();
}
