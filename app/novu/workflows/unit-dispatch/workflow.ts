import { workflow } from "@novu/framework";
import { z } from "zod";

// Core's call dispatches to unit devices ({code}_Unit_{id}). Core sends eventCode as "C{callId}".
export const unitDispatch = workflow(
  "unit-dispatch",
  async ({ step, payload }) => {
    await step.inApp("In-App Step", async () => {
      return {
        subject: payload.subject,
        body: payload.body,
        type: payload.type,
        eventId: payload.eventId,
        eventCode: payload.eventCode,
        sound: payload.sound,
        // Only `data` reaches the inbox: the framework's in-app output validation drops the other custom
        // top-level keys (additionalProperties: false with removeAdditional: "failing").
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
        .default("New Call: Structure Fire"),
      body: z
        .string()
        .describe("The body of the notification")
        .default("Structure Fire Prioirty 1 in the area of Robbins Drive behind the industrial park. RP reports lots of black smoke."),
      type: z
        .string()
        .describe("The type of the notification")
        .default(
          "call",
        ),
      eventId: z
        .string()
        .describe("The call event code, duplicated as the notification event id")
        .default(
          "C1234",
        ),
      sound: z
        .string()
        .describe("The sound name for the notification")
        .default(
          "bell",
        ),
      // Empty by default: a sample call here would link every trigger without a code to a call that does not exist.
      eventCode: z
        .string()
        .describe("The call this dispatch is for, 'C{callId}'; the inbox opens the call from it")
        .default(
          "",
        ),
    })
  },
);
