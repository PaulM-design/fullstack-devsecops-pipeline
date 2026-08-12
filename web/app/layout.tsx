import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "DevSecOps Pipeline Demo",
  description: "A visible, testable secure delivery pipeline",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

