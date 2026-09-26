/**
 * AI Vision Estimator Engine
 * Runtime Unlocked Gemini AI Key & Canvas JPEG Photo Processing
 */

const ENCODED_KEY = "QVEuQWI4Uk42Sjg3R05oQlVjZTJ6dUV3clJpbjFObG1oSmpFRmpTUWkzallWaFd0WExlUQ==";

export const AIVisionEstimator = {
  getStoredApiKey() {
    const saved = localStorage.getItem("snc_gemini_api_key");
    if (saved && saved.trim()) return saved.trim();
    try {
      return atob(ENCODED_KEY);
    } catch (e) {
      return "";
    }
  },

  setStoredApiKey(key) {
    localStorage.setItem("snc_gemini_api_key", key.trim());
  },

  processImageToJpegBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1024;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const jpegBase64 = canvas.toDataURL("image/jpeg", 0.85);
          resolve(jpegBase64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = event.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  async analyzeMealPhotoFile(file) {
    let jpegBase64 = "";
    try {
      jpegBase64 = await this.processImageToJpegBase64(file);
    } catch (e) {
      return { success: false, error: "Could not read image file." };
    }

    const apiKey = this.getStoredApiKey();

    if (!apiKey) {
      return {
        success: false,
        requiresKey: true,
        error: "Google Gemini API Key is missing.",
        photoUrl: jpegBase64
      };
    }

    try {
      const cleanBase64 = jpegBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "Examine this image carefully. Is it a food or beverage? Identify the exact item (e.g. Beer, Salad, Pizza, Steak, Coffee, Smoothie). Estimate total calories (kcal), protein (g), carbs (g), and fat (g). Respond ONLY with a raw valid JSON object in this exact structure: {\"name\": \"Item Name\", \"calories\": 200, \"protein\": 2, \"carbs\": 15, \"fat\": 0, \"notes\": \"Brief description\"}"
                  },
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: cleanBase64
                    }
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const rawText = data.candidates[0].content.parts[0].text;
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            name: parsed.name || "Identified Item",
            calories: parseInt(parsed.calories, 10) || 200,
            protein: parseInt(parsed.protein, 10) || 0,
            carbs: parseInt(parsed.carbs, 10) || 0,
            fat: parseInt(parsed.fat, 10) || 0,
            notes: parsed.notes || "Analyzed by Gemini AI Vision",
            photoUrl: jpegBase64
          };
        }
      }
      return { success: false, error: "AI could not identify item in photo." };
    } catch (err) {
      return { success: false, error: "Failed to connect to Gemini AI." };
    }
  }
};
