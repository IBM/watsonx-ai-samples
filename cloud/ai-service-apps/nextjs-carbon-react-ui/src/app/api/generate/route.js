import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { URLS, getToken } from "../../lib/util";

export async function POST(req) {
  try {
    const token = await getToken();
    const body = await req.json();
    const messages = body.messages;

    const payload = {
      messages,
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(URLS.aiServiceStreamUrl, options);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: 500 });
    }
    const stream = Readable.fromWeb(response.body);
    return new NextResponse(stream, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
