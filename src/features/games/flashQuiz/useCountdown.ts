import { useEffect, useRef } from 'react';

interface UseCountdownProps {
  isRunning: boolean;
  timeLeft: number;
  onTick: () => void;
  onTimeout: () => void;
  intervalMs?: number;
}

export function useCountdown({
  isRunning,
  timeLeft,
  onTick,
  onTimeout,
  intervalMs = 1000
}: UseCountdownProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        onTick();
      }, intervalMs);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
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
  }, [isRunning, onTick, intervalMs]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      onTimeout();
    }
  }, [timeLeft, isRunning, onTimeout]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}