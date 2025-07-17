// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
  const {
    dealerName,
    brandName,
    competitors,
    symbolism,
    colors,
    avoidColors,
    brandguidelines,
    brandIdeas
  } = req.body;

  const responses = [];

  if (dealerName) {
    responses.push({ question: "What is your name and what dealership are you from?", answer: dealerName });
  }
  if (brandName) {
    responses.push({ question: "What do you want to call it?", answer: brandName });
  }
  if (brandguidelines) {
    responses.push({ question: "Do you have a link to your brand guidelines?", answer: brandguidelines });
  }
  if (brandIdeas) {
    responses.push({ question: "Tell me what you're thinking for brand ideas.", answer: brandIdeas });
  }
  if (competitors) {
    responses.push({ question: "Who are your top competitors?", answer: competitors });
  }
  if (symbolism) {
    responses.push({ question: "Is there any symbolism you'd like included in your captive brand?", answer: symbolism });
  }
  if (colors) {
    responses.push({ question: "What colors would you like to include?", answer: colors });
  }
  if (avoidColors) {
    responses.push({ question: "What colors should be avoided?", answer: avoidColors });
  }

  const htmlBody = `
    <h2>Captive Brand Survey Submission</h2>
    <p><strong>Dealer Name:</strong> ${dealerName || 'N/A'}</p>
    <ul>
      ${responses.map(r => `<li><strong>${r.question}</strong><br>${r.answer}</li>`).join('')}
    </ul>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `Captive Brand Survey <${process.env.EMAIL_USER}>`,
    to: 'kensey.edwards@roadrunnerfinancial.com',
    subject: `New Captive Brand Submission`,
    html: htmlBody
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
