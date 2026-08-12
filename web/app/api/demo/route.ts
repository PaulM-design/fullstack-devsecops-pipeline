import { NextResponse } from "next/server";

export async function POST() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const response = await fetch(`${apiBase}/api/message`, { cache: "no-store" });
    if (!response.ok) throw new Error("Backend request failed");
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
