import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderFinalGuessView(container, state, navigate, onGuessSubmit, onComplete) {
  const caughtImposterIds = state.caughtImposterIds || [];
  const imposterIds = state.imposterIds || [];
  const players = state.activeGroup?.players || [];
  const secretWordObj = state.secretWordObj || {};
  const gameMode = state.gameMode || 'ONE_PHONE';
  const currentUserId = state.user?.id;
  const guessResults = state.guessResults || {};
  const isMultiPhone = gameMode === 'MULTI_PHONE';

  let currentIndex = 0;
  let selectedWord = null;
  let isAnswered = false;
  let onePhoneStep = 'PRIVACY_HANDOFF';

  const imposterListToUse = (caughtImposterIds && caughtImposterIds.length > 0)
    ? caughtImposterIds
    : (imposterIds && imposterIds.length > 0 ? imposterIds : []);

  const choices = secretWordObj?.choices || [secretWordObj?.secretWord || 'كلمة', 'بيتزا', 'شاورما', 'كشري'];
  const correctWord = secretWordObj?.secretWord || '';

  const render = () => {
    const currentImposterId = imposterListToUse[currentIndex];
    const currentImposter = players.find((p) => String(p.id) === String(currentImposterId))
      || players.find((p) => imposterIds.includes(p.id))
      || players[0];

    if (!currentImposter) {
      container.innerHTML = `
        <div class="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto w-full text-[#F4F0E8] text-center h-full">
          <div class="glass-panel p-8 rounded-3xl border border-[#E5B91A]/40 shadow-2xl space-y-4 w-full bg-gradient-to-b from-[#2A102E] to-[#120A12]">
            <div class="w-16 h-16 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/50 flex items-center justify-center mx-auto text-[#E5B91A]">
              ${ICONS.Sparkles}
            </div>
            <h2 class="text-2xl font-black text-[#E5B91A]">جاري تجهيز نتائج الجولة...</h2>
            <p class="text-xs font-bold text-[#F4F0E8]/70">جاري الانتقال لحساب النقاط والترتيب!</p>
          </div>
        </div>
      `;
      return;
    }

    const isMyTurnToGuess = isMultiPhone
      ? Boolean(currentImposter?.id) && String(currentImposter.id) === String(currentUserId)
      : true;
    const hasGuessed = guessResults[currentImposter?.id] !== undefined;
    const isGuessCorrect = guessResults[currentImposter.id] === true;

    if (isMultiPhone) {
      container.innerHTML = `
        <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto h-full">
          <div class="flex items-center justify-between py-2 border-b border-white/10">
            <span class="text-xs font-bold text-[#E5B91A] flex items-center gap-1.5">
              ${ICONS.Sparkles} الفرصة الأخيرة
            </span>
            <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772]">
              (${currentIndex + 1} من ${imposterListToUse.length})
            </span>
          </div>

          ${isMyTurnToGuess ? `
            ${!isAnswered && !hasGuessed ? `
              <div class="my-auto space-y-4 w-full">
                <div class="space-y-1">
                  <span class="text-xs font-extrabold text-[#E5B91A] uppercase tracking-wider flex items-center justify-center gap-1">
                    دورك يا ${currentImposter.name}
                  </span>
                  <h2 class="text-2xl font-black text-[#F4F0E8]">لسه عندك فرصة تخمين الكلمة!</h2>
                  <p class="text-xs text-[#F4F0E8]/70">أمامك 4 خيارات.. اختار الكلمة الصح وكسب نقاط!</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  ${choices.map((word) => `
                    <button data-word="${word}" class="btn-choice-word p-5 rounded-2xl glass-card border border-white/10 hover:border-[#D92772] text-xl font-black text-[#F4F0E8] shadow-lg flex items-center justify-center min-h-[90px] cursor-pointer">
                      ${word}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : `
              <div class="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl">
                ${selectedWord === correctWord || isGuessCorrect ? `
                  <div class="space-y-3">
                    <h3 class="text-3xl font-black text-emerald-400">يا ابن اللعيبة</h3>
                    <p class="text-lg font-extrabold text-[#E5B91A]">عرفتها صح! (+3 نقاط)</p>
                  </div>
                ` : `
                  <div class="space-y-3">
                    <h3 class="text-3xl font-black text-red-400">لأ يا معلم</h3>
                    <p class="text-sm font-bold text-[#F4F0E8]/80">الكلمة كانت: <span class="text-[#E5B91A] font-black text-xl">${correctWord}</span></p>
                  </div>
                `}
                <div class="text-xs font-extrabold text-[#E5B91A] animate-pulse py-2">جاري الانتقال لجدول النتائج وحساب النقاط...</div>
              </div>
            `}
          ` : `
            <div class="my-auto space-y-5 glass-panel p-6 rounded-3xl border border-[#E5B91A]/50 shadow-2xl bg-gradient-to-b from-[#2A102E] via-[#1B0E19] to-[#120A12]">
              <div class="space-y-2">
                <span class="text-xs font-black text-[#E5B91A] uppercase tracking-wider flex items-center justify-center gap-1.5">
                  ${ICONS.Sparkles} الفرصة الأخيرة للمحتال!
                </span>
                <h2 class="text-2xl font-black text-[#F4F0E8] leading-tight">
                  <span class="text-[#E5B91A]">${currentImposter.name}</span> قدّامه 4 كلمات وبيحاول ينقذ نفسه!
                </h2>
                <p class="text-xs font-bold text-[#F4F0E8]/80 leading-relaxed bg-[#120A12]/80 p-3 rounded-2xl border border-white/10">
                  الاختيارات نازلة سرّي على موبايله دلوقتي.. نشوف هيحزرها ولا هيهبد وتضيع النقط!
                </p>
              </div>

              ${hasGuessed ? `
                <div class="p-4 rounded-2xl bg-[#120A12] border border-white/10 space-y-1 shadow-inner">
                  ${isGuessCorrect ? `
                    <div class="text-emerald-400 font-black text-lg flex items-center justify-center gap-2">يا ابن اللعيبة سلك وعرفها صح! (+3 نقاط)</div>
                  ` : `
                    <div class="text-red-400 font-black text-lg flex items-center justify-center gap-2">لبس في الحيط ومعرفش الكلمة! (0 نقاط)</div>
                  `}
                  <p class="text-xs font-bold text-[#E5B91A] animate-pulse pt-1 flex items-center justify-center gap-1">
                    جاري الانتقال لجدول الترتيب...
                  </p>
                </div>
              ` : `
                <div class="py-3 px-4 rounded-2xl bg-[#120A12]/90 border border-[#E5B91A]/40 text-xs font-black text-[#E5B91A] text-center animate-pulse flex items-center justify-center gap-2 shadow-md">
                  <span>مستنيين المعلم ${currentImposter.name} يختار الكلمة...</span>
                </div>
              `}
            </div>
          `}
        </div>
      `;

      container.querySelectorAll('.btn-choice-word').forEach(btn => {
        btn.onclick = () => {
          const word = btn.getAttribute('data-word');
          if (isAnswered || !currentImposter) return;
          selectedWord = word;
          isAnswered = true;
          const isCorrect = word === correctWord;
          if (isCorrect) soundManager.playCorrectGuess();
          else soundManager.playWrongGuess();

          if (onGuessSubmit) onGuessSubmit(currentImposter.id, isCorrect);
          render();

          setTimeout(() => {
            handleNextImposter();
          }, 2400);
        };
      });
      return;
    }

    // ONE_PHONE MODE
    container.innerHTML = `
      <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto h-full">
        <div class="space-y-2 my-2">
          <span class="px-3.5 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] text-xs font-black inline-block">
            الفرصة الأخيرة (${currentIndex + 1} من ${imposterListToUse.length})
          </span>
          <h2 class="text-3xl font-black text-[#F4F0E8]">لسه عندك فرصة</h2>
        </div>

        ${onePhoneStep === 'PRIVACY_HANDOFF' ? `
          <div class="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl">
            <div class="space-y-2">
              <span class="text-xs font-black text-[#E5B91A] flex items-center justify-center gap-1">الفرصة الأخيرة</span>
              <h2 class="text-3xl font-black text-[#F4F0E8]">سلّم الموبايل لـ ${currentImposter.name}</h2>
              <p class="text-xs font-bold text-[#F4F0E8]/70">تأكد إن محدش باصص في الشاشة عشان يختار الكلمة السرية!</p>
            </div>
            <button id="btn-start-one-guess" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
              ${ICONS.Lock} <span>أنا ${currentImposter.name} - جاهز أحزر</span>
            </button>
          </div>
        ` : onePhoneStep === 'GUESSING' ? `
          <div class="my-auto space-y-3 w-full">
            <p class="text-sm font-extrabold text-[#D92772] mb-2">${currentImposter.name}… تقدر تعرف الكلمة كانت إيه؟</p>
            <div class="grid grid-cols-2 gap-3">
              ${choices.map((word) => `
                <button data-word="${word}" class="btn-choice-word p-5 rounded-2xl glass-card border border-white/10 hover:border-[#D92772] text-xl font-black text-[#F4F0E8] shadow-lg flex items-center justify-center min-h-[90px] cursor-pointer">
                  ${word}
                </button>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl">
            ${selectedWord === correctWord ? `
              <div class="space-y-3">
                <h3 class="text-3xl font-black text-emerald-400">يا ابن اللعيبة</h3>
                <p class="text-lg font-extrabold text-[#E5B91A]">عرفتها صح! (+3 نقاط)</p>
              </div>
            ` : `
              <div class="space-y-3">
                <h3 class="text-3xl font-black text-red-400">لأ يا معلم</h3>
                <p class="text-sm font-bold text-[#F4F0E8]/80">الكلمة كانت: <span class="text-[#E5B91A] font-black text-xl">${correctWord}</span></p>
              </div>
            `}
            <button id="btn-next-imposter-one" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
              ${currentIndex < imposterListToUse.length - 1 ? 'التالي' : 'عرض نتائج الجولة'}
            </button>
          </div>
        `}
      </div>
    `;

    const btnStartOneGuess = document.getElementById('btn-start-one-guess');
    if (btnStartOneGuess) {
      btnStartOneGuess.onclick = () => {
        soundManager.playTap();
        onePhoneStep = 'GUESSING';
        render();
      };
    }

    container.querySelectorAll('.btn-choice-word').forEach(btn => {
      btn.onclick = () => {
        const word = btn.getAttribute('data-word');
        if (isAnswered || !currentImposter) return;
        selectedWord = word;
        isAnswered = true;
        const isCorrect = word === correctWord;
        if (isCorrect) soundManager.playCorrectGuess();
        else soundManager.playWrongGuess();

        if (onGuessSubmit) onGuessSubmit(currentImposter.id, isCorrect);
        onePhoneStep = 'RESULT';
        render();
      };
    });

    const btnNextImpOne = document.getElementById('btn-next-imposter-one');
    if (btnNextImpOne) {
      btnNextImpOne.onclick = () => {
        handleNextImposter();
      };
    }
  };

  const handleNextImposter = () => {
    soundManager.playTap();
    isAnswered = false;
    selectedWord = null;
    onePhoneStep = 'PRIVACY_HANDOFF';

    if (currentIndex < imposterListToUse.length - 1) {
      currentIndex++;
      render();
    } else {
      if (onComplete) onComplete(guessResults);
    }
  };

  render();
}
