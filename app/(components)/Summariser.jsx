"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Indie_Flower } from "next/font/google";
import Intro from "./Intro";
import Loader from "./Loader";

const inputFont = Indie_Flower({
  subsets: ["latin"],
  weight: ["400"],
});

const Summariser = () => {
  const [pdfjsLibLoaded, setPdfjsLibLoaded] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [startPage, setStartPage] = useState();
  const [numPages, setNumPages] = useState();
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.pdfjsLib) {
      setPdfjsLibLoaded(true);
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${window.pdfjsLib.version}/pdf.worker.min.js`;
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.min.js";
      script.onload = () => {
        setPdfjsLibLoaded(true);
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${window.pdfjsLib.version}/pdf.worker.min.js`;
      };
      document.body.appendChild(script);
    }
  }, []);

  function onFileChange(event) {
    const file = event.target.files[0];
    setSelectedFile(file);
    setLoading(true);
    setError("");

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const typedarray = new Uint8Array(e.target.result);
      const pdf = await window.pdfjsLib.getDocument({ data: typedarray })
        .promise;
      setTotalPages(pdf.numPages);
      setLoading(false);
    };
    fileReader.readAsArrayBuffer(file);
  }

  async function onLoadFile() {
    setLoading(true);
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const typedarray = new Uint8Array(e.target.result);
      const pdf = await window.pdfjsLib.getDocument({ data: typedarray })
        .promise;
      const endPage = Math.min(startPage + numPages - 1, totalPages);
      let text = "";

      for (let i = startPage; i <= endPage; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        content.items.forEach((item) => {
          text += item.str + " ";
        });
      }

      sendToAPI(text);
    };
    fileReader.readAsArrayBuffer(selectedFile);
  }

  function sendToAPI(text) {
    fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSummary(data.summary);
        setLoading(false);
      });
  }

  const handleSummarize = () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    if (startPage < 1 || startPage > totalPages) {
      setError(`Start page must be between 1 and ${totalPages}.`);
      return;
    }

    if (numPages < 1) {
      setError("Number of pages must be at least 1.");
      return;
    }

    if (startPage + numPages - 1 > totalPages) {
      setError(`Cannot summarize beyond page ${totalPages}.`);
      return;
    }
    if (numPages > 3) {
      setError("You can only select 3 pages at once");
      return;
    }

    setError("");
    onLoadFile();
  };

  const handleGenerateQuiz = () => {
    if (summary) {
      const encodedSummary = btoa(unescape(encodeURIComponent(summary)));
      router.push(`/quiz?summary=${encodedSummary}`);
    }
  };

  if (!pdfjsLibLoaded) {
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  const formatSummary = (text) => {
    return text.split("\n").map((line, index) => (
      <p key={index} className="mb-2 text-gray-900">
        {line}
      </p>
    ));
  };

  return (
    <div className="w-full flex justify-center items-center flex-col mt-[10vh] z-20">
      {/* <h1 className="mb-10 text-3xl font-semibold">Upload your PDF here</h1> */}

      <div className="min-w-[250px] w-[40%] h-[30vh] max-h-[200px] border-[2px] border-black inputBackground relative rounded-xl">
        <input
          type="file"
          id="file"
          name="file"
          accept=".pdf"
          onChange={onFileChange}
          className="w-full h-full inset-0 absolute opacity-0 cursor-pointer"
        />
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-semibold text-xl pointer-events-none">
          {selectedFile ? (
            selectedFile.name
          ) : (
            <div className={`${inputFont.className} text-3xl`}>
              Drag your file here
            </div>
          )}
        </h1>
      </div>

      {totalPages && (
        <div className="mt-5 flex flex-col items-center z-20">
          <div className="flex flex-wrap gap-3 w-full">
            <div className="flex justify-between gap-5 items-center w-full">
              <h1 className="text-white text-xl">Start page: </h1>
              <input
                type="number"
                placeholder="Start Page"
                value={startPage}
                onChange={(e) => setStartPage(Number(e.target.value))}
                className="border p-2 rounded w-[50%] "
              />
            </div>
            <div className="flex flex-wrap justify-between items-center gap-3 w-full">
              <h1 className="text-white text-xl">No. of pages: </h1>
              <select
                value={numPages}
                onChange={(e) => setNumPages(Number(e.target.value))}
                className="border p-2 rounded w-[50%] "
              >
                {[...Array(10)].map((_, index) => (
                  <option
                    key={index + 1}
                    value={index + 1}
                    disabled={index > 2}
                  >
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-8 z-20">
        <button
          className="px-4 py-2 bg-white text-black rounded-md disabled:opacity-50 mt-5"
          onClick={handleSummarize}
          disabled={!selectedFile || loading}
        >
          Summarize
        </button>
        <button
          className="px-4 py-2 bg-white text-black rounded-md disabled:opacity-50 mt-5"
          onClick={handleGenerateQuiz}
          disabled={!summary}
        >
          Generate Quiz
        </button>
      </div>
      {error && <div className="mt-5 text-red-500">{error}</div>}

      {loading && selectedFile ? (
        <div className="mt-5 text-center text-white text-3xl flex justify-center items-center">
          Summarizing your content{" "}
          <span>
            <svg viewBox="25 25 50 50" className="svg1">
              <circle r="10" cy="50" cx="50"></circle>
            </svg>
          </span>
        </div>
      ) : (
        summary && (
          <div className="mt-5 border-[2px] border-opacity-45 border-black bg-gray-200 p-5 z-10 rounded-md w-full h-auto mb-10">
            <h1 className="font-semibold text-2xl py-3">Summarized text</h1>

            {formatSummary(summary)}
          </div>
        )
      )}
    </div>
  );
};

export default Summariser;
