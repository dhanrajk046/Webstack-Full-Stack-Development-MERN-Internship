const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const FoodItem = require("../Models/foodItem");
const Restaurant = require("../Models/restaurant");

// ─────────────────────────────────────────────
// Groq API config (OpenAI-compatible)
// Key prefix: gsk_ → Groq Cloud (https://console.groq.com)
// ─────────────────────────────────────────────
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL_FAST = "llama-3.3-70b-versatile";      // Best quality + speed
const GROQ_MODEL_JSON = "llama-3.1-8b-instant";          // Reliable JSON output

// ── Fallback mock responses ──────────────────
const getMockDescription = (name, context = "") => {
  return `Indulge in our signature ${name || "delicacy"}, prepared fresh with the finest handpicked ingredients. Bursting with aromatic spices and authentic regional flavors, this dish offers a perfect balance of taste and texture that will leave you wanting more. A must-try premium selection from our kitchen.`;
};

const getMockAnalysis = (name, reviews = []) => {
  const ratings = reviews.map(r => r.rating || 0).filter(Boolean);
  const avg = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : "4.0";
  return {
    sentiment: Number(avg) >= 4.0 ? "Positive" : Number(avg) >= 3.0 ? "Neutral" : "Negative",
    key_pros: [
      "Outstanding flavor profile and freshly prepared ingredients.",
      "Excellent value for money with satisfying portion sizes.",
      "Clean packaging and consistent delivery timing.",
    ],
    key_cons: [
      "Spiciness levels can occasionally be inconsistent.",
      "Peak hour orders may experience slight delays.",
      "Packaging could be improved for liquid items.",
    ],
    ai_verdict: `Highly recommended! With an average customer rating of ${avg}/5, ${name || "this establishment"} consistently delivers delicious meals with great service.`,
  };
};

// ── Shared Groq fetch helper ─────────────────
const callGroq = async (apiKey, model, messages, temperature = 0.7) => {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens: 512 }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
};

// ── 1. GENERATE FOOD DESCRIPTION ────────────
exports.generateDescription = catchAsyncErrors(async (req, res, next) => {
  const { name, currentDescription } = req.body;
  if (!name) {
    return next(new ErrorHandler("Food item name is required", 400));
  }

  // Caching: Check if the food item already has an AI description cached in the database
  try {
    const cachedItem = await FoodItem.findOne({ name: name.trim() });
    if (cachedItem && cachedItem.aiDescription) {
      console.log(`[AI Description Cache Hit] 🎯 Served from DB: "${name}"`);
      return res.status(200).json({
        success: true,
        description: cachedItem.aiDescription,
        isMock: false,
        cached: true,
      });
    }
  } catch (dbErr) {
    console.warn("[AI Cache Check Failed] ⚠️ Continuing to Groq API:", dbErr.message);
  }

  const apiKey = process.env.GROK_API_KEY; // variable name kept for compatibility
  const isConfigured = apiKey && !apiKey.includes("your_grok_api_key_here");

  if (!isConfigured) {
    return res.status(200).json({
      success: true,
      description: getMockDescription(name, currentDescription),
      isMock: true,
      message: "Showing simulated AI response. Add GROK_API_KEY in config.env to activate real AI.",
    });
  }

  try {
    const prompt = `Write a mouth-watering, premium, and highly engaging 2-3 sentence menu description for the Indian food item "${name}"${currentDescription ? ` (context: ${currentDescription})` : ""}. Make it appetizing and professional. Begin directly with the description — no introductory phrases like "Sure" or "Here is".`;

    const description = await callGroq(
      apiKey,
      GROQ_MODEL_FAST,
      [
        {
          role: "system",
          content:
            "You are a top-tier culinary copywriter specializing in Indian cuisine menu descriptions. Write vivid, appetizing, premium descriptions. Never start with 'Sure', 'Here is', or similar filler.",
        },
        { role: "user", content: prompt },
      ],
      0.75
    );

    // Save generated description to cache
    if (description) {
      try {
        await FoodItem.updateMany(
          { name: name.trim() },
          { $set: { aiDescription: description } }
        );
        console.log(`[AI Description Cache Saved] 💾 Saved description for: "${name}"`);
      } catch (saveErr) {
        console.warn("[AI Cache Save Failed] ⚠️", saveErr.message);
      }
    }

    res.status(200).json({
      success: true,
      description: description || getMockDescription(name, currentDescription),
      isMock: false,
    });
  } catch (err) {
    console.error("[AI Description] ❌ Groq API failed:", err.message);
    res.status(200).json({
      success: true,
      description: getMockDescription(name, currentDescription),
      isMock: true,
      message: `Groq API error — showing fallback. (${err.message})`,
    });
  }
});

// ── 2. ANALYZE RESTAURANT REVIEWS ───────────
exports.analyzeReviews = catchAsyncErrors(async (req, res, next) => {
  const { name, reviews = [] } = req.body;
  if (!name) {
    return next(new ErrorHandler("Restaurant name is required", 400));
  }

  // Caching: Check if the restaurant already has a fresh review analysis cached (less than 6 hours old)
  try {
    const restaurant = await Restaurant.findOne({ name: name.trim() });
    if (restaurant && restaurant.aiReviewSummary && restaurant.aiReviewSummary.lastAnalyzed) {
      const hoursSinceAnalysis = (Date.now() - new Date(restaurant.aiReviewSummary.lastAnalyzed).getTime()) / (1000 * 60 * 60);
      if (hoursSinceAnalysis < 6) {
        console.log(`[AI Reviews Cache Hit] 🎯 Served from DB: "${name}" (${hoursSinceAnalysis.toFixed(1)}h old)`);
        return res.status(200).json({
          success: true,
          analysis: {
            sentiment: restaurant.aiReviewSummary.sentiment,
            key_pros: restaurant.aiReviewSummary.key_pros,
            key_cons: restaurant.aiReviewSummary.key_cons,
            ai_verdict: restaurant.aiReviewSummary.ai_verdict,
          },
          isMock: false,
          cached: true,
        });
      }
    }
  } catch (dbErr) {
    console.warn("[AI Reviews Cache Check Failed] ⚠️ Continuing to Groq API:", dbErr.message);
  }

  const apiKey = process.env.GROK_API_KEY;
  const isConfigured = apiKey && !apiKey.includes("your_grok_api_key_here");

  if (!isConfigured) {
    return res.status(200).json({
      success: true,
      analysis: getMockAnalysis(name, reviews),
      isMock: true,
      message: "Showing simulated AI analysis. Add GROK_API_KEY in config.env to activate real AI.",
    });
  }

  // Truncate reviews to avoid token limits (max 50 reviews, 200 chars each)
  const safeReviews = reviews.slice(0, 50).map(r => ({
    rating: r.rating,
    Comment: (r.Comment || "").slice(0, 200),
  }));

  try {
    const reviewsText = safeReviews
      .map(r => `- [${r.rating}/5] ${r.Comment}`)
      .join("\n");

    const prompt = reviews.length > 0
      ? `Analyze these ${safeReviews.length} customer reviews for the Indian restaurant "${name}":\n\n${reviewsText}\n\nRespond ONLY with a single raw JSON object (no markdown, no explanation) with these exact fields:\n{\n  "sentiment": "Positive" | "Neutral" | "Negative",\n  "key_pros": ["...", "...", "..."],\n  "key_cons": ["...", "...", "..."],\n  "ai_verdict": "1-2 sentence summary recommendation"\n}`
      : `The Indian restaurant "${name}" has no reviews yet. Generate a realistic fictional analysis JSON as if you'd seen typical customer feedback for a restaurant of this type.\n\nRespond ONLY with a single raw JSON object:\n{\n  "sentiment": "Positive" | "Neutral" | "Negative",\n  "key_pros": ["...", "...", "..."],\n  "key_cons": ["...", "...", "..."],\n  "ai_verdict": "1-2 sentence summary"\n}`;

    const rawContent = await callGroq(
      apiKey,
      GROQ_MODEL_JSON,
      [
        {
          role: "system",
          content:
            "You are an expert restaurant review analyst. Always respond with ONLY a valid raw JSON object — no markdown, no backticks, no explanation text whatsoever.",
        },
        { role: "user", content: prompt },
      ],
      0.3
    );

    // Safely parse — strip any accidental markdown wrappers
    let analysis;
    try {
      const cleaned = rawContent
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      analysis = JSON.parse(cleaned);

      // Validate required fields
      if (!analysis.sentiment || !Array.isArray(analysis.key_pros) || !analysis.ai_verdict) {
        throw new Error("Invalid response structure from Groq");
      }
    } catch (parseErr) {
      console.warn("[AI Reviews] ⚠️ JSON parse failed, using mock:", parseErr.message);
      analysis = getMockAnalysis(name, reviews);
    }

    // Save generated review summary to database cache
    if (analysis && !analysis.isMock) {
      try {
        await Restaurant.updateOne(
          { name: name.trim() },
          {
            $set: {
              aiReviewSummary: {
                sentiment: analysis.sentiment,
                key_pros: analysis.key_pros,
                key_cons: analysis.key_cons,
                ai_verdict: analysis.ai_verdict,
                lastAnalyzed: new Date(),
              }
            }
          }
        );
        console.log(`[AI Reviews Cache Saved] 💾 Saved review analysis for: "${name}"`);
      } catch (saveErr) {
        console.warn("[AI Reviews Cache Save Failed] ⚠️", saveErr.message);
      }
    }

    console.log(`[AI Reviews] ✅ Analyzed "${name}" — Sentiment: ${analysis.sentiment}`);

    res.status(200).json({
      success: true,
      analysis,
      isMock: false,
      reviewCount: safeReviews.length,
    });
  } catch (err) {
    console.error("[AI Reviews] ❌ Groq API failed:", err.message);
    res.status(200).json({
      success: true,
      analysis: getMockAnalysis(name, reviews),
      isMock: true,
      message: `Groq API error — showing fallback. (${err.message})`,
    });
  }
});
