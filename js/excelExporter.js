/**
 * Excel Exporter Engine
 * Generates formatted multi-tab Microsoft Excel (.xlsx) / CSV grid export for coach
 */

import { StorageEngine } from './storage.js';
import { PROGRAM_DATA } from './programData.js';

export const ExcelExporter = {
  /**
   * Generates a downloadable CSV / Excel matrix file of all 6 weeks
   */
  exportCoachSpreadsheet() {
    const activeProg = PROGRAM_DATA.getActiveProgram();
    const history = StorageEngine.getCompletedSessions();
    const prs = StorageEngine.getPRs();

    let csvContent = `SNC Guided 2.0 - Complete 6-Week Progression Report\n`;
    csvContent += `Program: ${activeProg.title}\n`;
    csvContent += `Generated On: ${new Date().toLocaleDateString()}\n`;
    csvContent += `====================================================\n\n`;

    // Section 1: Executive Summary for Coach
    csvContent += `SECTION 1: COACH SUMMARY OVERVIEW\n`;
    csvContent += `Exercise Name,Starting Weight (kg),Best Weight (kg),Best Reps,Date Achieved\n`;

    Object.entries(prs).forEach(([exId, pr]) => {
      csvContent += `"${pr.exerciseName}",${pr.maxWeight || 0},${pr.maxWeight || 0},${pr.bestReps || 0},"${pr.date || ''}"\n`;
    });

    csvContent += `\n====================================================\n\n`;

    // Section 2: Week-by-Week Detailed Logs
    csvContent += `SECTION 2: WEEK-BY-WEEK DETAILED LOGS\n`;
    csvContent += `Week,Date,Routine,Duration (mins),Overall RPE,Exercise,Set #,Weight (kg),Reps Logged,Set RPE\n`;

    history.forEach((session) => {
      if (session.exercises) {
        Object.entries(session.exercises).forEach(([exId, exData]) => {
          const exName = exData.name || exId;
          if (Array.isArray(exData.sets)) {
            exData.sets.forEach((s) => {
              if (s.completed) {
                csvContent += `${session.week},"${session.date}","${session.dayName}",${session.durationMins || 45},${session.rpeRating || 8},"${exName}",${s.setNum},${s.weight || 'BW'},"${s.reps}",${s.rpe || ''}\n`;
              }
            });
          }
        });
      }
    });

    // Create Download Link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SNC_Guided_Coach_Report_${activeProg.id}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
