/**
 * Tailored Strength & Conditioning (SNC) Program Data
 * Supports Phase 1 & Phase 2 (Pyramid Loading 15-12-9-6 Reps)
 */

export const PROGRAM_DATA = {
  activeProgramId: "phase2", // Default to Phase 2, toggleable to phase1

  programs: {
    phase1: {
      id: "phase1",
      title: "Phase 1: Foundation & Hypertrophy",
      weeksCount: 6,
      getWeekTarget(weekNum) {
        if (weekNum <= 2) return { reps: 8, holdSec: 30, sets: 3 };
        if (weekNum <= 4) return { reps: 10, holdSec: 35, sets: 3 };
        return { reps: 12, holdSec: 40, sets: 3 };
      },
      days: [
        {
          id: "p1_day1",
          name: "Day 1: Lower / Upper Pull & Push",
          subtitle: "Goblet Squats, Lat Pull Down & BB RDL",
          color: "var(--accent-gold)",
          sections: [
            {
              title: "Warm Up",
              type: "warmup",
              exercises: [
                { id: "p1_d1_w1", name: "Bike / Row / Jump Rope / Cross trainer", sets: 1, reps: "5 mins", rpe: "RPE 4/5" }
              ]
            },
            {
              title: "Mobility",
              type: "mobility",
              exercises: [
                { id: "p1_d1_m1", name: "HK Flexor to Adductor rockers", sets: 2, reps: 8 },
                { id: "p1_d1_m2", name: "Bench T spine Extension", sets: 2, reps: 8 },
                { id: "p1_d1_m3", name: "Hip 90 - 90 with lateral reaches", sets: 2, reps: 8 },
                { id: "p1_d1_m4", name: "Banded shoulder Passthroughs", sets: 2, reps: 8 }
              ]
            },
            {
              title: "Activations",
              type: "activation",
              exercises: [
                { id: "p1_d1_a1", name: "Side plank clamshells", sets: 2, reps: 8 },
                { id: "p1_d1_a2", name: "Scapular Pull Ups", sets: 2, reps: 8 },
                { id: "p1_d1_a3", name: "Incline Bench W to OH", sets: 2, reps: 8 },
                { id: "p1_d1_a4", name: "SL Hip thrust Hold", sets: 2, isHold: true }
              ]
            },
            {
              title: "Mains (Supersets)",
              type: "mains",
              exercises: [
                { id: "p1_d1_a1", name: "A1. Heel Elevated Goblet Squats", superset: "A", supersetRole: "A1", sets: 3, isDynamicReps: true, rpe: "RPE 7/8", tempo: "3 sec Eccentric focus" },
                { id: "p1_d1_a2", name: "A2. HK SA Lat Pull Down", superset: "A", supersetRole: "A2", sets: 3, isDynamicReps: true },
                { id: "p1_d1_b1", name: "B1. BB RDL", superset: "B", supersetRole: "B1", sets: 3, isDynamicReps: true },
                { id: "p1_d1_b2", name: "B2. Decline Push Ups", superset: "B", supersetRole: "B2", sets: 3, isDynamicReps: true },
                { id: "p1_d1_c1", name: "C1. CL DB Split Squats", superset: "C", supersetRole: "C1", sets: 3, isDynamicReps: true },
                { id: "p1_d1_c2", name: "C2. Chest Supported Alternate Rows", superset: "C", supersetRole: "C2", sets: 3, isDynamicReps: true }
              ]
            },
            {
              title: "Conditioning",
              type: "conditioning",
              exercises: [
                { id: "p1_d1_cond", name: "Bike Interval Conditioning", sets: 1, reps: "8-10 rounds", tempo: "30s hard / 30s easy", hasIntervalTimer: true }
              ]
            }
          ]
        },
        {
          id: "p1_day2",
          name: "Day 2: Hinge / Upper Push & Core",
          subtitle: "Trap Bar Deadlift, Landmine Press & Step Ups",
          color: "var(--accent-rose)",
          sections: [
            {
              title: "Warm Up",
              type: "warmup",
              exercises: [
                { id: "p1_d2_w1", name: "Bike / Row / Jump Rope / Cross trainer", sets: 1, reps: "5 mins", rpe: "RPE 4/5" }
              ]
            },
            {
              title: "Mobility",
              type: "mobility",
              exercises: [
                { id: "p1_d2_m1", name: "Banded Hamstring Kickouts", sets: 2, reps: 8 },
                { id: "p1_d2_m2", name: "HK Thoracic Windmill", sets: 2, reps: 8 },
                { id: "p1_d2_m3", name: "KB Wall Ankle Lunge Mobility", sets: 2, reps: 8 },
                { id: "p1_d2_m4", name: "Crab Reaches", sets: 2, reps: 8 }
              ]
            },
            {
              title: "Activations",
              type: "activation",
              exercises: [
                { id: "p1_d2_a1", name: "Serratus Wall slides", sets: 2, reps: 8 },
                { id: "p1_d2_a2", name: "Hamstring walkouts", sets: 2, reps: 8 },
                { id: "p1_d2_a3", name: "Banded shoulder External rotation", sets: 2, reps: 8 },
                { id: "p1_d2_a4", name: "Modified MSL", sets: 2, isHold: true }
              ]
            },
            {
              title: "Mains (Supersets)",
              type: "mains",
              exercises: [
                { id: "p1_d2_a1", name: "A1. Trap bar deadlift", superset: "A", supersetRole: "A1", sets: 3, isDynamicReps: true, rpe: "RPE 7/8", tempo: "3 sec Eccentric focus" },
                { id: "p1_d2_a2", name: "A2. HK Landmine press", superset: "A", supersetRole: "A2", sets: 3, isDynamicReps: true },
                { id: "p1_d2_b1", name: "B1. DB Step Ups", superset: "B", supersetRole: "B1", sets: 3, isDynamicReps: true },
                { id: "p1_d2_b2", name: "B2. SA DB Chest Press", superset: "B", supersetRole: "B2", sets: 3, isDynamicReps: true },
                { id: "p1_d2_c1", name: "C1. Sliders / Swissball Leg curls", superset: "C", supersetRole: "C1", sets: 3, isDynamicReps: true },
                { id: "p1_d2_c2", name: "C2. Plank to Pike", superset: "C", supersetRole: "C2", sets: 3, isDynamicReps: true }
              ]
            },
            {
              title: "Core / Accessories",
              type: "accessories",
              exercises: [
                { id: "p1_d2_acc1", name: "Sled Push + Farmer's carry", sets: 1, reps: "8-10 rounds (15m)" }
              ]
            }
          ]
        },
        {
          id: "p1_day3",
          name: "Day 3: Hip Thrust & Bodybuilding",
          subtitle: "BB Hip Thrust, TRX Rows & Arm/Shoulder Circuit",
          color: "var(--accent-emerald)",
          sections: [
            {
              title: "Warm Up",
              type: "warmup",
              exercises: [
                { id: "p1_d3_w1", name: "Bike / Row / Jump Rope / Cross trainer", sets: 1, reps: "5 mins", rpe: "RPE 4/5" }
              ]
            },
            {
              title: "Mobility",
              type: "mobility",
              exercises: [
                { id: "p1_d3_m1", name: "Adductor Rockers T spine rotation", sets: 2, reps: 8 },
                { id: "p1_d3_m2", name: "Walking Inchworms", sets: 2, reps: 8 },
                { id: "p1_d3_m3", name: "Bear crawl", sets: 2, reps: 8 }
              ]
            },
            {
              title: "Activations",
              type: "activation",
              exercises: [
                { id: "p1_d3_a1", name: "SL MB Reaches", sets: 2, reps: 6 },
                { id: "p1_d3_a2", name: "Wall Cuban Press", sets: 2, reps: 8 },
                { id: "p1_d3_a3", name: "PSL", sets: 2, isHold: true }
              ]
            },
            {
              title: "Mains (Supersets)",
              type: "mains",
              exercises: [
                { id: "p1_d3_a1", name: "A1. BB Hip Thrust", superset: "A", supersetRole: "A1", sets: 3, isDynamicReps: true, rpe: "RPE 7/8", tempo: "3 sec Eccentric focus" },
                { id: "p1_d3_a2", name: "A2. TRX rows", superset: "A", supersetRole: "A2", sets: 3, isDynamicReps: true },
                { id: "p1_d3_b1", name: "B1. Lateral Squats", superset: "B", supersetRole: "B1", sets: 3, isDynamicReps: true },
                { id: "p1_d3_b2", name: "B2. Chek Press", superset: "B", supersetRole: "B2", sets: 3, isDynamicReps: true },
                { id: "p1_d3_c1", name: "C1. Goblet Reverse Lunges", superset: "C", supersetRole: "C1", sets: 3, isDynamicReps: true },
                { id: "p1_d3_c2", name: "C2. Incline bench / cable machine Pec Flys", superset: "C", supersetRole: "C2", sets: 3, isDynamicReps: true }
              ]
            },
            {
              title: "Bodybuilding Circuit",
              type: "circuit",
              exercises: [
                { id: "p1_d3_bb1", name: "Bicep curls", sets: 2, reps: 12 },
                { id: "p1_d3_bb2", name: "OH Triceps extension", sets: 2, reps: 12 },
                { id: "p1_d3_bb3", name: "Rear delt flys", sets: 2, reps: 12 },
                { id: "p1_d3_bb4", name: "Front to lateral raises", sets: 2, reps: 12 },
                { id: "p1_d3_bb5", name: "Standing calf raises", sets: 2, reps: 12 },
                { id: "p1_d3_bb6", name: "Ant tib raises", sets: 2, reps: 12 }
              ]
            }
          ]
        }
      ]
    },

    phase2: {
      id: "phase2",
      title: "Phase 2: Pyramid Loading & Strength Peak",
      weeksCount: 6,
      getWeekTarget(weekNum) {
        return { reps: [15, 12, 9, 6], holdSec: 45, sets: 4, note: "Pyramid sets: 15, 12, 9, 6 reps. Add load week-on-week." };
      },
      days: [
        {
          id: "p2_day1",
          name: "Day 1: Split Squats & Sumo Deadlift",
          subtitle: "Bulgarian Split Squat, SA Rows, Sumo Deadlift & Incline Press",
          color: "var(--accent-gold)",
          sections: [
            {
              title: "Warm Up",
              type: "warmup",
              exercises: [
                { id: "p2_d1_w1", name: "Bike / Row / Jump Rope / Cross trainer", sets: 1, reps: "5 mins", rpe: "RPE 4/5" }
              ]
            },
            {
              title: "Mobility",
              type: "mobility",
              exercises: [
                { id: "p2_d1_m1", name: "Banded Pec stretch", sets: 1, reps: "30 sec ES", comments: "Each side stretch" },
                { id: "p2_d1_m2", name: "Band Assisted T spine rotation", sets: 1, reps: "12 ES" },
                { id: "p2_d1_m3", name: "Banded Couch stretch w/ side bend", sets: 1, reps: "12 ES" },
                { id: "p2_d1_m4", name: "Banded Pigeon rockers", sets: 1, reps: "12 ES" }
              ]
            },
            {
              title: "Activations",
              type: "activation",
              exercises: [
                { id: "p2_d1_a1", name: "Wall Fire hydrants", sets: 2, reps: 8 },
                { id: "p2_d1_a2", name: "Banded W to OH Raises", sets: 2, reps: 8 },
                { id: "p2_d1_a3", name: "Adductor ball squeeze hamstring bridge", sets: 2, reps: "45 sec" }
              ]
            },
            {
              title: "Mains (Pyramid Sets)",
              type: "mains",
              exercises: [
                { id: "p2_d1_main_a1", name: "A1. DB Bulgarian Split Squats", sets: 4, pyramidReps: [15, 12, 9, 6], rpe: "RPE 7/8", tempo: "3 sec Eccentric focus", comments: "Finish A1 before moving to B1. Add load week-on-week." },
                { id: "p2_d1_main_b1", name: "B1. SA DB Bent Over Rows", sets: 4, pyramidReps: [15, 12, 9, 6], tempo: "3 sec Eccentric focus", comments: "Progress weight per set" },
                { id: "p2_d1_main_c1", name: "C1. BB Sumo Deadlift", sets: 4, pyramidReps: [15, 12, 9, 6], tempo: "3 sec Eccentric focus", comments: "Heavy hip hinge drive" },
                { id: "p2_d1_main_d1", name: "D1. Incline BB Bench Press", sets: 4, pyramidReps: [15, 12, 9, 6], tempo: "3 sec Eccentric focus", comments: "Upper chest focus" }
              ]
            },
            {
              title: "Accessories",
              type: "accessories",
              exercises: [
                { id: "p2_d1_acc1", name: "Tall Plank KB Drags", sets: 2, reps: 8 },
                { id: "p2_d1_acc2", name: "Toes In - Out Calf Raises", sets: 2, reps: 8 },
                { id: "p2_d1_acc3", name: "Hanging Wipers", sets: 2, reps: 8 },
                { id: "p2_d1_acc4", name: "Bench Dips", sets: 2, reps: 8 }
              ]
            }
          ]
        },
        {
          id: "p2_day2",
          name: "Day 2: Box Squats & Deadlifts",
          subtitle: "BB Box Squats, Lat Pull Down, Conventional Deadlift & Shoulder Press",
          color: "var(--accent-rose)",
          sections: [
            {
              title: "Warm Up",
              type: "warmup",
              exercises: [
                { id: "p2_d2_w1", name: "Bike / Row / Jump Rope / Cross trainer", sets: 1, reps: "5 mins", rpe: "RPE 4/5" }
              ]
            },
            {
              title: "Mobility",
              type: "mobility",
              exercises: [
                { id: "p2_d2_m1", name: "Banded Lats Stretch", sets: 1, reps: "30 sec ES" },
                { id: "p2_d2_m2", name: "Band distracted Hip IR - ER", sets: 1, reps: "12 ES" },
                { id: "p2_d2_m3", name: "KB FR T-Spine Extension", sets: 1, reps: 12 },
                { id: "p2_d2_m4", name: "HK Banded Adductor rockers", sets: 1, reps: "12 ES" }
              ]
            },
            {
              title: "Activations",
              type: "activation",
              exercises: [
                { id: "p2_d2_a1", name: "Modified MSL Drops", sets: 2, reps: 8 },
                { id: "p2_d2_a2", name: "Incline Bench Y's & T's", sets: 2, reps: 8 },
                { id: "p2_d2_a3", name: "Banded Bear Plank Scap Push Ups", sets: 2, reps: 8 }
              ]
            },
            {
              title: "Mains (Pyramid Sets)",
              type: "mains",
              exercises: [
                { id: "p2_d2_main_a1", name: "A1. BB Box Squats", sets: 4, pyramidReps: [15, 12, 9, 6], rpe: "RPE 7/8", tempo: "3 sec Eccentric focus", comments: "Sit back on box, explosive drive up." },
                { id: "p2_d2_main_b1", name: "B1. Lat Pull Down", sets: 4, pyramidReps: [15, 12, 9, 6], comments: "Full lat contraction" },
                { id: "p2_d2_main_c1", name: "C1. Conventional Deadlift", sets: 4, pyramidReps: [15, 12, 9, 6], comments: "Brace core, drag bar up shins" },
                { id: "p2_d2_main_d1", name: "D1. Seated DB Shoulder Press", sets: 4, pyramidReps: [15, 12, 9, 6], comments: "Controlled vertical overhead press" }
              ]
            },
            {
              title: "Core / Accessories",
              type: "accessories",
              exercises: [
                { id: "p2_d2_acc1", name: "Hollow Body Rockers", sets: 2, reps: 8 },
                { id: "p2_d2_acc2", name: "BB Reverse Curls", sets: 2, reps: 8 },
                { id: "p2_d2_acc3", name: "KB Side Bends", sets: 2, reps: 8 },
                { id: "p2_d2_acc4", name: "SM SL Calf Raises", sets: 2, reps: 8 }
              ]
            }
          ]
        },
        {
          id: "p2_day3",
          name: "Day 3: Conditioning Circuit & Arms",
          subtitle: "Pull Ups, Weighted Push-ups, Hip Thrusts & Ring Rows Circuit",
          color: "var(--accent-emerald)",
          sections: [
            {
              title: "Warm Up",
              type: "warmup",
              exercises: [
                { id: "p2_d3_w1", name: "Bike / Row / Jump Rope / Cross trainer", sets: 1, reps: "5 mins", rpe: "RPE 4/5" }
              ]
            },
            {
              title: "Mobility",
              type: "mobility",
              exercises: [
                { id: "p2_d3_m1", name: "Banded WGS with rotation", sets: 2, reps: 8 },
                { id: "p2_d3_m2", name: "Deep Squat Ankle rockers", sets: 2, reps: 8 },
                { id: "p2_d3_m3", name: "Banded shoulder Distraction", sets: 2, reps: 8 }
              ]
            },
            {
              title: "Activations",
              type: "activation",
              exercises: [
                { id: "p2_d3_a1", name: "HK Inverted KB Push Outs", sets: 2, reps: 8 },
                { id: "p2_d3_a2", name: "Band distracted step downs", sets: 2, reps: 8 },
                { id: "p2_d3_a3", name: "LSL", sets: 2, reps: "30 sec" }
              ]
            },
            {
              title: "Mains (Conditioning Circuit)",
              type: "mains",
              exercises: [
                { id: "p2_d3_c1", name: "Pull Ups / Assisted", sets: 3, reps: 20, rpe: "RPE 7/8", comments: "Perform as conditioning circuit. 3 sec eccentric." },
                { id: "p2_d3_c2", name: "DB slider lateral lunges", sets: 3, reps: "15 ES" },
                { id: "p2_d3_c3", name: "Weighted Push Ups", sets: 3, reps: 20 },
                { id: "p2_d3_c4", name: "SL DB Hip Thrust", sets: 3, reps: "15 ES" },
                { id: "p2_d3_c5", name: "Ring Inverted Rows", sets: 3, reps: 20 },
                { id: "p2_d3_c6", name: "DB Step Ups", sets: 3, reps: "15 ES" }
              ]
            },
            {
              title: "Core & Accessories",
              type: "accessories",
              exercises: [
                { id: "p2_d3_acc1", name: "DB Skull crusher", sets: 2, reps: 8 },
                { id: "p2_d3_acc2", name: "DB Hammer Curl", sets: 2, reps: 8 },
                { id: "p2_d3_acc3", name: "Lying / Seated Hamstring Curl", sets: 2, reps: 8 },
                { id: "p2_d3_acc4", name: "Leg Extension", sets: 2, reps: 8 }
              ]
            }
          ]
        }
      ]
    }
  },

  getActiveProgram() {
    const savedId = localStorage.getItem("snc_active_program_id") || this.activeProgramId;
    return this.programs[savedId] || this.programs.phase2;
  },

  setActiveProgram(programId) {
    if (this.programs[programId]) {
      this.activeProgramId = programId;
      localStorage.setItem("snc_active_program_id", programId);
    }
  }
};
