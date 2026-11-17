
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/health", (req, res) => {
  res.json({ status: "online" });
});

app.post("/api/chat", async (req, res) => {
console.log("CHAT REQUEST RECEIVED:", req.body);
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Your message is too long."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key is missing."
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: message
    });

    res.json({
      reply: response.output_text ||
        "Sorry, I couldn't generate a response."
    });

  } catch (error) {
    console.error("GEMINI ERROR DETAILS:", error);

    res.status(500).json({
      error: "The AI couldn't respond. Please try again."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
