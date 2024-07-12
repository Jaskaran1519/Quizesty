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
    <div>
      <h1>Upload pdf</h1>
      <input
        type="file"
        id="file"
        name="file"
        accept=".pdf"
        onChange={onFileChange}
      />
      <button onClick={handleGenerateQuiz} disabled={!summary}>
        Generate Quiz
      </button>
    </div>
  );
};

export default Summariser;
