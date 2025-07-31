import { workflow } from "@novu/framework";
import { z } from "zod";

export const userDispatch = workflow(
  "user-dispatch",
  async ({ step, payload }) => {
    await step.inApp("In-App Step", async () => {
      return {
        subject: payload.subject,
        body: payload.body,
        avatar: payload.inAppAvatar,
      };
    });

    await step.push("Push Step", async () => {
      return {
        subject: payload.subject,
        body: payload.body,
      };
    });
  },
  {
    payloadSchema: z.object({
      subject: z
        .string()
        .describe("The subject of the notification")
        .default("New Call: Structure Fire"),
      body: z
        .string()
        .describe("The body of the notification")
        .default("Structure Fire Prioirty 1 in the area of Robbins Drive behind the industrial park. RP reports lots of black smoke."),
      inAppAvatar: z
        .string()
        .describe("The avatar of the notification")
        .default("https://avatars.githubusercontent.com/u/77433905?s=200&v=4"),
    })
  },
);
