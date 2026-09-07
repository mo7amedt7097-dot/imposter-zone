import { ICONS } from '../components/icons.js';
import { formatRoomCode } from '../roomCode.js';
import { syncEngine } from '../syncEngine.js';
import { soundManager } from '../sound.js';

export function renderJoinGroupView(container, state, navigate, initialCode, onJoinGroupSuccess) {
  const currentUser = state.user;
  let roomCodeInput = (initialCode || '').toUpperCase();
  let playerName = currentUser?.name || '';
  let isLoading = false;
  let errorMsg = '';

  const render = () => {
    container.innerHTML = `
      <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto h-full">
        <!-- Header back button -->
        <div class="flex items-center justify-between mb-4">
          <button id="btn-back-home" class="p-2.5 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1.5 text-xs font-bold cursor-pointer">
            <span class="text-[#E5B91A]">${ICONS.ArrowRight}</span>
            الرئيسية
          </button>
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] flex items-center gap-1.5">
            ${ICONS.Lock}
            دخول لجروب
          </span>
        </div>

        <div class="space-y-4 my-auto">
          <div class="text-center space-y-1">
            <h2 class="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
              <span class="text-[#D92772]">${ICONS.Users}</span>
              انضمام لاعب عادي
            </h2>
            <p class="text-xs font-medium text-[#F4F0E8]/70">
              ${initialCode ? `تم اكتشاف الرابط المباشر للكود ${initialCode}` : 'اكتب كود الجروب واسمك عشان تدخل مع الشلة فوراً'}
            </p>
          </div>

          <form id="form-join-group" class="space-y-4">
            <div class="glass-panel p-5 rounded-3xl border border-[#D92772]/30 space-y-4">
              <div>
                <label class="block text-xs font-extrabold text-[#E5B91A] mb-1.5 flex items-center justify-between">
                  <span class="flex items-center gap-1.5">
                    ${ICONS.Lock}
                    كود الجروب (GROUP ID)
                  </span>
                  ${initialCode ? `<span class="text-[10px] text-emerald-400 font-bold flex items-center gap-1">رابط مباشر</span>` : ''}
                </label>
                <input
                  id="input-room-code"
                  type="text"
                  value="${roomCodeInput}"
                  placeholder="مثلاً: SRWQ"
                  maxlength="4"
                  class="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-white/10 text-[#E5B91A] font-black text-3xl tracking-widest text-center uppercase focus:outline-none focus:border-[#D92772]"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-extrabold text-[#F4F0E8]/80 mb-1.5 flex items-center gap-1.5">
                  <span class="text-[#D92772]">${ICONS.Users}</span>
                  اسمك في اللعبة
                </label>
                <input
                  id="input-player-name"
                  type="text"
                  value="${playerName}"
                  placeholder="اسمك (مثلاً: أحمد)"
                  class="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-white/10 text-[#F4F0E8] font-bold text-base focus:outline-none focus:border-[#D92772]"
                  required
                />
              </div>

              ${errorMsg ? `<p class="text-xs font-bold text-red-400 text-center bg-red-950/50 p-2.5 rounded-xl border border-red-500/30">${errorMsg}</p>` : ''}
            </div>

            <button
              type="submit"
              ${isLoading ? 'disabled' : ''}
              class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${isLoading ? 'opacity-50' : ''}"
            >
              <span class="text-[#E5B91A]">${ICONS.LogIn}</span>
              ${isLoading ? 'جاري الاتصال...' : 'انضمام للجروب'}
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('btn-back-home').onclick = () => {
      soundManager.playTap();
      navigate('HOME');
    };

    const form = document.getElementById('form-join-group');
    form.onsubmit = async (e) => {
      e.preventDefault();
      soundManager.playTap();
      errorMsg = '';

      const codeVal = document.getElementById('input-room-code').value;
      const nameVal = document.getElementById('input-player-name').value;

      const formattedCode = formatRoomCode(codeVal);
      const cleanedPlayerName = nameVal.trim();

      if (!formattedCode || formattedCode.length < 4) {
        errorMsg = 'أدخل كود الجروب المكون من 4 حروف أو أرقام!';
        render();
        return;
      }

      if (!cleanedPlayerName) {
        errorMsg = 'أدخل اسمك للانضمام!';
        render();
        return;
      }

      isLoading = true;
      render();

      try {
        let targetRoom = await syncEngine.fetchRoomState(formattedCode);

        if (!targetRoom) {
          errorMsg = 'الكود ده مش موجود، تأكد إن الكود صح وأن الـ Host عمل الجروب!';
          isLoading = false;
          render();
          return;
        }

        const currentPlayers = targetRoom.players || [];
        const existingPlayer = currentPlayers.find(
          (p) => p.name.trim().toLowerCase() === cleanedPlayerName.toLowerCase()
        );

        let activePlayerId;
        let updatedPlayers;

        if (existingPlayer) {
          activePlayerId = existingPlayer.id;
          updatedPlayers = currentPlayers;
        } else {
          if (currentPlayers.length >= 10) {
            errorMsg = 'الجروب كامل — أقصى عدد 10 لاعبين';
            isLoading = false;
            render();
            return;
          }
          activePlayerId = 'member_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
          updatedPlayers = [...currentPlayers, { id: activePlayerId, name: cleanedPlayerName }];
        }

        const updatedScores = { ...(targetRoom.scores || {}) };
        if (updatedScores[activePlayerId] === undefined) {
          updatedScores[activePlayerId] = 0;
        }

        const updatedRoom = {
          ...targetRoom,
          players: updatedPlayers,
          scores: updatedScores
        };

        await syncEngine.publishRoomState(formattedCode, updatedRoom);

        isLoading = false;
        if (onJoinGroupSuccess) onJoinGroupSuccess(updatedRoom, cleanedPlayerName, activePlayerId);
      } catch (err) {
        isLoading = false;
        errorMsg = 'حصل خطأ في الاتصال بالسيرفر، حاول تاني!';
        render();
      }
    };
  };

  render();
}
