import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "Bhushan Ingale — Full Stack Developer",
  description: "Full Stack Developer proficient in MERN stack. Building scalable web applications with clean, maintainable code.",
  keywords: ["Full Stack Developer", "MERN Stack", "React", "Next.js", "Node.js","Django","Flask","MongoDB","SQL","Git","REST APIs","GraphQL","TypeScript","JavaScript" ],
  authors: [{ name: "Bhushan Ingale" }],
  openGraph: {
    title: "Bhushan Ingale — Full Stack Developer",
    description: "Building scalable web applications with the MERN stack",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
