const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Mock AI generation as a fallback if the API key is missing or fails
const getMockDescription = (name, context = "") => {
  return `Indulge in our signature ${name || "delicacy"}, prepared fresh with the finest handpicked ingredients. Bursting with aromatic spices and authentic regional flavors, this dish offers a perfect balance of taste and texture that will leave you wanting more. A must-try premium selection from our kitchen.`;
};

const getMockAnalysis = (name, reviews = []) => {
  const ratings = reviews.map(r => r.rating || 0).filter(Boolean);
  const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "4.0";
  return {
    sentiment: Number(avg) >= 4.0 ? "Positive" : Number(avg) >= 3.0 ? "Neutral" : "Negative",
    key_pros: [
      "Outstanding flavor profile and freshly prepared ingredients.",
      "Excellent value for money with satisfying portion sizes.",
      "Clean packaging and consistent delivery timing."
    ],
    key_cons: [
      "Spiciness levels can occasionally be inconsistent.",
      "Peak hour orders may experience slight delays.",
      "Packaging could be improved for liquid items."
    ],
    ai_verdict: `Highly recommended! With an average customer rating of ${avg}/5, ${name || "this establishment"} consistently delivers delicious meals with great service.`
  };
};

// ── 1. GENERATE DESCRIPTION ──
exports.generateDescription = catchAsyncErrors(async (req, res, next) => {
  const { name, currentDescription } = req.body;
  if (!name) {
    return next(new ErrorHandler("Food item name is required", 400));
  }

  const apiKey = process.env.GROK_API_KEY;
  const isConfigured = apiKey && apiKey !== "your_grok_api_key_here";

  if (!isConfigured) {
    // Return mock response if key is missing/placeholder
    return res.status(200).json({
      success: true,
      description: getMockDescription(name, currentDescription),
      isMock: true,
      message: "Showing simulated AI response. Configure GROK_API_KEY in config.env to connect to real Grok AI."
    });
  }

  try {
    const prompt = `Generate a mouth-watering, highly engaging, and appetizing description for the food item "${name}" based on this context: "${currentDescription || ""}". Keep it under 3 sentences and make it sound premium and professional. Do not include introductory text, start directly with the description.`;
    
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-2-1212",
        messages: [
          { role: "system", content: "You are a professional culinary copywriter and menu designer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Grok API call failed, falling back to mock:", errText);
      return res.status(200).json({
        success: true,
        description: getMockDescription(name, currentDescription),
        isMock: true,
        message: "API error. Fallback response generated."
      });
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim() || getMockDescription(name, currentDescription);

    res.status(200).json({
      success: true,
      description,
      isMock: false
    });

  } catch (err) {
    console.error("AI generate description error:", err.message);
    res.status(200).json({
      success: true,
      description: getMockDescription(name, currentDescription),
      isMock: true,
      message: "System fallback generated."
    });
  }
});

// ── 2. ANALYZE REVIEWS ──
exports.analyzeReviews = catchAsyncErrors(async (req, res, next) => {
  const { name, reviews = [] } = req.body;
  if (!name) {
    return next(new ErrorHandler("Restaurant name is required", 400));
  }

  const apiKey = process.env.GROK_API_KEY;
  const isConfigured = apiKey && apiKey !== "your_grok_api_key_here";

  if (!isConfigured) {
    return res.status(200).json({
      success: true,
      analysis: getMockAnalysis(name, reviews),
      isMock: true,
      message: "Showing simulated AI review analysis. Configure GROK_API_KEY in config.env to connect to real Grok AI."
    });
  }

  try {
    const reviewsText = reviews.map(r => `- [Rating: ${r.rating}/5] ${r.Comment || ""}`).join("\n");
    const prompt = `Analyze these customer reviews for the restaurant "${name}":\n\n${reviewsText}\n\nOutput a valid JSON object with the following fields: "sentiment" (string: Positive, Neutral, or Negative), "key_pros" (array of 3 strings outlining what people loved), "key_cons" (array of 3 strings outlining key complaints), and "ai_verdict" (1-2 sentence recommendation summary). Do not include any markdown format blocks or extra text, output strictly the raw JSON object.`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-2-1212",
        messages: [
          { role: "system", content: "You are an expert sentiment analyst specializing in restaurant and hospitality reviews. Output strictly valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Grok API call failed, falling back to mock:", errText);
      return res.status(200).json({
        success: true,
        analysis: getMockAnalysis(name, reviews),
        isMock: true,
        message: "API error. Fallback analysis generated."
      });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content?.trim() || "";

    // Parse JSON safely
    let analysis;
    try {
      // Remove any markdown wrapper like ```json ... ``` if model output it
      const cleanedJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
      analysis = JSON.parse(cleanedJson);
    } catch (parseErr) {
      console.warn("Failed to parse Grok JSON, falling back to mock:", parseErr.message);
      analysis = getMockAnalysis(name, reviews);
    }

    res.status(200).json({
      success: true,
      analysis,
      isMock: false
    });

  } catch (err) {
    console.error("AI analyze reviews error:", err.message);
    res.status(200).json({
      success: true,
      analysis: getMockAnalysis(name, reviews),
      isMock: true,
      message: "System fallback analysis generated."
    });
  }
});
