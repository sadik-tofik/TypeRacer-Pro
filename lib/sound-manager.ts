'use client';

export class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudioContext();
      this.createSounds();
    }
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  private createSounds() {
    if (!this.audioContext) return;

    // Create keypress sound
    this.createKeypressSound();
    this.createErrorSound();
    this.createSuccessSound();
  }

  private createKeypressSound() {
    if (!this.audioContext) return;

    const buffer = this.audioContext.createBuffer(1, 1024, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < 1024; i++) {
      data[i] = Math.sin(2 * Math.PI * 800 * i / this.audioContext.sampleRate) * 0.1 * Math.exp(-i / 200);
    }
    
    this.sounds.keypress = buffer;
  }

  private createErrorSound() {
    if (!this.audioContext) return;

    const buffer = this.audioContext.createBuffer(1, 2048, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < 2048; i++) {
      data[i] = Math.sin(2 * Math.PI * 300 * i / this.audioContext.sampleRate) * 0.2 * Math.exp(-i / 400);
    }
    
    this.sounds.error = buffer;
  }

  private createSuccessSound() {
    if (!this.audioContext) return;

    const buffer = this.audioContext.createBuffer(1, 4096, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < 4096; i++) {
      const freq = 523 + (i / 4096) * 200; // C5 to D5
      data[i] = Math.sin(2 * Math.PI * freq * i / this.audioContext.sampleRate) * 0.15 * Math.exp(-i / 800);
    }
    
    this.sounds.success = buffer;
  }

  playSound(soundName: string) {
    if (!this.enabled || !this.audioContext || !this.sounds[soundName]) return;

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[soundName];
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();