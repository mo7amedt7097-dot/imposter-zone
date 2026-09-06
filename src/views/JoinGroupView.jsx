import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn, Key, User, Loader2, Link as LinkIcon, Shield } from 'lucide-react';
import { formatRoomCode } from '../utils/roomCode';
import { syncEngine } from '../utils/syncEngine';
import { soundManager } from '../utils/sound';

export default function JoinGroupView({ currentUser, initialCode, onJoinGroupSuccess, onNavigate }) {
  const [roomCodeInput, setRoomCodeInput] = useState(initialCode || '');
  const [playerName, setPlayerName] = useState(currentUser?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialCode) {
      setRoomCodeInput(initialCode.toUpperCase());
    }
  }, [initialCode]);

  const handleJoin = async (e) => {
    e.preventDefault();
    soundManager.playTap();
    setErrorMsg('');

    const formattedCode = formatRoomCode(roomCodeInput);
    const cleanedPlayerName = playerName.trim();

    if (!formattedCode || formattedCode.length < 4) {
      setErrorMsg('أدخل كود الجروب المكون من 4 حروف أو أرقام!');
      return;
    }

    if (!cleanedPlayerName) {
      setErrorMsg('أدخل اسمك للانضمام!');
      return;
    }

    setIsLoading(true);

    try {
      let targetRoom = await syncEngine.fetchRoomState(formattedCode);

      if (!targetRoom) {
        setErrorMsg('الكود ده مش موجود، تأكد إن الكود صح وأن الـ Host عمل الجروب!');
        setIsLoading(false);
        return;
      }

      const currentPlayers = targetRoom.players || [];
      
      // Check if name already exists in the room
      const existingPlayer = currentPlayers.find(
        (p) => p.name.trim().toLowerCase() === cleanedPlayerName.toLowerCase()
      );

      let activePlayerId;
      let updatedPlayers;

      if (existingPlayer) {
        // If player name is already in the group, connect directly as that player!
        activePlayerId = existingPlayer.id;
        updatedPlayers = currentPlayers;
      } else {
        // Otherwise, add as a new player if under 10
        if (currentPlayers.length >= 10) {
          setErrorMsg('الجروب كامل — أقصى عدد 10 لاعبين');
          setIsLoading(false);
          return;
        }

        activePlayerId = 'member_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        updatedPlayers = [...currentPlayers, { id: activePlayerId, name: cleanedPlayerName }];
      }

      const updatedScores = { ...(targetRoom.scores || {}) };
      if (updatedScores[activePlayerId] === undefined) {
        updatedScores[activePlayerId] = 0;
      }

      // Keep original creator hostUserId intact
      const updatedRoom = {
        ...targetRoom,
        players: updatedPlayers,
        scores: updatedScores
      };

      await syncEngine.publishRoomState(formattedCode, updatedRoom);

      setIsLoading(false);
      onJoinGroupSuccess(updatedRoom, cleanedPlayerName, activePlayerId);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('حصل خطأ في الاتصال بالسيرفر، حاول تاني!');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto">
      {/* Header back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            soundManager.playTap();
            onNavigate('HOME');
          }}
          className="p-2.5 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowRight className="w-4 h-4 text-[#E5B91A]" />
          الرئيسية
        </button>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5" />
          دخول لجروب
        </span>
      </div>

      <div className="space-y-4 my-auto">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
            <Shield className="w-7 h-7 text-[#D92772]" />
            انضمام لاعب عادي
          </h2>
          <p className="text-xs font-medium text-[#F4F0E8]/70">
            {initialCode ? `تم اكتشاف الرابط المباشر للكود ${initialCode}` : 'اكتب كود الجروب واسمك عشان تدخل مع الشلة فوراً'}
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-[#D92772]/30 space-y-4 glow-pink">
            {/* Room Code input */}
            <div>
              <label className="block text-xs font-extrabold text-[#E5B91A] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  كود الجروب (GROUP ID)
                </span>
                {initialCode && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> رابط مباشر
                  </span>
                )}
              </label>
              <input
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="مثلاً: SRWQ"
                maxLength={4}
                className="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-white/10 text-[#E5B91A] font-black text-3xl tracking-widest text-center uppercase focus:outline-none focus:border-[#D92772]"
                required
              />
            </div>

            {/* Player Name input */}
            <div>
              <label className="block text-xs font-extrabold text-[#F4F0E8]/80 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#D92772]" />
                اسمك في اللعبة
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="اسمك (مثلاً: أحمد)"
                className="w-full px-4 py-3 rounded-2xl bg-[#1B0E19] border border-white/10 text-[#F4F0E8] font-bold text-base focus:outline-none focus:border-[#D92772]"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-red-400 text-center bg-red-950/50 p-2.5 rounded-xl border border-red-500/30">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] to-[#4A1E55] font-black text-lg text-white shadow-xl shadow-[#D92772]/30 flex items-center justify-center gap-2 active:scale-95 transition-all glow-pink disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#E5B91A]" />
            ) : (
              <LogIn className="w-5 h-5 text-[#E5B91A]" />
            )}
            انضمام للجروب
          </button>
        </form>
      </div>
    </div>
  );
}

