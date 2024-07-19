import { Arimo, Raleway } from "next/font/google";
import React from "react";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400"],
});
const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400"],
});
const Intro = () => {
  return (
    <div className="overflow-hidden ">
      <h1
        className={`  font-bold text-[2rem] sm:text-[3rem] md:text-[4rem] text-center mt-16 text-white`}
      >
        Summarize pdf in one click
      </h1>
      <h2
        className={`${raleway.className} text-center mt-5 text-2xl text-gray-400`}
      >
        Effortlessly summarize your pdfs and generate quiz from it in a couple
        of seconds
      </h2>
    </div>
  );
};

export default Intro;
