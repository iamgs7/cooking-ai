import React, { useState } from "react";
import axios from "axios";

function Chatbot() {
  const [query, setQuery] = useState("");
  const [recipe, setRecipe] = useState(null);

  const fetchRecipe = async () => {
    const res = await axios.post("http://localhost:8000/recipe", { query });
    setRecipe(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Cooking AI</h1>
      <input
        type="text"
        value={query}
        placeholder="e.g. vegan pasta under 20 mins"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={fetchRecipe}>Get Recipe</button>

      {recipe && !recipe.error && (
        <div style={{ marginTop: 20 }}>
          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
          <p><strong>Prep:</strong> {recipe.prep_time_minutes} mins | <strong>Cook:</strong> {recipe.cook_time_minutes} mins | <strong>Servings:</strong> {recipe.servings}</p>
          <h3>Nutirional Values</h3>
          <ul>{recipe.nutritional_values.map((item, i) => <li key={i}>{item}</li>)}</ul>
          <h3>Ingredients</h3>
          <ul>{recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}</ul>
          <h3>Instructions</h3>
          <ol>{recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}</ol>
          <p><strong>Tags:</strong> {recipe.tags.join(", ")}</p>
        </div>
      )}

      {recipe?.error && (
        <pre>{recipe.raw}</pre>
      )}
    </div>
  );
}

export default Chatbot;
