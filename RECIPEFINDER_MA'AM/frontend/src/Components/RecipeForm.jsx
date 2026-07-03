import { useState } from "react";
import { generateRecipeAPI } from "../api/recipeAPI"
import Loader from "./Loader";
import RecipeHistory from "./RecipeHistory";

export default function RecipeForm() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Please enter ingredients");
      return;
    }

    setError("");
    setLoading(true);
    setRecipe("");

    try {
      const data = await generateRecipeAPI(ingredients);

      setRecipe(data.recipe);

      setHistory((prev) => [
        { ingredients, recipe: data.recipe },
        ...prev,
      ]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>🍽️ AI Recipe Generator</h2>

      <textarea
        placeholder="Enter ingredients (e.g. rice, onion, tomato)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />

      <br /><br />

      <button onClick={handleGenerateRecipe} disabled={loading}>
        Generate Recipe
      </button>

      {loading && <Loader />}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {recipe && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
          {recipe}
        </pre>
      )}

      <RecipeHistory history={history} />
    </div>
  );
}