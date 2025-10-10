import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import {
  selectFocusStatus,
  selectProgress,
  selectIsFinished,
} from '../focusSelectors';
import {
  pauseWithAudio,
  resumeWithAudio,
} from '../audioActions';

interface FocusHUDProps {
  onExit?: () => void;
}

const FocusHUD: React.FC<FocusHUDProps> = memo(({ onExit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectFocusStatus);
  const progress = useSelector(selectProgress);
  const isFinished = useSelector(selectIsFinished);

  const handlePauseResume = () => {
    if (status === 'playing') {
      dispatch(pauseWithAudio());
    } else if (status === 'paused') {
      dispatch(resumeWithAudio());
    }
  };

  const renderPauseResumeButton = () => {
    if (isFinished) {
      return (
        <TouchableOpacity
          style={[styles.button, styles.finishButton]}
          onPress={onExit}
        >
          <Text style={styles.buttonText}>Finalizar</Text>
        </TouchableOpacity>
      );
    }

    const isPaused = status === 'paused';
    return (
      <TouchableOpacity
        style={[styles.button, isPaused ? styles.playButton : styles.pauseButton]}
        onPress={handlePauseResume}
      >
        <Text style={styles.buttonText}>
          {isPaused ? '▶️' : '⏸️'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top HUD */}
      <View style={styles.topHUD}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {progress.current} / {progress.total}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress.percentage}%` }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Bottom HUD */}
      <View style={styles.bottomHUD}>
        <View style={styles.controlsContainer}>
          {/* Pause/Resume Button */}
          {renderPauseResumeButton()}

          {/* Exit Button */}
          {!isFinished && (
            <TouchableOpacity
              style={[styles.button, styles.exitButton]}
              onPress={onExit}
            >
              <Text style={styles.buttonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Status indicator */}
        {status === 'paused' && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              Pausado - Toca ▶️ para continuar
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
   );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  topHUD: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  bottomHUD: {
    paddingHorizontal: 10,
    paddingBottom: 35,
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    pointerEvents: 'auto', // Enable touch events for buttons
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  pauseButton: {
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    borderColor: 'rgba(255, 193, 7, 0.7)',
  },
  playButton: {
    backgroundColor: 'rgba(40, 167, 69, 0.3)',
    borderColor: 'rgba(40, 167, 69, 0.7)',
  },
  exitButton: {
    backgroundColor: 'rgba(220, 53, 69, 0.3)',
    borderColor: 'rgba(220, 53, 69, 0.7)',
  },
  finishButton: {
    backgroundColor: 'rgba(40, 167, 69, 0.3)',
    borderColor: 'rgba(40, 167, 69, 0.7)',
    width: 100,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
});

FocusHUD.displayName = 'FocusHUD';

export default FocusHUD;