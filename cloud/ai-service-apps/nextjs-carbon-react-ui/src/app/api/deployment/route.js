import { NextResponse } from "next/server";
import { URLS, getToken } from "../../lib/util";

export async function GET() {
  try {
    const token = await getToken();

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    const response = await fetch(URLS.deploymentUrl, options);

    if (!response.ok) {
      throw new Error("Unexpected response from get-deployment: " + (await response.text()));
    }
    const result = await response.json();
    const fields = {
      name: result.entity.name,
      description: result.entity.description,
      avatar_color: result.entity.custom?.avatar_color,
      avatar_icon: result.entity.custom?.avatar_icon,
      placeholder_image: result.entity.custom?.placeholder_image,
      sample_questions: result.entity.custom?.sample_questions,
    };
    return NextResponse.json(fields);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
