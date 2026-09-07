import { ICONS } from '../components/icons.js';
import { generateRoomCode } from '../roomCode.js';
import { soundManager } from '../sound.js';

export function renderCreateGroupView(container, state, navigate, onCreateGroup) {
  const currentUser = state.user;
  let groupName = 'الشلة';
  let playerName = currentUser?.name || 'محمد';

  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto h-full">
      <!-- Header back button -->
      <div class="flex items-center justify-between mb-4">
        <button id="btn-back-home" class="p-2.5 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1 text-xs font-bold cursor-pointer">
          <span class="text-[#E5B91A]">${ICONS.ArrowRight}</span>
          الرئيسية
        </button>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] flex items-center gap-1">
          ${ICONS.Crown}
          انت الـ Host
        </span>
      </div>

      <div class="space-y-4 my-auto">
        <div class="text-center space-y-1">
          <h2 class="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
            <span class="text-[#D92772]">${ICONS.Sparkles}</span>
            إنشاء جروب جديد
          </h2>
          <p class="text-xs font-medium text-[#F4F0E8]/70">
            أدخل اسم الجروب واسمك عشان تبقى الأدمن بتاع الشلة
          </p>
        </div>

        <form id="form-create-group" class="space-y-4">
          <div class="glass-panel p-5 rounded-3xl border border-[#D92772]/30 space-y-4">
            <div>
              <label class="block text-xs font-extrabold text-[#E5B91A] mb-1.5 flex items-center gap-1.5">
                ${ICONS.Users}
                اسم الجروب
              </label>
              <input
                id="input-group-name"
                type="text"
                value="${groupName}"
                placeholder="مثلاً: الشلة"
                class="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-white/10 text-[#F4F0E8] font-black text-lg focus:outline-none focus:border-[#D92772]"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-extrabold text-[#F4F0E8]/80 mb-1.5 flex items-center gap-1.5">
                <span class="text-[#E5B91A]">${ICONS.Crown}</span>
                اسمك (الـ Host)
              </label>
              <input
                id="input-player-name"
                type="text"
                value="${playerName}"
                placeholder="مثلاً: محمد"
                class="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-white/10 text-[#F4F0E8] font-bold text-base focus:outline-none focus:border-[#D92772]"
                required
              />
            </div>

            <div id="error-msg-container"></div>
          </div>

          <button
            type="submit"
            class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span class="text-[#E5B91A]">${ICONS.Sparkles}</span>
            إنشاء الجروب ودخول اللوبي
          </button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('btn-back-home').onclick = () => {
    soundManager.playTap();
    navigate('HOME');
  };

  document.getElementById('form-create-group').onsubmit = (e) => {
    e.preventDefault();
    soundManager.playTap();

    const gName = document.getElementById('input-group-name').value.trim() || 'الشلة';
    const pName = document.getElementById('input-player-name').value.trim() || 'محمد';

    const userId = currentUser?.id || ('user_' + Date.now().toString(36));
    const roomCode = generateRoomCode();
    const newGroup = {
      code: roomCode,
      name: gName,
      hostUserId: userId,
      createdAt: Date.now(),
      players: [
        { id: userId, name: pName }
      ],
      scores: {
        [userId]: 0
      }
    };

    if (onCreateGroup) onCreateGroup(newGroup, pName);
  };
}
