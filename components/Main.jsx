import { useState, useRef, useEffect } from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromChefClaude, getRecipeFromMistral } from "../ai";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);

  const [recipe, setRecipe] = useState("");
  const recipeSection = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipe && recipeSection.current)
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
  }, [recipe]);

  function addIngredient(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newIngredient = formData.get("ingredient").trim();
    if (!newIngredient) return;
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    setInputValue("");
  }

  async function getRecipe() {
    setLoading(true);
    try {
      // const recipeMarkdown = await getRecipeFromMistral(ingredients);
      const recipeMarkdown = await getRecipeFromChefClaude(ingredients);
      setRecipe(recipeMarkdown); // Set the recipe state with the raw markdown
    } catch (err) {
      console.error("Error fetching recipe:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <form onSubmit={addIngredient} className="ingredient__form">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          className="ingredient__input"
          name="ingredient"
        />
        <button className="ingredient__button" disabled={!inputValue}>
          Add ingredient
        </button>
      </form>
      {ingredients.length > 0 && (
        <IngredientsList
          ref={recipeSection}
          ingredients={ingredients}
          getRecipe={getRecipe}
          loading={loading}
        />
      )}
      {recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}
