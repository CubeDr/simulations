import { useEffect, useRef, useState } from 'react';

export default function useIntervalTimer(interval: number, callback: () => void) {
  const [start, setStart] = useState<() => void>(() => { });
  const [pause, setPause] = useState<() => void>(() => { });

  const savedCallbackRef = useRef<() => void>(() => { });
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallbackCallTimeRef = useRef<number | null>(null);

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      const now = Date.now();

      if (
        lastCallbackCallTimeRef.current === null ||
        now - lastCallbackCallTimeRef.current >= interval
      ) {
        savedCallbackRef.current();
        lastCallbackCallTimeRef.current = now;
      }
    }

    function startInterval() {
      if (intervalIdRef.current) return;

      intervalIdRef.current = setInterval(tick, 10);
    }

    function pauseInterval() {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }

    setStart(() => startInterval);
    setPause(() => pauseInterval);

    return () => {
      if (intervalIdRef.current) {
        pauseInterval();
        startInterval();
      }
    };
  }, [interval]);

  return { start, pause, isRunning: intervalIdRef.current != null };
}
