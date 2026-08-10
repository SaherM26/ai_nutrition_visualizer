import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  try {
    await connectToDatabase();
    const user = await User.findById(payload.userId).select("email name");
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user: { id: user._id.toString(), email: user.email, name: user.name } });
  } catch (error) {
    console.error("Fetching current user failed:", error);
    return NextResponse.json({ user: null });
  }
}
