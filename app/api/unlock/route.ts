// lock sync
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === process.env.SITE_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("locaplux_access", password, { path: "/" });
    return res;
  }

  return NextResponse.json({ error: "Invalid" }, { status: 401 });
}
