// Synthesized Web Audio API chime for announcements and notifications
// No external MP3 audio file dependencies - runs 100% reliably in any browser

const SOUND_PREF_KEY = "lga_notification_sound_enabled";

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!sharedAudioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }
    // Auto-resume if browser autoplay policy suspended the context
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

// Unlock audio on first user interaction if locked by browser policy
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };
  window.addEventListener("click", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });
}

export function isNotificationSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const val = localStorage.getItem(SOUND_PREF_KEY);
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

export function setNotificationSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SOUND_PREF_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent("lga-sound-pref-changed", { detail: { enabled } }));
  } catch (e) {
    void e;
  }
}

export type SoundType = "announcement" | "alert" | "success" | "notification";

/**
 * Plays an audible, harmonic school chime using the Web Audio API.
 * Designed to sound warm, crystalline, and school-appropriate.
 */
export function playChimeSound(type: SoundType = "announcement"): void {
  if (!isNotificationSoundEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (type === "announcement" || type === "notification") {
      // 3-note harmonic school bell chime (D5 -> F#5 -> A5 with resonance)
      const frequencies = [587.33, 739.99, 880.0]; // D5, F#5, A5
      const delays = [0, 0.12, 0.24];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm harmonic: combination of sine and slight triangle timbre
        osc.type = idx === 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now + delays[idx]);

        // Smooth volume envelope: gentle attack, long musical decay
        const startTime = now + delays[idx];
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.28, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.9);
      });
    } else if (type === "success") {
      // Ascending joyful arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        const startTime = now + idx * 0.08;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } else if (type === "alert") {
      // Double attention pulse
      [0, 0.18].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(659.25, now + delay);

        const startTime = now + delay;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    }
  } catch (err) {
    console.debug("Web Audio chime playback not allowed or failed:", err);
  }
}
