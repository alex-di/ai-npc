import { Configuration, OpenAIApi } from "openai";
import characters from '../../data/chars.json';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const { id }= req.query;

  if (!id) {
    throw new Error('Character ID is empty')
  }

  const history = ''


  const char = characters.find(({ id: charId }) =>  charId === id);
  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(char, history, prompt),
      stop: [' character:', ' player:', '###'],
      temperature: 0.9,
      presence_penalty: 0.6,
      max_tokens: 300,
      logprobs: 0,
      stream: false,
      // echo: true,

    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(character, chatHistory, input) {
  return `You are NPC character named ${character.name}
  ${character.bio}

  The following is a conversation with a character. 

  ${chatHistory}
  player: ${input}.`;
}
