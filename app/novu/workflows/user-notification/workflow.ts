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
        .default("Rescue 1 Responding"),
      body: z
        .string()
        .describe("The body of the notification")
        .default("Rescue 1 has changed it's Status to Responding"),
      type: z
        .string()
        .describe("The type of the notification")
        .default(
          "notification",
        ),
      eventId: z
        .string()
        .describe("The notification event code, duplicated as the notification event id")
        .default(
          "N9012",
        ),
      eventCode: z
        .string()
        .describe("The entity this notification refers to, 'N{messageId}'; clients use it for routing")
        .default(
          "N9012",
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
