const TONE_FREQUENCY = 600; // Hz — standard Morse tone
const FADE_OUT = 0.01;      // seconds — short ramp to avoid click on release

let audioCtx = null;
let oscillator = null;
let gain = null;

function getContext() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/**
 * Starts a continuous Morse tone. Call stopTone() to end it.
 */
export function startTone() {
  if (oscillator) return; // already playing

  const ctx = getContext();

  oscillator = ctx.createOscillator();
  gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(TONE_FREQUENCY, ctx.currentTime);
  gain.gain.setValueAtTime(1, ctx.currentTime);

  oscillator.start(ctx.currentTime);
}

/**
 * Stops the continuous Morse tone with a short fade to avoid clicks.
 */
export function stopTone() {
  if (!oscillator) return;

  const ctx = getContext();
  const now = ctx.currentTime;

  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + FADE_OUT);

  oscillator.stop(now + FADE_OUT);
  oscillator = null;
  gain = null;
}
