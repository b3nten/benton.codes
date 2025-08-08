import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";

export const POST: RequestHandler = async (ctx) => {
  try {
    let body = await ctx.request.json();

    var { name, email, content } = body;
  } catch {
    throw error(400, "Invalid request body");
  }

  const url = `https://api.submitjson.com/v1/submit/tlaSGUu6G`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-API-Key": String(env.EMAIL_API_KEY),
    },
    body: JSON.stringify({
      data: {
        name,
        email,
        content,
      },
    }),
  });

  const submission = await response.json();

  if (!response.ok) {
    throw error(submission.status, submission.statusText);
  }

  return new Response(JSON.stringify(submission), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};
