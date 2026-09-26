/**
 * Nutrition Engine
 * Mifflin-St Jeor BMR & TDEE Calculator + Daily Macro Tracker & Meal Deletion
 */

import { StorageEngine } from './storage.js';

export const NutritionEngine = {
  calculateBMR(weightKg, heightCm, ageYears, gender = 'female') {
    const w = parseFloat(weightKg) || 60;
    const h = parseFloat(heightCm) || 165;
    const a = parseInt(ageYears, 10) || 28;

    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    if (gender.toLowerCase() === 'female') {
      bmr -= 161;
    } else {
      bmr += 5;
    }
    return Math.round(bmr);
  },

  calculateTDEE(bmr, activityLevel = 1.55) {
    return Math.round(bmr * parseFloat(activityLevel));
  },

  getNutritionSettings() {
    const raw = localStorage.getItem("snc_nutrition_settings");
    return raw ? JSON.parse(raw) : {
      weightKg: 62,
      heightCm: 165,
      age: 26,
      gender: "female",
      activityLevel: 1.55,
      bmr: 1350,
      tdee: 2090,
      targetProtein: 130,
      targetCarbs: 200,
      targetFat: 55
    };
  },

  saveNutritionSettings(settings) {
    const bmr = this.calculateBMR(settings.weightKg, settings.heightCm, settings.age, settings.gender);
    const tdee = this.calculateTDEE(bmr, settings.activityLevel);

    const fullSettings = {
      ...settings,
      bmr: bmr,
      tdee: tdee
    };

    localStorage.setItem("snc_nutrition_settings", JSON.stringify(fullSettings));
    return fullSettings;
  },

  getTodayMealLogs() {
    const todayStr = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(`snc_meals_${todayStr}`);
    return raw ? JSON.parse(raw) : [];
  },

  addMealLog(mealObj) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const currentMeals = this.getTodayMealLogs();
    
    const newMeal = {
      id: `meal_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: mealObj.name || "Logged Item",
      calories: parseInt(mealObj.calories, 10) || 0,
      protein: parseInt(mealObj.protein, 10) || 0,
      carbs: parseInt(mealObj.carbs, 10) || 0,
      fat: parseInt(mealObj.fat, 10) || 0,
      notes: mealObj.notes || "",
      photoUrl: mealObj.photoUrl || null
    };

    currentMeals.unshift(newMeal);
    localStorage.setItem(`snc_meals_${todayStr}`, JSON.stringify(currentMeals));
    return newMeal;
  },

  deleteMealLog(mealId) {
    const todayStr = new Date().toISOString().slice(0, 10);
    let meals = this.getTodayMealLogs();
    meals = meals.filter((m) => m.id !== mealId);
    localStorage.setItem(`snc_meals_${todayStr}`, JSON.stringify(meals));
  },

  getTodayTotals() {
    const meals = this.getTodayMealLogs();
    return meals.reduce(
      (acc, m) => {
        acc.calories += m.calories;
        acc.protein += m.protein;
        acc.carbs += m.carbs;
        acc.fat += m.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }
};
