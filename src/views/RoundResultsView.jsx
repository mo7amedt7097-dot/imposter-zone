import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Flame, Play, Home, Crown, BarChart3 } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function RoundResultsView({
  players,
  imposterIds,
  votes,
  guessResults,
  scores,
  onUpdateScores,
  onNextRound,
  onTriggerWinner,
  onGoHome
}) {
  // Calculate round points
  const roundPoints = {};
  players.forEach((p) => {
    roundPoints[p.id] = 0;
  });

  // Calculate vote tallies per player
  const voteTallies = {};
  players.forEach((p) => {
    voteTallies[p.id] = 0;
  });
  Object.values(votes).forEach((targetId) => {
    if (voteTallies[targetId] !== undefined) {
      voteTallies[targetId] += 1;
    }
  });

  const maxVotes = Math.max(...Object.values(voteTallies));
  const topVotedIds = Object.keys(voteTallies).filter(id => voteTallies[id] === maxVotes && maxVotes > 0);

  // Score Normal Players & Imposters
  players.forEach((player) => {
    const isImp = imposterIds.includes(player.id);
    if (!isImp) {
      // Normal player: voted for an imposter?
      const votedTarget = votes[player.id];
      if (votedTarget && imposterIds.includes(votedTarget)) {
        roundPoints[player.id] = 2; // +2 for correct vote
      } else {
        roundPoints[player.id] = 0;
      }
    } else {
      // Imposter
      const isCaught = topVotedIds.includes(player.id);
      if (!isCaught) {
        roundPoints[player.id] = 5; // +5 if uncaught!
      } else {
        const guessedCorrectly = guessResults[player.id] === true;
        if (guessedCorrectly) {
          roundPoints[player.id] = 3; // +3 if caught but guessed secret word
        } else {
          roundPoints[player.id] = 0; // 0 if caught and wrong guess
        }
      }
    }
  });

  // Compute updated total scores
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

  useEffect(() => {
    soundManager.playCorrectGuess();
    onUpdateScores(updatedScores);
  }, []);

  const handleNextAction = () => {
    soundManager.playTap();
    if (winner) {
      onTriggerWinner(winner);
    } else {
      onNextRound();
    }
  };

  // Sort players by total score descending for scoreboard
  const leaderboard = players.slice().sort((a, b) => (updatedScores[b.id] || 0) - (updatedScores[a.id] || 0));

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto">
      {/* Title */}
      <div className="text-center space-y-1 my-2">
        <span className="px-3 py-1 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#E5B91A] text-xs font-black inline-flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>نتيجة الجولة</span>
        </span>
        <h2 className="text-3xl font-black text-[#F4F0E8]">
          نقاط الجولة والترتيب
        </h2>
      </div>

      {/* Round Breakdown */}
      <div className="space-y-4 my-auto">
        <div className="glass-panel p-4 rounded-3xl border border-[#D92772]/30 space-y-2">
          <h3 className="text-xs font-black text-[#E5B91A] text-right flex items-center justify-end gap-1">
            <Flame className="w-3.5 h-3.5 text-[#D92772]" />
            <span>نقاط الجولة دي</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {players.map((p) => {
              const pts = roundPoints[p.id];
              const isImp = imposterIds.includes(p.id);
              return (
                <motion.div
                  key={p.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-3 rounded-2xl flex items-center justify-between border ${
                    isImp ? 'bg-[#D92772]/20 border-[#D92772]/40' : 'bg-[#1B0E19] border-white/5'
                  }`}
                >
                  <span className="font-extrabold text-sm text-[#F4F0E8] truncate">
                    {p.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#2A102E] text-xs font-black text-[#E5B91A]">
                    +{pts}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Global Standings Leaderboard */}
        <div className="glass-panel p-4 rounded-3xl border border-[#D92772]/30 space-y-2">
          <h3 className="text-xs font-black text-[#F4F0E8]/70 text-right flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#E5B91A]" />
              <span>ترتيب الشلة العام (هدف 50 نقطة)</span>
            </span>
            <span>النقاط</span>
          </h3>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {leaderboard.map((player, idx) => {
              const total = updatedScores[player.id] || 0;
              const isFirst = idx === 0;
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border ${
                    isFirst
                      ? 'bg-gradient-to-r from-[#D92772]/30 to-[#4A1E55]/30 border-[#D92772] text-[#E5B91A]'
                      : 'bg-[#1B0E19] border-white/5 text-[#F4F0E8]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#2A102E] text-xs font-black flex items-center justify-center">
                      {idx === 0 ? <Crown className="w-4 h-4 text-[#E5B91A]" /> : idx + 1}
                    </span>
                    <span className="font-black text-sm">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D92772] to-[#E5B91A]"
                        style={{ width: `${Math.min(100, (total / 50) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-[#E5B91A] min-w-[30px] text-left">
                      {total}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          onClick={handleNextAction}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all glow-pink"
        >
          {winner ? (
            <>
              <Trophy className="w-6 h-6 text-[#E5B91A]" />
              <span>شاهد الفائز العظيم</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current text-[#E5B91A]" />
              <span>الجولة اللي بعدها</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            if (onGoHome) onGoHome();
          }}
          className="w-full py-3 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-bold text-xs text-[#E5B91A] flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Home className="w-4 h-4 text-[#E5B91A]" />
          <span>العودة للرئيسية</span>
        </button>
      </div>
    </div>
  );
}
