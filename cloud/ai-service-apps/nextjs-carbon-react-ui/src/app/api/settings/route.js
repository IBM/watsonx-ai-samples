import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getToken } from "../../lib/util";

export async function GET() {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("Cannot get token");
    }
    const {
      name = "User",
      given_name = "User",
      family_name = "",
      email = null,
      sub = null,
    } = jwt.decode(token);

    return NextResponse.json({
      name,
      givenName: given_name,
      familyName: family_name,
      email,
      sub,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
