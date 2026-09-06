import React, { useState } from 'react';
import { Settings, Copy, Check, ArrowRight, LogOut, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function Header({
  groupName,
  roomCode,
  playerCount,
  onOpenSettings,
  onBack,
  canGoBack,
  isGameActive
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    soundManager.playTap();
    if (roomCode && navigator.clipboard) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackClick = () => {
    soundManager.playTap();
    if (onBack) onBack();
  };

  return (
    <header className="w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between z-30 relative gap-2">
      {/* Left Action: "خروج" in active game, "رجوع" on normal screens, or Logo */}
      <div className="flex items-center gap-2">
        {isGameActive ? (
          <button
            onClick={handleBackClick}
            className="px-3 py-1.5 rounded-2xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
            aria-label="خروج من الجولة"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        ) : canGoBack ? (
          <button
            onClick={handleBackClick}
            className="px-3 py-1.5 rounded-2xl glass-card flex items-center gap-1 text-xs font-extrabold text-[#F4F0E8] hover:border-[#D92772]/50 active:scale-95 transition-all"
            aria-label="رجوع"
          >
            <ArrowRight className="w-4 h-4 text-[#E5B91A]" />
            <span>رجوع</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D92772] to-[#E5B91A] flex items-center justify-center text-black text-base shadow-lg shadow-[#D92772]/20">
              <Sparkles className="w-5 h-5 text-black font-black" />
            </div>
            <div>
              <h1 className="font-extrabold text-base leading-tight text-[#F4F0E8] flex items-center gap-1">
                IMPOSTER
              </h1>
              {groupName && (
                <p className="text-[11px] text-[#F4F0E8]/70 font-semibold truncate max-w-[110px]">
                  {groupName} {playerCount ? `(${playerCount})` : ''}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Middle: Prominent Room Code with 1-Tap Copy */}
      {roomCode && (
        <button
          onClick={handleCopyCode}
          className={`px-3 py-1.5 rounded-2xl font-mono text-xs font-black flex items-center gap-1.5 border transition-all active:scale-95 ${
            copied
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              : 'bg-[#1B0E19] border-[#D92772]/40 text-[#E5B91A] hover:border-[#E5B91A]'
          }`}
          title="اضغط لنسخ كود الشلة"
        >
          <span className="tracking-wider">CODE: {roomCode}</span>
          {copied ? (
            <span className="text-[10px] bg-emerald-500 text-black font-black px-1.5 py-0.2 rounded">تم!</span>
          ) : (
            <Copy className="w-3.5 h-3.5 text-[#D92772]" />
          )}
        </button>
      )}

      {/* Right Action: Settings gear button */}
      <button
        onClick={() => {
          soundManager.playTap();
          onOpenSettings();
        }}
        className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-[#F4F0E8]/80 hover:text-[#F4F0E8] hover:border-[#D92772]/50 active:scale-95 transition-all shrink-0"
        aria-label="الإعدادات"
      >
        <Settings className="w-4 h-4" />
      </button>
    </header>
  );
}
