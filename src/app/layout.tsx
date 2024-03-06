import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to JobFit - the best place to find your next job!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <ThemeProvider theme={theme}>
          <body>{children}</body>
        </ThemeProvider>
      </html>
    </SessionProvider>
  );
}
