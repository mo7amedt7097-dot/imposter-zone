import { ICONS } from './icons.js';
import { soundManager } from '../sound.js';

export function renderSettingsModal(container, state, onClose, onEditGroup, onResetAll) {
  let soundEnabled = state.soundEnabled;
  let vibrationEnabled = state.vibrationEnabled;
  let timerEnabled = state.timerEnabled;
  const isHost = true;
  let confirmResetAll = false;

  const render = () => {
    container.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div class="w-full max-w-sm glass-panel rounded-3xl p-6 relative border border-[#D92772]/40 shadow-2xl text-[#F4F0E8] bg-gradient-to-b from-[#2A102E] to-[#120A12]">
          <div class="flex items-center justify-between pb-4 border-b border-[#D92772]/20 mb-5">
            <h2 class="text-xl font-black flex items-center gap-2 text-[#E5B91A]">
              ${ICONS.Settings} الإعدادات
            </h2>
            <button id="btn-close-settings" class="w-8 h-8 rounded-full bg-[#2A102E] flex items-center justify-center text-[#F4F0E8]/70 hover:text-white cursor-pointer">
              ${ICONS.X}
            </button>
          </div>

          <div class="space-y-4">
            <!-- Sound Toggle -->
            <div class="flex items-center justify-between p-3 rounded-2xl bg-[#1B0E19] border border-white/5">
              <div class="flex items-center gap-3">
                <span class="text-[#E5B91A]">${soundEnabled ? ICONS.Volume2 : ICONS.VolumeX}</span>
                <span class="font-semibold text-sm">المؤثرات الصوتية</span>
              </div>
              <button id="btn-toggle-sound" class="w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${soundEnabled ? 'bg-[#D92772]' : 'bg-gray-700'}">
                <div class="w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-[-24px]' : 'translate-x-0'}"></div>
              </button>
            </div>

            <!-- Vibration Toggle -->
            <div class="flex items-center justify-between p-3 rounded-2xl bg-[#1B0E19] border border-white/5">
              <div class="flex items-center gap-3">
                <span class="text-[#D92772]">${ICONS.Vibrate}</span>
                <span class="font-semibold text-sm">الاهتزاز والتفاعل</span>
              </div>
              <button id="btn-toggle-vib" class="w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${vibrationEnabled ? 'bg-[#D92772]' : 'bg-gray-700'}">
                <div class="w-4 h-4 rounded-full bg-white transition-transform ${vibrationEnabled ? 'translate-x-[-24px]' : 'translate-x-0'}"></div>
              </button>
            </div>

            <!-- Timer Toggle -->
            <div class="flex items-center justify-between p-3 rounded-2xl bg-[#1B0E19] border border-white/5">
              <div class="flex items-center gap-3">
                <span class="text-purple-400">${ICONS.Zap}</span>
                <span class="font-semibold text-sm">مؤقت التلميحات</span>
              </div>
              <button id="btn-toggle-timer" class="w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${timerEnabled ? 'bg-[#D92772]' : 'bg-gray-700'}">
                <div class="w-4 h-4 rounded-full bg-white transition-transform ${timerEnabled ? 'translate-x-[-24px]' : 'translate-x-0'}"></div>
              </button>
            </div>

            <!-- Action Buttons -->
            <div class="pt-2 space-y-2">
              <button id="btn-settings-edit-group" class="w-full py-3 px-4 rounded-2xl bg-[#2A102E] hover:bg-[#4A1E55] border border-[#D92772]/30 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all text-[#E5B91A] cursor-pointer">
                ${ICONS.Users}
                تعديل أسماء الشلة
              </button>

              <button id="btn-settings-reset-all" class="w-full py-3 px-4 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all bg-red-950/40 hover:bg-red-900/60 border-red-500/30 text-red-400 active:scale-95 cursor-pointer">
                ${ICONS.Trash}
                مسح كل حاجة من الأول
              </button>
            </div>
          </div>
        </div>

        ${confirmResetAll ? `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
            <div class="glass-panel p-6 rounded-3xl border border-red-500/40 shadow-2xl max-w-xs w-full text-center space-y-4 bg-gradient-to-b from-[#2A102E] to-[#120A12]">
              <div class="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
                ${ICONS.Trash}
              </div>
              <div class="space-y-1">
                <h3 class="text-lg font-black text-[#F4F0E8]">أكيد عاوز تمسح كل حاجة من الأول؟</h3>
                <p class="text-xs font-bold text-[#F4F0E8]/70 leading-relaxed">سيتم إعادة اللعبة لحالتها الإفتراضية كأنها جديدة!</p>
              </div>
              <div class="grid grid-cols-2 gap-3 pt-2">
                <button id="btn-cancel-reset" class="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F4F0E8] font-extrabold text-xs cursor-pointer">إلغاء</button>
                <button id="btn-confirm-reset" class="py-2.5 px-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1 cursor-pointer">
                  ${ICONS.Trash} <span>تأكيد</span>
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById('btn-close-settings').onclick = () => {
      soundManager.playTap();
      container.innerHTML = '';
      if (onClose) onClose();
    };

    document.getElementById('btn-toggle-sound').onclick = () => {
      soundEnabled = !soundEnabled;
      soundManager.setEnabled(soundEnabled, vibrationEnabled);
      if (soundEnabled) soundManager.playTap();
      render();
    };

    document.getElementById('btn-toggle-vib').onclick = () => {
      soundManager.playTap();
      vibrationEnabled = !vibrationEnabled;
      soundManager.setEnabled(soundEnabled, vibrationEnabled);
      render();
    };

    document.getElementById('btn-toggle-timer').onclick = () => {
      soundManager.playTap();
      timerEnabled = !timerEnabled;
      render();
    };

    document.getElementById('btn-settings-edit-group').onclick = () => {
      soundManager.playTap();
      container.innerHTML = '';
      if (onClose) onClose();
      if (onEditGroup) onEditGroup();
    };

    document.getElementById('btn-settings-reset-all').onclick = () => {
      soundManager.playTap();
      confirmResetAll = true;
      render();
    };

    const cancelReset = document.getElementById('btn-cancel-reset');
    if (cancelReset) {
      cancelReset.onclick = () => {
        confirmResetAll = false;
        render();
      };
    }

    const confirmReset = document.getElementById('btn-confirm-reset');
    if (confirmReset) {
      confirmReset.onclick = () => {
        soundManager.playTap();
        confirmResetAll = false;
        container.innerHTML = '';
        if (onClose) onClose();
        if (onResetAll) onResetAll();
      };
    }
  };

  render();
}

export function renderEditGroupModal(container, state, onClose, onSaveGroup) {
  const group = state.activeGroup;
  let groupName = group?.name || 'WANTED';
  let players = group?.players ? [...group.players] : [];
  let errorMsg = '';

  const render = () => {
    container.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="w-full max-w-md glass-panel rounded-3xl p-6 relative border border-[#D92772]/40 shadow-2xl text-[#F4F0E8] max-h-[90vh] flex flex-col bg-gradient-to-b from-[#2A102E] to-[#120A12]">
          <div class="flex items-center justify-between pb-4 border-b border-[#D92772]/20 mb-4 shrink-0">
            <h2 class="text-xl font-black flex items-center gap-2 text-[#E5B91A]">
              <span class="text-[#D92772]">${ICONS.Users}</span>
              تعديل أسماء الشلة
            </h2>
            <button id="btn-close-edit-group" class="w-8 h-8 rounded-full bg-[#2A102E] flex items-center justify-center text-[#F4F0E8]/70 hover:text-white cursor-pointer">
              ${ICONS.X}
            </button>
          </div>

          <div class="space-y-4 overflow-y-auto pr-1 flex-1">
            <div>
              <label class="block text-xs font-bold text-[#F4F0E8]/70 mb-1.5">اسم الشلة</label>
              <input
                id="input-edit-group-name"
                type="text"
                value="${groupName}"
                placeholder="أدخل اسم الشلة"
                class="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-[#D92772]/30 text-[#F4F0E8] font-extrabold focus:outline-none focus:border-[#D92772]"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold text-[#F4F0E8]/70">الاعيبة (${players.length})</label>
                <button id="btn-add-player-edit" type="button" class="px-3 py-1.5 rounded-xl bg-[#D92772]/20 border border-[#D92772]/50 text-[#D92772] font-black text-xs flex items-center gap-1.5 active:scale-95 transition-all hover:bg-[#D92772]/30 cursor-pointer">
                  ${ICONS.Users} زود حد
                </button>
              </div>

              <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
                ${players.map((player, idx) => `
                  <div class="flex items-center gap-2 p-2 rounded-2xl bg-[#1B0E19] border border-white/5">
                    <span class="w-6 h-6 rounded-lg bg-[#2A102E] text-xs font-black flex items-center justify-center text-[#E5B91A]">
                      ${idx + 1}
                    </span>
                    <input
                      type="text"
                      data-id="${player.id}"
                      value="${player.name}"
                      placeholder="غيّر الاسم"
                      class="input-player-edit-name flex-1 px-3 py-2 rounded-xl bg-[#120A12] border border-white/10 text-sm font-bold text-[#F4F0E8] focus:outline-none focus:border-[#D92772]"
                    />
                    <button
                      type="button"
                      data-id="${player.id}"
                      ${players.length <= 3 ? 'disabled' : ''}
                      class="btn-remove-player-edit w-9 h-9 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/20 flex items-center justify-center text-red-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all cursor-pointer"
                    >
                      ${ICONS.Trash}
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            ${errorMsg ? `<div class="p-3 rounded-xl bg-red-900/40 border border-red-500/40 text-red-300 font-bold text-xs text-center">${errorMsg}</div>` : ''}
          </div>

          <div class="pt-4 border-t border-[#D92772]/20 mt-3 shrink-0">
            <button id="btn-save-edit-group" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-base text-white shadow-lg shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
              <span class="text-[#E5B91A]">${ICONS.Check}</span>
              تمام كده
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-close-edit-group').onclick = () => {
      soundManager.playTap();
      container.innerHTML = '';
      if (onClose) onClose();
    };

    document.getElementById('btn-add-player-edit').onclick = () => {
      soundManager.playTap();
      if (players.length >= 12) {
        errorMsg = 'أخّرنا 12 لعيب عشان متبقاش زحمة أوي!';
        render();
        return;
      }
      const newId = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      players.push({ id: newId, name: `لاعب ${players.length + 1}` });
      errorMsg = '';
      render();
    };

    container.querySelectorAll('.input-player-edit-name').forEach(input => {
      input.oninput = (e) => {
        const id = input.getAttribute('data-id');
        const p = players.find(x => x.id === id);
        if (p) p.name = e.target.value;
      };
    });

    container.querySelectorAll('.btn-remove-player-edit').forEach(btn => {
      btn.onclick = () => {
        soundManager.playTap();
        const id = btn.getAttribute('data-id');
        if (players.length <= 3) {
          errorMsg = 'الحد الأدنى 3 لاعيبين يا نجم!';
          render();
          return;
        }
        players = players.filter(p => p.id !== id);
        errorMsg = '';
        render();
      };
    });

    document.getElementById('btn-save-edit-group').onclick = () => {
      soundManager.playTap();
      const gName = document.getElementById('input-edit-group-name').value.trim() || 'WANTED';
      const cleanedPlayers = players.map(p => ({
        ...p,
        name: p.name.trim() || 'لاعب مجهول'
      }));

      if (cleanedPlayers.length < 3) {
        errorMsg = 'لازم على الأقل 3 لاعيبين!';
        render();
        return;
      }

      const updatedScores = { ...(group?.scores || {}) };
      cleanedPlayers.forEach((p) => {
        if (updatedScores[p.id] === undefined) {
          updatedScores[p.id] = 0;
        }
      });

      if (onSaveGroup) {
        onSaveGroup({
          ...group,
          name: gName,
          players: cleanedPlayers,
          scores: updatedScores
        });
      }
      container.innerHTML = '';
      if (onClose) onClose();
    };
  };

  render();
}
