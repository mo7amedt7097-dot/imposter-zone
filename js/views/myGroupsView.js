import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderMyGroupsView(container, state, navigate, onSelectGroup, onEditGroup, onDeleteGroup) {
  const groups = state.savedGroups || [];
  const currentUserId = state.user?.id;
  const scores = state.scores || {};

  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto h-full">
      <!-- Header back button -->
      <div class="flex items-center justify-between mb-4">
        <button id="btn-back-home" class="p-2.5 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1.5 text-xs font-bold cursor-pointer">
          <span class="text-[#E5B91A]">${ICONS.ArrowRight}</span>
          الرئيسية
        </button>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] flex items-center gap-1.5">
          ${ICONS.Users}
          جروباتي
        </span>
      </div>

      <div class="space-y-4 my-auto">
        <div class="text-center space-y-1">
          <h2 class="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
            <span class="text-[#D92772]">${ICONS.Users}</span>
            جروباتي المفضلة
          </h2>
          <p class="text-xs font-medium text-[#F4F0E8]/70">
            اختر الشلة اللي عاوز تلعب معاها أو امسح الجروبات القديمة
          </p>
        </div>

        ${groups.length === 0 ? `
          <div class="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-[#4A1E55] flex items-center justify-center mx-auto text-[#E5B91A]">
              ${ICONS.Users}
            </div>
            <p class="text-sm font-bold text-[#F4F0E8]/70">
              لسه ما انضميتش لأي جروب.. اعمل جروب جديد أو انضم بكود الشلة!
            </p>
          </div>
        ` : `
          <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            ${groups.map((group) => {
              const isHost = group.hostUserId === currentUserId;
              return `
                <div class="glass-card p-5 rounded-3xl border border-[#D92772]/30 space-y-3 text-right relative group">
                  <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div>
                      <h3 class="text-xl font-black text-[#F4F0E8] flex items-center gap-2">
                        <span class="text-[#D92772]">${ICONS.Users}</span> ${group.name}
                        ${isHost ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] font-extrabold flex items-center gap-1">${ICONS.Crown} HOST</span>` : ''}
                      </h3>

                      <button class="btn-copy-code mt-1 px-2.5 py-1 rounded-xl bg-[#1B0E19] border border-[#D92772]/40 text-[#E5B91A] text-xs font-mono font-black flex items-center gap-1.5 hover:border-[#E5B91A] transition-colors cursor-pointer" data-code="${group.code}">
                        <span>GROUP ID: ${group.code}</span>
                        ${ICONS.Sparkles}
                      </button>
                    </div>

                    <div class="flex flex-col items-end gap-2">
                      <span class="px-3 py-1 rounded-xl bg-[#4A1E55] text-xs font-black text-[#E5B91A]">
                        ${(group.players || []).length} لاعبين
                      </span>

                      <button class="btn-delete-group p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/30 text-red-400 text-xs flex items-center gap-1 transition-all cursor-pointer" data-code="${group.code}" data-name="${group.name}">
                        ${ICONS.Trash}
                        <span>مسح</span>
                      </button>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-1.5">
                    ${(group.players || []).map((p) => {
                      const pScore = (group?.scores && group.scores[p.id]) || scores[p.id] || 0;
                      return `
                        <span class="text-xs font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1 ${p.id === group.hostUserId ? 'bg-[#E5B91A]/10 border-[#E5B91A]/30 text-[#E5B91A]' : 'bg-[#1B0E19] border-white/5 text-[#F4F0E8]/80'}">
                          ${p.name} ${p.id === group.hostUserId ? ICONS.Crown : ''}
                          <span class="text-[#E5B91A] font-black text-[11px] flex items-center gap-0.5">
                            (${ICONS.Trophy} ${pScore})
                          </span>
                        </span>
                      `;
                    }).join('')}
                  </div>

                  <div class="grid grid-cols-2 gap-2 pt-1">
                    <button class="btn-play-group py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-sm text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-[#D92772]/20 cursor-pointer" data-code="${group.code}">
                      <span class="text-[#E5B91A]">${ICONS.Zap}</span>
                      العب
                    </button>

                    ${isHost ? `
                      <button class="btn-edit-group py-3 px-4 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-sm text-[#F4F0E8] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" data-code="${group.code}">
                        <span class="text-[#E5B91A]">${ICONS.Edit}</span>
                        تعديل
                      </button>
                    ` : `
                      <div class="py-3 px-4 rounded-2xl bg-[#1B0E19]/40 border border-white/5 font-bold text-xs text-[#F4F0E8]/40 flex items-center justify-center gap-1">
                        عضو بالجروب
                      </div>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

      <!-- Bottom Actions -->
      <div class="pt-4 space-y-2 mt-auto">
        <button id="btn-[#create-group-bottom]" class="btn-new-group w-full py-3.5 rounded-2xl bg-[#2A102E] hover:bg-[#4A1E55] border border-[#D92772]/40 font-black text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
          <span class="text-[#E5B91A]">${ICONS.PlusCircle}</span>
          إنشاء جروب جديد
        </button>

        <button id="btn-[#join-group-bottom]" class="btn-join-group-bottom w-full py-3.5 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
          <span class="text-[#D92772]">${ICONS.LogIn}</span>
          دخول لجروب بكود
        </button>
      </div>

      <div id="modal-delete-container"></div>
    </div>
  `;

  // Attach Event Listeners
  document.getElementById('btn-back-home').onclick = () => {
    soundManager.playTap();
    navigate('HOME');
  };

  const newGroupBtn = container.querySelector('.btn-new-group');
  if (newGroupBtn) {
    newGroupBtn.onclick = () => {
      soundManager.playTap();
      navigate('CREATE_GROUP');
    };
  }

  const joinGroupBtn = container.querySelector('.btn-join-group-bottom');
  if (joinGroupBtn) {
    joinGroupBtn.onclick = () => {
      soundManager.playTap();
      navigate('JOIN_GROUP');
    };
  }

  container.querySelectorAll('.btn-play-group').forEach(btn => {
    btn.onclick = () => {
      soundManager.playTap();
      const code = btn.getAttribute('data-code');
      const targetGroup = groups.find(g => g.code === code);
      if (targetGroup && onSelectGroup) onSelectGroup(targetGroup);
    };
  });

  container.querySelectorAll('.btn-edit-group').forEach(btn => {
    btn.onclick = () => {
      soundManager.playTap();
      const code = btn.getAttribute('data-code');
      const targetGroup = groups.find(g => g.code === code);
      if (targetGroup && onEditGroup) onEditGroup(targetGroup);
    };
  });

  container.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      soundManager.playTap();
      const code = btn.getAttribute('data-code');
      if (code && navigator.clipboard) {
        navigator.clipboard.writeText(code);
        btn.innerHTML = `<span>تم النسخ!</span> ${ICONS.Check}`;
        setTimeout(() => {
          btn.innerHTML = `<span>GROUP ID: ${code}</span> ${ICONS.Sparkles}`;
        }, 2000);
      }
    };
  });

  container.querySelectorAll('.btn-delete-group').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      soundManager.playTap();
      const code = btn.getAttribute('data-code');
      const name = btn.getAttribute('data-name');
      
      const modalContainer = document.getElementById('modal-delete-container');
      modalContainer.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div class="glass-panel p-6 rounded-3xl border border-red-500/40 shadow-2xl max-w-sm w-full text-center space-y-4 bg-gradient-to-b from-[#2A102E] to-[#120A12]">
            <div class="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
              ${ICONS.Trash}
            </div>
            <div class="space-y-1">
              <h3 class="text-xl font-black text-[#F4F0E8]">حذف جروب "${name}"؟</h3>
              <p class="text-xs font-bold text-[#F4F0E8]/70 leading-relaxed">
                مسح الجروب هيطلعك منه وهيتحذف من قائمتك!
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-2">
              <button id="btn-cancel-delete" class="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F4F0E8] font-extrabold text-xs cursor-pointer">إلغاء</button>
              <button id="btn-confirm-delete" class="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1 cursor-pointer">
                ${ICONS.Trash} <span>تأكيد الحذف</span>
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btn-cancel-delete').onclick = () => {
        modalContainer.innerHTML = '';
      };
      document.getElementById('btn-confirm-delete').onclick = () => {
        soundManager.playTap();
        if (onDeleteGroup) onDeleteGroup(code);
        modalContainer.innerHTML = '';
      };
    };
  });
}
