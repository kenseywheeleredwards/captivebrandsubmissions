const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST handler
app.post("/submit", async (req, res) => {
  const { dealerName, responses } = req.body;

  // Format response body into Q&A style message
  let message = `🧾 New Captive Brand Survey Submission\n\n`;
  message += `👤 Dealer Name: ${dealerName || "N/A"}\n\n`;

  if (responses?.length) {
    responses.forEach((r, i) => {
      message += `Q${i + 1}: ${r.question || "(no question)"}\n`;
      message += `A: ${r.answer || "(no answer)"}\n\n`;
    });
  } else {
    message += "No detailed responses submitted.\n";
  }

  // Optional: Write to local log file
  fs.appendFile("submissions.txt", message + "-------------------------\n", (err) => {
    if (err) console.error("Failed to log to file:", err);
  });

  // Send email via Nodemailer (use Gmail, Mailgun, or other SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'SendGrid', 'Mailgun', etc.
    auth: {
      user: process.env.EMAIL_USER,       // Your email (e.g. gmail)
      pass: process.env.EMAIL_PASS        // App password (not account password)
    }
  });

  try {
    await transporter.sendMail({
      from: `"Captive Survey Bot" <${process.env.EMAIL_USER}>`,
      to: "kensey.edwards@octane.co", // or whatever email you prefer
      subject: "📬 New Captive Brand Survey Submission",
      text: message
    });

    res.status(200).json({ success: true, message: "Email sent and logged." });
  } catch (err) {
    console.error("Email failed:", err);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
