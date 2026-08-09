/**
 * Main Application Orchestrator & View Controller
 * Luxury Minimalist Theme + Voice/Visual Metronome + Peppered Inspirational Quotes
 */

import { PROGRAM_DATA } from './programData.js';
import { StorageEngine } from './storage.js';
import { WorkoutEngine } from './workoutEngine.js';
import { CoachUpdater } from './coachUpdater.js';

const INSPIRATIONAL_QUOTES = [
  "Consistency is the quiet bridge between goals and accomplishment.",
  "Small daily improvements over time lead to stunning results.",
  "Focus on the process, and the outcome will take care of itself.",
  "Strength is built in the quiet moments of effort.",
  "Your dedication today creates your resilience tomorrow.",
  "Quality over load. Precision in every movement.",
  "Discipline is choosing between what you want now and what you want most."
];

class AppController {
  constructor() {
    this.currentWeek = StorageEngine.getCurrentWeek();
    this.activeWorkout = null;
    this.activeTab = "home";

    this.initDOMReferences();
    this.bindEvents();
    this.initInspirationalQuote();
    this.render();
    this.registerServiceWorker();
  }

  initDOMReferences() {
    this.weekSelect = document.getElementById("weekSelect");
    this.navTabs = document.querySelectorAll(".nav-tab");
    this.motivationalQuote = document.getElementById("motivationalQuote");

    this.viewHome = document.getElementById("viewHome");
    this.viewActiveSession = document.getElementById("viewActiveSession");
    this.viewHistory = document.getElementById("viewHistory");
    this.viewPRs = document.getElementById("viewPRs");
    this.viewSettings = document.getElementById("viewSettings");

    this.dayCardsContainer = document.getElementById("dayCardsContainer");
    this.sessionExercisesContainer = document.getElementById("sessionExercisesContainer");
    this.historyListContainer = document.getElementById("historyListContainer");
    this.prsListContainer = document.getElementById("prsListContainer");

    this.sessionTitle = document.getElementById("sessionTitle");
    this.sessionTimer = document.getElementById("sessionTimer");
    this.btnFinishSession = document.getElementById("btnFinishSession");

    this.metronomeVisualBar = document.getElementById("metronomeVisualBar");
    this.metronomeStatusText = document.getElementById("metronomeStatusText");

    this.floatingRestTimer = document.getElementById("floatingRestTimer");
    this.restTimerDisplay = document.getElementById("restTimerDisplay");
    this.btnSkipRest = document.getElementById("btnSkipRest");

    this.coachModal = document.getElementById("coachModal");
    this.reportPreview = document.getElementById("reportPreview");
    this.btnShareWhatsApp = document.getElementById("btnShareWhatsApp");
    this.btnCopyReport = document.getElementById("btnCopyReport");
    this.btnCloseCoachModal = document.getElementById("btnCloseCoachModal");
    this.coachNotesInput = document.getElementById("coachNotesInput");
    this.rpeSlider = document.getElementById("rpeSlider");
    this.rpeValDisplay = document.getElementById("rpeValDisplay");

    this.intervalModal = document.getElementById("intervalModal");
    this.intervalPhaseTitle = document.getElementById("intervalPhaseTitle");
    this.intervalCountdown = document.getElementById("intervalCountdown");
    this.intervalRoundsText = document.getElementById("intervalRoundsText");
    this.btnStopInterval = document.getElementById("btnStopInterval");

    this.btnToggleMetronome = document.getElementById("btnToggleMetronome");

    this.btnExportData = document.getElementById("btnExportData");
    this.importFileInput = document.getElementById("importFileInput");
    this.btnResetData = document.getElementById("btnResetData");
  }

  initInspirationalQuote() {
    if (this.motivationalQuote) {
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      const selectedQuote = INSPIRATIONAL_QUOTES[dayOfYear % INSPIRATIONAL_QUOTES.length];
      this.motivationalQuote.textContent = selectedQuote;
    }
  }

  bindEvents() {
    if (this.weekSelect) {
      this.weekSelect.value = this.currentWeek.toString();
      this.weekSelect.addEventListener("change", (e) => {
        this.currentWeek = parseInt(e.target.value, 10);
        StorageEngine.setCurrentWeek(this.currentWeek);
        this.renderHome();
      });
    }

    this.navTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetView = tab.getAttribute("data-target");
        this.switchTab(targetView);
      });
    });

    if (this.btnSkipRest) {
      this.btnSkipRest.addEventListener("click", () => {
        if (this.activeWorkout) this.activeWorkout.stopRestTimer();
        this.hideFloatingRestTimer();
      });
    }

    if (this.btnFinishSession) {
      this.btnFinishSession.addEventListener("click", () => {
        this.openCoachUpdateModal();
      });
    }

    if (this.rpeSlider) {
      this.rpeSlider.addEventListener("input", (e) => {
        if (this.rpeValDisplay) this.rpeValDisplay.textContent = e.target.value;
      });
    }

    if (this.btnCloseCoachModal) {
      this.btnCloseCoachModal.addEventListener("click", () => {
        this.closeCoachUpdateModal();
        this.switchTab("home");
      });
    }

    if (this.btnShareWhatsApp) {
      this.btnShareWhatsApp.addEventListener("click", () => {
        if (this.latestSessionLog) {
          const notes = this.coachNotesInput ? this.coachNotesInput.value : "";
          const rpe = this.rpeSlider ? this.rpeSlider.value : 8;
          this.latestSessionLog.coachNotes = notes;
          this.latestSessionLog.rpeRating = rpe;
          
          const waUrl = CoachUpdater.getWhatsAppShareUrl(this.latestSessionLog);
          window.open(waUrl, "_blank");
          this.closeCoachUpdateModal();
          this.switchTab("home");
        }
      });
    }

    if (this.btnCopyReport) {
      this.btnCopyReport.addEventListener("click", async () => {
        if (this.latestSessionLog) {
          const notes = this.coachNotesInput ? this.coachNotesInput.value : "";
          const rpe = this.rpeSlider ? this.rpeSlider.value : 8;
          this.latestSessionLog.coachNotes = notes;
          this.latestSessionLog.rpeRating = rpe;

          const text = CoachUpdater.generateSummaryText(this.latestSessionLog);
          const copied = await CoachUpdater.copyToClipboard(text);
          if (copied) {
            this.btnCopyReport.textContent = "✓ Copied to Clipboard!";
            setTimeout(() => {
              this.btnCopyReport.textContent = "📋 Copy Summary Text";
            }, 2000);
          }
        }
      });
    }

    if (this.btnStopInterval) {
      this.btnStopInterval.addEventListener("click", () => {
        if (this.activeWorkout) this.activeWorkout.stopIntervalTimer();
        this.intervalModal.classList.add("hidden");
      });
    }

    // Toggle Voice & Visual Metronome (DOWN -> 3 -> 2 -> 1 -> UP)
    if (this.btnToggleMetronome) {
      this.btnToggleMetronome.addEventListener("click", () => {
        if (this.activeWorkout) {
          if (this.activeWorkout.metronomeActive) {
            this.activeWorkout.stopMetronome();
            this.btnToggleMetronome.classList.remove("active");
            this.btnToggleMetronome.textContent = "⏱ Voice Metronome (3s)";
            if (this.metronomeVisualBar) this.metronomeVisualBar.classList.add("hidden");
          } else {
            this.btnToggleMetronome.classList.add("active");
            if (this.metronomeVisualBar) this.metronomeVisualBar.classList.remove("hidden");
            
            this.activeWorkout.startMetronome((stepText, stepIdx) => {
              if (this.metronomeStatusText) {
                this.metronomeStatusText.textContent = stepText;
              }
              this.btnToggleMetronome.textContent = `⏱ Metronome: ${stepText}`;
            });
          }
        }
      });
    }

    if (this.btnExportData) {
      this.btnExportData.addEventListener("click", () => StorageEngine.exportBackupJSON());
    }

    if (this.importFileInput) {
      this.importFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const res = StorageEngine.importBackupJSON(event.target.result);
            alert(res.message);
            if (res.success) {
              location.reload();
            }
          };
          reader.readAsText(file);
        }
      });
    }

    if (this.btnResetData) {
      this.btnResetData.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset all workout history and PRs? This cannot be undone.")) {
          StorageEngine.resetAllData();
          location.reload();
        }
      });
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    
    this.navTabs.forEach((t) => {
      if (t.getAttribute("data-target") === tabName) {
        t.classList.add("active");
      } else {
        t.classList.remove("active");
      }
    });

    [this.viewHome, this.viewActiveSession, this.viewHistory, this.viewPRs, this.viewSettings].forEach((v) => {
      if (v) v.classList.add("hidden");
    });

    if (tabName === "home") {
      this.viewHome.classList.remove("hidden");
      this.renderHome();
    } else if (tabName === "history") {
      this.viewHistory.classList.remove("hidden");
      this.renderHistory();
    } else if (tabName === "prs") {
      this.viewPRs.classList.remove("hidden");
      this.renderPRs();
    } else if (tabName === "settings") {
      this.viewSettings.classList.remove("hidden");
    } else if (tabName === "active") {
      this.viewActiveSession.classList.remove("hidden");
    }
  }

  render() {
    this.switchTab("home");
  }

  renderHome() {
    if (!this.dayCardsContainer) return;
    this.dayCardsContainer.innerHTML = "";

    const targetInfo = PROGRAM_DATA.getWeekTarget(this.currentWeek);

    PROGRAM_DATA.days.forEach((day) => {
      const card = document.createElement("div");
      card.className = "glass-card day-card";

      card.innerHTML = `
        <div class="day-header">
          <h3 class="day-title">${day.name}</h3>
        </div>
        <div class="day-subtitle">${day.subtitle}</div>
        <div class="day-meta-tags">
          <span class="tag tag-highlight">Week ${this.currentWeek} Target: ${targetInfo.reps} Reps</span>
          <span class="tag">Holds: ${targetInfo.holdSec}s</span>
          <span class="tag">3 Sets</span>
        </div>
        <button class="btn-start-day">
          <span>Start Session</span>
        </button>
      `;

      card.querySelector(".btn-start-day").addEventListener("click", () => {
        this.startWorkout(day.id);
      });

      this.dayCardsContainer.appendChild(card);
    });
  }

  startWorkout(dayId) {
    this.activeWorkout = new WorkoutEngine(dayId, this.currentWeek);
    
    this.activeWorkout.onClockTick = (formattedTime) => {
      if (this.sessionTimer) this.sessionTimer.textContent = formattedTime;
    };

    this.activeWorkout.onSetCompleted = (exId, setIdx) => {
      this.activeWorkout.startRestTimer(90, (secLeft) => {
        this.showFloatingRestTimer(secLeft);
      }, () => {
        this.hideFloatingRestTimer();
      });
    };

    this.sessionTitle.textContent = this.activeWorkout.dayData.name;
    this.renderActiveSessionExercises();
    this.switchTab("active");
  }

  renderActiveSessionExercises() {
    if (!this.sessionExercisesContainer || !this.activeWorkout) return;
    this.sessionExercisesContainer.innerHTML = "";

    const dayData = this.activeWorkout.dayData;

    dayData.sections.forEach((section) => {
      const secHeader = document.createElement("h4");
      secHeader.style.cssText = "color: var(--accent-gold); margin: 20px 0 10px 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;";
      secHeader.textContent = section.title;
      this.sessionExercisesContainer.appendChild(secHeader);

      section.exercises.forEach((ex) => {
        const exCard = document.createElement("div");
        exCard.className = "glass-card exercise-card";

        let supersetBadgeHTML = "";
        if (ex.superset) {
          supersetBadgeHTML = `<div class="superset-badge">SUPERSET ${ex.supersetRole}</div>`;
        }

        let commentsHTML = "";
        if (ex.comments) {
          commentsHTML = `<div class="exercise-comments">💡 ${ex.comments}</div>`;
        }

        let extraToolsHTML = "";
        if (ex.hasIntervalTimer) {
          extraToolsHTML = `
            <button class="btn-start-day" style="margin-bottom: 12px; background: linear-gradient(135deg, var(--accent-gold), var(--accent-rose)); color: #0f1013;" id="btnLaunchInterval_${ex.id}">
              ⏱ Launch 30s/30s Interval Timer (8 Rounds)
            </button>
          `;
        }

        const loggedEx = this.activeWorkout.loggedData[ex.id];

        let setsRowsHTML = loggedEx.sets.map((setObj, sIdx) => {
          return `
            <div class="set-row ${setObj.completed ? 'completed' : ''}" id="setRow_${ex.id}_${sIdx}">
              <div class="set-label">Set ${setObj.setNum}</div>
              <input type="number" step="0.5" class="set-input" placeholder="kg" value="${setObj.weight}" id="inputW_${ex.id}_${sIdx}">
              <input type="text" class="set-input" placeholder="reps" value="${setObj.reps}" id="inputR_${ex.id}_${sIdx}">
              <input type="text" class="set-input" placeholder="RPE" value="${setObj.rpe}" id="inputRPE_${ex.id}_${sIdx}">
              <button class="btn-check-set" id="btnCheck_${ex.id}_${sIdx}">
                ${setObj.completed ? '✓' : '○'}
              </button>
            </div>
          `;
        }).join("");

        exCard.innerHTML = `
          ${supersetBadgeHTML}
          <div class="exercise-title-row">
            <div class="exercise-name">${ex.name}</div>
          </div>
          ${commentsHTML}
          ${extraToolsHTML}
          <div class="sets-header-row">
            <span>SET</span>
            <span>KG</span>
            <span>REPS</span>
            <span>RPE</span>
            <span>LOG</span>
          </div>
          ${setsRowsHTML}
        `;

        this.sessionExercisesContainer.appendChild(exCard);

        loggedEx.sets.forEach((setObj, sIdx) => {
          const btnCheck = exCard.querySelector(`#btnCheck_${ex.id}_${sIdx}`);
          const inputW = exCard.querySelector(`#inputW_${ex.id}_${sIdx}`);
          const inputR = exCard.querySelector(`#inputR_${ex.id}_${sIdx}`);
          const inputRPE = exCard.querySelector(`#inputRPE_${ex.id}_${sIdx}`);

          if (btnCheck) {
            btnCheck.addEventListener("click", () => {
              const weightVal = inputW ? inputW.value : "";
              const repsVal = inputR ? inputR.value : "";
              const rpeVal = inputRPE ? inputRPE.value : "";

              this.activeWorkout.toggleSetCompleted(ex.id, sIdx, weightVal, repsVal, rpeVal);
              
              const row = exCard.querySelector(`#setRow_${ex.id}_${sIdx}`);
              if (row) {
                if (loggedEx.sets[sIdx].completed) {
                  row.classList.add("completed");
                  btnCheck.textContent = "✓";
                } else {
                  row.classList.remove("completed");
                  btnCheck.textContent = "○";
                }
              }
            });
          }
        });

        if (ex.hasIntervalTimer) {
          const btnLaunch = exCard.querySelector(`#btnLaunchInterval_${ex.id}`);
          if (btnLaunch) {
            btnLaunch.addEventListener("click", () => {
              this.launchIntervalTimer();
            });
          }
        }
      });
    });
  }

  launchIntervalTimer() {
    if (!this.activeWorkout) return;
    this.intervalModal.classList.remove("hidden");

    this.activeWorkout.startIntervalTimer(
      8,
      (secLeft, phase, round) => {
        this.intervalCountdown.textContent = secLeft.toString().padStart(2, '0');
        this.intervalRoundsText.textContent = `Round ${round} of 8`;
      },
      (phase, round, secLeft) => {
        this.intervalPhaseTitle.textContent = phase === "HARD" ? "⚡ GO HARD (30s)" : "🧊 EASY RECOVERY (30s)";
        this.intervalPhaseTitle.className = `interval-phase-title ${phase}`;
        this.intervalCountdown.textContent = secLeft.toString().padStart(2, '0');
      },
      () => {
        this.intervalPhaseTitle.textContent = "✨ WORKOUT FINISHED!";
        this.intervalCountdown.textContent = "00";
        setTimeout(() => this.intervalModal.classList.add("hidden"), 2000);
      }
    );
  }

  showFloatingRestTimer(secLeft) {
    if (!this.floatingRestTimer) return;
    this.floatingRestTimer.classList.remove("hidden");
    if (this.restTimerDisplay) {
      const mins = Math.floor(secLeft / 60);
      const secs = secLeft % 60;
      this.restTimerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }

  hideFloatingRestTimer() {
    if (this.floatingRestTimer) this.floatingRestTimer.classList.add("hidden");
  }

  openCoachUpdateModal() {
    if (!this.activeWorkout) return;

    const overallRpe = this.rpeSlider ? parseInt(this.rpeSlider.value, 10) : 8;
    const coachNotes = this.coachNotesInput ? this.coachNotesInput.value : "";

    this.latestSessionLog = this.activeWorkout.finishSession(overallRpe, coachNotes);
    
    const summaryText = CoachUpdater.generateSummaryText(this.latestSessionLog);
    if (this.reportPreview) this.reportPreview.textContent = summaryText;

    this.coachModal.classList.remove("hidden");
  }

  closeCoachUpdateModal() {
    if (this.coachModal) this.coachModal.classList.add("hidden");
    this.hideFloatingRestTimer();
    if (this.metronomeVisualBar) this.metronomeVisualBar.classList.add("hidden");
    this.activeWorkout = null;
  }

  renderHistory() {
    if (!this.historyListContainer) return;
    this.historyListContainer.innerHTML = "";

    const history = StorageEngine.getCompletedSessions();

    if (history.length === 0) {
      this.historyListContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">📋</div>
          <p>No completed workout logs yet.</p>
          <p style="font-size: 0.82rem;">Complete your first session to view coach updates & logs here!</p>
        </div>
      `;
      return;
    }

    history.forEach((log) => {
      const card = document.createElement("div");
      card.className = "history-card";
      
      const summaryText = CoachUpdater.generateSummaryText(log);

      card.innerHTML = `
        <div class="history-card-header">
          <span>${log.dayName} (Week ${log.week})</span>
          <span>⏱ ${log.durationMins} mins</span>
        </div>
        <div class="history-card-date">📅 ${log.date} ${log.rpeRating ? `| RPE ${log.rpeRating}/10` : ''}</div>
        <pre style="margin-top: 10px; font-family: monospace; font-size: 0.78rem; color: var(--text-secondary); background: rgba(0,0,0,0.3); padding: 10px; border-radius: var(--radius-sm); white-space: pre-wrap;">${summaryText}</pre>
      `;

      this.historyListContainer.appendChild(card);
    });
  }

  renderPRs() {
    if (!this.prsListContainer) return;
    this.prsListContainer.innerHTML = "";

    const prs = StorageEngine.getPRs();
    const entries = Object.entries(prs);

    if (entries.length === 0) {
      this.prsListContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🏆</div>
          <p>No Personal Records logged yet.</p>
          <p style="font-size: 0.82rem;">Log your exercise weights to track strength gains across 6 weeks!</p>
        </div>
      `;
      return;
    }

    entries.forEach(([exId, pr]) => {
      const card = document.createElement("div");
      card.className = "history-card";
      card.innerHTML = `
        <div class="history-card-header">
          <span>🏆 ${pr.exerciseName}</span>
          <span style="color: var(--accent-gold); font-size: 1.05rem;">${pr.maxWeight} kg</span>
        </div>
        <div class="history-card-date">Best Reps: ${pr.bestReps} reps | Week ${pr.week} (${pr.date})</div>
      `;
      this.prsListContainer.appendChild(card);
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => console.log('SNC PWA ServiceWorker registered:', reg.scope))
          .catch((err) => console.log('ServiceWorker failed:', err));
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.sncApp = new AppController();
});
