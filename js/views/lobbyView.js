import { ICONS } from '../components/icons.js';
import { soundManager } from '../sound.js';

export function renderLobbyView(container, state, navigate, onStartGame, onOpenEditGroup, onUpdateOwnName, onLeaveGroup) {
  const group = state.activeGroup;
  if (!group) return;

  const currentUserId = state.user?.id;
  const isHost = group.hostUserId === currentUserId;
  const players = group.players || [];
  const isFull = players.length >= 10;
  const myPlayerObj = players.find(p => p.id === currentUserId);
  const gameMode = state.gameMode || 'ONE_PHONE';
  const isOnePhone = gameMode === 'ONE_PHONE';
  const scores = state.scores || {};

  let copiedCode = false;
  let copiedLink = false;
  let isEditingOwnName = false;
  let ownNameInput = myPlayerObj?.name || '';

  const render = () => {
    const modeBannerHtml = isOnePhone
      ? `
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-[#D92772]/20 via-[#4A1E55]/30 to-[#E5B91A]/20 border border-[#E5B91A]/40 text-[#F4F0E8] text-xs font-bold text-center flex items-center justify-between gap-2 shadow-lg mb-2">
          <div class="text-right space-y-0.5">
            <span class="font-black text-[#E5B91A] flex items-center gap-1.5">
              نلعب الآن على هاتف واحد (جهاز ${players.find(p => p.id === group.hostUserId)?.name || 'الـ Host'})
            </span>
            <p class="text-[11px] text-[#F4F0E8]/80">الموبايل بيتمسّك وبيتمرّر بين الشلة دلوقتي على نفس الجهاز!</p>
          </div>
          ${isHost ? `
            <button id="btn-add-edit-banner" class="px-3 py-2 rounded-xl bg-[#D92772] hover:bg-[#b01e5b] text-white text-xs font-black shrink-0 flex items-center gap-1 active:scale-95 transition-all shadow-md cursor-pointer">
              ${ICONS.Users}
              أضف/عدّل الأسماء
            </button>
          ` : ''}
        </div>
      `
      : `
        <div class="p-3 rounded-2xl bg-gradient-to-r from-[#D92772]/20 via-[#E5B91A]/20 to-emerald-500/20 border border-[#E5B91A]/40 text-[#F4F0E8] text-xs font-black text-center flex items-center justify-between gap-2 shadow-lg mb-2">
          <span class="flex items-center gap-1.5 text-right">
            ${ICONS.Sparkles}
            <span>شارك كود الجروب <strong class="text-[#E5B91A]">${group.code}</strong> مع أصحابك للدخول من هواتفهم.</span>
          </span>
          <button id="btn-copy-banner" class="px-3 py-1 rounded-xl bg-[#D92772] hover:bg-[#b01e5b] text-white text-[11px] font-bold shrink-0 transition-all active:scale-95 shadow-md cursor-pointer">
            ${copiedCode ? 'تم النسخ!' : 'نسخ الكود'}
          </button>
        </div>
      `;

    const codeCardHtml = !isOnePhone
      ? `
        <div class="my-2 p-4 rounded-3xl glass-panel border border-[#D92772]/50 text-center space-y-3">
          <div class="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#E5B91A]">
            ${ICONS.Lock}
            <span>كود الجروب (GROUP ID)</span>
          </div>

          <div class="text-4xl font-black font-mono tracking-widest text-[#F4F0E8] text-glow-yellow py-0.5">
            ${group.code}
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button id="btn-copy-code-card" class="py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer ${copiedCode ? 'bg-emerald-600 text-white' : 'bg-[#D92772] hover:bg-[#b01e5b] text-white'}">
              ${copiedCode ? 'تم النسخ!' : 'نسخ الكود'}
            </button>

            <button id="btn-share-link-card" class="py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer ${copiedLink ? 'bg-emerald-600 text-white' : 'bg-[#4A1E55] hover:bg-[#5c256b] text-[#E5B91A] border border-[#E5B91A]/30'}">
              ${copiedLink ? 'تم نسخ الرابط!' : 'مشاركة الرابط'}
            </button>
          </div>
        </div>
      `
      : '';

    const editNameHtml = !isEditingOwnName
      ? `
        <button id="btn-start-edit-own-name" class="w-full py-2.5 rounded-2xl bg-[#1B0E19] border border-white/10 text-xs font-bold text-[#E5B91A] flex items-center justify-center gap-1.5 hover:bg-[#2A102E] transition-colors cursor-pointer">
          ${ICONS.Edit}
          تعديل اسمي في الجروب
        </button>
      `
      : `
        <div class="flex items-center gap-2 p-2 rounded-2xl bg-[#1B0E19] border border-[#D92772]/40">
          <input id="input-own-name" type="text" value="${ownNameInput}" placeholder="اسمك الجديد" class="flex-1 px-3 py-1.5 rounded-xl bg-[#120A12] border border-white/10 text-xs font-bold text-[#F4F0E8] focus:outline-none" />
          <button id="btn-save-own-name" class="px-3 py-1.5 rounded-xl bg-[#D92772] text-xs font-black text-white hover:bg-[#b01e5b] cursor-pointer">حفظ</button>
        </div>
      `;

    const startGameHtml = (!isOnePhone && !isHost)
      ? `
        <div class="py-4 rounded-2xl bg-[#1B0E19] border border-[#E5B91A]/30 text-xs font-extrabold text-[#E5B91A] text-center animate-pulse flex items-center justify-center gap-2">
          <span class="text-[#E5B91A]">${ICONS.Crown}</span>
          <span>في انتظار الـ Host لبدء اللعبة واختيار الفئة...</span>
        </div>
      `
      : `
        <button id="btn-start-game-now" ${players.length < 3 ? 'disabled' : ''} class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D92772] via-[#4A1E55] to-[#D92772] font-black text-lg text-white shadow-xl shadow-[#D92772]/40 flex items-center justify-center gap-2 active:scale-95 transition-all ${players.length < 3 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}">
          <span class="text-[#E5B91A]">${ICONS.Zap}</span>
          <span>بدء اللعبة الآن للجميع</span>
        </button>
      `;

    const playersListHtml = players.map((p) => {
      const isPlayerHost = p.id === group.hostUserId;
      const isMe = p.id === currentUserId;
      const playerScore = (group?.scores && group.scores[p.id]) || scores[p.id] || 0;

      return `
        <div class="flex items-center justify-between p-3 rounded-2xl border transition-all ${isPlayerHost ? 'bg-gradient-to-r from-[#D92772]/25 via-[#4A1E55]/40 to-[#E5B91A]/20 border-[#E5B91A]/60 text-[#E5B91A]' : isMe ? 'bg-[#4A1E55]/30 border-[#D92772]/50 text-[#F4F0E8]' : 'bg-[#1B0E19] border-white/10 text-[#F4F0E8]'}">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span class="font-extrabold text-sm flex items-center gap-1.5">
              <span>${p.name}</span>
              ${isMe ? `<span class="px-1.5 py-0.5 rounded-md bg-[#D92772] text-white text-[10px] font-black">أنت</span>` : ''}
            </span>
            ${isPlayerHost ? `
              <span class="px-2 py-0.5 rounded-md bg-[#E5B91A]/20 text-[#E5B91A] text-[10px] font-black flex items-center gap-0.5 border border-[#E5B91A]/50 shadow-sm">
                ${ICONS.Crown} HOST
              </span>
            ` : ''}
          </div>

          <span class="px-2.5 py-1 rounded-xl bg-[#E5B91A]/15 border border-[#E5B91A]/30 text-[#E5B91A] text-xs font-black flex items-center gap-1 shadow-sm shrink-0">
            ${ICONS.Trophy}
            <span>${playerScore} ${playerScore === 1 ? 'نقطة' : 'نقاط'}</span>
          </span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="flex-1 flex flex-col justify-between px-4 py-4 max-w-md mx-auto w-full text-[#F4F0E8] overflow-y-auto h-full">
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-2">
          <button id="btn-back-mygroups" class="p-2 rounded-2xl glass-card text-[#F4F0E8]/70 hover:text-white flex items-center gap-1 text-xs font-bold cursor-pointer">
            <span class="text-[#E5B91A]">${ICONS.ArrowRight}</span>
            جروباتي
          </button>

          <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#D92772]/20 border border-[#D92772]/40 text-[#D92772] flex items-center gap-1">
            ${ICONS.Users}
            ${isOnePhone ? 'هاتف واحد' : 'لوبي الشلة'}
          </span>

          <button id="btn-leave-group" class="px-2.5 py-1 rounded-2xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-[11px] font-extrabold flex items-center gap-1 transition-all active:scale-95 shadow-md cursor-pointer">
            ${ICONS.LogOut}
            خروج
          </button>
        </div>

        ${modeBannerHtml}

        <!-- Group Name Header -->
        <div class="text-center space-y-1 my-2">
          <h2 class="text-3xl font-black text-[#F4F0E8] flex items-center justify-center gap-2">
            <span class="text-[#D92772]">${ICONS.Users}</span>
            ${group.name}
          </h2>
          <div class="flex items-center justify-center gap-2">
            <span class="text-xs font-bold text-[#F4F0E8]/70 flex items-center gap-1">
              <span class="text-[#E5B91A]">${ICONS.Users}</span>
              ${players.length} / 10 لاعبين
            </span>
            ${isFull ? `
              <span class="px-2 py-0.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] font-black flex items-center gap-1">
                الجروب كامل
              </span>
            ` : ''}
          </div>
        </div>

        ${codeCardHtml}

        <!-- Players List Card with Scores -->
        <div class="my-auto space-y-3">
          <div class="glass-panel p-4 rounded-3xl border border-white/10 space-y-2">
            <div class="flex items-center justify-between text-xs font-black text-[#F4F0E8]/70 border-b border-white/10 pb-2">
              <span class="flex items-center gap-1.5">
                <span class="text-[#E5B91A]">${ICONS.Users}</span>
                الاعيبة في الجروب (${players.length})
              </span>
              <button id="btn-edit-members" class="text-[#E5B91A] text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer">
                ${ICONS.Users}
                تعديل / إضافة أعضاء
              </button>
            </div>

            <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
              ${playersListHtml}
            </div>
          </div>

          <div>
            ${editNameHtml}
          </div>
        </div>

        <!-- Room Controls -->
        <div class="pt-3 space-y-2 mt-auto">
          <div class="grid grid-cols-2 gap-2">
            <button id="btn-edit-members-bottom" class="btn-edit-members-bottom py-3 px-4 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-black text-sm text-[#F4F0E8] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer">
              <span class="text-[#E5B91A]">${ICONS.Edit}</span>
              تعديل وتزويد أعضاء
            </button>

            <button id="btn-share-link-bottom" class="btn-share-link-bottom py-3 px-4 rounded-2xl bg-[#1B0E19] hover:bg-[#2A102E] border border-white/10 font-black text-sm text-[#E5B91A] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer">
              <span class="text-[#D92772]">${ICONS.Sparkles}</span>
              مشاركة الرابط
            </button>
          </div>

          ${startGameHtml}
        </div>
      </div>
    `;

    document.getElementById('btn-back-mygroups').onclick = () => {
      soundManager.playTap();
      navigate('MY_GROUPS');
    };

    document.getElementById('btn-leave-group').onclick = () => {
      soundManager.playTap();
      if (onLeaveGroup) onLeaveGroup(group.code);
    };

    const addBanner = document.getElementById('btn-add-edit-banner');
    if (addBanner) addBanner.onclick = () => { soundManager.playTap(); if (onOpenEditGroup) onOpenEditGroup(); };

    const editMembers = document.getElementById('btn-edit-members');
    if (editMembers) editMembers.onclick = () => { soundManager.playTap(); if (onOpenEditGroup) onOpenEditGroup(); };

    const editMembersBottom = container.querySelector('.btn-edit-members-bottom');
    if (editMembersBottom) editMembersBottom.onclick = () => { soundManager.playTap(); if (onOpenEditGroup) onOpenEditGroup(); };

    const shareLinkBottom = container.querySelector('.btn-share-link-bottom');
    if (shareLinkBottom) shareLinkBottom.onclick = handleShareLink;

    const copyCodeCard = document.getElementById('btn-copy-code-card');
    if (copyCodeCard) copyCodeCard.onclick = handleCopyCode;

    const shareLinkCard = document.getElementById('btn-share-link-card');
    if (shareLinkCard) shareLinkCard.onclick = handleShareLink;

    const btnStartEditOwn = document.getElementById('btn-start-edit-own-name');
    if (btnStartEditOwn) {
      btnStartEditOwn.onclick = () => {
        soundManager.playTap();
        isEditingOwnName = true;
        render();
      };
    }

    const btnSaveOwn = document.getElementById('btn-save-own-name');
    if (btnSaveOwn) {
      btnSaveOwn.onclick = () => {
        soundManager.playTap();
        const val = document.getElementById('input-own-name').value.trim();
        if (val) {
          if (onUpdateOwnName) onUpdateOwnName(val);
          isEditingOwnName = false;
          render();
        }
      };
    }

    const btnStart = document.getElementById('btn-start-game-now');
    if (btnStart) {
      btnStart.onclick = () => {
        soundManager.playTap();
        if (onStartGame) onStartGame();
      };
    }
  };

  const handleCopyCode = () => {
    soundManager.playTap();
    if (group.code && navigator.clipboard) {
      navigator.clipboard.writeText(group.code);
      copiedCode = true;
      render();
      setTimeout(() => { copiedCode = false; render(); }, 2500);
    }
  };

  const handleShareLink = async () => {
    soundManager.playTap();
    const shareableUrl = `${window.location.origin}${window.location.pathname}?code=${group.code}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareableUrl);
        copiedLink = true;
        render();
        setTimeout(() => { copiedLink = false; render(); }, 2500);
      } catch (e) {}
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: `انضم لجروب ${group.name} - IMPOSTER`,
          text: `تعالى العب معانا في لعبة إمبوستر\nكود الجروب: ${group.code}`,
          url: shareableUrl
        });
      } catch (e) {}
    }
  };

  render();
}
