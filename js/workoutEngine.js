/**
 * Workout Engine
 * Manages active session state, rest countdowns, interval timers & Web Audio + Speech for DOWN, 3, 2, 1, UP
 */

import { PROGRAM_DATA } from './programData.js';
import { StorageEngine } from './storage.js';

export class WorkoutEngine {
  constructor(dayId, weekNum) {
    this.dayData = PROGRAM_DATA.days.find((d) => d.id === dayId);
    this.weekNum = weekNum;
    this.targetInfo = PROGRAM_DATA.getWeekTarget(weekNum);
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.timerInterval = null;

    // Audio Context Unlocked state for iOS Safari
    this.audioCtx = null;

    // Rest Timer State
    this.restTimerSec = 0;
    this.restTimerInterval = null;

    // Interval Timer State
    this.intervalTimerActive = false;
    this.intervalPhase = "HARD";
    this.intervalSec = 30;
    this.intervalRound = 1;
    this.totalRounds = 8;
    this.intervalTimerInterval = null;

    // Metronome State (Literal DOWN, 3, 2, 1, DRIVE UP!)
    this.metronomeActive = false;
    this.metronomeStep = 0; // 0: DOWN, 1: 3, 2: 2, 3: 1, 4: UP
    this.metronomeInterval = null;

    this.loggedData = {};

    this.initExerciseLogs();
    this.startSessionClock();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
          if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
          }
        }
      } catch (e) {}
    }
  }

  initExerciseLogs() {
    this.dayData.sections.forEach((section) => {
      section.exercises.forEach((ex) => {
        const totalSets = ex.sets || 1;
        const defaultReps = ex.isDynamicReps
          ? this.targetInfo.reps
          : (ex.isHold ? `${this.targetInfo.holdSec}s` : ex.reps);

        const setsArray = [];
        for (let i = 0; i < totalSets; i++) {
          setsArray.push({
            setNum: i + 1,
            weight: "",
            reps: defaultReps,
            rpe: ex.rpe || "7/8",
            completed: false
          });
        }

        this.loggedData[ex.id] = {
          id: ex.id,
          name: ex.name,
          superset: ex.superset || null,
          supersetRole: ex.supersetRole || null,
          sets: setsArray
        };
      });
    });
  }

  startSessionClock() {
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      if (this.onClockTick) this.onClockTick(this.getFormattedElapsed());
    }, 1000);
  }

  stopSessionClock() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  getFormattedElapsed() {
    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = this.elapsedSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  toggleSetCompleted(exId, setIdx, weight, reps, rpe) {
    if (this.loggedData[exId] && this.loggedData[exId].sets[setIdx]) {
      const setObj = this.loggedData[exId].sets[setIdx];
      setObj.completed = !setObj.completed;
      if (weight !== undefined) setObj.weight = weight;
      if (reps !== undefined) setObj.reps = reps;
      if (rpe !== undefined) setObj.rpe = rpe;

      if (setObj.completed && this.onSetCompleted) {
        this.onSetCompleted(exId, setIdx);
      }

      this.saveDraft();
    }
  }

  saveDraft() {
    StorageEngine.saveActiveWorkoutDraft({
      dayId: this.dayData.id,
      weekNum: this.weekNum,
      elapsedSeconds: this.elapsedSeconds,
      loggedData: this.loggedData,
      savedAt: Date.now()
    });
  }

  startRestTimer(seconds, onTick, onComplete) {
    this.stopRestTimer();
    this.restTimerSec = seconds;
    if (onTick) onTick(this.restTimerSec);

    this.restTimerInterval = setInterval(() => {
      this.restTimerSec--;
      if (onTick) onTick(this.restTimerSec);

      if (this.restTimerSec <= 0) {
        this.stopRestTimer();
        this.playAudioPitch(880, 0.4);
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  stopRestTimer() {
    if (this.restTimerInterval) {
      clearInterval(this.restTimerInterval);
      this.restTimerInterval = null;
    }
  }

  startIntervalTimer(totalRounds = 8, onTick, onPhaseChange, onComplete) {
    this.stopIntervalTimer();
    this.intervalTimerActive = true;
    this.totalRounds = totalRounds;
    this.intervalRound = 1;
    this.intervalPhase = "HARD";
    this.intervalSec = 30;

    if (onPhaseChange) onPhaseChange(this.intervalPhase, this.intervalRound, this.intervalSec);

    this.intervalTimerInterval = setInterval(() => {
      this.intervalSec--;
      if (onTick) onTick(this.intervalSec, this.intervalPhase, this.intervalRound);

      if (this.intervalSec <= 0) {
        this.playAudioPitch(1000, 0.3);
        if (this.intervalPhase === "HARD") {
          this.intervalPhase = "EASY";
          this.intervalSec = 30;
          if (onPhaseChange) onPhaseChange(this.intervalPhase, this.intervalRound, this.intervalSec);
        } else {
          if (this.intervalRound >= this.totalRounds) {
            this.stopIntervalTimer();
            if (onComplete) onComplete();
            return;
          }
          this.intervalRound++;
          this.intervalPhase = "HARD";
          this.intervalSec = 30;
          if (onPhaseChange) onPhaseChange(this.intervalPhase, this.intervalRound, this.intervalSec);
        }
      }
    }, 1000);
  }

  stopIntervalTimer() {
    if (this.intervalTimerInterval) {
      clearInterval(this.intervalTimerInterval);
      this.intervalTimerInterval = null;
    }
    this.intervalTimerActive = false;
  }

  /**
   * Literal Audio & Voice Metronome: DOWN -> 3 -> 2 -> 1 -> UP!
   */
  startMetronome(onTick) {
    this.initAudioContext();
    this.stopMetronome();
    this.metronomeActive = true;
    this.metronomeStep = 0;

    const steps = [
      { text: "DOWN ⬇️", speech: "Down", pitch: 300 },
      { text: "3", speech: "Three", pitch: 440 },
      { text: "2", speech: "Two", pitch: 520 },
      { text: "1", speech: "One", pitch: 660 },
      { text: "DRIVE UP! ⬆️", speech: "Up", pitch: 880 }
    ];

    const triggerStep = () => {
      const current = steps[this.metronomeStep];
      if (onTick) onTick(current.text, this.metronomeStep);

      // Play audio tone
      this.playAudioPitch(current.pitch, 0.15);

      // Speak voice utterance
      this.speakVoice(current.speech);

      this.metronomeStep = (this.metronomeStep + 1) % steps.length;
    };

    triggerStep();
    this.metronomeInterval = setInterval(triggerStep, 1000);
  }

  stopMetronome() {
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
    }
    this.metronomeActive = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  speakVoice(text) {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.3;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {}
  }

  playAudioPitch(freq = 440, duration = 0.15) {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);

      if (navigator.vibrate) {
        navigator.vibrate(60);
      }
    } catch (e) {}
  }

  finishSession(overallRpe = 8, coachNotes = "") {
    this.stopSessionClock();
    this.stopRestTimer();
    this.stopIntervalTimer();
    this.stopMetronome();

    const durationMins = Math.max(1, Math.round(this.elapsedSeconds / 60));
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const sessionLog = {
      id: `session_${Date.now()}`,
      dayId: this.dayData.id,
      dayName: this.dayData.name,
      week: this.weekNum,
      date: formattedDate,
      timestamp: Date.now(),
      durationMins: durationMins,
      rpeRating: overallRpe,
      coachNotes: coachNotes,
      exercises: this.loggedData
    };

    StorageEngine.saveCompletedSession(sessionLog);
    return sessionLog;
  }
}
