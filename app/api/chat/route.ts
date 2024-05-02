import BaseAnthropic from "@anthropic-ai/sdk";
import { AnthropicStream, StreamingTextResponse } from "ai";
import { promptlayer } from "promptlayer";

export const runtime = "edge";

const Anthropic: typeof BaseAnthropic = promptlayer.Anthropic;
const anthropic = new Anthropic();

export const POST = async (request: Request) => {
  const { messages } = await request.json();
  const response = await anthropic.messages.create({
    messages,
    max_tokens: 100,
    model: "claude-3-sonnet-20240229",
    stream: true,
  });
  const stream = AnthropicStream(response);
  return new StreamingTextResponse(stream);
};
