import { useState } from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromChefClaude, getRecipeFromMistral } from "../ai";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);

  const [recipe, setRecipe] = useState("");

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient");
    console.log(newIngredient);
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  }

  async function getRecipe() {
    try {
      //   const recipeMarkdown = await getRecipeFromMistral(ingredients);
      const recipeMarkdown = await getRecipeFromChefClaude(ingredients);
      //   console.log(recipeMarkdown); // Log the raw markdown to ensure it's received
      setRecipe(recipeMarkdown); // Set the recipe state with the raw markdown
    } catch (err) {
      console.error("Error fetching recipe:", err);
    }
  }

  return (
    <main>
      <form action={addIngredient} className="ingredient__form">
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          className="ingredient__input"
          name="ingredient"
        />
        <button className="ingredient__button">Add ingredient</button>
      </form>
      {ingredients.length > 0 && (
        <IngredientsList ingredients={ingredients} getRecipe={getRecipe} />
      )}
      {recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}
