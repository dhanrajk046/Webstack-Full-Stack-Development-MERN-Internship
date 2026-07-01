import Groq from "groq-sdk";

export const generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients) {
      return res.status(400).json({ error: "Ingredients are required" });
    }
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      projectId: process.env.GROQ_PROJECT_ID,
    });

    const completions = await groq.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Create a simple recipe using the following ingredients: ${ingredients}. Please provide the recipe in a clear and concise format, including the name of the dish, a list of ingredients, and step-by-step instructions for preparation.`,
        },
      ],
    });

    res.json({
      recipe: completions.choices[0].message.content,
      source: "Groq AI (LLaMA 3.1-8B Instant)",
    });
  } catch (error) {
    res.status(500).json({
      error: "AI generation failed",
      details: error.message
    });
  }
};
