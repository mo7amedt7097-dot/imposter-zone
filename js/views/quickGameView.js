import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderQuickGameView(container, state, navigate, onStartQuickGame) {
  let players = [
    { id: 'q1', name: 'أحمد' },
    { id: 'q2', name: 'محمد' },
    { id: 'q3', name: 'علي' },
    { id: 'q4', name: 'عمر' },
    { id: 'q5', name: 'يوسف' },
    { id: 'q6', name: 'كريم' }
  ];
  let errorMsg = '';

  const render = () => {
    container.innerHTML = `
      <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto h-full">
        <!-- Header back button -->
        <div class="flex items-center justify-between mb-4">
          <button id="btn-back-home" class="p-2.5 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1 text-xs font-bold cursor-pointer">
            <span class="text-[#E5B91A]">${ICONS.ArrowRight}</span>
            الرئيسية
          </button>
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] flex items-center gap-1">
            <span class="text-[#E5B91A]">${ICONS.Zap}</span>
            <span>لعب سريع</span>
          </span>
        </div>

        <div class="space-y-4 my-auto">
          <div class="text-center space-y-1">
            <h2 class="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
              <span class="text-[#E5B91A]">${ICONS.Zap}</span>
              <span>لعب سريع</span>
            </h2>
            <p class="text-xs font-medium text-[#F4F0E8]/70">
              أدخل أسماء اللاعيبين وابدأ اللعبة فوراً (بدون حفظ الجروب)
            </p>
          </div>

          <form id="form-quick-game" class="space-y-4">
            <div class="glass-panel p-4 rounded-3xl border border-[#D92772]/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-[#F4F0E8]">
                  اللاعيبين (${players.length}/10)
                </span>
                <button
                  type="button"
                  id="btn-add-player"
                  class="px-3 py-1.5 rounded-xl bg-[#D92772]/20 border border-[#D92772]/50 text-[#D92772] font-black text-xs flex items-center gap-1 hover:bg-[#D92772]/30 active:scale-95 transition-all cursor-pointer"
                >
                  ${ICONS.Users}
                  زود حد
                </button>
              </div>

              <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
                ${players.map((player, idx) => `
                  <div class="flex items-center gap-2">
                    <span class="w-7 h-7 rounded-xl bg-[#2A102E] text-xs font-black flex items-center justify-center text-[#E5B91A] border border-[#D92772]/20">
                      ${idx + 1}
                    </span>
                    <input
                      type="text"
                      data-id="${player.id}"
                      value="${player.name}"
                      placeholder="اسم لاعب ${idx + 1}"
                      class="input-player-name flex-1 px-3.5 py-2.5 rounded-xl bg-[#1B0E19] border border-white/10 text-sm font-bold text-[#F4F0E8] focus:outline-none focus:border-[#D92772]"
                      required
                    />
                    <button
                      type="button"
                      data-id="${player.id}"
                      ${players.length <= 3 ? 'disabled' : ''}
                      class="btn-remove-player w-10 h-10 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 flex items-center justify-center text-red-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all cursor-pointer"
                    >
                      ${ICONS.Trash}
                    </button>
                  </div>
                `).join('')}
              </div>

              ${errorMsg ? `<p class="text-xs font-bold text-red-400 text-center bg-red-950/50 p-2 rounded-xl border border-red-500/30">${errorMsg}</p>` : ''}
            </div>

            <button
              type="submit"
              class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] via-[#4A1E55] to-[#D92772] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span class="text-[#E5B91A]">${ICONS.Zap}</span>
              <span>ابدأ اللعبة السريعة</span>
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('btn-back-home').onclick = () => {
      soundManager.playTap();
      navigate('HOME');
    };

    document.getElementById('btn-add-player').onclick = () => {
      soundManager.playTap();
      if (players.length >= 10) {
        errorMsg = 'أقصى عدد للاعيبين 10 لاعبين!';
        render();
        return;
      }
      const newId = 'q_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 4);
      players.push({ id: newId, name: `لاعب ${players.length + 1}` });
      errorMsg = '';
      render();
    };

    container.querySelectorAll('.input-player-name').forEach(input => {
      input.oninput = (e) => {
        const id = input.getAttribute('data-id');
        const player = players.find(p => p.id === id);
        if (player) player.name = e.target.value;
      };
    });

    container.querySelectorAll('.btn-remove-player').forEach(btn => {
      btn.onclick = () => {
        soundManager.playTap();
        const id = btn.getAttribute('data-id');
        if (players.length <= 3) {
          errorMsg = 'الحد الأدنى 3 لاعيبين!';
          render();
          return;
        }
        players = players.filter(p => p.id !== id);
        errorMsg = '';
        render();
      };
    });

    document.getElementById('form-quick-game').onsubmit = (e) => {
      e.preventDefault();
      soundManager.playTap();

      const cleanedPlayers = players.map(p => ({
        ...p,
        name: p.name.trim() || 'لاعب'
      }));

      if (cleanedPlayers.length < 3) {
        errorMsg = 'لازم 3 لاعيبين على الأقل!';
        render();
        return;
      }

      const quickGroup = {
        code: 'QUICK',
        name: 'لعب سريع',
        hostUserId: cleanedPlayers[0].id,
        players: cleanedPlayers,
        isQuick: true
      };

      if (onStartQuickGame) onStartQuickGame(quickGroup);
    };
  };

  render();
}
