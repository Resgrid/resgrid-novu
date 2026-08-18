import { workflow } from "@novu/framework";
import { z } from "zod";

// Triggered for every realtime chat message push: responder users ({code}_User_{id}), IC users
// ({code}_IC_User_{id}) and unit devices ({code}_Unit_{id}) all resolve to this one workflow, the
// subscriber is picked by the trigger's `to`. Core sends eventCode as "t:{channelId}" for direct
// messages and "g:{channelId}" for group channels; clients use it to open the conversation.
export const userChatMessage = workflow(
  "user-chat-message",
  async ({ step, payload }) => {
    await step.inApp("In-App Step", async () => {
      return {
        subject: payload.subject,
        body: payload.body,
        type: payload.type,
        id: payload.id,
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
        .default("Jane Smith in Engine 6 Crew"),
      body: z
        .string()
        .describe("The body of the notification")
        .default("Heading over to the staging area now, we'll need another set of hands on the hose."),
      type: z
        .string()
        .describe("The type of the notification")
        .default(
          "chat",
        ),
      id: z
        .string()
        .describe("The unique identifier of the notification")
        .default(
          "default-id",
        ),
      eventId: z
        .string()
        .describe("The chat event code, duplicated as the notification event id")
        .default(
          "g:00000000-0000-0000-0000-000000000000",
        ),
      eventCode: z
        .string()
        .describe("The chat channel this message belongs to, 't:{channelId}' for a direct message and 'g:{channelId}' for a group channel")
        .default(
          "g:00000000-0000-0000-0000-000000000000",
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
