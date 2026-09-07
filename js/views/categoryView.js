import { ICONS } from '../components/icons.js';
import { CATEGORIES, getRandomSecretWord } from '../dictionary.js';
import { soundManager } from '../sound.js';

export function renderCategoryView(container, state, navigate, onSelectCategory) {
  const categoriesList = Object.values(CATEGORIES);
  const recentWords = state.recentWords || [];

  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto h-full">
      <!-- Title -->
      <div class="text-center space-y-1 my-2">
        <h2 class="text-3xl font-black text-[#F4F0E8]">
          هنلعب في إيه؟
        </h2>
        <p class="text-xs font-semibold text-[#F4F0E8]/70">
          اختر الفئة وابدأ الجولة فوراً لجميع الأجهزة (100 كلمة لكل قسم)
        </p>
      </div>

      <!-- Category Cards -->
      <div class="space-y-3 my-auto py-2">
        ${categoriesList.map((cat) => {
          const iconSvg = ICONS[cat.iconName] || ICONS.Sparkles;
          return `
            <div
              data-cat-id="${cat.id}"
              class="btn-category-card glass-card p-4 rounded-3xl cursor-pointer border ${cat.borderColor} flex items-center justify-between group relative overflow-hidden active:scale-95 transition-all"
            >
              <div class="flex items-center gap-4 z-10">
                <div class="w-12 h-12 rounded-2xl bg-[#1B0E19] border border-white/10 flex items-center justify-center text-[#E5B91A]">
                  ${iconSvg}
                </div>
                <div class="text-right">
                  <h3 class="text-xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors">
                    ${cat.name}
                  </h3>
                  <p class="text-xs font-semibold text-[#F4F0E8]/70 mt-0.5">
                    ${cat.subtitle}
                  </p>
                </div>
              </div>

              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black group-hover:bg-[#D92772] group-hover:text-white transition-colors z-10">
                ${ICONS.ArrowLeft}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.btn-category-card').forEach(card => {
    card.onclick = () => {
      soundManager.playTap();
      const catId = card.getAttribute('data-cat-id');
      const wordObj = getRandomSecretWord(catId, recentWords);
      if (onSelectCategory) onSelectCategory(catId, wordObj);
    };
  });
}
