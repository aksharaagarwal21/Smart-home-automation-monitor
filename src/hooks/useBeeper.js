import { useEffect, useRef, useCallback } from 'react';

export default function useBeeper(isActive) {
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const isPlayingRef = useRef(false);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playBeep = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Create oscillator for the beep tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.setValueAtTime(1800, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      // Audio not supported
    }
  }, [getAudioCtx]);

  useEffect(() => {
    if (isActive && !isPlayingRef.current) {
      isPlayingRef.current = true;
      // Play immediately
      playBeep();
      // Then repeat every 350ms
      intervalRef.current = setInterval(playBeep, 350);
    } else if (!isActive && isPlayingRef.current) {
      isPlayingRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, playBeep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);
}
