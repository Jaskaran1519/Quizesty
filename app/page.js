import React from "react";
import Summariser from "./(components)/Summariser";
import Header from "./(components)/Header";
import Intro from "./(components)/Intro";
import Use from "./(components)/Use";

const page = () => {
  return (
    <div className=" w-[90%] max-w-[1400px] mx-auto min-h-screen overflow-hidden">
      <Header />
      <Intro />
      <Summariser />
      <Use />
    </div>
  );
};

export default page;
