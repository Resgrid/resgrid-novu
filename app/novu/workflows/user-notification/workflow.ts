import { workflow } from "@novu/framework";
import { z } from "zod";

// Core's generic notifications to responder users ({code}_User_{id}) and IC users ({code}_IC_User_{id}).
// Core sends eventCode as the push routing code, e.g. "NWO:{workOrderId}" for a work order; the Responder
// inbox reads it from the in-app `data` to open the item the notification is about.
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
        // The in-app output schema has additionalProperties: false and the framework validates with
        // removeAdditional: "failing", so custom top-level keys are silently dropped. `data` is the
        // only field the inbox receives as-is.
        data: {
          eventCode: payload.eventCode,
        },
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
      sound: z
        .string()
        .describe("The sound name for the notification")
        .default(
          "bell",
        ),
      // Empty by default: a made-up code here would give every trigger without one a link to nowhere.
      eventCode: z
        .string()
        .describe("The push routing code, e.g. 'NWO:{workOrderId}' for a work order; 'N{id}' for a plain notification")
        .default(
          "",
        ),
    })
  },
);
