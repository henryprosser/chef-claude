// Claude AI
export const getRecipeFromChefClaude = async (ingredientsArr) => {
  try {
    const response = await fetch("http://localhost:5001/api/recipe/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: ingredientsArr }),
    });

    if (!response.ok) {
      throw new Error("Error fetching from Claude");
    }

    // Get the raw markdown response
    const data = await response.text();
    return data; // Returning raw markdown
  } catch (err) {
    console.error("Error in fetching recipe from Claude:", err);
    throw err; // Re-throw the error so it can be handled in the component
  }
};

// Hugging Face AI
export const getRecipeFromMistral = async (ingredientsArr) => {
  try {
    const response = await fetch("http://localhost:5001/api/recipe/mistral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: ingredientsArr }),
    });

    if (!response.ok) {
      throw new Error("Error fetching from Mistral");
    }

    const data = await response.text(); // Use .text() to handle raw markdown text
    return data; // Returning raw text
  } catch (err) {
    console.error("Error in fetching recipe from Mistral:", err);
    throw err; // Re-throw the error so it can be handled in the component
  }
};
