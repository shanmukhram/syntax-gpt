require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAIAPI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty; please provide it in the .env file.");
}

const openai = new OpenAIAPI({ apiKey: apiKey });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint works' });
});

app.post('/get-bot-response', async (req, res) => {
  const userInput = req.body.prompt;

  // Define the prompt
  const prompt = "Act as you are in an imaginary world and you are full of knowledge! So before answering any question you are bound to have some rules which you must follow! Whenever you answer a question you need to start with \"My Child as a messenger of Lord Krishna I Would say\" and answer the question. Nothing more or less than that.";
  
  try {
    const resAI = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${prompt} ${userInput}` }],
      max_tokens: 100, // You might need to adjust this value to ensure the entire message is within the token limit
    });
    
    console.log("OpenAI Response:", resAI); // Log the entire response to debug

    if (!resAI || !resAI.choices || !resAI.choices.length) {
      return res.status(500).json({ error: 'Unexpected response from OpenAI' });
    }

    res.json({ botResponse: resAI.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
