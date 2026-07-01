import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import recipeRoutes from "./controllers/routes/recipe.js";

const app = express();

app.use(cors());
app.use(express.json());


console.log("GROQ KEY:", process.env.GROQ_API_KEY); // Log the API key to verify it's being read correctly
app.use("/api/recipe", recipeRoutes);


app.get("/", (req, res) => {
  res.send("Recipe Finder API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
}) 