import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderDramaticRevealView(container, state, navigate, onProceed) {
  const players = state.activeGroup?.players || [];
  const imposterIds = state.imposterIds || [];
  const votes = state.votes || {};

  let stage = 'suspense'; // 'suspense' | 'countdown' | 'reveal'
  let countdown = 3;

  const voteTallies = {};
  players.forEach((p) => { voteTallies[p.id] = 0; });
  Object.values(votes).forEach((targetId) => {
    if (voteTallies[targetId] !== undefined) voteTallies[targetId] += 1;
  });

  const maxVotes = Math.max(...Object.values(voteTallies), 0);
  const topVotedIds = Object.keys(voteTallies).filter(id => voteTallies[id] === maxVotes && maxVotes > 0);
  const caughtImposterIds = imposterIds.filter(id => topVotedIds.includes(id));
  const imposters = players.filter((p) => imposterIds.includes(p.id));

  let suspenseTimer = null;
  let countdownInterval = null;
  let autoProceedTimer = null;

  const render = () => {
    if (stage === 'suspense') {
      container.innerHTML = `
        <div class="flex-1 flex flex-col justify-center items-center px-4 py-6 max-w-md mx-auto w-full text-[#F4F0E8] text-center h-full">
          <div class="space-y-6 animate-pulse">
            <div class="w-16 h-16 text-[#D92772] mx-auto">${ICONS.Zap}</div>
            <h2 class="text-4xl font-black text-[#E5B91A]">طب نشوف بقى…</h2>
            <p class="text-sm font-bold text-[#F4F0E8]/70">مين اللي كان بيهبد ومين اللي اتكشف؟</p>
          </div>
        </div>
      `;
      return;
    }

    if (stage === 'countdown') {
      container.innerHTML = `
        <div class="flex-1 flex flex-col justify-center items-center px-4 py-6 max-w-md mx-auto w-full text-[#F4F0E8] text-center h-full">
          <div class="space-y-4">
            <span class="text-[#E5B91A] font-black text-xl flex items-center justify-center gap-1.5">
              ${ICONS.Eye} <span>كشف الحقيقة</span>
            </span>
            <div class="text-9xl font-black text-[#D92772] drop-shadow-2xl">
              ${countdown}
            </div>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="flex-1 flex flex-col justify-between px-4 py-6 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto h-full">
        <div class="my-auto space-y-5 w-full">
          <div class="glass-panel p-6 rounded-3xl border border-[#D92772] space-y-4 bg-gradient-to-b from-[#2A102E] to-[#120A12]">
            <span class="px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] text-xs font-black">
              ${imposters.length === 1 ? 'الـ IMPOSTER هو…' : 'الإمبوسترز هما…'}
            </span>

            <div class="space-y-2">
              ${imposters.map((imp) => `
                <div class="p-4 rounded-2xl bg-[#1B0E19] border border-[#D92772]/50">
                  <h3 class="text-3xl font-black text-[#E5B91A]">${imp.name}</h3>
                </div>
              `).join('')}
            </div>

            <p class="text-base font-extrabold text-[#D92772]">
              ${imposters.length === 1 ? 'اتقفشت يا نجم' : 'يا سلام على العصابة'}
            </p>
          </div>

          <div class="glass-panel p-4 rounded-3xl border border-white/10 space-y-2">
            <h4 class="text-xs font-black text-[#F4F0E8]/70 text-right flex items-center justify-between">
              <span class="flex items-center gap-1">
                ${ICONS.Sparkles} <span>توزيع الأصوات</span>
              </span>
              <span>الأصوات</span>
            </h4>

            <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              ${players.slice().sort((a, b) => voteTallies[b.id] - voteTallies[a.id]).map((player) => {
                const count = voteTallies[player.id];
                const isImp = imposterIds.includes(player.id);
                return `
                  <div class="flex items-center justify-between p-2.5 rounded-xl text-sm font-bold border ${isImp ? 'bg-[#D92772]/20 border-[#D92772]/40 text-[#F4F0E8]' : 'bg-[#120A12] border-white/5 text-[#F4F0E8]/80'}">
                    <span class="flex items-center gap-1.5">
                      ${player.name}
                    </span>
                    <span class="px-2.5 py-0.5 rounded-lg bg-[#2A102E] text-xs text-[#E5B91A] font-black">
                      ${count === 1 ? 'صوت واحد' : count === 2 ? 'صوتين' : `${count} أصوات`}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <button id="btn-reveal-next" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
            <span>التالي</span>
          </button>
        </div>
      </div>
    `;

    const btnNext = document.getElementById('btn-reveal-next');
    if (btnNext) {
      btnNext.onclick = () => {
        soundManager.playTap();
        if (autoProceedTimer) clearTimeout(autoProceedTimer);
        if (onProceed) onProceed(caughtImposterIds, voteTallies);
      };
    }
  };

  soundManager.playDramaticSuspense();
  render();

  suspenseTimer = setTimeout(() => {
    stage = 'countdown';
    soundManager.playTick();
    render();

    countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        soundManager.playTick();
        render();
      } else {
        clearInterval(countdownInterval);
        soundManager.playRevealBoom();
        stage = 'reveal';
        render();

        autoProceedTimer = setTimeout(() => {
          if (onProceed) onProceed(caughtImposterIds, voteTallies);
        }, 4500);
      }
    }, 800);
  }, 2500);
}
