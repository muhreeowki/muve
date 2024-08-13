import { Inter } from "next/font/google";
import "./globals.css";
import StateWrapper from "@/wrapper/stateWrapper";
import { Suspense } from "react";
import Loading from "@/app/loading";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Loading />}>
      <StateWrapper>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </StateWrapper>
    </Suspense>
  );
}
