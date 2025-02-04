import { useState, useRef, useEffect } from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromChefClaude, getRecipeFromMistral } from "../ai";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);

  const [recipe, setRecipe] = useState("");
  const recipeSection = useRef(null);

  useEffect(() => {
    if (recipe && recipeSection.current)
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
  }, [recipe]);

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient");
    console.log(newIngredient);
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  }

  async function getRecipe() {
    try {
      //   const recipeMarkdown = await getRecipeFromMistral(ingredients);
      const recipeMarkdown = await getRecipeFromChefClaude(ingredients);
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
        <IngredientsList
          ref={recipeSection}
          ingredients={ingredients}
          getRecipe={getRecipe}
        />
      )}
      {recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}
