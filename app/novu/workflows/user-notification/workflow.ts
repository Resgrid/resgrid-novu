import { workflow } from "@novu/framework";
import { z } from "zod";

export const userNotification = workflow(
  "user-notification",
  async ({ step, payload }) => {
    await step.inApp("In-App Step", async () => {
      return {
        subject: payload.subject,
        body: payload.body,
        type: payload.type,
        id: payload.id,
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
      type: z
        .string()
        .describe("The type of the notification")
        .default(
          "notification",
        ),
      id: z
        .string()
        .describe("The unique identifier of the notification")
        .default(
          "default-id",
        ),
    })
  },
);
