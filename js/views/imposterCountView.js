import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderImposterCountView(container, state, navigate, onSelectImposterCount) {
  const playerCount = state.activeGroup?.players?.length || 6;

  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-center px-4 py-6 max-w-md mx-auto w-full text-[#F4F0E8] text-center space-y-6 h-full">
      <div class="space-y-2">
        <span class="px-3.5 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] text-xs font-black inline-flex items-center justify-center gap-1 mx-auto">
          ${ICONS.Users}
          <span>عدد اللاعيبين ${playerCount}</span>
        </span>
        <h2 class="text-3xl font-black text-[#F4F0E8] drop-shadow-md">
          تحبوا تلعبوها إزاي؟
        </h2>
        <p class="text-xs font-bold text-[#F4F0E8]/70">
          بما إن عددكم أكتر من 6.. تقدروا تختاروا عدد الإمبوسترز
        </p>
      </div>

      <div class="space-y-4 my-auto">
        <!-- Option 1: 1 Imposter -->
        <div id="btn-count-1" class="glass-card p-6 rounded-3xl border border-[#D92772]/40 text-right cursor-pointer group hover:border-[#D92772] active:scale-95 transition-all">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
              <span class="text-[#D92772]">${ICONS.Zap}</span>
              <span>إمبوستر واحد</span>
            </h3>
            <span class="w-8 h-8 rounded-full bg-[#D92772]/20 flex items-center justify-center text-[#D92772] font-black text-sm">
              1
            </span>
          </div>
          <p class="text-sm font-semibold text-[#F4F0E8]/70">
            كلاسيك… واحد بس بيحاول ينجو
          </p>
        </div>

        <!-- Option 2: 2 Imposters -->
        <div id="btn-count-2" class="glass-card p-6 rounded-3xl border border-[#E5B91A]/40 text-right cursor-pointer group hover:border-[#E5B91A] active:scale-95 transition-all">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
              <span class="text-[#E5B91A]">${ICONS.Zap}</span>
              <span>إمبوسترين (2)</span>
            </h3>
            <span class="w-8 h-8 rounded-full bg-[#E5B91A]/20 flex items-center justify-center text-[#E5B91A] font-black text-sm">
              2
            </span>
          </div>
          <p class="text-sm font-semibold text-[#F4F0E8]/70">
            فوضى أكتر… وشك في الكل
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-count-1').onclick = () => {
    soundManager.playTap();
    if (onSelectImposterCount) onSelectImposterCount(1);
  };

  document.getElementById('btn-count-2').onclick = () => {
    soundManager.playTap();
    if (onSelectImposterCount) onSelectImposterCount(2);
  };
}
