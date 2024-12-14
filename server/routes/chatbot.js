const path = require("path");
const fs = require("fs").promises;
const express = require("express");

const router = express.Router();

// Cache chatbot data to improve performance
let chatbotDataCache = null;
const loadChatbotData = async () => {
  if (!chatbotDataCache) {
    const chatbotDataPath = path.join(__dirname, "..", "data", "chatbotData.json");
    const fileContent = await fs.readFile(chatbotDataPath, "utf-8");
    chatbotDataCache = JSON.parse(fileContent);
  }
};

// POST /chatbot/chat
router.post("/chat", async (req, res) => {
  const { question } = req.body;

  try {
    await loadChatbotData();

    const response = chatbotDataCache.find(
      (item) => item?.question?.toLowerCase() === question?.toLowerCase()
    );

    res.json({
      answer: response
        ? response.answer
        : "I'm sorry, I couldn't find an answer to that question.",
    });
  } catch (error) {
    console.error("Error handling chatbot query:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /chatbotData.json
router.get("/public/chatbotData.json", (req, res) => {
  const filePath = path.join(__dirname, "..", "data", "chatbotData.json");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error serving chatbot data file:", err.message);
      res.status(500).send("Error serving the chatbot data file.");
    }
  });
});

// GET /chatbot
router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "chatbot.html");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error serving chatbot HTML file:", err.message);
      res.status(500).send("Error serving the chatbot HTML file.");
    }
  });
});

module.exports = router;
