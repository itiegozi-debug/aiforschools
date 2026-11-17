
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Open the website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Check that the server is working
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message: "AI for Schools server is working!"
  });
});

// Chatbot endpoint (AI connection comes later)
app.post("/api/chat", (req, res) => {
  res.json({
    reply: "The chatbot server is working! An approved AI provider still needs to be connected."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port " + PORT);
});
