import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderGameModeSelectView(container, state, navigate, onSelectGameMode, onBack) {
  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto h-full">
      <!-- Header back button -->
      <div class="flex items-center justify-between mb-4">
        <button id="btn-back-lobby" class="p-2.5 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1 text-xs font-bold cursor-pointer">
          <span class="text-[#E5B91A]">${ICONS.ArrowRight}</span>
          اللوبي
        </button>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] flex items-center gap-1">
          <span class="text-[#D92772]">${ICONS.Zap}</span>
          <span>طريقة اللعب</span>
        </span>
      </div>

      <div class="space-y-2 my-2">
        <h2 class="text-3xl font-black text-[#F4F0E8]">
          هتلعبوا إزاي؟
        </h2>
        <p class="text-xs font-bold text-[#F4F0E8]/70">
          اختار هل كل اللعيبة على موبايل واحد ولا كل واحد من موبايله
        </p>
      </div>

      <div class="space-y-4 my-auto">
        <!-- Option 1: One Phone / Pass & Play -->
        <div id="mode-one-phone" class="glass-card p-6 rounded-3xl border border-[#D92772]/40 text-right cursor-pointer group hover:border-[#D92772] active:scale-95 transition-all">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
              <span class="text-[#D92772]">${ICONS.Zap}</span>
              <span>هاتف واحد</span>
            </h3>
            <span class="px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] font-black text-xs">
              Pass & Play
            </span>
          </div>
          <p class="text-sm font-semibold text-[#F4F0E8]/70">
            مرروا الموبايل بينكم.. كل واحد يتأكد من دوره في السر وينقل للي بعده
          </p>
        </div>

        <!-- Option 2: Multi Phone / Realtime -->
        <div id="mode-multi-phone" class="glass-card p-6 rounded-3xl border border-[#E5B91A]/40 text-right cursor-pointer group hover:border-[#E5B91A] active:scale-95 transition-all">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
              <span class="text-[#E5B91A]">${ICONS.Users}</span>
              <span>عدة هواتف</span>
            </h3>
            <span class="px-3 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] font-black text-xs">
              Realtime Sync
            </span>
          </div>
          <p class="text-sm font-semibold text-[#F4F0E8]/70">
            كل واحد يلعب من موبايله الشخصي.. كل الشاشات متزامنة في نفس الوقت!
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-back-lobby').onclick = () => {
    soundManager.playTap();
    if (onBack) onBack();
  };

  document.getElementById('mode-one-phone').onclick = () => {
    soundManager.playTap();
    if (onSelectGameMode) onSelectGameMode('ONE_PHONE');
  };

  document.getElementById('mode-multi-phone').onclick = () => {
    soundManager.playTap();
    if (onSelectGameMode) onSelectGameMode('MULTI_PHONE');
  };
}
