//app/api/generate-quiz/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const POST = async (req) => {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    if (!body.text) {
      throw new Error("No text provided for quiz generation");
    }

    console.log("Sending request to Google Gemini...");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate 5 multiple-choice quiz questions with 4 options and correct answers based on the following text:
    Text: ${body.text}

    Return the result as a JSON array where each object contains:
    - question: The quiz question as a string.
    - options: An array of four options as strings.
    - correctAnswer: The correct answer as a string.

    Ensure the response is a valid JSON array. Do not include any explanations or additional text outside the JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawText = response.text();

    console.log("Raw Gemini response:", rawText);

    // Preprocess the raw text to extract only the JSON part
    rawText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    rawText = rawText.trim();

    let questions;
    try {
      // Use a more permissive JSON parsing
      questions = Function("return " + rawText)();
      if (!Array.isArray(questions)) {
        throw new Error("Gemini response is not an array");
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse Gemini response",
          rawResponse: rawText,
        },
        { status: 500 }
      );
    }

    const formattedQuestions = questions.map((question) => ({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
    }));

    return NextResponse.json({
      success: true,
      questions: formattedQuestions,
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
