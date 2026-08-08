/**
 * Tailored Strength & Conditioning (SNC) 6-Week Program Data
 * Directly extracted from Coach's Plan PDF
 */

export const PROGRAM_DATA = {
  title: "Tailored SNC 6-Week Program",
  weeksCount: 6,
  getWeekTarget(weekNum) {
    if (weekNum <= 2) return { reps: 8, holdSec: 30, sets: 3 };
    if (weekNum <= 4) return { reps: 10, holdSec: 35, sets: 3 };
    return { reps: 12, holdSec: 40, sets: 3 };
  },
  days: [
    {
      id: "day1",
      name: "Day 1: Lower / Upper Pull & Push",
      subtitle: "Heel Elevated Goblet Squats, Lat Pull Down & RDL Focus",
      color: "var(--accent-cyan)",
      sections: [
        {
          title: "Warm Up",
          type: "warmup",
          exercises: [
            {
              id: "d1_w1",
              name: "Bike / Row / Jump Rope / Cross trainer",
              sets: 1,
              reps: "5 mins",
              rpe: "RPE 4/5",
              tempo: "Steady pace",
              comments: "General cardiovascular warm-up"
            }
          ]
        },
        {
          title: "Mobility",
          type: "mobility",
          exercises: [
            { id: "d1_m1", name: "HK Flexor to Adductor rockers", sets: 2, reps: 8, comments: "Half-kneeling dynamic rockers" },
            { id: "d1_m2", name: "Bench T spine Extension", sets: 2, reps: 8, comments: "Elbows on bench, thoracic extension" },
            { id: "d1_m3", name: "Hip 90 - 90 with lateral reaches", sets: 2, reps: 8, comments: "Hip internal & external mobility" },
            { id: "d1_m4", name: "Banded shoulder Passthroughs", sets: 2, reps: 8, comments: "Keep arms straight and core braced" }
          ]
        },
        {
          title: "Activations",
          type: "activation",
          exercises: [
            { id: "d1_a1", name: "Side plank clamshells", sets: 2, reps: 8, comments: "Glute medius and core activation" },
            { id: "d1_a2", name: "Scapular Pull Ups", sets: 2, reps: 8, comments: "Depress scapula without bending elbows" },
            { id: "d1_a3", name: "Incline Bench W to OH", sets: 2, reps: 8, comments: "Scapular Y-W-T activation" },
            { id: "d1_a4", name: "SL Hip thrust Hold", sets: 2, isHold: true, holdKey: true, comments: "Single leg isometric glute activation" }
          ]
        },
        {
          title: "Mains (Supersets)",
          type: "mains",
          exercises: [
            {
              id: "d1_main_a1",
              name: "A1. Heel Elevated Goblet Squats",
              superset: "A",
              supersetRole: "A1",
              sets: 3,
              isDynamicReps: true,
              rpe: "RPE 7/8",
              tempo: "3 sec Eccentric focus",
              comments: "To be performed as superset. Up to 2 mins break in between supersets. 3 sec eccentric focus."
            },
            {
              id: "d1_main_a2",
              name: "A2. HK SA Lat Pull Down",
              superset: "A",
              supersetRole: "A2",
              sets: 3,
              isDynamicReps: true,
              comments: "Half-kneeling single arm pull down. Squeeze lat at bottom."
            },
            {
              id: "d1_main_b1",
              name: "B1. BB RDL",
              superset: "B",
              supersetRole: "B1",
              sets: 3,
              isDynamicReps: true,
              comments: "Hinge at hips, flat back, stretch hamstrings."
            },
            {
              id: "d1_main_b2",
              name: "B2. Decline Push Ups",
              superset: "B",
              supersetRole: "B2",
              sets: 3,
              isDynamicReps: true,
              comments: "Feet elevated, core tight, chest to floor."
            },
            {
              id: "d1_main_c1",
              name: "C1. CL DB Split Squats",
              superset: "C",
              supersetRole: "C1",
              sets: 3,
              isDynamicReps: true,
              comments: "Contralateral DB hold. Stay upright."
            },
            {
              id: "d1_main_c2",
              name: "C2. Chest Supported Alternate Rows",
              superset: "C",
              supersetRole: "C2",
              sets: 3,
              isDynamicReps: true,
              comments: "Incline bench support, alternate row each side."
            }
          ]
        },
        {
          title: "Conditioning",
          type: "conditioning",
          exercises: [
            {
              id: "d1_c1",
              name: "Bike Interval Conditioning",
              sets: 1,
              reps: "8-10 rounds",
              tempo: "30s hard / 30s easy",
              hasIntervalTimer: true,
              comments: "30 sec moderate-hard effort followed by 30 sec easy recovery for 8 to 10 rounds."
            }
          ]
        }
      ]
    },
    {
      id: "day2",
      name: "Day 2: Hinge / Upper Push & Core",
      subtitle: "Trap Bar Deadlift, Landmine Press & Step Ups",
      color: "var(--accent-orange)",
      sections: [
        {
          title: "Warm Up",
          type: "warmup",
          exercises: [
            {
              id: "d2_w1",
              name: "Bike / Row / Jump Rope / Cross trainer",
              sets: 1,
              reps: "5 mins",
              rpe: "RPE 4/5",
              comments: "General cardiovascular warm-up"
            }
          ]
        },
        {
          title: "Mobility",
          type: "mobility",
          exercises: [
            { id: "d2_m1", name: "Banded Hamstring Kickouts", sets: 2, reps: 8, comments: "Dynamic hamstring lengthening" },
            { id: "d2_m2", name: "HK Thoracic Windmill", sets: 2, reps: 8, comments: "Thoracic mobility & chest opener" },
            { id: "d2_m3", name: "KB Wall Ankle Lunge Mobility", sets: 2, reps: 8, comments: "Dorsiflexion dynamic stretches" },
            { id: "d2_m4", name: "Crab Reaches", sets: 2, reps: 8, comments: "Glute extension & thoracic rotation" }
          ]
        },
        {
          title: "Activations",
          type: "activation",
          exercises: [
            { id: "d2_a1", name: "Serratus Wall slides", sets: 2, reps: 8, comments: "Scapular upward rotation activation" },
            { id: "d2_a2", name: "Hamstring walkouts", sets: 2, reps: 8, comments: "Isometric to dynamic hamstring drive" },
            { id: "d2_a3", name: "Banded shoulder External rotation", sets: 2, reps: 8, comments: "Rotator cuff activation" },
            { id: "d2_a4", name: "Modified MSL", sets: 2, isHold: true, holdKey: true, comments: "Modified Side Plank Isometric Hold" }
          ]
        },
        {
          title: "Mains (Supersets)",
          type: "mains",
          exercises: [
            {
              id: "d2_main_a1",
              name: "A1. Trap bar deadlift",
              superset: "A",
              supersetRole: "A1",
              sets: 3,
              isDynamicReps: true,
              rpe: "RPE 7/8",
              tempo: "3 sec Eccentric focus",
              comments: "To be performed as superset. Up to 2 mins break in between. 3 sec eccentric lowering."
            },
            {
              id: "d2_main_a2",
              name: "A2. HK Landmine press",
              superset: "A",
              supersetRole: "A2",
              sets: 3,
              isDynamicReps: true,
              comments: "Half-kneeling press with core brace."
            },
            {
              id: "d2_main_b1",
              name: "B1. DB Step Ups",
              superset: "B",
              supersetRole: "B1",
              sets: 3,
              isDynamicReps: true,
              comments: "Drive through front heel, minimize rear leg push."
            },
            {
              id: "d2_main_b2",
              name: "B2. SA DB Chest Press",
              superset: "B",
              supersetRole: "B2",
              sets: 3,
              isDynamicReps: true,
              comments: "Single arm bench press, anti-rotational core engagement."
            },
            {
              id: "d2_main_c1",
              name: "C1. Sliders / Swissball Leg curls",
              superset: "C",
              supersetRole: "C1",
              sets: 3,
              isDynamicReps: true,
              comments: "Keep hips elevated throughout leg curl."
            },
            {
              id: "d2_main_c2",
              name: "C2. Plank to Pike",
              superset: "C",
              supersetRole: "C2",
              sets: 3,
              isDynamicReps: true,
              comments: "Drive hips high using core abs."
            }
          ]
        },
        {
          title: "Core / Accessories",
          type: "accessories",
          exercises: [
            {
              id: "d2_acc1",
              name: "Sled Push + Farmer's carry",
              sets: 1,
              reps: "8-10 rounds",
              comments: "8-10 rounds of 15m distance each."
            }
          ]
        }
      ]
    },
    {
      id: "day3",
      name: "Day 3: Hip Thrust & Bodybuilding",
      subtitle: "BB Hip Thrust, TRX Rows & Full Arm/Shoulder Circuit",
      color: "var(--accent-purple)",
      sections: [
        {
          title: "Warm Up",
          type: "warmup",
          exercises: [
            {
              id: "d3_w1",
              name: "Bike / Row / Jump Rope / Cross trainer",
              sets: 1,
              reps: "5 mins",
              rpe: "RPE 4/5",
              comments: "General cardiovascular warm-up"
            }
          ]
        },
        {
          title: "Mobility",
          type: "mobility",
          exercises: [
            { id: "d3_m1", name: "Adductor Rockers T spine rotation", sets: 2, reps: 8, comments: "Inner thigh stretch with T-spine twist" },
            { id: "d3_m2", name: "Walking Inchworms", sets: 2, reps: 8, comments: "Hamstring stretch & shoulder stability" },
            { id: "d3_m3", name: "Bear crawl", sets: 2, reps: 8, comments: "Quadruped core & shoulder warmup" }
          ]
        },
        {
          title: "Activations",
          type: "activation",
          exercises: [
            { id: "d3_a1", name: "SL MB Reaches", sets: 2, reps: 6, comments: "Single leg medicine ball reaches for balance" },
            { id: "d3_a2", name: "Wall Cuban Press", sets: 2, reps: 8, comments: "Rotator cuff & upper back activation" },
            { id: "d3_a3", name: "PSL", sets: 2, isHold: true, holdKey: true, comments: "Prone / Plank Isometric hold" }
          ]
        },
        {
          title: "Mains (Supersets)",
          type: "mains",
          exercises: [
            {
              id: "d3_main_a1",
              name: "A1. BB Hip Thrust",
              superset: "A",
              supersetRole: "A1",
              sets: 3,
              isDynamicReps: true,
              rpe: "RPE 7/8",
              tempo: "3 sec Eccentric focus",
              comments: "To be performed as superset. Up to 2 mins break in between. 3 sec eccentric control."
            },
            {
              id: "d3_main_a2",
              name: "A2. TRX rows",
              superset: "A",
              supersetRole: "A2",
              sets: 3,
              isDynamicReps: true,
              comments: "Bodyweight inverted rows, squeeze shoulder blades."
            },
            {
              id: "d3_main_b1",
              name: "B1. Lateral Squats",
              superset: "B",
              supersetRole: "B1",
              sets: 3,
              isDynamicReps: true,
              comments: "Side lunges / Cossack variation."
            },
            {
              id: "d3_main_b2",
              name: "B2. Chek Press",
              superset: "B",
              supersetRole: "B2",
              sets: 3,
              isDynamicReps: true,
              comments: "Controlled shoulder press variation."
            },
            {
              id: "d3_main_c1",
              name: "C1. Goblet Reverse Lunges",
              superset: "C",
              supersetRole: "C1",
              sets: 3,
              isDynamicReps: true,
              comments: "Step back with DB held at chest level."
            },
            {
              id: "d3_main_c2",
              name: "C2. Incline bench / cable machine Pec Flys",
              superset: "C",
              supersetRole: "C2",
              sets: 3,
              isDynamicReps: true,
              comments: "Chest isolation flys."
            }
          ]
        },
        {
          title: "Bodybuilding Circuit",
          type: "circuit",
          exercises: [
            { id: "d3_bb1", name: "Bicep curls", sets: 2, reps: 12, comments: "Strict form curls" },
            { id: "d3_bb2", name: "OH Triceps extension", sets: 2, reps: 12, comments: "Overhead triceps stretch & extension" },
            { id: "d3_bb3", name: "Rear delt flys", sets: 2, reps: 12, comments: "Posterior deltoid flys" },
            { id: "d3_bb4", name: "Front to lateral raises", sets: 2, reps: 12, comments: "Combined shoulder raise combo" },
            { id: "d3_bb5", name: "Standing calf raises", sets: 2, reps: 12, comments: "Full range calf contraction" },
            { id: "d3_bb6", name: "Ant tib raises", sets: 2, reps: 12, comments: "Anterior tibialis flexions for shin health" }
          ]
        }
      ]
    }
  ]
};
