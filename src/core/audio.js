const TONE_FREQUENCY = 600; // Hz — standard Morse tone
const DOT_DURATION = 0.1;   // seconds
const DASH_DURATION = 0.3;  // seconds

let audioCtx = null;

function getContext() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/**
 * Plays a Morse tone for the given signal type.
 * @param {'dot' | 'dash'} signal
 */
export function playTone(signal) {
  const ctx = getContext();
  const duration = signal === 'dot' ? DOT_DURATION : DASH_DURATION;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(TONE_FREQUENCY, ctx.currentTime);

  gain.gain.setValueAtTime(1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}
