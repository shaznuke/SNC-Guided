/**
 * Storage Engine for SNC Guided 2.0
 * Manages LocalStorage, Full Session Editing/Deletion, Meal Deletion, & Active Draft Resume
 */

const STORAGE_KEYS = {
  CURRENT_WEEK: "snc_current_week",
  COMPLETED_SESSIONS: "snc_completed_sessions",
  IN_PROGRESS_WORKOUT: "snc_active_workout",
  USER_NOTES: "snc_user_notes",
  PRS: "snc_personal_records"
};

export const StorageEngine = {
  getCurrentWeek() {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_WEEK);
    return saved ? parseInt(saved, 10) : 1;
  },

  setCurrentWeek(weekNum) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, weekNum.toString());
  },

  saveCompletedSession(sessionLog) {
    const history = this.getCompletedSessions();
    const existingIndex = history.findIndex((s) => s.id === sessionLog.id);

    if (existingIndex >= 0) {
      history[existingIndex] = sessionLog; // Update existing
    } else {
      history.unshift(sessionLog); // Add new
    }

    localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, JSON.stringify(history));
    this.updatePRs(sessionLog);
    this.clearActiveWorkout();
  },

  deleteCompletedSession(sessionId) {
    let history = this.getCompletedSessions();
    history = history.filter((s) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, JSON.stringify(history));
  },

  getCompletedSessions() {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  },

  // Auto-save active workout draft to prevent loss when app is minimized
  saveActiveWorkoutDraft(draftData) {
    localStorage.setItem(STORAGE_KEYS.IN_PROGRESS_WORKOUT, JSON.stringify({
      ...draftData,
      lastSavedTimestamp: Date.now()
    }));
  },

  getActiveWorkoutDraft() {
    const raw = localStorage.getItem(STORAGE_KEYS.IN_PROGRESS_WORKOUT);
    if (!raw) return null;
    try {
      const draft = JSON.parse(raw);
      // Only return draft if saved within last 24 hours
      if (Date.now() - draft.lastSavedTimestamp < 86400000) {
        return draft;
      }
    } catch (e) {}
    return null;
  },

  clearActiveWorkout() {
    localStorage.removeItem(STORAGE_KEYS.IN_PROGRESS_WORKOUT);
  },

  updatePRs(sessionLog) {
    const prs = this.getPRs();
    let updated = false;

    if (sessionLog.exercises) {
      Object.entries(sessionLog.exercises).forEach(([exerciseId, exData]) => {
        if (Array.isArray(exData.sets)) {
          exData.sets.forEach((set) => {
            const weight = parseFloat(set.weight) || 0;
            const reps = parseInt(set.reps, 10) || 0;
            if (weight > 0) {
              const currentPr = prs[exerciseId] || { maxWeight: 0, bestReps: 0, date: "" };
              if (weight > currentPr.maxWeight || (weight === currentPr.maxWeight && reps > currentPr.bestReps)) {
                prs[exerciseId] = {
                  exerciseName: exData.name || exerciseId,
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

  exportBackupJSON() {
    const exportData = {
      app: "SNC-Guided-2.0",
      exportedAt: new Date().toISOString(),
      currentWeek: this.getCurrentWeek(),
      completedSessions: this.getCompletedSessions(),
      personalRecords: this.getPRs()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SNC_Guided_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importBackupJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.app || data.completedSessions) {
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

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WEEK);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.IN_PROGRESS_WORKOUT);
    localStorage.removeItem(STORAGE_KEYS.PRS);
  }
};
