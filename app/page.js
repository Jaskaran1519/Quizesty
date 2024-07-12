import React from "react";
import Summariser from "./(components)/Summariser";
import Header from "./(components)/Header";

const page = () => {
  return (
    <div className="w-[90%] max-w-[1400px] mx-auto min-h-screen">
      <Header />
      <Summariser />
    </div>
  );
};

export default page;
