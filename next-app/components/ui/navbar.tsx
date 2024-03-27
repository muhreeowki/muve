import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full px-5 flex flex-row justify-between z-1 max-w-screen-xl">
      <Link href="/">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Muve
        </h1>
      </Link>
    </nav>
  );
};

export default Navbar;
