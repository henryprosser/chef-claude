// Detect environment or set manually
const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5001" : ""; // Vercel auto-hosts your API functions

// Claude AI
export const getRecipeFromChefClaude = async (ingredientsArr) => {
  try {
    const response = await fetch(`${BASE_URL}/api/recipe/claude`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: ingredientsArr }),
    });

    if (!response.ok) {
      throw new Error("Error fetching from Claude");
    }

    const data = await response.text();
    return data;
  } catch (err) {
    console.error("Error in fetching recipe from Claude:", err);
    throw err;
  }
};

// Hugging Face AI
export const getRecipeFromMistral = async (ingredientsArr) => {
  try {
    const response = await fetch(`${BASE_URL}/api/recipe/mistral`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: ingredientsArr }),
    });

    if (!response.ok) {
      throw new Error("Error fetching from Mistral");
    }

    const data = await response.text();
    return data;
  } catch (err) {
    console.error("Error in fetching recipe from Mistral:", err);
    throw err;
  }
};
