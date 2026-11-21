import type { VoiceToolContext, VoiceToolSchema } from "./types.js";

export function createLookWithCamera(
  context: Pick<VoiceToolContext, "lookWithCamera">,
) {
  const schema: VoiceToolSchema = {
    type: "function",
    name: "look_with_camera",
    description:
      "Take one photo with the phone camera and answer a question about it. Use this whenever the user asks what you see, what they are holding, what is in front of you, to read text, or anything that needs your eyes. Use the front camera (the user's side, default) unless they ask about what is behind the phone. The result is a short description; speak it naturally and never invent details it does not contain.",
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description:
            "What to look for or answer from the photo, in the user's language, e.g. 'What am I holding?'",
        },
        camera: {
          type: "string",
          enum: ["front", "back"],
          description: "front = facing the user (default), back = facing away",
        },
      },
      required: ["question"],
      additionalProperties: false,
    },
  };

  return {
    schema,
    async execute(args: Record<string, unknown>): Promise<unknown> {
      if (!context.lookWithCamera)
        throw Object.assign(new Error("Camera is not available"), {
          code: "CAMERA_UNAVAILABLE",
        });
      const question =
        typeof args.question === "string" && args.question.trim()
          ? args.question.trim().slice(0, 500)
          : "Describe what you see.";
      const facing = args.camera === "back" ? "back" : "front";
      const description = await context.lookWithCamera(question, facing);
      return { camera: facing, description };
    },
  };
}
