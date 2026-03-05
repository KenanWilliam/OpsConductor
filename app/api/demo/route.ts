import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, message: "Demo request received" }, { status: 200 })
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 })
  }
}
