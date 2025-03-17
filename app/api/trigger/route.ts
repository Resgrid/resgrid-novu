import { NextResponse } from "next/server";
import { unitDispatch, welcomeOnboardingEmail } from "../../novu/workflows";


export async function POST() {
  try {
    await welcomeOnboardingEmail.trigger({
      to: process.env.NEXT_PUBLIC_NOVU_SUBSCRIBER_ID || "",
      payload: {},
    });

    await unitDispatch.trigger({
      to: process.env.NEXT_PUBLIC_NOVU_SUBSCRIBER_ID || "",
      payload: {},
    });

    return NextResponse.json({
      message: "Notification triggered successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error triggering notification:", errorMessage);

    return NextResponse.json(
      { message: "Error triggering notification", error: errorMessage },
      { status: 500 },
    );
  }
}
