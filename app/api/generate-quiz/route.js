import { NextResponse } from "next/server";
import { Client } from "@octoai/client";

const client = new Client(process.env.OCTOAI_TOKEN);

export const POST = async (req) => {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    if (!body.text) {
      throw new Error("No text provided for quiz generation");
    }

    console.log("Sending request to OctoAI...");
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-instruct-fp16",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates multiple-choice quiz questions based on text.",
        },
        {
          role: "user",
          content: `Generate 5 multiple-choice quiz questions with 4 options and correct answers based on the following text:
          Text: ${body.text}

          Return the result as a JSON array where each object contains:
          - question: The quiz question as a string.
          - options: An array of four options.
          - correctAnswer: The correct answer as a string.`,
        },
      ],
    });

    console.log("Received response from OctoAI:", completion);

    const quizResponse = completion.choices[0].message.content;
    console.log("Quiz response:", quizResponse);

    // Parse the quiz response as JSON
    const questions = JSON.parse(quizResponse).map((question) => ({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
    }));

    return NextResponse.json({
      success: true,
      questions: questions,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
};
