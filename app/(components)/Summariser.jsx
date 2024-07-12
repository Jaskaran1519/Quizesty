"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Summariser = () => {
  const [pdfjsLibLoaded, setPdfjsLibLoaded] = useState(false);
  const [summary, setSummary] = useState("");
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
    const fileReader = new FileReader();
    fileReader.onload = onLoadFile;
    fileReader.readAsArrayBuffer(file);
  }

  function onLoadFile(e) {
    const typedarray = new Uint8Array(e.target.result);
    window.pdfjsLib.getDocument({ data: typedarray }).promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        page.getTextContent().then((content) => {
          let text = "";
          content.items.forEach((item) => {
            text += item.str + " ";
          });
          sendToAPI(text);
        });
      });
    });
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
      });
  }

  const handleGenerateQuiz = () => {
    if (summary) {
      console.log("Original summary:", summary);
      const encodedSummary = btoa(unescape(encodeURIComponent(summary)));
      console.log("Encoded summary:", encodedSummary);
      router.push(`/quiz?summary=${encodedSummary}`);
    }
  };

  if (!pdfjsLibLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex justify-center items-center flex-col mt-[10vh]">
      <h1 className="mb-10 text-3xl font-semibold">Upload your pdf here</h1>
      <div className="min-w-[250px] w-[40%] h-[30vh] max-h-[200px] border-[1px] border-black relative rounded-md ">
        <input
          type="file"
          id="file"
          name="file"
          accept=".pdf"
          onChange={onFileChange}
          className="w-full h-full inset-0 absolute opacity-0"
        />
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-center">
          Drag your file here
        </h1>
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 mt-5"
        onClick={handleGenerateQuiz}
        disabled={!summary}
      >
        Generate Quiz
      </button>
      {summary && (
        <div className="mt-5 border-[2px] border-opacity-45 border-black p-3 border-r-10 w-full h-auto mb-10">
          <h1 className="font-semibold text-2xl py-3">Summarized text</h1>
          {summary}
        </div>
      )}
    </div>
  );
};

export default Summariser;
