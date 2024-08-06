"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";

export default function Home() {
  return (
    <>
      <header className="w-full p-5">
        <Navbar />
      </header>
      <main className="w-full flex justify-center items-center p-5">
        {/* Hero */}
        <div className="overflow-hidden py-24 lg:py-32">
          {/* Gradients */}
          {/* End Gradients */}
          <div className=" z-10">
            <div className="container py-10 lg:py-16">
              <div className="max-w-2xl text-center mx-auto">
                <p className="">Welcome To </p>
                {/* Title */}
                <div className="mt-5 max-w-2xl">
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Muve - Playlist Converter
                  </h1>
                </div>
                {/* End Title */}
                <div className="mt-5 max-w-3xl">
                  <p className="text-xl text-muted-foreground">
                    Elevate your playlist experience by seamlessly converting
                    your music playlists across different platforms.
                  </p>
                </div>
                {/* Buttons */}
                <div className="mt-8 gap-3 flex justify-center">
                  <Link href="/login">
                    <Button className="dark" size={"lg"}>
                      Sign Up
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="dark" size={"lg"} variant={"outline"}>
                      Login
                    </Button>
                  </Link>
                </div>
                {/* End Buttons */}
              </div>
            </div>
          </div>
        </div>
        {/* End Hero */}
      </main>
    </>
  );
}
