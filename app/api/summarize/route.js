import { NextResponse } from "next/server";
import { Client } from "@octoai/client";

const client = new Client(process.env.OCTOAI_TOKEN);

export const POST = async (req) => {
  try {
    const body = await req.json();
    console.log("body", body);

    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-instruct-fp16",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes text.",
        },
        {
          role: "user",
          content: "Summarize the following text: " + body.text,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      summary: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};
