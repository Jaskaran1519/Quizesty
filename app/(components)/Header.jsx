import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SignedOut, UserButton, SignedIn } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <Link href="/">
        <h1 className="px-4 py-4 text-xl font-semibold">Quizesty</h1>
      </Link>

      <div className="flex gap-5 items-center">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-up">Sign up</Link>
          <Link href="/sign-in">Login</Link>
        </SignedOut>
      </div>
    </div>
  );
};

export default Header;