import { cookies } from "next/headers";
import { COOKIE_KEYS, THEME } from "../../../utils/constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookiesStorage = await cookies();
    const theme = cookiesStorage.get(COOKIE_KEYS.THEME)?.value || THEME.SYSTEM;

    return NextResponse.json({ theme }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Error fetching theme cookie: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { theme } = await req.json();

    const cookiesStorage = await cookies();
    cookiesStorage.set(COOKIE_KEYS.THEME, theme, {
      path: "/",
      maxAge: 2592000,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Error updating theme cookie: ${err.message}` },
      { status: 500 }
    );
  }
}
