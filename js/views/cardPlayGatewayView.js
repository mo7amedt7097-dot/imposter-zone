import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderCardPlayGatewayView(container, state, navigate) {
  let selectedType = null;

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
            <span class="text-[#E5B91A]">${ICONS.QrCode}</span>
            <span>بوابة الكروت</span>
          </span>
        </div>

        ${!selectedType ? `
          <div class="my-auto space-y-6">
            <div class="text-center space-y-2">
              <h2 class="text-3xl font-black text-[#F4F0E8]">هتلعبوا إزاي؟</h2>
              <p class="text-xs font-bold text-[#F4F0E8]/70">اختار طريق اللعب المناسب لشلتكم دلوقتي</p>
            </div>

            <div class="space-y-4">
              <div id="type-cards" class="glass-card p-6 rounded-3xl border border-[#E5B91A]/40 text-right cursor-pointer group hover:border-[#E5B91A] active:scale-95 transition-all">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-2xl font-black text-[#F4F0E8] group-hover:text-[#E5B91A] transition-colors flex items-center gap-2">
                    <span class="text-[#E5B91A]">${ICONS.QrCode}</span>
                    <span>مع الكروت</span>
                  </h3>
                  <span class="text-xs font-black text-[#E5B91A] bg-[#E5B91A]/10 px-2.5 py-1 rounded-full border border-[#E5B91A]/30">كروت فيزيائية</span>
                </div>
                <p class="text-xs font-semibold text-[#F4F0E8]/70">معاكم علبة وكروت IMPOSTER وبياخدوا الموبايل للمساعد الرقمي والتصويت</p>
              </div>

              <div id="type-digital" class="glass-card p-6 rounded-3xl border border-[#D92772]/40 text-right cursor-pointer group hover:border-[#D92772] active:scale-95 transition-all">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-2xl font-black text-[#F4F0E8] group-hover:text-[#D92772] transition-colors flex items-center gap-2">
                    <span class="text-[#D92772]">${ICONS.Sparkles}</span>
                    <span>بدون كروت</span>
                  </h3>
                  <span class="text-xs font-black text-[#D92772] bg-[#D92772]/10 px-2.5 py-1 rounded-full border border-[#D92772]/30">ديجيتال 100%</span>
                </div>
                <p class="text-xs font-semibold text-[#F4F0E8]/70">المرجع الكامل، الكلمات السرية، الأدوار والتصويت كله داخل الأبلكيشن</p>
              </div>
            </div>
          </div>
        ` : `
          <div class="my-auto space-y-6">
            <div class="text-center space-y-2">
              <h2 class="text-3xl font-black text-[#F4F0E8]">عندكم جروب؟</h2>
              <p class="text-xs font-bold text-[#F4F0E8]/70">تقدر تلعب فوراً أو تنشئ جروب للشلة</p>
            </div>

            <div class="space-y-3">
              <button id="btn-gateway-quick" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] via-[#4A1E55] to-[#D92772] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                <span class="text-[#E5B91A]">${ICONS.Zap}</span>
                <span>لعب سريع بدون حفظ</span>
              </button>

              <button id="btn-gateway-create" class="w-full py-3.5 rounded-2xl bg-[#2A102E] hover:bg-[#4A1E55] border border-[#D92772]/40 font-black text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                <span class="text-[#E5B91A]">${ICONS.PlusCircle}</span>
                <span>إنشاء جروب جديد</span>
              </button>

              <button id="btn-gateway-join" class="w-full py-3.5 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-sm text-[#F4F0E8] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                <span class="text-[#D92772]">${ICONS.LogIn}</span>
                <span>انضم لجروب موجود</span>
              </button>
            </div>
          </div>
        `}
      </div>
    `;

    document.getElementById('btn-back-home').onclick = () => {
      soundManager.playTap();
      navigate('HOME');
    };

    const typeCards = document.getElementById('type-cards');
    if (typeCards) {
      typeCards.onclick = () => {
        soundManager.playTap();
        selectedType = 'CARDS';
        render();
      };
    }

    const typeDigital = document.getElementById('type-digital');
    if (typeDigital) {
      typeDigital.onclick = () => {
        soundManager.playTap();
        navigate('HOME');
      };
    }

    const gQuick = document.getElementById('btn-gateway-quick');
    if (gQuick) gQuick.onclick = () => { soundManager.playTap(); navigate('QUICK_GAME'); };

    const gCreate = document.getElementById('btn-gateway-create');
    if (gCreate) gCreate.onclick = () => { soundManager.playTap(); navigate('CREATE_GROUP'); };

    const gJoin = document.getElementById('btn-gateway-join');
    if (gJoin) gJoin.onclick = () => { soundManager.playTap(); navigate('JOIN_GROUP'); };
  };

  render();
}
