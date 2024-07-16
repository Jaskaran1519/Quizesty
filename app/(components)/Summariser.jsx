"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Summariser = () => {
  const [pdfjsLibLoaded, setPdfjsLibLoaded] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [numPages, setNumPages] = useState(5);
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
    return <div>Loading...</div>;
  }

  const formatSummary = (text) => {
    return text.split("\n").map((line, index) => (
      <p key={index} className="mb-2 text-gray-900">
        {line}
      </p>
    ));
  };

  return (
    <div className="w-full flex justify-center items-center flex-col mt-[10vh]">
      <h1 className="mb-10 text-3xl font-semibold">Upload your PDF here</h1>
      <div className="min-w-[250px] w-[40%] h-[30vh] max-h-[200px] border-[1px] border-black relative rounded-xl">
        <input
          type="file"
          id="file"
          name="file"
          accept=".pdf"
          onChange={onFileChange}
          className="w-full h-full inset-0 absolute opacity-0"
        />
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-center">
          {selectedFile ? selectedFile.name : "Drag your file here"}
        </h1>
      </div>
      {totalPages && (
        <div className="mt-5 flex flex-col items-center">
          <div className="flex flex-row gap-3">
            <input
              type="number"
              placeholder="Start Page"
              value={startPage}
              onChange={(e) => setStartPage(Number(e.target.value))}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Number of Pages"
              value={numPages}
              onChange={(e) => setNumPages(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md disabled:opacity-50 mt-5"
            onClick={handleSummarize}
            disabled={!selectedFile || loading}
          >
            Summarize
          </button>
        </div>
      )}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 mt-5"
        onClick={handleGenerateQuiz}
        disabled={!summary}
      >
        Generate Quiz
      </button>
      {error && <div className="mt-5 text-red-500">{error}</div>}

      {loading && selectedFile ? (
        <div className="mt-5 text-center">Summarizing your content...</div>
      ) : (
        summary && (
          <div className="mt-5 border-[2px] border-opacity-45 border-black p-3 rounded-md w-full h-auto mb-10">
            <h1 className="font-semibold text-2xl py-3">Summarized text</h1>
            {formatSummary(summary)}
          </div>
        )
      )}
    </div>
  );
};

export default Summariser;
