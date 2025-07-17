const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const {
    dealerName,
    brandName,
    competitors,
    symbolism,
    colors,
    avoidColors
  } = req.body;

  const responses = [];

  if (dealerName) {
    responses.push({
      question: "What is your name and what dealership are you from?",
      answer: dealerName
    });
  }

  if (brandName) {
    responses.push({
      question: "What do you want to call it?",
      answer: brandName
    });
  }

  if (competitors) {
    responses.push({
      question: "Who are your top competitors?",
      answer: competitors
    });
  }

  if (symbolism) {
    responses.push({
      question: "Is there any symbolism you'd like included in your captive brand?",
      answer: symbolism
    });
  }

  if (colors) {
    responses.push({
      question: "What colors would you like to include?",
      answer: colors
    });
  }

  if (avoidColors) {
    responses.push({
      question: "What colors should be avoided?",
      answer: avoidColors
    });
  }

  try {
    await axios.post("https://hooks.slack.com/triggers/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", {
      dealerName,
      responses
    });
    res.status(200).send("Data relayed successfully.");
  } catch (error) {
    console.error("Error relaying:", error.message);
    res.status(500).send("Error relaying data.");
  }
});

app.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});
