// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/submit", async (req, res) => {
  try {
    const payload = req.body;

    const zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch/11992512/u28cwau/";

    const zapierRes = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!zapierRes.ok) {
      throw new Error(`Zapier responded with status ${zapierRes.status}`);
    }

    res.status(200).json({ message: "Submission relayed to Zapier successfully." });
  } catch (error) {
    console.error("Relay error:", error);
    res.status(500).json({ error: "Relay server failed to submit data." });
  }
});

app.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});
