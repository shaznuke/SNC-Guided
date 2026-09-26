/**
 * Main Application Orchestrator & View Controller
 * Dragon Ball Z Super Saiyan Training Aesthetic + Canvas JPEG AI Vision Food Analyzer
 */

import { PROGRAM_DATA } from './programData.js';
import { StorageEngine } from './storage.js';
import { WorkoutEngine } from './workoutEngine.js';
import { CoachUpdater } from './coachUpdater.js';
import { ProgressiveEngine } from './progressiveEngine.js';
import { ExcelExporter } from './excelExporter.js';
import { NutritionEngine } from './nutritionEngine.js';
import { AIVisionEstimator } from './aiVisionEstimator.js';
import { WhoopTracker } from './whoopTracker.js';

const DBZ_INSPIRATIONAL_QUOTES = [
  "PUSH PAST YOUR LIMITS. BREAK YOUR CEILING.",
  "WORK HARD, STUDY WELL, AND EAT AND SLEEP PLENTY!",
  "POWER COMES IN RESPONSE TO A NEED, NOT A DESIRE.",
  "TRAIN LIKE A SAIYAN IN THE HYPERBOLIC TIME CHAMBER.",
  "PAIN IS TEMPORARY. POWER IS FOREVER.",
  "OUTWORK EVERY CEILING YOU EVER PLACED ON YOURSELF.",
  "EVERY REP IS A STEP CLOSER TO SUPER SAIYAN STRENGTH."
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
    this.programSelect = document.getElementById("programSelect");
    this.weekSelect = document.getElementById("weekSelect");
    this.navTabs = document.querySelectorAll(".nav-tab");
    this.motivationalQuote = document.getElementById("motivationalQuote");

    this.viewHome = document.getElementById("viewHome");
    this.viewActiveSession = document.getElementById("viewActiveSession");
    this.viewHistory = document.getElementById("viewHistory");
    this.viewNutrition = document.getElementById("viewNutrition");
    this.viewWhoop = document.getElementById("viewWhoop");
    this.viewSettings = document.getElementById("viewSettings");

    this.dayCardsContainer = document.getElementById("dayCardsContainer");
    this.sessionExercisesContainer = document.getElementById("sessionExercisesContainer");
    this.historyListContainer = document.getElementById("historyListContainer");

    this.homeProgramTitle = document.getElementById("homeProgramTitle");

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

    this.btnToggleMetronome = document.getElementById("btnToggleMetronome");

    this.btnExportExcelCoach = document.getElementById("btnExportExcelCoach");

    this.whoopHeaderBanner = document.getElementById("whoopHeaderBanner");
    this.whoopHeaderTitle = document.getElementById("whoopHeaderTitle");
    this.whoopHeaderAdvice = document.getElementById("whoopHeaderAdvice");
    this.whoopZoneBadge = document.getElementById("whoopZoneBadge");
    this.whoopAdviceText = document.getElementById("whoopAdviceText");
    this.whoopRecoveryInput = document.getElementById("whoopRecoveryInput");
    this.whoopStrainInput = document.getElementById("whoopStrainInput");
    this.whoopSleepInput = document.getElementById("whoopSleepInput");
    this.btnSaveWhoop = document.getElementById("btnSaveWhoop");

    this.bmrValueDisplay = document.getElementById("bmrValueDisplay");
    this.tdeeValueDisplay = document.getElementById("tdeeValueDisplay");
    this.calsProgressText = document.getElementById("calsProgressText");
    this.calsProgressBar = document.getElementById("calsProgressBar");
    this.proteinProgressText = document.getElementById("proteinProgressText");
    this.carbsProgressText = document.getElementById("carbsProgressText");
    this.fatsProgressText = document.getElementById("fatsProgressText");
    this.mealPhotoInput = document.getElementById("mealPhotoInput");
    this.mealsListContainer = document.getElementById("mealsListContainer");
    this.btnEditBMR = document.getElementById("btnEditBMR");
    this.bmrModal = document.getElementById("bmrModal");
    this.btnCloseBMRModal = document.getElementById("btnCloseBMRModal");
    this.bmrWeightInput = document.getElementById("bmrWeightInput");
    this.bmrHeightInput = document.getElementById("bmrHeightInput");
    this.bmrAgeInput = document.getElementById("bmrAgeInput");
    this.bmrActivityInput = document.getElementById("bmrActivityInput");
    this.btnCalculateBMR = document.getElementById("btnCalculateBMR");

    this.geminiApiKeyInput = document.getElementById("geminiApiKeyInput");
    this.btnSaveApiKey = document.getElementById("btnSaveApiKey");
    this.btnExportData = document.getElementById("btnExportData");
    this.btnResetData = document.getElementById("btnResetData");
  }

  initInspirationalQuote() {
    if (this.motivationalQuote) {
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      const selectedQuote = DBZ_INSPIRATIONAL_QUOTES[dayOfYear % DBZ_INSPIRATIONAL_QUOTES.length];
      this.motivationalQuote.textContent = selectedQuote;
    }
  }

  bindEvents() {
    if (this.programSelect) {
      this.programSelect.value = PROGRAM_DATA.getActiveProgram().id;
      this.programSelect.addEventListener("change", (e) => {
        PROGRAM_DATA.setActiveProgram(e.target.value);
        this.renderHome();
      });
    }

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

    if (this.btnExportExcelCoach) {
      this.btnExportExcelCoach.addEventListener("click", () => {
        ExcelExporter.exportCoachSpreadsheet();
      });
    }

    if (this.whoopHeaderBanner) {
      this.whoopHeaderBanner.addEventListener("click", () => this.switchTab("whoop"));
    }
    if (this.btnSaveWhoop) {
      this.btnSaveWhoop.addEventListener("click", () => {
        const data = WhoopTracker.saveTodayWhoopData({
          recoveryScore: this.whoopRecoveryInput ? this.whoopRecoveryInput.value : 78,
          dayStrain: this.whoopStrainInput ? this.whoopStrainInput.value : 12.4,
          sleepPerformance: this.whoopSleepInput ? this.whoopSleepInput.value : 85
        });
        this.renderWhoop();
        alert("✓ WHOOP metrics saved!");
      });
    }

    if (this.btnEditBMR) {
      this.btnEditBMR.addEventListener("click", () => {
        if (this.bmrModal) this.bmrModal.classList.remove("hidden");
      });
    }
    if (this.btnCloseBMRModal) {
      this.btnCloseBMRModal.addEventListener("click", () => {
        if (this.bmrModal) this.bmrModal.classList.add("hidden");
      });
    }
    if (this.btnCalculateBMR) {
      this.btnCalculateBMR.addEventListener("click", () => {
        NutritionEngine.saveNutritionSettings({
          weightKg: this.bmrWeightInput ? this.bmrWeightInput.value : 62,
          heightCm: this.bmrHeightInput ? this.bmrHeightInput.value : 165,
          age: this.bmrAgeInput ? this.bmrAgeInput.value : 26,
          gender: "female",
          activityLevel: this.bmrActivityInput ? this.bmrActivityInput.value : 1.55,
          targetProtein: 130,
          targetCarbs: 200,
          targetFat: 55
        });
        if (this.bmrModal) this.bmrModal.classList.add("hidden");
        this.renderNutrition();
      });
    }

    // AI Meal Photo Scanner with Canvas JPEG Processing
    if (this.mealPhotoInput) {
      this.mealPhotoInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          alert("⚡ AI is analyzing your food/beverage photo...");
          const result = await AIVisionEstimator.analyzeMealPhotoFile(file);

          NutritionEngine.addMealLog({
            name: result.name,
            calories: result.calories,
            protein: result.protein,
            carbs: result.carbs,
            fat: result.fat,
            photoUrl: result.photoUrl
          });

          this.renderNutrition();
          alert(`✓ AI Identified: ${result.name} (${result.calories} kcal)`);
        }
      });
    }

    if (this.btnSaveApiKey && this.geminiApiKeyInput) {
      this.geminiApiKeyInput.value = AIVisionEstimator.getStoredApiKey();
      this.btnSaveApiKey.addEventListener("click", () => {
        AIVisionEstimator.setStoredApiKey(this.geminiApiKeyInput.value);
        alert("✓ Gemini API Key saved!");
      });
    }

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

    if (this.btnToggleMetronome) {
      this.btnToggleMetronome.addEventListener("click", () => {
        if (this.activeWorkout) {
          this.activeWorkout.unlockIOSAudio();

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

    [this.viewHome, this.viewActiveSession, this.viewHistory, this.viewNutrition, this.viewWhoop, this.viewSettings].forEach((v) => {
      if (v) v.classList.add("hidden");
    });

    if (tabName === "home") {
      this.viewHome.classList.remove("hidden");
      this.renderHome();
    } else if (tabName === "history") {
      this.viewHistory.classList.remove("hidden");
      this.renderHistory();
    } else if (tabName === "nutrition") {
      this.viewNutrition.classList.remove("hidden");
      this.renderNutrition();
    } else if (tabName === "whoop") {
      this.viewWhoop.classList.remove("hidden");
      this.renderWhoop();
    } else if (tabName === "settings") {
      this.viewSettings.classList.remove("hidden");
    } else if (tabName === "active") {
      this.viewActiveSession.classList.remove("hidden");
    }
  }

  render() {
    this.renderWhoopHeader();
    this.switchTab("home");
  }

  renderWhoopHeader() {
    const wData = WhoopTracker.getTodayWhoopData();
    const advice = WhoopTracker.getReadinessAdvice(wData.recoveryScore);
    if (this.whoopHeaderTitle) this.whoopHeaderTitle.textContent = `WHOOP Recovery: ${wData.recoveryScore}% (${advice.zone} Zone)`;
    if (this.whoopHeaderAdvice) this.whoopHeaderAdvice.textContent = advice.advice;
  }

  renderHome() {
    if (!this.dayCardsContainer) return;
    this.dayCardsContainer.innerHTML = "";

    const activeProg = PROGRAM_DATA.getActiveProgram();
    const targetInfo = activeProg.getWeekTarget(this.currentWeek);

    if (this.homeProgramTitle) {
      this.homeProgramTitle.textContent = activeProg.title;
    }

    activeProg.days.forEach((day) => {
      const card = document.createElement("div");
      card.className = "glass-card day-card";

      const repsLabel = targetInfo.reps && Array.isArray(targetInfo.reps)
        ? "Pyramid (15,12,9,6)"
        : `${targetInfo.reps} Reps`;

      card.innerHTML = `
        <div class="day-header">
          <h3 class="day-title">${day.name}</h3>
        </div>
        <div class="day-subtitle">${day.subtitle}</div>
        <div class="day-meta-tags">
          <span class="tag tag-highlight">⚡ Week ${this.currentWeek}: ${repsLabel}</span>
          <span class="tag">3s Eccentric Focus</span>
        </div>
        <button class="btn-start-day">
          <span>🔥 START TRAINING</span>
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
      secHeader.style.cssText = "color: var(--accent-gold); margin: 20px 0 10px 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800;";
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

        const loggedEx = this.activeWorkout.loggedData[ex.id];

        let setsRowsHTML = loggedEx.sets.map((setObj, sIdx) => {
          const sug = ProgressiveEngine.getSetSuggestion(ex.id, this.currentWeek, sIdx, setObj.reps);

          let sugBannerHTML = "";
          if (sug.hasData) {
            sugBannerHTML = `
              <div style="grid-column: 1 / -1; font-size: 0.72rem; color: var(--accent-gold); background: rgba(255, 215, 0, 0.08); padding: 4px 8px; border-radius: var(--radius-sm); margin-bottom: 4px; font-weight: 700;">
                ⚡ ${sug.text}
              </div>
            `;
          }

          return `
            ${sugBannerHTML}
            <div class="set-row ${setObj.completed ? 'completed' : ''}" id="setRow_${ex.id}_${sIdx}">
              <div class="set-label">Set ${setObj.setNum}</div>
              <input type="number" step="0.5" class="set-input" placeholder="${sug.suggestedWeight ? sug.suggestedWeight + 'kg' : 'kg'}" value="${setObj.weight}" id="inputW_${ex.id}_${sIdx}">
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
      });
    });
  }

  renderNutrition() {
    const settings = NutritionEngine.getNutritionSettings();
    const totals = NutritionEngine.getTodayTotals();

    if (this.bmrValueDisplay) this.bmrValueDisplay.textContent = `${settings.bmr.toLocaleString()} kcal`;
    if (this.tdeeValueDisplay) this.tdeeValueDisplay.textContent = `${settings.tdee.toLocaleString()} kcal`;

    if (this.calsProgressText) this.calsProgressText.textContent = `${totals.calories} / ${settings.tdee} kcal`;
    if (this.calsProgressBar) {
      const pct = Math.min(100, Math.round((totals.calories / settings.tdee) * 100));
      this.calsProgressBar.style.width = `${pct}%`;
    }

    if (this.proteinProgressText) this.proteinProgressText.textContent = `${totals.protein} / ${settings.targetProtein}g`;
    if (this.carbsProgressText) this.carbsProgressText.textContent = `${totals.carbs} / ${settings.targetCarbs}g`;
    if (this.fatsProgressText) this.fatsProgressText.textContent = `${totals.fat} / ${settings.targetFat}g`;

    if (this.mealsListContainer) {
      this.mealsListContainer.innerHTML = "";
      const meals = NutritionEngine.getTodayMealLogs();

      if (meals.length === 0) {
        this.mealsListContainer.innerHTML = `
          <div style="text-align: center; color: var(--text-muted); padding: 20px 0; font-size: 0.85rem;">
            No meals logged today yet. Snap a meal/drink photo above!
          </div>
        `;
        return;
      }

      meals.forEach((m) => {
        const card = document.createElement("div");
        card.className = "history-card";
        card.innerHTML = `
          <div class="history-card-header">
            <span>🍽 ${m.name}</span>
            <span style="color: var(--accent-gold);">${m.calories} kcal</span>
          </div>
          <div class="history-card-date">⏱ ${m.time} | P: ${m.protein}g • C: ${m.carbs}g • F: ${m.fat}g</div>
        `;
        this.mealsListContainer.appendChild(card);
      });
    }
  }

  renderWhoop() {
    const wData = WhoopTracker.getTodayWhoopData();
    const advice = WhoopTracker.getReadinessAdvice(wData.recoveryScore);

    if (this.whoopZoneBadge) {
      this.whoopZoneBadge.textContent = advice.title;
      this.whoopZoneBadge.style.color = advice.color;
    }
    if (this.whoopAdviceText) this.whoopAdviceText.textContent = advice.advice;

    if (this.whoopRecoveryInput) this.whoopRecoveryInput.value = wData.recoveryScore;
    if (this.whoopStrainInput) this.whoopStrainInput.value = wData.dayStrain;
    if (this.whoopSleepInput) this.whoopSleepInput.value = wData.sleepPerformance;
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
        <pre style="margin-top: 10px; font-family: monospace; font-size: 0.78rem; color: var(--text-secondary); background: rgba(0,0,0,0.4); padding: 10px; border-radius: var(--radius-sm); white-space: pre-wrap;">${summaryText}</pre>
      `;

      this.historyListContainer.appendChild(card);
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
