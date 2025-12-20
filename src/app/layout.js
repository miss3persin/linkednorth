// import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Suspense } from "react";
import { ClerkProvider } from '@clerk/nextjs'
import { Open_Sans } from 'next/font/google';

export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

// const inter = Inter({ subsets: ["latin"] });
// const openSans = Open_Sans({ subsets: ["latin"]});

export const metadata = {
  title: "Linkednorth",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    // <Suspense fallback={<Loading />}>
    <ClerkProvider>
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${openSans.className}`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
    </ClerkProvider>
    // </Suspense> 
  );
}
