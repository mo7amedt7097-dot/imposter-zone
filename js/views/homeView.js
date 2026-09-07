import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderHomeView(container, state, navigate) {
  const savedGroupsCount = (state.savedGroups || []).length;

  container.innerHTML = `
    <div className="flex-1 flex flex-col items-center justify-between px-4 py-6 max-w-md mx-auto w-full text-center relative overflow-hidden h-full flex flex-col justify-between">
      <!-- Floating Background Deco -->
      <div class="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div class="absolute top-10 right-8 text-[#D92772] animate-bounce">${ICONS.Utensils}</div>
        <div class="absolute top-1/3 left-6 text-[#E5B91A] animate-pulse">${ICONS.Film}</div>
        <div class="absolute bottom-1/3 right-10 text-emerald-400 animate-bounce">${ICONS.Trophy}</div>
        <div class="absolute bottom-20 left-10 text-purple-400 animate-pulse">${ICONS.Sparkles}</div>
      </div>

      <!-- Main Brand Title Section -->
      <div class="my-auto space-y-3 z-10 w-full pt-4">
        <div class="inline-block">
          <span class="px-4 py-1.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5 mx-auto">
            ${ICONS.Sparkles}
            لعبة الشلة الأولى في مصر
          </span>
        </div>

        <h1 class="text-6xl font-black tracking-tighter text-[#F4F0E8] drop-shadow-2xl">
          IMPOSTER
        </h1>

        <p class="text-2xl font-extrabold text-[#E5B91A] flex items-center justify-center gap-2">
          <span>مين فيكم مش عارف؟</span>
          <span class="text-[#D92772] animate-pulse">${ICONS.Flame}</span>
        </p>

        <p class="text-xs font-semibold text-[#F4F0E8]/70 max-w-xs mx-auto leading-relaxed">
          موبايل واحد أو عدة هواتف • شلة واحدة • شك في الكل
        </p>
      </div>

      <!-- Entry Actions Menu -->
      <div class="w-full space-y-3 z-10 mt-auto pb-4">
        <!-- Quick Game Button -->
        <button id="btn-quick-game" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] via-[#4A1E55] to-[#D92772] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
          <span class="text-[#E5B91A]">${ICONS.Zap}</span>
          لعب سريع
        </button>

        <div class="grid grid-cols-2 gap-2.5">
          <!-- My Groups -->
          <button id="btn-my-groups" class="py-3.5 px-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-extrabold text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all relative cursor-pointer">
            <span class="text-[#E5B91A]">${ICONS.Users}</span>
            جروباتي
            ${savedGroupsCount > 0 ? `<span class="w-5 h-5 rounded-full bg-[#D92772] text-[10px] font-black text-white flex items-center justify-center">${savedGroupsCount}</span>` : ''}
          </button>

          <!-- Join Group -->
          <button id="btn-join-group" class="py-3.5 px-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-extrabold text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
            <span class="text-[#D92772]">${ICONS.LogIn}</span>
            دخول لجروب
          </button>
        </div>

        <!-- Create Group -->
        <button id="btn-create-group" class="w-full py-3.5 rounded-2xl bg-[#2A102E] hover:bg-[#4A1E55] border border-[#D92772]/40 font-black text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
          <span class="text-[#E5B91A]">${ICONS.PlusCircle}</span>
          إنشاء جروب جديد
        </button>

        <!-- Card Play Gateway -->
        <button id="btn-card-gateway" class="w-full py-2 text-xs font-bold text-[#F4F0E8]/50 hover:text-[#E5B91A] flex items-center justify-center gap-1.5 transition-colors pt-1 cursor-pointer">
          ${ICONS.QrCode}
          لعب بالكروت (سكان QR)
        </button>
      </div>
    </div>
  `;

  // Attach Event Listeners
  document.getElementById('btn-quick-game').onclick = () => {
    soundManager.playTap();
    navigate('QUICK_GAME');
  };
  document.getElementById('btn-my-groups').onclick = () => {
    soundManager.playTap();
    navigate('MY_GROUPS');
  };
  document.getElementById('btn-join-group').onclick = () => {
    soundManager.playTap();
    navigate('JOIN_GROUP');
  };
  document.getElementById('btn-create-group').onclick = () => {
    soundManager.playTap();
    navigate('CREATE_GROUP');
  };
  document.getElementById('btn-card-gateway').onclick = () => {
    soundManager.playTap();
    navigate('CARD_GATEWAY');
  };
}
