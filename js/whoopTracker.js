/**
 * WHOOP Tracker Engine
 * Tracks WHOOP Recovery Score (%), Day Strain (0-21), Sleep Performance (%) & Workout Readiness
 */

export const WhoopTracker = {
  getTodayWhoopData() {
    const todayStr = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(`snc_whoop_${todayStr}`);
    return raw ? JSON.parse(raw) : {
      recoveryScore: 78,
      dayStrain: 12.4,
      sleepPerformance: 85,
      lastUpdated: todayStr
    };
  },

  saveTodayWhoopData(data) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const fullData = {
      recoveryScore: Math.min(100, Math.max(0, parseInt(data.recoveryScore, 10) || 75)),
      dayStrain: Math.min(21, Math.max(0, parseFloat(data.dayStrain) || 10)),
      sleepPerformance: Math.min(100, Math.max(0, parseInt(data.sleepPerformance, 10) || 80)),
      lastUpdated: todayStr
    };

    localStorage.setItem(`snc_whoop_${todayStr}`, JSON.stringify(fullData));
    return fullData;
  },

  getReadinessAdvice(recoveryScore) {
    const score = parseInt(recoveryScore, 10) || 75;
    if (score >= 67) {
      return {
        zone: "GREEN",
        color: "var(--accent-emerald)",
        title: "🟢 GREEN RECOVERY (" + score + "%)",
        advice: "Your autonomic nervous system is fully primed! Push for new Personal Records today."
      };
    } else if (score >= 34) {
      return {
        zone: "YELLOW",
        color: "var(--accent-gold)",
        title: "🟡 YELLOW RECOVERY (" + score + "%)",
        advice: "Moderate recovery. Stick to target reps and focus on 3s eccentric form without over-reaching."
      };
    } else {
      return {
        zone: "RED",
        color: "var(--accent-rose)",
        title: "🔴 RED RECOVERY (" + score + "%)",
        advice: "High CNS fatigue. Consider dropping weight by 10-15% or focusing on light mobility."
      };
    }
  }
};
