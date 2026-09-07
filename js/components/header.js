import { ICONS } from './icons.js';
import { soundManager } from '../sound.js';

export function renderHeader(container, state, navigate, onOpenSettings, onBack) {
  const currentView = state.currentView;
  const isGameActive = ['GAME_MODE_SELECT', 'CATEGORY', 'IMPOSTER_COUNT', 'TRANSITION_COUNTDOWN', 'ROLE_REVEAL', 'CLUE_PHASE', 'PRIVATE_VOTING', 'DRAMATIC_REVEAL', 'FINAL_GUESS', 'ROUND_RESULTS', 'WINNER'].includes(currentView);
  const canGoBack = ['MY_GROUPS', 'CREATE_GROUP', 'JOIN_GROUP', 'QUICK_GAME', 'CARD_GATEWAY', 'LOBBY'].includes(currentView);
  const roomCode = state.activeGroup?.code;
  const groupName = state.activeGroup?.name;
  const playerCount = state.activeGroup?.players?.length;

  let copied = false;

  const render = () => {
    container.innerHTML = `
      <header class="w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between z-30 relative gap-2">
        <div class="flex items-center gap-2">
          ${isGameActive ? `
            <button id="btn-header-exit" class="px-3 py-1.5 rounded-2xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer">
              ${ICONS.LogOut}
              <span>خروج</span>
            </button>
          ` : canGoBack ? `
            <button id="btn-header-back" class="px-3 py-1.5 rounded-2xl glass-card flex items-center gap-1 text-xs font-extrabold text-[#F4F0E8] hover:border-[#D92772]/50 active:scale-95 transition-all cursor-pointer">
              <span class="text-[#E5B91A]">${ICONS.ArrowRight}</span>
              <span>رجوع</span>
            </button>
          ` : `
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D92772] to-[#E5B91A] flex items-center justify-center text-black text-base shadow-lg shadow-[#D92772]/20">
                ${ICONS.Sparkles}
              </div>
              <div>
                <h1 class="font-extrabold text-base leading-tight text-[#F4F0E8] flex items-center gap-1">IMPOSTER</h1>
                ${groupName ? `<p class="text-[11px] text-[#F4F0E8]/70 font-semibold truncate max-w-[110px]">${groupName} ${playerCount ? `(${playerCount})` : ''}</p>` : ''}
              </div>
            </div>
          `}
        </div>

        ${roomCode ? `
          <button id="btn-header-copy" class="px-3 py-1.5 rounded-2xl font-mono text-xs font-black flex items-center gap-1.5 border transition-all active:scale-95 cursor-pointer ${copied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#1B0E19] border-[#D92772]/40 text-[#E5B91A] hover:border-[#E5B91A]'}">
            <span class="tracking-wider">CODE: ${roomCode}</span>
            ${copied ? `<span class="text-[10px] bg-emerald-500 text-black font-black px-1.5 py-0.2 rounded">تم!</span>` : `<span class="text-[#D92772]">${ICONS.Sparkles}</span>`}
          </button>
        ` : ''}

        <button id="btn-header-settings" class="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-[#F4F0E8]/80 hover:text-[#F4F0E8] hover:border-[#D92772]/50 active:scale-95 transition-all shrink-0 cursor-pointer">
          ${ICONS.Settings}
        </button>
      </header>
    `;

    const btnBack = document.getElementById('btn-header-back');
    if (btnBack) btnBack.onclick = () => { soundManager.playTap(); if (onBack) onBack(); };

    const btnExit = document.getElementById('btn-header-exit');
    if (btnExit) btnExit.onclick = () => { soundManager.playTap(); if (onBack) onBack(); };

    const btnSettings = document.getElementById('btn-header-settings');
    if (btnSettings) btnSettings.onclick = () => { soundManager.playTap(); if (onOpenSettings) onOpenSettings(); };

    const btnCopy = document.getElementById('btn-header-copy');
    if (btnCopy) {
      btnCopy.onclick = () => {
        soundManager.playTap();
        if (roomCode && navigator.clipboard) {
          navigator.clipboard.writeText(roomCode);
          copied = true;
          render();
          setTimeout(() => { copied = false; render(); }, 2000);
        }
      };
    }
  };

  render();
}
