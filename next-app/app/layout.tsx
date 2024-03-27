"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { saveState } from "./redux/localStorage";

const inter = Inter({ subsets: ["latin"] });

store.subscribe(() => {
  saveState(store.getState().store);
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={inter.className + "dark text-white bg-black"}>
          {children}
        </body>
      </html>
    </Provider>
  );
}
