const express = require("express");
const cors = require("cors"); // Import the CORS package
const Anthropic = require("@anthropic-ai/sdk");
const { HfInference } = require("@huggingface/inference");
const app = express();

// Enable CORS for all origins (you can restrict it to your frontend later)
app.use(cors());
app.use(express.json());

require("dotenv").config({ path: "../.env" });

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

// Anthropic API setup
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Use environment variable for key
  dangerouslyAllowBrowser: false,
});

// Hugging Face API setup
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// Endpoint for Claude AI (Anthropic)
app.post("/api/recipe/claude", async (req, res) => {
  const ingredientsArr = req.body.ingredients;
  const ingredientsString = ingredientsArr.join(", ");
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
    });
    // Return markdown directly
    res.send(msg.content[0].text); // Sending markdown directly
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching from Claude");
  }
});

// Endpoint for Mistral AI (Hugging Face)
app.post("/api/recipe/mistral", async (req, res) => {
  const ingredientsArr = req.body.ingredients;
  const ingredientsString = ingredientsArr.join(", ");
  console.log("Received ingredients:", ingredientsString); // Log the incoming ingredients

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
    });

    console.log("Response from Mistral:", response); // Log the full response

    // Extract the generated text from the response object
    const recipe =
      response.choices[0]?.message?.content || "No recipe generated";
    res.send(recipe); // Send back the recipe
  } catch (err) {
    console.error("Error fetching from Mistral:", err); // Log the full error stack
    res.status(500).send("Error fetching from Mistral");
  }
});

// Start server
app.listen(5001, () => {
  console.log("Backend running on http://localhost:5001");
});
