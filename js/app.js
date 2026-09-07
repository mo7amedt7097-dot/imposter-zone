// IMPOSTER Main Application Orchestrator (Vanilla JS)

import { store } from './state.js';
import { syncEngine } from './syncEngine.js';
import { soundManager } from './sound.js';

import { renderHeader } from './components/header.js';
import { renderSettingsModal, renderEditGroupModal } from './components/modals.js';

import { renderHomeView } from './views/homeView.js';
import { renderMyGroupsView } from './views/myGroupsView.js';
import { renderCreateGroupView } from './views/createGroupView.js';
import { renderJoinGroupView } from './views/joinGroupView.js';
import { renderQuickGameView } from './views/quickGameView.js';
import { renderCardPlayGatewayView } from './views/cardPlayGatewayView.js';
import { renderLobbyView } from './views/lobbyView.js';
import { renderGameModeSelectView } from './views/gameModeSelectView.js';
import { renderCategoryView } from './views/categoryView.js';
import { renderImposterCountView } from './views/imposterCountView.js';
import { renderRoleRevealView } from './views/roleRevealView.js';
import { renderCluePhaseView } from './views/cluePhaseView.js';
import { renderPrivateVotingView } from './views/privateVotingView.js';
import { renderDramaticRevealView } from './views/dramaticRevealView.js';
import { renderFinalGuessView } from './views/finalGuessView.js';
import { renderRoundResultsView } from './views/roundResultsView.js';
import { renderWinnerView } from './views/winnerView.js';

class App {
  constructor() {
    this.headerContainer = document.getElementById('header-container');
    this.viewContainer = document.getElementById('view-container');
    this.modalContainer = document.getElementById('modal-container');
    this.initialUrlCode = null;
    this.unsubRoomSync = null;

    this.init();
  }

  init() {
    // Sound settings
    const state = store.get();
    soundManager.setEnabled(state.soundEnabled, state.vibrationEnabled);

    // Detect URL room code (e.g. ?code=SRWQ)
    const urlParams = new URLSearchParams(window.location.search);
    const urlCode = urlParams.get('code');
    if (urlCode && urlCode.trim().length >= 4) {
      this.initialUrlCode = urlCode.trim().toUpperCase();
      store.set({ currentView: 'JOIN_GROUP' });
    }

    // Subscribe to store updates
    store.subscribe((data) => {
      this.renderApp(data);
    });

    this.renderApp(store.get());
  }

  navigate(newView) {
    const currentState = store.get();
    store.set({ currentView: newView });
  }

  setupRoomSync(roomCode) {
    if (this.unsubRoomSync) {
      this.unsubRoomSync();
      this.unsubRoomSync = null;
    }
    if (!roomCode) return;

    this.unsubRoomSync = syncEngine.subscribeRoomState(roomCode, (remoteState) => {
      const state = store.get();
      if (!remoteState) return;

      const updatedPlayers = remoteState.players || [];
      const updatedScores = remoteState.scores || {};
      const remoteView = remoteState.currentView;

      let mergedActiveGroup = {
        ...(state.activeGroup || {}),
        ...remoteState,
        players: updatedPlayers,
        scores: updatedScores
      };

      // Save to saved groups
      const currentSaved = state.savedGroups || [];
      const idx = currentSaved.findIndex(g => g && g.code === remoteState.code);
      let newSavedList;
      if (idx >= 0) {
        newSavedList = [...currentSaved];
        newSavedList[idx] = mergedActiveGroup;
      } else {
        newSavedList = [mergedActiveGroup, ...currentSaved];
      }

      const patch = {
        activeGroup: mergedActiveGroup,
        savedGroups: newSavedList,
        scores: { ...(state.scores || {}), ...updatedScores }
      };

      if (remoteState.secretWordObj) patch.secretWordObj = remoteState.secretWordObj;
      if (remoteState.imposterIds) patch.imposterIds = remoteState.imposterIds;
      if (remoteState.rolesRevealed) patch.rolesRevealed = remoteState.rolesRevealed;
      if (remoteState.votes) patch.votes = remoteState.votes;
      if (remoteState.guessResults) patch.guessResults = remoteState.guessResults;

      // Sync view across all multi-phone devices
      if (state.gameMode === 'MULTI_PHONE' && remoteView && remoteView !== state.currentView) {
        patch.currentView = remoteView;
      }

      store.set(patch);
    });
  }

  async broadcastRoomUpdate(partialRoom) {
    const state = store.get();
    if (!state.activeGroup) return;

    const updatedGroup = {
      ...state.activeGroup,
      ...partialRoom,
      currentView: state.currentView
    };

    store.set({ activeGroup: updatedGroup });

    if (updatedGroup.code && updatedGroup.code !== 'QUICK') {
      await syncEngine.publishRoomState(updatedGroup.code, updatedGroup);
    }
  }

  openSettings() {
    renderSettingsModal(
      this.modalContainer,
      store.get(),
      () => {},
      () => this.openEditGroup(),
      () => this.resetAllData()
    );
  }

  openEditGroup() {
    renderEditGroupModal(
      this.modalContainer,
      store.get(),
      () => {},
      (updatedGroup) => {
        const state = store.get();
        const currentSaved = state.savedGroups || [];
        const idx = currentSaved.findIndex(g => g.code === updatedGroup.code);
        let newSaved;
        if (idx >= 0) {
          newSaved = [...currentSaved];
          newSaved[idx] = updatedGroup;
        } else {
          newSaved = [updatedGroup, ...currentSaved];
        }
        store.set({
          activeGroup: updatedGroup,
          savedGroups: newSaved,
          scores: { ...state.scores, ...updatedGroup.scores }
        });
        if (updatedGroup.code && updatedGroup.code !== 'QUICK') {
          syncEngine.publishRoomState(updatedGroup.code, updatedGroup);
        }
      }
    );
  }

  resetAllData() {
    try { localStorage.clear(); } catch(e) {}
    window.location.reload();
  }

  renderApp(state) {
    // 1. Render Header
    renderHeader(
      this.headerContainer,
      state,
      (view) => this.navigate(view),
      () => this.openSettings(),
      () => this.handleHeaderBack(state)
    );

    // 2. Render Active View
    const vContainer = this.viewContainer;
    const view = state.currentView;

    switch (view) {
      case 'HOME':
        renderHomeView(vContainer, state, (v) => this.navigate(v));
        break;

      case 'MY_GROUPS':
        renderMyGroupsView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (group) => {
            store.set({ activeGroup: group, currentView: 'LOBBY' });
            if (group.code && group.code !== 'QUICK') this.setupRoomSync(group.code);
          },
          (group) => {
            store.set({ activeGroup: group });
            this.openEditGroup();
          },
          (groupCode) => {
            const newSaved = (state.savedGroups || []).filter(g => g.code !== groupCode);
            store.set({ savedGroups: newSaved });
            syncEngine.deleteRoomFromRegistry(groupCode);
          }
        );
        break;

      case 'CREATE_GROUP':
        renderCreateGroupView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (newGroup, pName) => {
            const newSaved = [newGroup, ...(state.savedGroups || [])];
            store.set({
              activeGroup: newGroup,
              savedGroups: newSaved,
              user: { ...state.user, name: pName },
              currentView: 'LOBBY'
            });
            this.setupRoomSync(newGroup.code);
            syncEngine.publishRoomState(newGroup.code, newGroup);
          }
        );
        break;

      case 'JOIN_GROUP':
        renderJoinGroupView(
          vContainer,
          state,
          (v) => this.navigate(v),
          this.initialUrlCode,
          (joinedGroup, pName, activePlayerId) => {
            const newSaved = [joinedGroup, ...(state.savedGroups || []).filter(g => g.code !== joinedGroup.code)];
            store.set({
              activeGroup: joinedGroup,
              savedGroups: newSaved,
              user: { id: activePlayerId, name: pName },
              currentView: 'LOBBY'
            });
            this.setupRoomSync(joinedGroup.code);
          }
        );
        break;

      case 'QUICK_GAME':
        renderQuickGameView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (quickGroup) => {
            store.set({ activeGroup: quickGroup, currentView: 'GAME_MODE_SELECT' });
          }
        );
        break;

      case 'CARD_GATEWAY':
        renderCardPlayGatewayView(vContainer, state, (v) => this.navigate(v));
        break;

      case 'LOBBY':
        renderLobbyView(
          vContainer,
          state,
          (v) => this.navigate(v),
          () => this.navigate('GAME_MODE_SELECT'),
          () => this.openEditGroup(),
          (newName) => {
            const group = state.activeGroup;
            if (!group) return;
            const updatedPlayers = (group.players || []).map(p => p.id === state.user?.id ? { ...p, name: newName } : p);
            const updated = { ...group, players: updatedPlayers };
            this.broadcastRoomUpdate(updated);
            store.set({ user: { ...state.user, name: newName } });
          },
          (groupCode) => {
            const newSaved = (state.savedGroups || []).filter(g => g.code !== groupCode);
            store.set({ savedGroups: newSaved, activeGroup: null, currentView: 'MY_GROUPS' });
          }
        );
        break;

      case 'GAME_MODE_SELECT':
        renderGameModeSelectView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (mode) => {
            store.set({ gameMode: mode, currentView: 'CATEGORY' });
            this.broadcastRoomUpdate({ gameMode: mode, currentView: 'CATEGORY' });
          },
          () => this.navigate('LOBBY')
        );
        break;

      case 'CATEGORY':
        renderCategoryView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (catId, wordObj) => {
            const playersCount = state.activeGroup?.players?.length || 6;
            const recentWords = [wordObj.secretWord, ...(state.recentWords || []).slice(0, 20)];
            const patch = {
              selectedCategory: catId,
              secretWordObj: wordObj,
              recentWords,
              rolesRevealed: {},
              votes: {},
              guessResults: {},
              caughtImposterIds: []
            };

            if (playersCount > 6) {
              patch.currentView = 'IMPOSTER_COUNT';
              store.set(patch);
              this.broadcastRoomUpdate(patch);
            } else {
              const impIds = this.calculateImposters(state.activeGroup?.players || [], 1);
              patch.imposterCount = 1;
              patch.imposterIds = impIds;
              patch.currentView = 'ROLE_REVEAL';
              store.set(patch);
              this.broadcastRoomUpdate(patch);
            }
          }
        );
        break;

      case 'IMPOSTER_COUNT':
        renderImposterCountView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (count) => {
            const impIds = this.calculateImposters(state.activeGroup?.players || [], count);
            const patch = {
              imposterCount: count,
              imposterIds: impIds,
              currentView: 'ROLE_REVEAL'
            };
            store.set(patch);
            this.broadcastRoomUpdate(patch);
          }
        );
        break;

      case 'ROLE_REVEAL':
        renderRoleRevealView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (playerId) => {
            const updated = { ...(state.rolesRevealed || {}), [playerId]: true };
            store.set({ rolesRevealed: updated });
            this.broadcastRoomUpdate({ rolesRevealed: updated });
          },
          () => {
            store.set({ currentView: 'CLUE_PHASE' });
            this.broadcastRoomUpdate({ currentView: 'CLUE_PHASE' });
          }
        );
        break;

      case 'CLUE_PHASE':
        renderCluePhaseView(
          vContainer,
          state,
          (v) => this.navigate(v),
          () => {
            store.set({ currentView: 'PRIVATE_VOTING' });
            this.broadcastRoomUpdate({ currentView: 'PRIVATE_VOTING' });
          }
        );
        break;

      case 'PRIVATE_VOTING':
        renderPrivateVotingView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (voterId, suspectId) => {
            const updatedVotes = { ...(state.votes || {}), [voterId]: suspectId };
            store.set({ votes: updatedVotes });
            this.broadcastRoomUpdate({ votes: updatedVotes });
          },
          (finalVotes) => {
            store.set({ currentView: 'DRAMATIC_REVEAL' });
            this.broadcastRoomUpdate({ currentView: 'DRAMATIC_REVEAL' });
          }
        );
        break;

      case 'DRAMATIC_REVEAL':
        renderDramaticRevealView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (caughtIds) => {
            store.set({ caughtImposterIds: caughtIds, currentView: 'FINAL_GUESS' });
            this.broadcastRoomUpdate({ caughtImposterIds: caughtIds, currentView: 'FINAL_GUESS' });
          }
        );
        break;

      case 'FINAL_GUESS':
        renderFinalGuessView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (imposterId, isCorrect) => {
            const updatedResults = { ...(state.guessResults || {}), [imposterId]: isCorrect };
            store.set({ guessResults: updatedResults });
            this.broadcastRoomUpdate({ guessResults: updatedResults });
          },
          (allResults) => {
            store.set({ currentView: 'ROUND_RESULTS' });
            this.broadcastRoomUpdate({ currentView: 'ROUND_RESULTS' });
          }
        );
        break;

      case 'ROUND_RESULTS':
        renderRoundResultsView(
          vContainer,
          state,
          (v) => this.navigate(v),
          (newScores) => {
            store.set({ scores: newScores });
            this.broadcastRoomUpdate({ scores: newScores });
          },
          () => {
            store.set({ currentView: 'CATEGORY' });
            this.broadcastRoomUpdate({ currentView: 'CATEGORY' });
          },
          (winner) => {
            store.set({ winnerPlayer: winner, currentView: 'WINNER' });
            this.broadcastRoomUpdate({ winnerPlayer: winner, currentView: 'WINNER' });
          },
          () => this.navigate('HOME')
        );
        break;

      case 'WINNER':
        renderWinnerView(
          vContainer,
          state,
          (v) => this.navigate(v),
          () => {
            const resetMap = {};
            (state.activeGroup?.players || []).forEach(p => { resetMap[p.id] = 0; });
            store.set({ scores: resetMap, winnerPlayer: null, currentView: 'CATEGORY' });
            this.broadcastRoomUpdate({ scores: resetMap, winnerPlayer: null, currentView: 'CATEGORY' });
          },
          () => {
            store.set({ winnerPlayer: null, currentView: 'CATEGORY' });
            this.broadcastRoomUpdate({ winnerPlayer: null, currentView: 'CATEGORY' });
          },
          () => this.navigate('HOME')
        );
        break;

      default:
        renderHomeView(vContainer, state, (v) => this.navigate(v));
        break;
    }
  }

  handleHeaderBack(state) {
    const isGameActive = ['GAME_MODE_SELECT', 'CATEGORY', 'IMPOSTER_COUNT', 'TRANSITION_COUNTDOWN', 'ROLE_REVEAL', 'CLUE_PHASE', 'PRIVATE_VOTING', 'DRAMATIC_REVEAL', 'FINAL_GUESS', 'ROUND_RESULTS', 'WINNER'].includes(state.currentView);
    if (isGameActive) {
      store.set({ currentView: 'LOBBY' });
    } else if (state.currentView === 'LOBBY') {
      store.set({ currentView: 'MY_GROUPS' });
    } else {
      store.set({ currentView: 'HOME' });
    }
  }

  calculateImposters(players, count) {
    if (!players || players.length === 0) return [];
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, players.length)).map(p => p.id);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
