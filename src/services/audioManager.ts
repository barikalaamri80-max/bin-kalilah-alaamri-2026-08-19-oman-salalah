/**
 * Global Audio Manager
 * Ensures strictly ONE audio source (Audio element or SpeechSynthesis) plays at any given time.
 * Prevents overlapping microphones, TTS audio, and simulations.
 */

class AudioManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentSpeechUtterance: SpeechSynthesisUtterance | null = null;
  private onStopCallbacks: Set<() => void> = new Set();

  public registerStopCallback(cb: () => void) {
    this.onStopCallbacks.add(cb);
  }

  public unregisterStopCallback(cb: () => void) {
    this.onStopCallbacks.delete(cb);
  }

  /**
   * Stop everything currently playing
   */
  public stopAll() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        console.warn('Error pausing current audio:', e);
      }
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
      this.currentSpeechUtterance = null;
    }

    // Notify registered listeners
    this.onStopCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.warn('Error in stop callback:', e);
      }
    });
  }

  /**
   * Set and play a new HTMLAudioElement, stopping previous sounds
   */
  public playAudio(audio: HTMLAudioElement) {
    this.stopAll();
    this.currentAudio = audio;
    return audio.play();
  }

  /**
   * Set and speak SpeechSynthesisUtterance, stopping previous sounds
   */
  public speak(utterance: SpeechSynthesisUtterance) {
    this.stopAll();
    this.currentSpeechUtterance = utterance;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.speak(utterance);
    }
  }

  public isPlaying(): boolean {
    const isAudioPlaying = !!this.currentAudio && !this.currentAudio.paused;
    const isSpeaking = typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
    return isAudioPlaying || isSpeaking;
  }
}

export const globalAudioManager = new AudioManager();
