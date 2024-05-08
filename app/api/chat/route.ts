import BaseAnthropic from "@anthropic-ai/sdk";
import { AnthropicStream, StreamingTextResponse } from "ai";
import { promptlayer } from "promptlayer";

export const runtime = "edge";

const Anthropic: typeof BaseAnthropic = promptlayer.Anthropic;
const anthropic = new Anthropic();

function iteratorToStream(
  iterator: any,
  afterDone: (requestId: number) => void
) {
  let request_id: number = 0;
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
        afterDone(request_id);
      } else {
        controller.enqueue(value[0]);
        request_id = value[1];
      }
    },
  });
}

export const POST = async (request: Request) => {
  const { messages } = await request.json();
  const prompt_name = "chat_prompt";
  const prompt_input_variables = {
    assistant_type: "sports expert",
  };

  const prompt = await promptlayer.templates.get(prompt_name, {
    provider: "anthropic",
    input_variables: prompt_input_variables,
  });

  const afterDone = async (requestId: number) => {
    await promptlayer.track.prompt({
      prompt_name,
      prompt_input_variables,
      request_id: requestId,
    });
  };

  const response = await anthropic.messages.create({
    ...prompt?.llm_kwargs,
    messages: prompt?.llm_kwargs.messages.concat(messages),
    stream: true,
    return_pl_id: true,
  });

  const stream = AnthropicStream(iteratorToStream(response, afterDone));
  return new StreamingTextResponse(stream);
};
