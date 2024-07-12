"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const Quiz = () => {
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
        setLoading(false);
      }
    } else {
      setLoading(false);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (score !== null) {
    return (
      <div>
        <h1>Quiz Completed</h1>
        <p>
          Your score: {score} / {questions.length}
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full mt-10 min-h-screen">
      {currentQuestion ? (
        <div className="">
          <h1>Question {currentQuestionIndex + 1}</h1>
          <p>{currentQuestion.question}</p>
          {currentQuestion.options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                id={`option-${index}`}
                name="option"
                value={option}
                onChange={() => handleAnswer(option)}
                checked={answers[currentQuestionIndex] === option}
              />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Quiz;
