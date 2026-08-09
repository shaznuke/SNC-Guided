/**
 * Workout Engine
 * Manages active session state, rest countdowns, interval timers & literal Metronome Voice/Beeps
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
        this.playBeepSound();
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
        this.playBeepSound();
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
   * Literal 3-Sec Metronome: DOWN -> 3 -> 2 -> 1 -> DRIVE UP!
   */
  startMetronome(onTick) {
    this.stopMetronome();
    this.metronomeActive = true;
    this.metronomeStep = 0; // 0: DOWN, 1: 3, 2: 2, 3: 1, 4: UP

    const sequence = [
      { text: "DOWN ⬇️", speech: "Down" },
      { text: "3", speech: "3" },
      { text: "2", speech: "2" },
      { text: "1", speech: "1" },
      { text: "DRIVE UP! ⬆️", speech: "Up" }
    ];

    const triggerStep = () => {
      const stepObj = sequence[this.metronomeStep];
      if (onTick) onTick(stepObj.text, this.metronomeStep);
      this.speakVoice(stepObj.speech);

      this.metronomeStep = (this.metronomeStep + 1) % sequence.length;
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
  }

  speakVoice(text) {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop pending speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2; // Slightly faster for workout rhythm
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      // Audio synthesis fallback
    }
  }

  playBeepSound(freq = 800) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
      
      if (navigator.vibrate) {
        navigator.vibrate(200);
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
