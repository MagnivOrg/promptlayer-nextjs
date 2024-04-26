import BaseAnthropic from "@anthropic-ai/sdk";
import { promptlayer } from "promptlayer";
const Anthropic: typeof BaseAnthropic = promptlayer.Anthropic;
const anthropic = new Anthropic();
export const runtime = "edge";
export const POST = async () => {
  const response = await anthropic.messages.create({
    messages: [
      {
        role: "user",
        content: "What is the capital of France?",
      },
    ],
    max_tokens: 100,
    model: "claude-3-sonnet-20240229",
  });
  return Response.json(response.content[0].text);
};
