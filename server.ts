import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.post("/api/recommendations", async (req, res) => {
  try {
    const { genres, mood, era, tempo, viewingType, additionalNotes } = req.body;

    const prompt = `You are an expert film critic and movie recommendation agent.
Suggest exactly 3-4 excellent movie recommendations based on these user preferences:
- Preferred Genres: ${genres && genres.length > 0 ? genres.join(", ") : "Any"}
- Current Mood/Vibe: ${mood || "Any"}
- Film Eras: ${era && era.length > 0 ? era.join(", ") : "Any"}
- Narrative Pace/Tempo: ${tempo || "Any"}
- Viewing Context (with whom): ${viewingType || "Any"}
- Additional specific notes: ${additionalNotes || "None"}

Ensure that the movies are well-regarded, relevant, and cover a healthy balance of popular blockbusters and deep-cut masterworks.
For each recommendation, assign a match score from 65 to 100 based on how well it fits. Provide a compelling "whyRecommend" description that explains how the movie matches their specific choices.`;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not defined. Using robust mockup data.");
      const fallback = [
        {
          title: "Knives Out",
          year: 2019,
          director: "Rian Johnson",
          genres: ["Comedy", "Mystery", "Drama"],
          synopsis: "A master detective investigates the mysterious death of the patriarch of an eccentric, combative family.",
          whyRecommend: "Perfect fit for an entertaining, crowd-pleasing watch. It matches your preference for comedy and drama with sharp pacing and top-tier cast performances.",
          matchScore: 96,
        },
        {
          title: "Arrival",
          year: 2016,
          director: "Denis Villeneuve",
          genres: ["Sci-Fi", "Drama"],
          synopsis: "A linguist is recruited by the military to assist in translating communication with extraterrestrial visitors.",
          whyRecommend: "An excellent thought-provoking sci-fi masterpiece. Matches your interest in sci-fi, thoughtful narrative pacing, and deep character struggles.",
          matchScore: 92,
        },
        {
          title: "The Grand Budapest Hotel",
          year: 2014,
          director: "Wes Anderson",
          genres: ["Comedy", "Drama"],
          synopsis: "A writer relates his adventures at a renowned European resort hotel under the care of a legendary concierge.",
          whyRecommend: "Matches your taste for charming visual style, quirky comedy, and moderate pacing. Perfect for an uplifting and highly aesthetic movie experience.",
          matchScore: 88,
        },
      ];
      return res.json({ recommendations: fallback });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional cinema curator. Generate personalized, diverse, high-quality movie recommendations in valid JSON format matching the schema exactly. Return only the raw JSON. Do not write markdown wraps or backticks.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The movie's title." },
              year: { type: Type.INTEGER, description: "The release year of the film." },
              director: { type: Type.STRING, description: "The director's name." },
              genres: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of genres matching this movie."
              },
              synopsis: { type: Type.STRING, description: "A captivating, brief summary of the plot." },
              whyRecommend: { type: Type.STRING, description: "Detailed, personalized explanation of why this fits their precise quiz responses." },
              matchScore: { type: Type.INTEGER, description: "Match percentage (65 to 100)." }
            },
            required: ["title", "year", "director", "genres", "synopsis", "whyRecommend", "matchScore"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini API");
    }

    const recommendations = JSON.parse(text.trim());
    res.json({ recommendations });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate recommendations" });
  }
});

// Serve frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
