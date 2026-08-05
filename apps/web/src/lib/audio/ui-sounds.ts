'use client';

class UISounds {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (typeof window !== 'undefined' && !this.audioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  // A generic synthesizer function
  private playTone(freq: number, type: OscillatorType, duration: number, vol: number) {
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    // Fade out to avoid clicking sounds
    gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  public playClick() {
    this.playTone(600, 'sine', 0.05, 0.1);
  }

  public playHover() {
    this.playTone(300, 'sine', 0.03, 0.02);
  }

  public playSuccessPop() {
    this.init();
    if (!this.audioCtx) return;
    
    // Play a happy major chord pop (C E G)
    this.playTone(523.25, 'sine', 0.3, 0.1); // C5
    
    setTimeout(() => {
      this.playTone(659.25, 'sine', 0.4, 0.1); // E5
    }, 100);
    
    setTimeout(() => {
      this.playTone(783.99, 'sine', 0.6, 0.1); // G5
    }, 200);
  }

  public playErrorShake() {
    this.init();
    if (!this.audioCtx) return;

    // Play a dissonant buzz
    this.playTone(150, 'sawtooth', 0.2, 0.05);
    setTimeout(() => {
      this.playTone(130, 'sawtooth', 0.3, 0.05);
    }, 150);
  }

  public playSwipe() {
    this.playTone(800, 'triangle', 0.1, 0.05);
    setTimeout(() => {
      this.playTone(400, 'triangle', 0.1, 0.05);
    }, 50);
  }
}

export const uiSounds = new UISounds();
