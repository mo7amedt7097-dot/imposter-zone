import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import EditGroupModal from './components/EditGroupModal';

import HomeView from './views/HomeView';
import MyGroupsView from './views/MyGroupsView';
import CreateGroupView from './views/CreateGroupView';
import JoinGroupView from './views/JoinGroupView';
import QuickGameView from './views/QuickGameView';
import CardPlayGatewayView from './views/CardPlayGatewayView';
import LobbyView from './views/LobbyView';
import GameModeSelectView from './views/GameModeSelectView';
import CategoryView from './views/CategoryView';
import ImposterCountView from './views/ImposterCountView';
import TransitionCountdown from './views/TransitionCountdown';
import RoleRevealView from './views/RoleRevealView';
import CluePhaseView from './views/CluePhaseView';
import PrivateVotingView from './views/PrivateVotingView';
import DramaticRevealView from './views/DramaticRevealView';
import FinalGuessView from './views/FinalGuessView';
import RoundResultsView from './views/RoundResultsView';
import WinnerView from './views/WinnerView';

import { useLocalStorage } from './hooks/useLocalStorage';
import { useUserIdentity } from './hooks/useUserIdentity';
import { syncEngine } from './utils/syncEngine';
import { soundManager } from './utils/sound';
import { LogOut, Crown } from 'lucide-react';


export default function App() {
  // User Profile Identity
  const { user, setUserName } = useUserIdentity();

  // Persistent User Saved Groups & Settings
  const [rawSavedGroups, setSavedGroups] = useLocalStorage('imposter_saved_groups', []);
  const [rawScores, setScores] = useLocalStorage('imposter_scores', {});
  const [rawRecentWords, setRecentWords] = useLocalStorage('imposter_recent_words', []);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('imposter_sound', true);
  const [vibrationEnabled, setVibrationEnabled] = useLocalStorage('imposter_vibration', true);
  const [timerEnabled, setTimerEnabled] = useLocalStorage('imposter_timer', true);

  const savedGroups = Array.isArray(rawSavedGroups) ? rawSavedGroups : [];
  const scores = (typeof rawScores === 'object' && rawScores !== null) ? rawScores : {};
  const recentWords = Array.isArray(rawRecentWords) ? rawRecentWords : [];

  // Navigation State Machine
  const [currentView, setCurrentView] = useState('HOME');
  const [activeGroup, setActiveGroup] = useState(null);
  const [gameMode, setGameMode] = useState('ONE_PHONE'); // ONE_PHONE | MULTI_PHONE
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [secretWordObj, setSecretWordObj] = useState(null);
  const [imposterCount, setImposterCount] = useState(1);
  const [imposterIds, setImposterIds] = useState([]);
  const [votes, setVotes] = useState({});
  const [rolesRevealed, setRolesRevealed] = useState({});
  const [caughtImposterIds, setCaughtImposterIds] = useState([]);
  const [guessResults, setGuessResults] = useState({});
  const [winnerPlayer, setWinnerPlayer] = useState(null);

  // Notifications & Modals
  const [hostTransferMessage, setHostTransferMessage] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [initialUrlCode, setInitialUrlCode] = useState('');

  const [activeRoomCode, setActiveRoomCode] = useLocalStorage('imposter_active_room_code', '');

  useEffect(() => {
    soundManager.setEnabled(soundEnabled, vibrationEnabled);

    // Auto detect direct link ?code=... or #code=...
    const params = new URLSearchParams(window.location.search);
    let codeParam = params.get('code');

    if (!codeParam && window.location.hash) {
      const hashClean = window.location.hash.replace(/^#\/?/, '');
      const hashParams = new URLSearchParams(hashClean);
      codeParam = hashParams.get('code') || hashClean;
    }

    if (codeParam) {
      const formatted = codeParam.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
      if (formatted.length >= 4) {
        setInitialUrlCode(formatted);
        setGameMode('MULTI_PHONE');
        setCurrentView('JOIN_GROUP');
        return;
      }
    }

    // Auto-reconnect on refresh if active room exists
    if (activeRoomCode) {
      syncEngine.fetchRoomState(activeRoomCode).then((remoteRoom) => {
        if (remoteRoom && remoteRoom.players?.some(p => p.id === user.id)) {
          const sanitized = ensureGroupHasHost(remoteRoom);
          setActiveGroup(sanitized);
          if (sanitized.secretWordObj) setSecretWordObj(sanitized.secretWordObj);
          if (sanitized.imposterIds) setImposterIds(sanitized.imposterIds);
          if (sanitized.gameMode) setGameMode(sanitized.gameMode);
          if (sanitized.votes) setVotes(sanitized.votes);
          if (sanitized.rolesRevealed) setRolesRevealed(sanitized.rolesRevealed);
          if (sanitized.guessResults) setGuessResults(sanitized.guessResults);
          if (sanitized.currentRemoteView) setCurrentView(sanitized.currentRemoteView);
        }
      }).catch(() => {});
    }
  }, []);

  // Helper: Guarantees every group always has exactly 1 valid Host
  const ensureGroupHasHost = (group) => {
    if (!group || !group.players || group.players.length === 0) return group;
    const hostExists = group.players.some(p => p.id === group.hostUserId);
    if (!group.hostUserId || !hostExists) {
      return {
        ...group,
        hostUserId: group.players[0].id
      };
    }
    return group;
  };

  // Realtime Sync Subscription for Active Group
  useEffect(() => {
    if (!activeGroup?.code) return;

    const roomCode = activeGroup.code;
    const unsubscribe = syncEngine.subscribeRoomState(roomCode, (remoteState) => {
      if (remoteState) {
        const sanitized = ensureGroupHasHost(remoteState);
        if (sanitized.hostUserId !== activeGroup?.hostUserId) {
          const oldHost = activeGroup?.players?.find(p => p.id === activeGroup.hostUserId);
          const newHost = sanitized.players?.find(p => p.id === sanitized.hostUserId);
          if (oldHost && newHost) {
            setHostTransferMessage(`${oldHost.name} خرج — ${newHost.name} بقى الـHost`);
            setTimeout(() => setHostTransferMessage(''), 4000);
          }
        }

        setActiveGroup(sanitized);

        if (sanitized.secretWordObj) setSecretWordObj(sanitized.secretWordObj);
        if (sanitized.imposterIds) setImposterIds(sanitized.imposterIds);
        if (sanitized.gameMode) setGameMode(sanitized.gameMode);
        if (sanitized.votes) setVotes(sanitized.votes);
        if (sanitized.rolesRevealed) setRolesRevealed(sanitized.rolesRevealed);
        if (sanitized.caughtImposterIds) setCaughtImposterIds(sanitized.caughtImposterIds);
        if (sanitized.guessResults) setGuessResults(sanitized.guessResults);
        if (sanitized.scores) setScores(sanitized.scores);

        setSavedGroups((prev) => {
          const exists = prev.some(g => g.code === sanitized.code);
          if (exists) {
            return prev.map(g => g.code === sanitized.code ? sanitized : g);
          }
          return [...prev, sanitized];
        });

        if (sanitized.currentRemoteView) {
          setCurrentView(sanitized.currentRemoteView);
        }
      }
    });

    return () => unsubscribe();
  }, [activeGroup?.code, activeGroup?.hostUserId, gameMode]);

  const broadcastRoomUpdate = (updatedRoom, nextView = null) => {
    const sanitizedRoom = ensureGroupHasHost(updatedRoom);
    const roomToPublish = {
      ...sanitizedRoom,
      currentRemoteView: nextView || currentView
    };

    setActiveGroup(roomToPublish);
    if (sanitizedRoom.code) setActiveRoomCode(sanitizedRoom.code);

    if (!sanitizedRoom.isQuick) {
      setSavedGroups((prev) => {
        const filtered = prev.filter(g => g.code !== sanitizedRoom.code);
        return [sanitizedRoom, ...filtered];
      });
    }

    // ALWAYS publish room state so ALL connected devices switch screens & receive updates in real time!
    if (sanitizedRoom.code) {
      syncEngine.publishRoomState(sanitizedRoom.code, roomToPublish);
    }
  };

  // Group Handlers
  const handleCreateGroup = (newGroup, playerName) => {
    const hostId = newGroup.hostUserId || user.id;
    setUserName(playerName, hostId);
    soundManager.playCorrectGuess();
    setCurrentView('LOBBY');
    broadcastRoomUpdate(newGroup, 'LOBBY');
  };

  const handleJoinGroupSuccess = (joinedGroup, playerName, joinedPlayerId = null) => {
    setUserName(playerName, joinedPlayerId);
    soundManager.playCorrectGuess();
    setCurrentView('LOBBY');
    broadcastRoomUpdate(joinedGroup, 'LOBBY');
  };

  const handleStartQuickGame = (quickGroup) => {
    setActiveGroup(quickGroup);
    setCurrentView('LOBBY');
  };

  const handleSelectGroupFromList = (group) => {
    setActiveGroup(group);
    setCurrentView('LOBBY');
  };

  const handleDeleteGroup = (groupCode) => {
    const groupToDelete = savedGroups.find((g) => g.code === groupCode) || (activeGroup?.code === groupCode ? activeGroup : null);

    setSavedGroups((prev) => prev.filter((g) => g.code !== groupCode));

    if (groupToDelete) {
      const currentPlayers = groupToDelete.players || [];
      const remainingPlayers = currentPlayers.filter((p) => p.id !== user.id);

      if (remainingPlayers.length === 0 || groupToDelete.hostUserId === user.id) {
        syncEngine.deleteRoomFromRegistry(groupCode);
      } else {
        const updatedGroup = ensureGroupHasHost({
          ...groupToDelete,
          players: remainingPlayers
        });
        syncEngine.publishRoomState(groupCode, updatedGroup);
      }
    }

    if (activeGroup?.code === groupCode) {
      setActiveGroup(null);
      setCurrentView('MY_GROUPS');
    }
  };

  const handleLeaveGroup = (groupCode) => {
    if (!activeGroup) return;

    const currentPlayers = activeGroup.players || [];
    const remainingPlayers = currentPlayers.filter(p => p.id !== user.id);

    if (remainingPlayers.length === 0) {
      syncEngine.deleteRoomFromRegistry(groupCode);
      setSavedGroups(prev => prev.filter(g => g.code !== groupCode));
      setActiveGroup(null);
      setCurrentView('HOME');
    } else {
      const updatedGroup = ensureGroupHasHost({
        ...activeGroup,
        players: remainingPlayers
      });

      setActiveGroup(null);
      setCurrentView('HOME');
      broadcastRoomUpdate(updatedGroup);
    }
  };

  const isHost = activeGroup?.hostUserId === user.id;

  const handleSaveGroupEditing = (updatedGroup) => {
    broadcastRoomUpdate(updatedGroup);
  };

  const handleUpdateOwnName = (newName) => {
    if (!activeGroup) return;
    setUserName(newName);
    const updatedPlayers = activeGroup.players.map((p) =>
      p.id === user.id ? { ...p, name: newName } : p
    );
    const updatedGroup = { ...activeGroup, players: updatedPlayers };
    broadcastRoomUpdate(updatedGroup);
  };

  // Active Round Exit Handler (Direct return to Home)
  const handleConfirmExitRound = () => {
    setShowExitConfirm(false);
    setCurrentView('HOME');
    if (activeGroup) broadcastRoomUpdate(activeGroup, 'HOME');
  };

  const activeRoundViews = [
    'TRANSITION_COUNTDOWN',
    'ROLE_REVEAL',
    'CLUE_PHASE',
    'PRIVATE_VOTING',
    'DRAMATIC_REVEAL',
    'FINAL_GUESS'
  ];
  const isGameActive = activeRoundViews.includes(currentView);

  // Back Navigation Handler
  const handleHeaderBack = () => {
    if (isGameActive) {
      setShowExitConfirm(true);
      return;
    }

    switch (currentView) {
      case 'IMPOSTER_COUNT_SELECT':
        setCurrentView('CATEGORY_SELECT');
        break;
      case 'CATEGORY_SELECT':
        setCurrentView('GAME_MODE_SELECT');
        break;
      case 'GAME_MODE_SELECT':
        setCurrentView('LOBBY');
        break;
      case 'LOBBY':
        if (savedGroups.length > 0) {
          setCurrentView('MY_GROUPS');
        } else {
          setCurrentView('HOME');
        }
        break;
      case 'ROUND_RESULTS':
      case 'WINNER':
        setCurrentView('LOBBY');
        break;
      case 'MY_GROUPS':
      case 'CREATE_GROUP':
      case 'JOIN_GROUP':
      case 'QUICK_GAME':
      case 'CARD_GATEWAY':
      default:
        setCurrentView('HOME');
        break;
    }
  };

  // Mode & Round Flow
  const handleStartGameClick = () => {
    setCurrentView('GAME_MODE_SELECT');
    if (activeGroup) broadcastRoomUpdate(activeGroup, 'GAME_MODE_SELECT');
  };

  const handleSelectGameMode = (mode) => {
    setGameMode(mode);
    setCurrentView('CATEGORY_SELECT');
    if (activeGroup) broadcastRoomUpdate({ ...activeGroup, gameMode: mode }, 'CATEGORY_SELECT');
  };

  const handleSelectCategory = (catId, wordObj) => {
    setSelectedCategory(catId);
    setSecretWordObj(wordObj);

    if (wordObj && wordObj.secretWord) {
      setRecentWords((prev) => [wordObj.secretWord, ...prev.slice(0, 25)]);
    }

    if (activeGroup && activeGroup.players.length > 5) {
      setCurrentView('IMPOSTER_COUNT_SELECT');
      broadcastRoomUpdate({ ...activeGroup, secretWordObj: wordObj }, 'IMPOSTER_COUNT_SELECT');
    } else {
      setupRound(1, wordObj);
    }
  };

  const handleSelectImposterCount = (count) => {
    setupRound(count, secretWordObj);
  };

  // Cryptographically Secure & Anti-Repeat Imposter Selection Algorithm
  const setupRound = (count, wordObj) => {
    setImposterCount(count);
    const players = activeGroup ? activeGroup.players : [];
    if (!players || players.length === 0) return;

    // Cryptographically Secure Pseudo-Random Generator (CSPRNG)
    const getSecureRandomIndex = (max) => {
      if (max <= 1) return 0;
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    };

    // Filter out previous round's imposters if enough other players exist
    const prevIds = activeGroup?.previousImposterIds || imposterIds || [];
    const nonPrevPlayers = players.filter((p) => !prevIds.includes(p.id));

    let candidates = [];
    if (nonPrevPlayers.length >= count) {
      candidates = [...nonPrevPlayers];
    } else {
      candidates = [...players];
    }

    // High-Entropy Fisher-Yates Shuffle on candidates
    const shuffled = [...candidates];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = getSecureRandomIndex(i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    let pickedImposterIds = shuffled.slice(0, count).map((p) => p.id);

    // If more imposters are needed to satisfy count, pick from remaining players
    if (pickedImposterIds.length < count) {
      const remainingPlayers = players.filter((p) => !pickedImposterIds.includes(p.id));
      const shuffledRemaining = [...remainingPlayers];
      for (let i = shuffledRemaining.length - 1; i > 0; i--) {
        const j = getSecureRandomIndex(i + 1);
        [shuffledRemaining[i], shuffledRemaining[j]] = [shuffledRemaining[j], shuffledRemaining[i]];
      }
      const extraNeeded = count - pickedImposterIds.length;
      pickedImposterIds = [...pickedImposterIds, ...shuffledRemaining.slice(0, extraNeeded).map((p) => p.id)];
    }

    setImposterIds(pickedImposterIds);
    setVotes({});
    setRolesRevealed({});
    setCaughtImposterIds([]);
    setGuessResults({});

    const updatedGroup = {
      ...activeGroup,
      secretWordObj: wordObj,
      imposterIds: pickedImposterIds,
      previousImposterIds: pickedImposterIds,
      gameMode: gameMode,
      rolesRevealed: {},
      votes: {},
      guessResults: {}
    };

    broadcastRoomUpdate(updatedGroup, 'TRANSITION_COUNTDOWN');
    setCurrentView('TRANSITION_COUNTDOWN');
  };

  const handleCountdownFinished = () => {
    setCurrentView('ROLE_REVEAL');
    if (activeGroup) broadcastRoomUpdate(activeGroup, 'ROLE_REVEAL');
  };

  const handleRoleRevealed = (userId) => {
    if (!activeGroup) return;
    const updatedRoles = { ...rolesRevealed, [userId]: true };
    setRolesRevealed(updatedRoles);

    const updatedGroup = {
      ...activeGroup,
      rolesRevealed: updatedRoles
    };

    const allRevealed = activeGroup.players.every(p => Boolean(updatedRoles[p.id]));

    if (allRevealed && gameMode === 'MULTI_PHONE') {
      broadcastRoomUpdate(updatedGroup, 'CLUE_PHASE');
    } else {
      broadcastRoomUpdate(updatedGroup);
    }
  };

  const handleRoleRevealComplete = () => {
    setCurrentView('CLUE_PHASE');
    if (activeGroup) broadcastRoomUpdate(activeGroup, 'CLUE_PHASE');
  };

  const handleCluePhaseComplete = () => {
    setCurrentView('PRIVATE_VOTING');
    if (activeGroup) broadcastRoomUpdate(activeGroup, 'PRIVATE_VOTING');
  };

  const handleCastVote = (voterId, suspectId) => {
    const updatedVotes = { ...votes, [voterId]: suspectId };
    setVotes(updatedVotes);
    if (!activeGroup) return;

    const totalCount = activeGroup.players?.length || 0;
    const votesCount = Object.keys(updatedVotes).length;

    if (gameMode === 'MULTI_PHONE' && votesCount >= totalCount && totalCount > 0) {
      setCurrentView('DRAMATIC_REVEAL');
      broadcastRoomUpdate({ ...activeGroup, votes: updatedVotes }, 'DRAMATIC_REVEAL');
    } else {
      broadcastRoomUpdate({ ...activeGroup, votes: updatedVotes });
    }
  };

  const handleVotingComplete = (votesMap) => {
    const finalVotes = votesMap && Object.keys(votesMap).length > 0 ? votesMap : votes;
    setVotes(finalVotes);
    setCurrentView('DRAMATIC_REVEAL');
    if (activeGroup) broadcastRoomUpdate({ ...activeGroup, votes: finalVotes }, 'DRAMATIC_REVEAL');
  };

  const handleDramaticRevealProceed = (caughtIds) => {
    const validCaught = (caughtIds || []).filter(Boolean);
    setCaughtImposterIds(validCaught);
    const nextView = validCaught.length > 0 ? 'FINAL_GUESS' : 'ROUND_RESULTS';
    setCurrentView(nextView);
    if (activeGroup) {
      broadcastRoomUpdate({ ...activeGroup, caughtImposterIds: validCaught }, nextView);
    }
  };

  const handleGuessSubmit = (imposterId, isCorrect) => {
    const updated = { ...guessResults, [imposterId]: isCorrect };
    setGuessResults(updated);
    if (activeGroup) {
      broadcastRoomUpdate({ ...activeGroup, guessResults: updated });
    }
  };

  const handleFinalGuessComplete = (finalResultsMap) => {
    const resultsToUse = finalResultsMap && Object.keys(finalResultsMap).length > 0 ? finalResultsMap : guessResults;
    setGuessResults(resultsToUse);
    setCurrentView('ROUND_RESULTS');
    if (activeGroup) broadcastRoomUpdate({ ...activeGroup, guessResults: resultsToUse }, 'ROUND_RESULTS');
  };

  const handleNextRound = () => {
    setCurrentView('CATEGORY_SELECT');
    if (activeGroup) broadcastRoomUpdate(activeGroup, 'CATEGORY_SELECT');
  };

  const handleTriggerWinner = (winnerObj) => {
    setWinnerPlayer(winnerObj);
    setCurrentView('WINNER');
    if (activeGroup) broadcastRoomUpdate(activeGroup, 'WINNER');
  };

  const handleUpdateScores = (newScoresMap) => {
    setScores(newScoresMap);
    if (activeGroup) {
      const updatedGroup = { ...activeGroup, scores: newScoresMap };
      broadcastRoomUpdate(updatedGroup);
    }
  };

  const handleResetScores = () => {
    const freshScores = {};
    if (activeGroup) {
      activeGroup.players.forEach((p) => {
        freshScores[p.id] = 0;
      });
    }
    setScores(freshScores);
    if (activeGroup) {
      broadcastRoomUpdate({ ...activeGroup, scores: freshScores });
    }
    if (currentView === 'WINNER') {
      setCurrentView('CATEGORY_SELECT');
    }
  };

  const handleResetAll = () => {
    setSavedGroups([]);
    setActiveGroup(null);
    setScores({});
    setRecentWords([]);
    setCurrentView('HOME');
  };

  return (
    <div className="min-h-screen bg-[#120A12] text-[#F4F0E8] flex flex-col justify-between selection:bg-[#D92772] selection:text-white font-sans antialiased relative">
      {/* Top Header with Room Code Badge & Back Button */}
      <Header
        groupName={activeGroup?.name}
        roomCode={activeGroup?.code}
        playerCount={activeGroup?.players?.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onBack={handleHeaderBack}
        canGoBack={currentView !== 'HOME'}
        isGameActive={isGameActive}
      />

      {/* Main App Content View */}
      <main className="flex-1 flex flex-col w-full relative z-10">
        {currentView === 'HOME' && (
          <HomeView
            savedGroupsCount={savedGroups.length}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'MY_GROUPS' && (
          <MyGroupsView
            groups={savedGroups}
            currentUserId={user.id}
            scores={scores}
            onSelectGroup={handleSelectGroupFromList}
            onEditGroup={(grp) => {
              setActiveGroup(grp);
              setIsEditGroupOpen(true);
            }}
            onDeleteGroup={handleDeleteGroup}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'CREATE_GROUP' && (
          <CreateGroupView
            currentUser={user}
            onCreateGroup={handleCreateGroup}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'JOIN_GROUP' && (
          <JoinGroupView
            currentUser={user}
            initialCode={initialUrlCode}
            onJoinGroupSuccess={handleJoinGroupSuccess}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'QUICK_GAME' && (
          <QuickGameView
            onStartQuickGame={handleStartQuickGame}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'CARD_GATEWAY' && (
          <CardPlayGatewayView onNavigate={setCurrentView} />
        )}

        {currentView === 'LOBBY' && (
          <LobbyView
            group={activeGroup}
            gameMode={gameMode}
            currentUserId={user.id}
            scores={scores}
            hostTransferMessage={hostTransferMessage}
            onStartGame={handleStartGameClick}
            onOpenEditGroup={() => setIsEditGroupOpen(true)}
            onUpdateOwnName={handleUpdateOwnName}
            onLeaveGroup={handleLeaveGroup}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'GAME_MODE_SELECT' && (
          !isHost && gameMode === 'MULTI_PHONE' ? (
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto w-full text-[#F4F0E8] text-center">
              <div className="glass-panel p-8 rounded-3xl border border-[#E5B91A]/40 shadow-2xl space-y-4 w-full bg-gradient-to-b from-[#2A102E] to-[#120A12]">
                <div className="w-16 h-16 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/50 flex items-center justify-center mx-auto">
                  <Crown className="w-8 h-8 text-[#E5B91A]" />
                </div>
                <h2 className="text-2xl font-black text-[#E5B91A]">طريقة اللعب</h2>
                <p className="text-xs font-bold text-[#F4F0E8]/70 animate-pulse">
                  في انتظار الـ Host تحديد هل اللعب من موبايل واحد أم عدة هواتف...
                </p>
              </div>
            </div>
          ) : (
            <GameModeSelectView
              onSelectGameMode={handleSelectGameMode}
              onBack={() => setCurrentView('LOBBY')}
            />
          )
        )}

        {currentView === 'CATEGORY_SELECT' && (
          !isHost && gameMode === 'MULTI_PHONE' ? (
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto w-full text-[#F4F0E8] text-center">
              <div className="glass-panel p-8 rounded-3xl border border-[#E5B91A]/40 shadow-2xl space-y-4 w-full bg-gradient-to-b from-[#2A102E] to-[#120A12]">
                <div className="w-16 h-16 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/50 flex items-center justify-center mx-auto">
                  <Crown className="w-8 h-8 text-[#E5B91A]" />
                </div>
                <h2 className="text-2xl font-black text-[#E5B91A]">اختيار الفئة</h2>
                <p className="text-xs font-bold text-[#F4F0E8]/70 animate-pulse">
                  في انتظار الـ Host اختيار الفئة وبدء الجولة فوراً...
                </p>
              </div>
            </div>
          ) : (
            <CategoryView
              recentWords={recentWords}
              isHost={isHost}
              onSelectCategory={handleSelectCategory}
            />
          )
        )}

        {currentView === 'IMPOSTER_COUNT_SELECT' && (
          !isHost && gameMode === 'MULTI_PHONE' ? (
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto w-full text-[#F4F0E8] text-center">
              <div className="glass-panel p-8 rounded-3xl border border-[#E5B91A]/40 shadow-2xl space-y-4 w-full bg-gradient-to-b from-[#2A102E] to-[#120A12]">
                <div className="w-16 h-16 rounded-full bg-[#E5B91A]/20 border border-[#E5B91A]/50 flex items-center justify-center mx-auto">
                  <Crown className="w-8 h-8 text-[#E5B91A]" />
                </div>
                <h2 className="text-2xl font-black text-[#E5B91A]">اختيار عدد الإمبوسترز</h2>
                <p className="text-xs font-bold text-[#F4F0E8]/70 animate-pulse">
                  في انتظار الـ Host تحديد هل تلعبوا بإمبوستر واحد أم إمبوسترين...
                </p>
              </div>
            </div>
          ) : (
            <ImposterCountView
              playerCount={activeGroup?.players?.length || 6}
              onSelectImposterCount={handleSelectImposterCount}
            />
          )
        )}

        {currentView === 'TRANSITION_COUNTDOWN' && (
          <TransitionCountdown onComplete={handleCountdownFinished} />
        )}

        {currentView === 'ROLE_REVEAL' && (
          <RoleRevealView
            players={activeGroup?.players || []}
            secretWord={secretWordObj?.secretWord || ''}
            imposterIds={imposterIds}
            gameMode={gameMode}
            currentUserId={user.id}
            rolesRevealed={rolesRevealed}
            onRoleRevealed={handleRoleRevealed}
            onComplete={handleRoleRevealComplete}
          />
        )}

        {currentView === 'CLUE_PHASE' && (
          <CluePhaseView
            timerEnabled={timerEnabled}
            gameMode={gameMode}
            isHost={isHost}
            onStartVoting={handleCluePhaseComplete}
          />
        )}

        {currentView === 'PRIVATE_VOTING' && (
          <PrivateVotingView
            players={activeGroup?.players || []}
            gameMode={gameMode}
            currentUserId={user.id}
            isHost={isHost}
            votes={votes}
            onCastVote={handleCastVote}
            onVotingComplete={handleVotingComplete}
          />
        )}

        {currentView === 'DRAMATIC_REVEAL' && (
          <DramaticRevealView
            players={activeGroup?.players || []}
            imposterIds={imposterIds}
            votes={votes}
            onProceed={handleDramaticRevealProceed}
          />
        )}

        {currentView === 'FINAL_GUESS' && (
          <FinalGuessView
            caughtImposterIds={caughtImposterIds}
            imposterIds={imposterIds}
            players={activeGroup?.players || []}
            secretWordObj={secretWordObj}
            gameMode={gameMode}
            currentUserId={user.id}
            isHost={isHost}
            guessResults={guessResults}
            onGuessSubmit={handleGuessSubmit}
            onComplete={handleFinalGuessComplete}
          />
        )}

        {currentView === 'ROUND_RESULTS' && (
          <RoundResultsView
            players={activeGroup?.players || []}
            imposterIds={imposterIds}
            votes={votes}
            guessResults={guessResults}
            scores={scores}
            onUpdateScores={handleUpdateScores}
            onNextRound={handleNextRound}
            onTriggerWinner={handleTriggerWinner}
            onGoHome={() => setCurrentView('HOME')}
          />
        )}

        {currentView === 'WINNER' && (
          <WinnerView
            winner={winnerPlayer}
            onResetScores={handleResetScores}
            onContinuePlaying={handleNextRound}
            onGoHome={() => setCurrentView('HOME')}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        vibrationEnabled={vibrationEnabled}
        setVibrationEnabled={setVibrationEnabled}
        timerEnabled={timerEnabled}
        setTimerEnabled={setTimerEnabled}
        onEditGroup={() => setIsEditGroupOpen(true)}
        onResetScores={handleResetScores}
        onResetAll={handleResetAll}
      />

      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={isEditGroupOpen}
        onClose={() => setIsEditGroupOpen(false)}
        group={activeGroup}
        onSaveGroup={handleSaveGroupEditing}
      />

      {/* Active Round Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl border border-red-500/40 shadow-2xl max-w-sm w-full text-center space-y-4 bg-gradient-to-b from-[#2A102E] to-[#120A12]">
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto text-[#D92772]">
              <LogOut className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-xl font-black text-[#F4F0E8]">
              أكيد عاوز تخرج من الجولة يا معلم؟
            </h3>
            <p className="text-xs font-bold text-[#F4F0E8]/70">
              الخروج هيفصلك من الجولة ويرجعك للصفحة الرئيسية فوراً!
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#F4F0E8] font-extrabold text-sm"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmExitRound}
                className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span>تأكيد الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
