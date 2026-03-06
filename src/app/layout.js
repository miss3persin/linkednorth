import "./globals.css";
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SupabaseProvider from './SupabaseProvider'
import { openSans } from '@/lib/fonts';

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
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${openSans.className} ${openSans.variable}`}>
        <SupabaseProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}
