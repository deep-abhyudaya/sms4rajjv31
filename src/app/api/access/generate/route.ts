import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, userType, durationMinutes } = body;

    if (!userId || !userType || !durationMinutes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Authorization: Only the user themselves or an admin can generate an access code for a profile
    if (role !== "admin" && clerkUserId !== userId) {
      return NextResponse.json({ error: "Forbidden: You can only share your own profile." }, { status: 403 });
    }

    const validDurations = [15, 60, 180];
    if (!validDurations.includes(durationMinutes)) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    const code = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const access = await prisma.profileAccess.create({
      data: {
        userId,
        userType,
        code,
        expiresAt,
      },
    });

    return NextResponse.json({ code: access.code, expiresAt: access.expiresAt });
  } catch (error) {
    console.error("Generate access code error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
