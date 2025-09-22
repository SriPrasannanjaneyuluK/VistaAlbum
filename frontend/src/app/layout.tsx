"use client";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
