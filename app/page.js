import React from "react";
import Summariser from "./(components)/Summariser";
import Header from "./(components)/Header";
import Intro from "./(components)/Intro";
import Use from "./(components)/Use";

const page = () => {
  return (
    <div className=" ">
      <Header />
      <Intro />
      <Summariser />
      <Use />
    </div>
  );
};

export default page;
