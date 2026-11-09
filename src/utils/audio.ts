/**
 * Procedural Web Audio API sound generator for Diwali experience.
 * 100% code-generated, zero 404s, authentic Indian classical ambient and festive firework soundscapes.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private droneGain: GainNode | null = null;
  private musicInterval: number | null = null;
  private isPlayingMusic: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime, 0.1);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startAmbientMusic() {
    if (this.isPlayingMusic) return;
    this.initContext();
    if (!this.ctx) return;
    this.isPlayingMusic = true;

    // Start gentle Tanpura drone (Sa - Pa - Sa octave: C3, G3, C4)
    try {
      const master = this.ctx.createGain();
      master.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
      master.connect(this.ctx.destination);
      this.droneGain = master;

      const freqs = [130.81, 196.00, 261.63, 196.00]; // C3, G3, C4
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        const oscGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Lowpass filter for warm woody Indian sitar/tanpura tone
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450 + idx * 80, this.ctx.currentTime);

        // Subtle slow chorus/tremolo
        lfo.frequency.setValueAtTime(0.2 + idx * 0.1, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(12, this.ctx.currentTime);
        lfo.connect(osc.frequency);

        oscGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(master);

        osc.start();
        lfo.start();
      });

      // Procedural Santoor / Sitar festive melodic notes (Raag Bhupali: C, D, E, G, A)
      const ragaNotes = [
        261.63, 293.66, 329.63, 392.00, 440.00,
        523.25, 587.33, 659.25, 783.99, 880.00
      ];

      this.musicInterval = window.setInterval(() => {
        if (this.isMuted || !this.ctx || Math.random() > 0.65) return;
        const note = ragaNotes[Math.floor(Math.random() * ragaNotes.length)];
        this.playPluckNote(note);
      }, 950);
    } catch {
      // Audio autoplay policy handled smoothly
    }
  }

  private playPluckNote(freq: number) {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, t);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, t + 1.2);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.7);
  }

  // --- Sound Effects ---

  public playDiyaSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Warm ignition whoosh
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // Warm chime
    this.playBellTone(587.33, 0.15, 1.2);
  }

  public playTempleBell() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    // Multi-harmonic rich brass temple bell chime
    const fundamental = 432; // Spiritual Hz
    const partials = [1, 1.5, 2.1, 2.76, 3.8];
    const amplitudes = [0.25, 0.18, 0.12, 0.08, 0.04];

    partials.forEach((p, idx) => {
      this.playBellTone(fundamental * p, amplitudes[idx], 2.8 - idx * 0.3);
    });
  }

  private playBellTone(freq: number, volume: number, duration: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  }

  public playRocketSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Ascending whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.9);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 1.0);

    // Explosion after 0.9s
    setTimeout(() => {
      this.playFireworkBurst(true);
    }, 900);
  }

  public playFireworkBurst(isLoud = false) {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Deep sub-bass boom
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.6);

    oscGain.gain.setValueAtTime(isLoud ? 0.35 : 0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.75);

    // Crackle noise
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.25));
      data[i] = (Math.random() * 2 - 1) * decay;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(isLoud ? 0.22 : 0.12, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }

  public playChakriSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const duration = 4.0;

    // 1. Spinning whirr oscillator with pitch modulation
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(750, t + 1.2);
    osc.frequency.linearRampToValueAtTime(820, t + 2.8);
    osc.frequency.exponentialRampToValueAtTime(180, t + duration);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.8);
    gain.gain.setValueAtTime(0.14, t + 3.0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);

    // 2. Continuous sparkling hiss noise layer
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const crackle = Math.random() > 0.85 ? 1.0 : 0.25;
      data[i] = (Math.random() * 2 - 1) * crackle;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.Q.setValueAtTime(3.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.02, t);
    noiseGain.gain.linearRampToValueAtTime(0.15, t + 0.6);
    noiseGain.gain.setValueAtTime(0.15, t + 3.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }

  public playAnarSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const duration = 4.5;

    // Multi-layered roaring fountain hiss with rising intensity
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const pop = Math.random() > 0.9 ? 1.0 : 0.35;
      data[i] = (Math.random() * 2 - 1) * pop;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.linearRampToValueAtTime(2200, t + 2.0);

    const gain = this.ctx.createGain();
    // Phase 1: initial fuse sizzle
    gain.gain.setValueAtTime(0.04, t);
    // Phase 2: surging fountain
    gain.gain.linearRampToValueAtTime(0.25, t + 1.2);
    gain.gain.setValueAtTime(0.25, t + 3.6);
    // Phase 3: gentle die-down
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  public playSparklerSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.8 ? 1.0 : 0.3);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  public playCardReveal() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    this.playBellTone(523.25, 0.12, 0.8);
    setTimeout(() => this.playBellTone(659.25, 0.12, 1.0), 120);
    setTimeout(() => this.playBellTone(783.99, 0.15, 1.4), 240);
  }

  public dispose() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
  }
}

export const soundEngine = new SoundEngine();
