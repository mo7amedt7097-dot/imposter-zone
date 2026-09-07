// IMPOSTER Soft & Realistic Web Audio API Sound Synthesizer

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
    this.vibrationEnabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setEnabled(soundState, vibState) {
    this.enabled = soundState;
    this.vibrationEnabled = vibState;
  }

  vibrate(pattern) {
    if (this.vibrationEnabled && typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(pattern); } catch (e) {}
    }
  }

  playTap() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.03);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  playTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  playRoleReveal() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.00, now);
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
      this.vibrate([30, 40, 30]);
    } catch (e) {}
  }

  playImposterAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
      this.vibrate([60, 40, 60]);
    } catch (e) {}
  }

  playVotingLock() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
      this.vibrate(40);
    } catch (e) {}
  }

  playDramaticSuspense() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const bassOsc = this.audioCtx.createOscillator();
      const bassGain = this.audioCtx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(75, now);
      bassOsc.frequency.exponentialRampToValueAtTime(40, now + 2.0);
      bassGain.gain.setValueAtTime(0.25, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
      bassOsc.connect(bassGain);
      bassGain.connect(this.audioCtx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 2.0);
      this.vibrate([60, 40, 60, 40, 100]);
    } catch (e) {}
  }

  playRevealBoom() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
      this.vibrate([150, 50, 200]);
    } catch (e) {}
  }

  playCorrectGuess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99];
      const now = this.audioCtx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.2);
      });
      this.vibrate([40, 30, 40]);
    } catch (e) {}
  }

  playWrongGuess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
      this.vibrate([100, 40, 100]);
    } catch (e) {}
  }

  playWinFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      let now = this.audioCtx.currentTime;
      notes.forEach((freq) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        now += 0.12;
      });
      this.vibrate([80, 40, 80, 40, 200]);
    } catch (e) {}
  }
}

export const soundManager = new SoundManager();
