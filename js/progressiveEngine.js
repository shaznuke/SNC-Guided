/**
 * Progressive Engine
 * Analyzes previous week logs & generates intelligent weight/rep suggestions
 */

import { StorageEngine } from './storage.js';

export const ProgressiveEngine = {
  /**
   * Finds the user's logged performance for an exercise from the prior week
   */
  getPreviousWeekLog(exerciseId, currentWeek) {
    if (currentWeek <= 1) return null;
    const prevWeek = currentWeek - 1;
    const history = StorageEngine.getCompletedSessions();

    // Look for session logged in prevWeek containing this exercise
    const prevSession = history.find(
      (s) => s.week === prevWeek && s.exercises && s.exercises[exerciseId]
    );

    if (prevSession && prevSession.exercises[exerciseId]) {
      return prevSession.exercises[exerciseId];
    }

    // Fallback: Find most recent log of this exercise before current week
    const recentSession = history.find(
      (s) => s.week < currentWeek && s.exercises && s.exercises[exerciseId]
    );

    return recentSession ? recentSession.exercises[exerciseId] : null;
  },

  /**
   * Generates target suggestion text and delta for a set
   */
  getSetSuggestion(exerciseId, currentWeek, setIdx, targetReps) {
    const prevLog = this.getPreviousWeekLog(exerciseId, currentWeek);
    if (!prevLog || !Array.isArray(prevLog.sets) || !prevLog.sets[setIdx]) {
      return {
        hasData: false,
        text: `Target: ${targetReps} reps`,
        suggestedWeight: ""
      };
    }

    const prevSet = prevLog.sets[setIdx];
    const prevWeight = parseFloat(prevSet.weight) || 0;
    const prevReps = parseInt(prevSet.reps, 10) || 0;

    if (prevWeight === 0) {
      return {
        hasData: false,
        text: `Last week: ${prevSet.reps || targetReps} reps (BW)`,
        suggestedWeight: ""
      };
    }

    // Progression logic: If target reps are lower (e.g. 15 -> 12 -> 9 -> 6), suggest +2.5kg increment!
    let suggestedWeight = prevWeight;
    if (typeof targetReps === 'number' && prevReps > targetReps) {
      suggestedWeight = prevWeight + 2.5; // Load progression
    } else if (prevReps >= 12) {
      suggestedWeight = prevWeight + 2.5;
    }

    const delta = suggestedWeight - prevWeight;
    const deltaStr = delta > 0 ? `(+${delta}kg)` : `(Maintain)`;

    return {
      hasData: true,
      prevWeight: prevWeight,
      prevReps: prevReps,
      suggestedWeight: suggestedWeight,
      deltaStr: deltaStr,
      text: `Last Week: ${prevWeight}kg × ${prevReps} reps → Suggested: ${suggestedWeight}kg × ${targetReps} reps ${deltaStr}`
    };
  }
};
