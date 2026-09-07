// IMPOSTER Reactive State Store (Vanilla JS)

class AppState {
  constructor() {
    this.listeners = [];
    this.data = {
      user: this.loadUser(),
      savedGroups: this.loadLocalStorage('imposter_saved_groups', []),
      scores: this.loadLocalStorage('imposter_scores', {}),
      recentWords: this.loadLocalStorage('imposter_recent_words', []),
      soundEnabled: this.loadLocalStorage('imposter_sound', true),
      vibrationEnabled: this.loadLocalStorage('imposter_vibration', true),
      timerEnabled: this.loadLocalStorage('imposter_timer', true),
      currentView: 'HOME',
      activeGroup: null,
      gameMode: 'ONE_PHONE',
      selectedCategory: null,
      secretWordObj: null,
      imposterCount: 1,
      imposterIds: [],
      votes: {},
      rolesRevealed: {},
      caughtImposterIds: [],
      guessResults: {},
      winnerPlayer: null
    };
  }

  loadUser() {
    try {
      const saved = localStorage.getItem('imposter_user_identity');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    const defaultUser = { id: 'u_' + Math.random().toString(36).substring(2, 8), name: 'لاعب 1' };
    try { localStorage.setItem('imposter_user_identity', JSON.stringify(defaultUser)); } catch(e) {}
    return defaultUser;
  }

  loadLocalStorage(key, defaultVal) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch(e) {}
    return defaultVal;
  }

  saveLocalStorage(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }

  get() {
    return this.data;
  }

  set(partialState) {
    this.data = { ...this.data, ...partialState };
    
    if ('savedGroups' in partialState) this.saveLocalStorage('imposter_saved_groups', this.data.savedGroups);
    if ('scores' in partialState) this.saveLocalStorage('imposter_scores', this.data.scores);
    if ('recentWords' in partialState) this.saveLocalStorage('imposter_recent_words', this.data.recentWords);
    if ('soundEnabled' in partialState) this.saveLocalStorage('imposter_sound', this.data.soundEnabled);
    if ('vibrationEnabled' in partialState) this.saveLocalStorage('imposter_vibration', this.data.vibrationEnabled);
    if ('timerEnabled' in partialState) this.saveLocalStorage('imposter_timer', this.data.timerEnabled);
    if ('user' in partialState) this.saveLocalStorage('imposter_user_identity', this.data.user);

    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.data));
  }
}

export const store = new AppState();
