/**
 * Storage Engine for SNC Workout Tracker
 * Manages LocalStorage, Session Logs, History & JSON Backup/Restore
 */

const STORAGE_KEYS = {
  CURRENT_WEEK: "snc_current_week",
  COMPLETED_SESSIONS: "snc_completed_sessions",
  IN_PROGRESS_WORKOUT: "snc_active_workout",
  USER_NOTES: "snc_user_notes",
  PRS: "snc_personal_records"
};

export const StorageEngine = {
  // Get active week (1 to 6, default 1)
  getCurrentWeek() {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_WEEK);
    return saved ? parseInt(saved, 10) : 1;
  },

  setCurrentWeek(weekNum) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, weekNum.toString());
  },

  // Save completed session log
  saveCompletedSession(sessionLog) {
    const history = this.getCompletedSessions();
    history.unshift(sessionLog); // Put newest first
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, JSON.stringify(history));

    // Update PRs
    this.updatePRs(sessionLog);

    // Clear active draft
    this.clearActiveWorkout();
  },

  getCompletedSessions() {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  },

  // Save transient active workout draft in case browser reloads during workout
  saveActiveWorkoutDraft(draftData) {
    localStorage.setItem(STORAGE_KEYS.IN_PROGRESS_WORKOUT, JSON.stringify(draftData));
  },

  getActiveWorkoutDraft() {
    const raw = localStorage.getItem(STORAGE_KEYS.IN_PROGRESS_WORKOUT);
    return raw ? JSON.parse(raw) : null;
  },

  clearActiveWorkout() {
    localStorage.removeItem(STORAGE_KEYS.IN_PROGRESS_WORKOUT);
  },

  // Update Personal Records
  updatePRs(sessionLog) {
    const prs = this.getPRs();
    let updated = false;

    if (sessionLog.exercises) {
      Object.entries(sessionLog.exercises).forEach(([exerciseId, setsData]) => {
        if (Array.isArray(setsData)) {
          setsData.forEach((set) => {
            const weight = parseFloat(set.weight) || 0;
            const reps = parseInt(set.reps, 10) || 0;
            if (weight > 0) {
              const currentPr = prs[exerciseId] || { maxWeight: 0, bestReps: 0, date: "" };
              if (weight > currentPr.maxWeight || (weight === currentPr.maxWeight && reps > currentPr.bestReps)) {
                prs[exerciseId] = {
                  exerciseName: set.exerciseName || exerciseId,
                  maxWeight: weight,
                  bestReps: reps,
                  date: sessionLog.date,
                  week: sessionLog.week
                };
                updated = true;
              }
            }
          });
        }
      });
    }

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(prs));
    }
  },

  getPRs() {
    const raw = localStorage.getItem(STORAGE_KEYS.PRS);
    return raw ? JSON.parse(raw) : {};
  },

  // Export all user data as JSON file for backup
  exportBackupJSON() {
    const exportData = {
      app: "SNC-Workout-Tracker",
      exportedAt: new Date().toISOString(),
      currentWeek: this.getCurrentWeek(),
      completedSessions: this.getCompletedSessions(),
      personalRecords: this.getPRs()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SNC_Workout_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import JSON backup
  importBackupJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.app === "SNC-Workout-Tracker" || data.completedSessions) {
        if (data.currentWeek) this.setCurrentWeek(data.currentWeek);
        if (Array.isArray(data.completedSessions)) {
          localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, JSON.stringify(data.completedSessions));
        }
        if (data.personalRecords) {
          localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(data.personalRecords));
        }
        return { success: true, message: "Backup imported successfully!" };
      }
      return { success: false, message: "Invalid backup format." };
    } catch (err) {
      return { success: false, message: "Failed to parse JSON file." };
    }
  },

  // Clear all data (Reset app)
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WEEK);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.IN_PROGRESS_WORKOUT);
    localStorage.removeItem(STORAGE_KEYS.PRS);
  }
};
