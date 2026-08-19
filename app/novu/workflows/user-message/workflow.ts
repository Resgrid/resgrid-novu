import { workflow } from "@novu/framework";
import { z } from "zod";

export const userMessage = workflow(
  "user-message",
  async ({ step, payload }) => {
    await step.inApp("In-App Step", async () => {
      return {
        subject: payload.subject,
        body: payload.body,
        sentOn: payload.sentOn,
        sentBy: payload.sentBy,
        sendingAvatar: payload.sendingAvatar,
        type: payload.type,
        eventId: payload.eventId,
        eventCode: payload.eventCode,
        sound: payload.sound,
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
      sentOn: z
        .string()
        .describe("The time the notification was sent")
        .default(new Date().toISOString()),
      sentBy: z
        .string()
        .describe("The user who sent the notification")
        .default("system"),
      sendingAvatar: z
        .string()
        .describe("The avatar of the notification")
        .default("https://avatars.githubusercontent.com/u/77433905?s=200&v=4"),
      type: z
        .string()
        .describe("The type of the notification")
        .default(
          "message",
        ),
      eventId: z
        .string()
        .describe("The message event code, duplicated as the notification event id")
        .default(
          "M5678",
        ),
      eventCode: z
        .string()
        .describe("The message this notification belongs to, 'M{messageId}'; clients use it to open the message")
        .default(
          "M5678",
        ),
      sound: z
        .string()
        .describe("The sound name for the notification")
        .default(
          "bell",
        ),
    })
  },
);
