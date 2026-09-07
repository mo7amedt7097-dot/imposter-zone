import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderRoleRevealView(container, state, navigate, onRoleRevealed, onComplete) {
  const players = state.activeGroup?.players || [];
  const secretWord = state.secretWordObj?.secretWord || '';
  const imposterIds = state.imposterIds || [];
  const gameMode = state.gameMode || 'ONE_PHONE';
  const currentUserId = state.user?.id;
  const rolesRevealed = state.rolesRevealed || {};

  let currentIndex = 0;
  let isRevealed = false;
  let hasConfirmedRead = false;
  let allFinished = false;

  const isMultiPhone = gameMode === 'MULTI_PHONE';
  const myPlayer = players.find(p => p.id === currentUserId) || players[0];
  const isMyImposter = imposterIds.includes(myPlayer?.id);

  const render = () => {
    const currentPlayer = players[currentIndex] || players[0];
    const isImposter = imposterIds.includes(currentPlayer?.id);
    const revealedCount = Object.keys(rolesRevealed).length;
    const totalCount = players.length;
    const hasMyRoleBeenRevealed = isMultiPhone && (hasConfirmedRead || Boolean(rolesRevealed[myPlayer?.id]));

    if (isMultiPhone) {
      container.innerHTML = `
        <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto h-full">
          <div class="flex items-center justify-between py-2 border-b border-white/10">
            <span class="text-xs font-bold text-[#E5B91A] flex items-center gap-1.5">
              ${ICONS.Sparkles} دورك السرّي على موبايلك
            </span>
            <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772]">
              ${myPlayer?.name || 'أنت'}
            </span>
          </div>

          ${!isRevealed && !hasMyRoleBeenRevealed ? `
            <div class="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/30 shadow-2xl">
              <div class="space-y-2">
                <span class="text-xs font-extrabold text-[#E5B91A] uppercase tracking-wider flex items-center justify-center gap-1">
                  ${ICONS.Users} أهلاً ${myPlayer?.name}
                </span>
                <h2 class="text-3xl font-black text-[#F4F0E8]">جاهز تكتشف دورك؟</h2>
              </div>
              <div class="p-4 rounded-2xl bg-[#1B0E19] border border-white/5 space-y-1">
                <p class="text-xs text-[#F4F0E8]/70">تأكد إن محدش باصص في شاشة موبايلك واضغط إظهار!</p>
              </div>
              <button id="btn-reveal-multi" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                <span class="text-[#E5B91A]">${ICONS.Eye}</span> إظهار دوري السرّي
              </button>
            </div>
          ` : isRevealed && !hasMyRoleBeenRevealed ? `
            <div class="my-auto space-y-6">
              ${!isMyImposter ? `
                <div class="glass-panel p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 bg-gradient-to-b from-[#1B0E19] to-[#2A102E]">
                  <div class="space-y-1">
                    <span class="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">${ICONS.Sparkles} إنت لاعب عادي</span>
                    <h3 class="text-sm font-bold text-[#F4F0E8]/70">الكلمة السرية هي:</h3>
                  </div>
                  <div class="p-6 rounded-2xl bg-[#120A12] border border-emerald-500/30 shadow-inner">
                    <span class="text-4xl font-black text-[#E5B91A] text-glow-yellow block">${secretWord}</span>
                  </div>
                  <p class="text-xs font-bold text-[#F4F0E8]/80 flex items-center justify-center gap-1">
                    ${ICONS.Lock} احفظ الكلمة في سرّك ومتفضحناش
                  </p>
                  <button id="btn-confirm-multi" class="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                    ${ICONS.Check} فهمت دوري وجاهز للتلميحات
                  </button>
                </div>
              ` : `
                <div class="glass-panel p-8 rounded-3xl border border-[#D92772] shadow-2xl space-y-6 bg-gradient-to-b from-[#2A102E] to-[#120A12]">
                  <div class="space-y-2">
                    <h2 class="text-3xl font-black text-[#D92772] flex items-center justify-center gap-2">
                      <span class="text-[#D92772]">${ICONS.Zap}</span> إنت الـ IMPOSTER
                    </h2>
                  </div>
                  <div class="p-5 rounded-2xl bg-[#1B0E19] border border-[#D92772]/40 text-right space-y-2">
                    <p class="text-sm font-extrabold text-[#E5B91A]">ملكش كلمة!</p>
                    <p class="text-xs font-semibold text-[#F4F0E8]/80 leading-relaxed">ركز في تلميحات الشلة وحاول تفهم الكلمة من كلامهم من غير ما يشكوا فيك!</p>
                  </div>
                  <button id="btn-confirm-multi" class="w-full py-4 rounded-2xl bg-[#D92772] hover:bg-[#b01e5b] font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                    ${ICONS.Check} فهمت دوري وجاهز للتلميحات
                  </button>
                </div>
              `}
            </div>
          ` : `
            <div class="my-auto space-y-6 glass-panel p-6 rounded-3xl border border-[#E5B91A]/40 shadow-2xl">
              <div class="space-y-1">
                <h2 class="text-2xl font-black text-[#E5B91A] flex items-center justify-center gap-2">
                  ${ICONS.Lock} <span>عرفت كلمتك وبقيت جاهز</span>
                </h2>
                <p class="text-xs font-bold text-[#F4F0E8]/70">في انتظار باقي الشلة يقرأوا أدوارهم على هواتفهم...</p>
              </div>
              <div class="bg-[#1B0E19]/80 rounded-2xl p-3 border border-white/10 space-y-2 text-right">
                <div class="flex items-center justify-between text-xs text-[#F4F0E8]/60 font-bold border-b border-white/10 pb-1.5">
                  <span>حالة استكشاف الكلمات</span>
                  <span>(${revealedCount} من ${totalCount} استكشفوا)</span>
                </div>
                <div class="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  ${players.map((p) => {
                    const isDone = Boolean(rolesRevealed[p.id]);
                    return `
                      <div class="p-2 rounded-xl border text-xs flex items-center justify-between ${isDone ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/50'}">
                        <span class="font-bold truncate max-w-[90px]">${p.name}</span>
                        ${isDone ? `<span class="flex items-center gap-1 text-[10px] font-black text-emerald-400">جاهز ${ICONS.Check}</span>` : `<span class="flex items-center gap-1 text-[10px] text-white/40">يقرأ...</span>`}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          `}
        </div>
      `;

      const btnRevealMulti = document.getElementById('btn-reveal-multi');
      if (btnRevealMulti) {
        btnRevealMulti.onclick = () => {
          soundManager.playTap();
          if (isMyImposter) soundManager.playImposterAlert();
          else soundManager.playRoleReveal();
          isRevealed = true;
          render();
        };
      }

      const btnConfirmMulti = document.getElementById('btn-confirm-multi');
      if (btnConfirmMulti) {
        btnConfirmMulti.onclick = () => {
          soundManager.playTap();
          hasConfirmedRead = true;
          if (onRoleRevealed && myPlayer) onRoleRevealed(myPlayer.id);
          render();
        };
      }
      return;
    }

    // ONE_PHONE MODE
    if (allFinished) {
      container.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-md mx-auto w-full text-center text-[#F4F0E8] space-y-6 h-full">
          <div class="glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl space-y-4 w-full">
            <div class="w-16 h-16 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/50 flex items-center justify-center mx-auto text-3xl">
              ${ICONS.Users}
            </div>
            <h2 class="text-3xl font-black text-[#F4F0E8]">الكل عرف دوره!</h2>
            <p class="text-xs font-semibold text-[#F4F0E8]/70 leading-relaxed">
              الموبايل يرجع في نص الترابيزة دلوقتي.. كل واحد هيقول تلميح ذكي عن الكلمة!
            </p>            <button id="btn-start-clues" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#E5B91A] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
              <span>بدء التلميحات والمناقشة</span>
              ${ICONS.ArrowRight}
            </button>
          </div>
        </div>
      `;
      document.getElementById('btn-start-clues').onclick = () => {
        soundManager.playTap();
        if (onComplete) onComplete();
      };
      return;
    }

    container.innerHTML = `
      <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto h-full">
        <div class="flex items-center justify-between py-2 border-b border-white/10">
          <span class="text-xs font-bold text-[#E5B91A] flex items-center gap-1.5">
            ${ICONS.Lock} كشف الدور السرّي
          </span>
          <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772]">
            اللاعب ${currentIndex + 1} من ${players.length}
          </span>
        </div>

        ${!isRevealed ? `
          <div class="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/30 shadow-2xl">
            <div class="space-y-2">
              <span class="text-xs font-extrabold text-[#E5B91A] uppercase tracking-wider flex items-center justify-center gap-1">سلّم الموبايل لـ:</span>
              <h2 class="text-4xl font-black text-[#F4F0E8]">${currentPlayer?.name}</h2>
            </div>
            <div class="p-4 rounded-2xl bg-[#1B0E19] border border-white/5 space-y-1">
              <p class="text-xs text-[#F4F0E8]/70">تأكد إن باقي الشلة مش باصين في الموبايل!</p>
            </div>
            <button id="btn-reveal-one" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
              <span class="text-[#E5B91A]">${ICONS.Eye}</span> <span>أنا ${currentPlayer?.name} - إظهار دوري</span>
            </button>
          </div>
        ` : `
          <div class="my-auto space-y-6">
            ${!isImposter ? `
              <div class="glass-panel p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 bg-gradient-to-b from-[#1B0E19] to-[#2A102E]">
                <div class="space-y-1">
                  <span class="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">${ICONS.Sparkles} إنت لاعب عادي</span>
                  <h3 class="text-sm font-bold text-[#F4F0E8]/70">الكلمة السرية هي:</h3>
                </div>
                <div class="p-6 rounded-2xl bg-[#120A12] border border-emerald-500/30 shadow-inner">
                  <span class="text-4xl font-black text-[#E5B91A] text-glow-yellow block">${secretWord}</span>
                </div>
                <p class="text-xs font-bold text-[#F4F0E8]/80 flex items-center justify-center gap-1">${ICONS.Lock} احفظ الكلمة في سرّك ومتفضحناش</p>
                <button id="btn-pass-one" class="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                  <span>إخفاء الدور والتمرير للي بعدي</span>
                </button>
              </div>
            ` : `
              <div class="glass-panel p-8 rounded-3xl border border-[#D92772] shadow-2xl space-y-6 bg-gradient-to-b from-[#2A102E] to-[#120A12]">
                <div class="space-y-2">
                  <h2 class="text-3xl font-black text-[#D92772] flex items-center justify-center gap-2">
                    <span class="text-[#D92772]">${ICONS.Zap}</span> إنت الـ IMPOSTER
                  </h2>
                </div>
                <div class="p-5 rounded-2xl bg-[#1B0E19] border border-[#D92772]/40 text-right space-y-2">
                  <p class="text-sm font-extrabold text-[#E5B91A]">ملكش كلمة!</p>
                  <p class="text-xs font-semibold text-[#F4F0E8]/80 leading-relaxed">ركز في تلميحات الشلة وحاول تفهم الكلمة من كلامهم من غير ما يشكوا فيك!</p>
                </div>
                <button id="btn-pass-one" class="w-full py-4 rounded-2xl bg-[#D92772] hover:bg-[#b01e5b] font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                  <span>إخفاء الدور والتمرير للي بعدي</span>
                </button>
              </div>
            `}
          </div>
        `}
      </div>
    `;

    const btnRevealOne = document.getElementById('btn-reveal-one');
    if (btnRevealOne) {
      btnRevealOne.onclick = () => {
        soundManager.playTap();
        if (isImposter) soundManager.playImposterAlert();
        else soundManager.playRoleReveal();
        isRevealed = true;
        render();
      };
    }

    const btnPassOne = document.getElementById('btn-pass-one');
    if (btnPassOne) {
      btnPassOne.onclick = () => {
        soundManager.playTap();
        isRevealed = false;
        if (currentIndex < players.length - 1) {
          currentIndex++;
        } else {
          allFinished = true;
        }
        render();
      };
    }
  };

  render();
}
