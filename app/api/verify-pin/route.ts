// app/api/verify-pin/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    const correctPin = process.env.APP_PIN || "1234";

    return NextResponse.json({
      valid: pin === correctPin,
    });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
