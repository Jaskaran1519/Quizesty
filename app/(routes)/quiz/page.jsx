"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const QuizContent = () => {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const encodedSummary = searchParams.get("summary");
    if (encodedSummary) {
      try {
        const decodedSummary = decodeURIComponent(escape(atob(encodedSummary)));
        console.log("Decoded summary:", decodedSummary);
        setSummary(decodedSummary);
      } catch (error) {
        console.error("Error decoding summary:", error);
        setError(
          "There was an error processing the summary. Please try again."
        );
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (summary) {
      console.log("Generating quiz for summary:", summary);
      generateQuiz(summary);
    }
  }, [summary]);

  async function generateQuiz(text) {
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Quiz data:", data);
      if (!Array.isArray(data.questions)) {
        throw new Error("API did not return an array of questions");
      }
      setQuestions(data.questions);
      setLoading(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
      setLoading(false);
    }
  }

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (score !== null) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Quiz Completed</h1>
        <p className="text-lg">
          Your score: {score} / {questions.length}
        </p>
        <button
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => router.push("/")}
        >
          Back to Summary Page
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {currentQuestion ? (
        <div className="bg-white p-6 rounded-md shadow-md w-4/5 max-w-2xl">
          <h1 className="text-xl font-semibold mb-4">
            Question {currentQuestionIndex + 1}
          </h1>
          <p className="mb-6">{currentQuestion.question}</p>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="option"
                  value={option}
                  onChange={() => handleAnswer(option)}
                  checked={answers[currentQuestionIndex] === option}
                  className="mr-2"
                />
                <label htmlFor={`option-${index}`} className="text-lg">
                  {option}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-10 text-lg">Loading...</div>
      )}
    </div>
  );
};

const Quiz = () => {
  return (
    <Suspense
      fallback={<div className="text-center mt-10 text-lg">Loading...</div>}
    >
      <QuizContent />
    </Suspense>
  );
};

export default Quiz;
