import "./globals.css";
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { ClerkProvider } from '@clerk/nextjs'
import { Open_Sans } from 'next/font/google';

export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "Linkednorth | Find Your Next Role, Verified and Secured",
  description:
    "Linkednorth connects talented professionals with verified global opportunities. Explore job listings, build your resume, and accelerate your career with our expert resources.",
  keywords: "jobs, remote work, career builder, resume reviews, hire freelancers, startup jobs",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`min-h-screen flex flex-col ${openSans.className}`}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
