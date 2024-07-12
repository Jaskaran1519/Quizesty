import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <Link href="/">
        <h1 className="px-4 py-4 text-xl font-semibold">Quizesty</h1>
      </Link>

      <Link href="/fuck">
        <Image
          src="/water.png"
          className="p-4"
          width={75}
          height={75}
          alt="/"
        />
      </Link>
    </div>
  );
};

export default Header;
