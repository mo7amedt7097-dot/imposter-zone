import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderRoundResultsView(container, state, navigate, onUpdateScores, onNextRound, onTriggerWinner, onGoHome) {
  const players = state.activeGroup?.players || [];
  const imposterIds = state.imposterIds || [];
  const votes = state.votes || {};
  const guessResults = state.guessResults || {};
  const scores = state.scores || {};

  const roundPoints = {};
  players.forEach((p) => { roundPoints[p.id] = 0; });

  const voteTallies = {};
  players.forEach((p) => { voteTallies[p.id] = 0; });
  Object.values(votes).forEach((targetId) => {
    if (voteTallies[targetId] !== undefined) voteTallies[targetId] += 1;
  });

  const maxVotes = Math.max(...Object.values(voteTallies), 0);
  const topVotedIds = Object.keys(voteTallies).filter(id => voteTallies[id] === maxVotes && maxVotes > 0);

  players.forEach((player) => {
    const isImp = imposterIds.includes(player.id);
    if (!isImp) {
      const votedTarget = votes[player.id];
      if (votedTarget && imposterIds.includes(votedTarget)) {
        roundPoints[player.id] = 2;
      } else {
        roundPoints[player.id] = 0;
      }
    } else {
      const isCaught = topVotedIds.includes(player.id);
      if (!isCaught) {
        roundPoints[player.id] = 5;
      } else {
        const guessedCorrectly = guessResults[player.id] === true;
        if (guessedCorrectly) {
          roundPoints[player.id] = 3;
        } else {
          roundPoints[player.id] = 0;
        }
      }
    }
  });

  const updatedScores = { ...scores };
  let winner = null;

  players.forEach((p) => {
    const prev = updatedScores[p.id] || 0;
    const nextTotal = prev + roundPoints[p.id];
    updatedScores[p.id] = nextTotal;
    if (nextTotal >= 50 && (!winner || nextTotal > updatedScores[winner.id])) {
      winner = p;
    }
  });

  soundManager.playCorrectGuess();
  if (onUpdateScores) onUpdateScores(updatedScores);

  const leaderboard = players.slice().sort((a, b) => (updatedScores[b.id] || 0) - (updatedScores[a.id] || 0));

  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto h-full">
      <div class="text-center space-y-1 my-2">
        <span class="px-3 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] text-xs font-black inline-flex items-center justify-center gap-1 mx-auto">
          ${ICONS.Sparkles}
          <span>نتيجة الجولة</span>
        </span>
        <h2 class="text-3xl font-black text-[#F4F0E8]">
          نقاط الجولة والترتيب
        </h2>
      </div>

      <div class="space-y-4 my-auto">
        <div class="glass-panel p-4 rounded-3xl border border-[#D92772]/30 space-y-2">
          <h3 class="text-xs font-black text-[#E5B91A] text-right flex items-center justify-end gap-1">
            <span class="text-[#D92772]">${ICONS.Flame}</span>
            <span>نقاط الجولة دي</span>
          </h3>
          <div class="grid grid-cols-2 gap-2">
            ${players.map((p) => {
              const pts = roundPoints[p.id];
              const isImp = imposterIds.includes(p.id);
              return `
                <div class="p-3 rounded-2xl flex items-center justify-between border ${isImp ? 'bg-[#D92772]/20 border-[#D92772]/40' : 'bg-[#1B0E19] border-white/5'}">
                  <span class="font-extrabold text-sm text-[#F4F0E8] truncate">${p.name}</span>
                  <span class="px-2 py-0.5 rounded-lg bg-[#2A102E] text-xs font-black text-[#E5B91A]">+${pts}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="glass-panel p-4 rounded-3xl border border-[#D92772]/30 space-y-2">
          <h3 class="text-xs font-black text-[#F4F0E8]/70 text-right flex items-center justify-between">
            <span class="flex items-center gap-1">
              ${ICONS.Trophy}
              <span>ترتيب الشلة العام (هدف 50 نقطة)</span>
            </span>
            <span>النقاط</span>
          </h3>

          <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            ${leaderboard.map((player, idx) => {
              const total = updatedScores[player.id] || 0;
              const isFirst = idx === 0;
              return `
                <div class="flex items-center justify-between p-3 rounded-2xl border ${isFirst ? 'bg-gradient-to-r from-[#D92772]/30 to-[#4A1E55]/30 border-[#D92772] text-[#E5B91A]' : 'bg-[#1B0E19] border-white/5 text-[#F4F0E8]'}">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-[#2A102E] text-xs font-black flex items-center justify-center">
                      ${idx === 0 ? ICONS.Crown : idx + 1}
                    </span>
                    <span class="font-black text-sm">${player.name}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-[#D92772] to-[#E5B91A]" style="width: ${Math.min(100, (total / 50) * 100)}%"></div>
                    </div>
                    <span class="text-xs font-black text-[#E5B91A] min-w-[30px] text-left">${total}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="pt-2 space-y-2">
        <button id="btn-next-action-round" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
          ${winner ? `<span>شاهد الفائز العظيم</span>` : `<span>الجولة اللي بعدها</span>`}
        </button>

        <button id="btn-results-home" class="w-full py-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-xs text-[#E5B91A] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
          <span>العودة للرئيسية</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-next-action-round').onclick = () => {
    soundManager.playTap();
    if (winner) {
      if (onTriggerWinner) onTriggerWinner(winner);
    } else {
      if (onNextRound) onNextRound();
    }
  };

  document.getElementById('btn-results-home').onclick = () => {
    soundManager.playTap();
    if (onGoHome) onGoHome();
  };
}
