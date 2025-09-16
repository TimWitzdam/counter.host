import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear().toString();

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <main>{children}</main>
        <footer className="text-center lg:text-left">
          <div className="grid lg:grid-cols-3 divide-x divide-y border-t">
            <a className="text-2xl font-medium py-5 px-4" href="/">
              Home
            </a>
            <a className="text-2xl font-medium py-5 px-4" href="/register">
              Sign Up
            </a>
            <a className="text-2xl font-medium py-5 px-4" href="/login">
              Login
            </a>
            <a className="text-2xl font-medium py-5 px-4" href="/docs">
              API Documentation
            </a>
            <a className="text-2xl font-medium py-5 px-4" href="/support">
              Support
            </a>
            <a
              className="text-2xl font-medium py-5 px-4 border-b border-r"
              href="https://github.com/TimWitzdam/counter.host"
              target="_blank"
            >
              GitHub
            </a>
          </div>
          <p className="text-sm py-5 px-4">&copy; {currentYear} counter.host</p>
        </footer>
      </body>
    </html>
  );
}
