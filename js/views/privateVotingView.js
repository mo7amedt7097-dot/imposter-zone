import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderPrivateVotingView(container, state, navigate, onCastVote, onVotingComplete) {
  const players = state.activeGroup?.players || [];
  const gameMode = state.gameMode || 'ONE_PHONE';
  const currentUserId = state.user?.id;
  const votes = state.votes || {};
  const isMultiPhone = gameMode === 'MULTI_PHONE';

  const myPlayer = players.find((p) => p.id === currentUserId) || players[0];
  let selectedSuspectId = null;
  let voterIndex = 0;
  let onePhoneStep = 'PRIVACY_HANDOFF';

  const render = () => {
    const hasMyVoteBeenCast = isMultiPhone && myPlayer && Boolean(votes[myPlayer.id]);
    const votedCount = Object.keys(votes).length;
    const totalPlayersCount = players.length;
    const currentVoter = players[voterIndex] || players[0];

    if (isMultiPhone && votedCount >= totalPlayersCount && totalPlayersCount > 0) {
      setTimeout(() => {
        if (onVotingComplete) onVotingComplete(votes);
      }, 600);
    }

    if (isMultiPhone) {
      container.innerHTML = `
        <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto h-full">
          <div class="flex items-center justify-between py-2 border-b border-white/10">
            <span class="text-xs font-bold text-[#E5B91A] flex items-center gap-1.5">
              ${ICONS.Sparkles} تصويت سري على موبايلك
            </span>
            <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772]">
              ${myPlayer?.name || 'أنت'}
            </span>
          </div>

          ${!hasMyVoteBeenCast ? `
            <div class="my-auto space-y-4 w-full">
              <div class="space-y-1">
                <span class="text-xs font-extrabold text-[#E5B91A] flex items-center justify-center gap-1">
                  صوّت بصفتك: ${myPlayer?.name}
                </span>
                <h2 class="text-2xl font-black text-[#F4F0E8]">
                  شايف مين الإمبوستر يا ${myPlayer?.name}؟
                </h2>
                <p class="text-xs text-[#F4F0E8]/60">
                  صوتك سري ومحدش هيشوفه غير لما التصويت يخلص!
                </p>
              </div>

              <div class="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-1">
                ${players.filter((p) => p.id !== myPlayer?.id).map((suspect) => {
                  const isSelected = selectedSuspectId === suspect.id;
                  return `
                    <div
                      data-suspect-id="${suspect.id}"
                      class="btn-suspect-card p-3.5 rounded-2xl cursor-pointer text-right transition-all border ${isSelected ? 'bg-[#D92772]/30 border-[#D92772] shadow-lg shadow-[#D92772]/20' : 'bg-[#1B0E19] border-white/10 hover:border-white/20'}"
                    >
                      <div class="flex items-center justify-between">
                        <span class="font-extrabold text-base text-[#F4F0E8]">${suspect.name}</span>
                        <div class="w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-[#D92772] border-[#D92772] text-white' : 'border-white/30'}">
                          ${isSelected ? ICONS.Check : ''}
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <button
                id="btn-confirm-multi-vote"
                ${!selectedSuspectId ? 'disabled' : ''}
                class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl ${!selectedSuspectId ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'} transition-all"
              >
                ${ICONS.Lock} <span>تأكيد الصوت</span>
              </button>
            </div>
          ` : `
            <div class="my-auto space-y-6 glass-panel p-6 rounded-3xl border border-[#D92772]/40 shadow-2xl">
              <div class="w-16 h-16 rounded-full bg-[#D92772]/20 border border-[#D92772]/50 flex items-center justify-center mx-auto">
                ${ICONS.Lock}
              </div>

              <div class="space-y-1">
                <h2 class="text-2xl font-black text-[#E5B91A]">تم تسجيل صوتك بنجاح</h2>
                <p class="text-xs font-bold text-[#F4F0E8]/70">اختيارك محفوظ في السر.. في انتظار باقي اللعيبة تصوّت!</p>
              </div>

              <div class="bg-[#1B0E19]/80 rounded-2xl p-3 border border-white/10 space-y-2 text-right">
                <div class="flex items-center justify-between text-xs text-[#F4F0E8]/60 font-bold border-b border-white/10 pb-1.5">
                  <span>حالة التصويت</span>
                  <span>(${votedCount} من ${totalPlayersCount} صوّتوا)</span>
                </div>
                <div class="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  ${players.map((p) => {
                    const playerVoted = Boolean(votes[p.id]);
                    return `
                      <div class="p-2 rounded-xl border text-xs flex items-center justify-between ${playerVoted ? 'bg-[#E5B91A]/10 border-[#E5B91A]/30 text-[#E5B91A]' : 'bg-white/5 border-white/10 text-white/50'}">
                        <span class="font-bold truncate max-w-[90px]">${p.name}</span>
                        ${playerVoted ? `<span class="flex items-center gap-1 text-[10px] font-black text-[#E5B91A]">صوّت ${ICONS.Check}</span>` : `<span class="flex items-center gap-1 text-[10px] text-white/40">يفكر...</span>`}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          `}
        </div>
      `;

      container.querySelectorAll('.btn-suspect-card').forEach(card => {
        card.onclick = () => {
          soundManager.playTap();
          selectedSuspectId = card.getAttribute('data-suspect-id');
          render();
        };
      });

      const btnConfirmMultiVote = document.getElementById('btn-confirm-multi-vote');
      if (btnConfirmMultiVote) {
        btnConfirmMultiVote.onclick = () => {
          if (!selectedSuspectId || !myPlayer) return;
          soundManager.playVotingLock();
          if (onCastVote) onCastVote(myPlayer.id, selectedSuspectId);
          render();
        };
      }
      return;
    }

    // ONE_PHONE MODE
    container.innerHTML = `
      <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] text-center overflow-y-auto h-full">
        <div class="flex items-center justify-between py-2 border-b border-white/10">
          <span class="text-xs font-bold text-[#F4F0E8]/60">التصويت السري (${voterIndex + 1} من ${players.length})</span>
        </div>

        ${onePhoneStep === 'PRIVACY_HANDOFF' ? `
          <div class="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/40 shadow-2xl">
            <div class="w-16 h-16 rounded-full bg-[#D92772]/20 border border-[#D92772]/50 flex items-center justify-center mx-auto">
              ${ICONS.Zap}
            </div>
            <div class="space-y-2">
              <span class="text-xs font-black text-[#E5B91A] flex items-center justify-center gap-1">دور في التصويت</span>
              <h2 class="text-3xl font-black text-[#F4F0E8]">سلّم الموبايل لـ ${currentVoter.name}</h2>
              <p class="text-xs font-bold text-[#F4F0E8]/70">تأكد إن محدش باصص في الشاشة قبل ما تفتح قائمة التصويت!</p>
            </div>
            <button id="btn-start-one-vote" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
              ${ICONS.Lock} <span>أنا ${currentVoter.name} - جاهز أصوّت</span>
            </button>
          </div>
        ` : onePhoneStep === 'CAST_VOTE' ? `
          <div class="my-auto space-y-4 w-full">
            <div class="space-y-1">
              <span class="text-xs font-extrabold text-[#E5B91A] flex items-center justify-center gap-1">دور ${currentVoter.name} في التصويت</span>
              <h2 class="text-2xl font-black text-[#F4F0E8]">${currentVoter.name}… مين اللي مش فاهم حاجة؟</h2>
            </div>
            <div class="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-1">
              ${players.filter((p) => p.id !== currentVoter.id).map((suspect) => {
                const isSelected = selectedSuspectId === suspect.id;
                return `
                  <div data-suspect-id="${suspect.id}" class="btn-suspect-card p-3.5 rounded-2xl cursor-pointer text-right transition-all border ${isSelected ? 'bg-[#D92772]/30 border-[#D92772] shadow-lg shadow-[#D92772]/20' : 'bg-[#1B0E19] border-white/10 hover:border-white/20'}">
                    <div class="flex items-center justify-between">
                      <span class="font-extrabold text-base text-[#F4F0E8]">${suspect.name}</span>
                      <div class="w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-[#D92772] border-[#D92772] text-white' : 'border-white/30'}">
                        ${isSelected ? ICONS.Check : ''}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <button id="btn-confirm-one-vote" ${!selectedSuspectId ? 'disabled' : ''} class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl ${!selectedSuspectId ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'} transition-all">
              ${ICONS.Lock} <span>تأكيد الصوت</span>
            </button>
          </div>
        ` : `
          <div class="my-auto space-y-6 glass-panel p-8 rounded-3xl border border-[#D92772]/50 shadow-2xl">
            <div class="w-16 h-16 rounded-full bg-[#D92772]/20 border border-[#D92772]/50 flex items-center justify-center mx-auto">
              ${ICONS.Lock}
            </div>
            <div class="space-y-2">
              <h2 class="text-3xl font-black text-[#E5B91A]">اتقفل صوتك</h2>
              <p class="text-xs font-bold text-[#F4F0E8]/70">اختيارك محفوظ في السر وماحدش هيعرف انت اخترت مين غير لما النتيجة تظهر!</p>
            </div>
            <button id="btn-pass-one-next" class="w-full py-4 rounded-2xl bg-[#D92772] hover:bg-[#b01e5b] font-black text-lg text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
              ${voterIndex < players.length - 1 ? 'ادّي الموبايل للي بعدك' : 'عرض نتائج التصويت'}
            </button>
          </div>
        `}
      </div>
    `;

    const btnStartOneVote = document.getElementById('btn-start-one-vote');
    if (btnStartOneVote) {
      btnStartOneVote.onclick = () => {
        soundManager.playTap();
        selectedSuspectId = null;
        onePhoneStep = 'CAST_VOTE';
        render();
      };
    }

    container.querySelectorAll('.btn-suspect-card').forEach(card => {
      card.onclick = () => {
        soundManager.playTap();
        selectedSuspectId = card.getAttribute('data-suspect-id');
        render();
      };
    });

    const btnConfirmOneVote = document.getElementById('btn-confirm-one-vote');
    if (btnConfirmOneVote) {
      btnConfirmOneVote.onclick = () => {
        if (!selectedSuspectId || !currentVoter) return;
        soundManager.playVotingLock();
        if (onCastVote) onCastVote(currentVoter.id, selectedSuspectId);
        onePhoneStep = 'VOTE_CONFIRMED';
        render();
      };
    }

    const btnPassOneNext = document.getElementById('btn-pass-one-next');
    if (btnPassOneNext) {
      btnPassOneNext.onclick = () => {
        soundManager.playTap();
        selectedSuspectId = null;
        if (voterIndex < players.length - 1) {
          voterIndex++;
          onePhoneStep = 'PRIVACY_HANDOFF';
          render();
        } else {
          if (onVotingComplete) onVotingComplete(votes);
        }
      };
    }
  };

  render();
}
