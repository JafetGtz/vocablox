import { AppDispatch } from '../../store/store';
import { startPlayback, next } from './focusSlice';

export class FocusSequencer {
  private countdownTimer: NodeJS.Timeout | null = null;
  private slideTimer: NodeJS.Timeout | null = null;
  private dispatch: AppDispatch;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  startCountdownTimer(onComplete?: () => void) {
    this.clearCountdownTimer();

    this.countdownTimer = setTimeout(() => {
      this.dispatch(startPlayback());
      this.startSlideTimer();
      if (onComplete) onComplete();
    }, 5000); // 5 seconds countdown
  }

  startSlideTimer(onSlideEnd?: () => void) {
    this.clearSlideTimer();

    this.slideTimer = setTimeout(() => {
      if (onSlideEnd) {
        // Call fadeOut callback first
        onSlideEnd();

        // Add a small delay for fade-out animation, then proceed to next
        setTimeout(() => {
          this.dispatch(next());
          this.startSlideTimer(onSlideEnd);
        }, 300); // 300ms for fade-out animation
      } else {
        this.dispatch(next());
        this.startSlideTimer();
      }
    }, 10000); // 10 seconds per slide
  }

  pause() {
    this.clearCountdownTimer();
    this.clearSlideTimer();
  }

  resume(isInCountdown: boolean, onSlideEnd?: () => void) {
    if (isInCountdown) {
      this.startCountdownTimer();
    } else {
      this.startSlideTimer(onSlideEnd);
    }
  }

  stop() {
    this.clearCountdownTimer();
    this.clearSlideTimer();
  }

  private clearCountdownTimer() {
    if (this.countdownTimer) {
      clearTimeout(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private clearSlideTimer() {
    if (this.slideTimer) {
      clearTimeout(this.slideTimer);
      this.slideTimer = null;
    }
  }
}

// Utility function to shuffle array
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}