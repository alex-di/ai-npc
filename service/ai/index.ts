
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const createCompletion = async (prompt: string, { stop = [' character:', ' player:', '###'] } = {}) => {

    if (!configuration.apiKey) {
        throw new Error("OpenAI API key not configured, please follow instructions in README.md")
      }
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        stop,
        temperature: 0.9,
        presence_penalty: 0.6,
        max_tokens: 300,
        logprobs: 0,
        stream: false,
        // echo: true,
    
      });
      return completion.data.choices[0].text
}