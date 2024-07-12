import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Image src="/middle finger.png" width={500} height={500} alt="/" />
    </div>
  );
};

export default page;
