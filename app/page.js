import React from "react";
import Summariser from "./(components)/Summariser";
import Header from "./(components)/Header";
import Intro from "./(components)/Intro";
import Use from "./(components)/Use";
import Image from "next/image";

const page = () => {
  return (
    <div className=" w-[90vw] max-w-[1400px] mx-auto min-h-screen overflow-hidden">
      <Image
        src="/bgsvg.svg"
        className="absolute top-1/4 -left-1/4 opacity-20 scale-100 rotate-60 -z-10"
        width={800}
        height={800}
        alt="hello"
      />
      <Image
        src="/bgsvg.svg"
        className="absolute -top-1/2 right-0 opacity-20 -z-10 scale-100 rotate-60"
        width={900}
        height={900}
        alt="hello"
      />
      <Image
        src="/bgsvg.svg"
        className="absolute top-[110vh] right-0 opacity-20 -z-10 scale-100 rotate-60"
        width={900}
        height={900}
        alt="hello"
      />

      <Header />
      <Intro />

      <Summariser />
      <Use />
    </div>
  );
};

export default page;
