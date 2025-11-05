import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "../components/layout/Sidebar";
import { HiCheck, HiLightningBolt } from "react-icons/hi";
import { FaRegFileAlt, FaChartPie } from "react-icons/fa";

export default async function PremiumPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const features = [
    "AI-powered resume optimization",
    "Priority application submissions",
    "Job fit analysis with match percentages",
    "Unlimited resume versions",
  ];

  const pricing = [
    {
      title: "Pay Per Use",
      price: "$0.59",
      sub: "per use",
      note: "Perfect for occasional job applications",
      button: "Get Started",
    },
    {
      title: "Monthly Subscription",
      price: "$2.67",
      sub: "/month",
      note: "Unlimited access to all premium features",
      tag: "BEST VALUE",
      button: "Subscribe Now",
      highlight: true,
    },
    {
      title: "Quarterly",
      price: "$7",
      sub: "/quarter",
      note: "Save 12% compared to monthly",
      button: "Subscribe Now",
    },
  ];

  return (
    <div className="min-h-screen flex bg-white mt-16">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-xl font-semibold mb-6">Premium Features</h1>

        {/* HERO SECTION */}
        <div className="bg-gradient-to-r from-[#7F5CFF] to-[#00B4D8] text-white p-8 rounded-xl mb-8">
          <h2 className="text-lg font-semibold mb-2">Unlock Premium Features</h2>
          <p className="text-sm opacity-90 mb-4">
            Enhance your job search with AI-powered tools designed to improve your chances of landing your dream job.
          </p>

          <ul className="grid md:grid-cols-2 gap-y-2 text-sm mb-6">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <HiCheck className="text-white text-lg" />
                {f}
              </li>
            ))}
          </ul>

          <div className="grid md:grid-cols-3 gap-4">
            {pricing.map((p, i) => (
              <div key={i} className="bg-white text-gray-900 p-6 rounded-xl text-center shadow-sm">
                {p.tag && (
                  <span className="text-[10px] bg-yellow-300 text-black px-2 py-[2px] rounded-md font-semibold">
                    {p.tag}
                  </span>
                )}
                <h3 className="font-medium mt-1">{p.title}</h3>
                <p className="text-3xl font-bold mt-2">
                  {p.price}<span className="text-sm font-normal">{p.sub}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1 mb-4">{p.note}</p>
                <button
                  className={`w-full py-2 rounded-md text-sm font-medium 
                    ${p.highlight ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  {p.button}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TOOLS SECTION */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">

          {/* Resume AI */}
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <FaRegFileAlt className="text-2xl text-blue-500" />
              <h3 className="font-semibold text-base">Resume Improvement AI</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Our AI analyzes your resume against industry standards and job requirements to suggest improvements that increase your chances of getting noticed.
            </p>

            <ul className="text-sm mb-4 space-y-1">
              {[
                "Keyword optimization for ATS systems",
                "Professional tone and language suggestions",
                "Bullet point rephrasing for impact",
                "Before/after comparison view"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <HiCheck className="text-green-500" /> {item}
                </li>
              ))}
            </ul>

            <button className="w-full bg-black text-white py-2 text-sm rounded-md">
              Try Resume Improvement
            </button>
          </div>

          {/* Job Fit Analyzer */}
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <FaChartPie className="text-2xl text-purple-500" />
              <h3 className="font-semibold text-base">Job Fit Analyzer</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              See how well your profile matches job requirements and get personalized suggestions to improve your application.
            </p>

            <ul className="text-sm mb-4 space-y-1">
              {[
                "Match percentage score",
                "Missing skills identification",
                "Experience alignment analysis",
                "Personalized application tips"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <HiCheck className="text-green-500" /> {item}
                </li>
              ))}
            </ul>

            <button className="w-full bg-black text-white py-2 text-sm rounded-md flex items-center justify-center gap-2">
              <HiLightningBolt /> Analyze Job Fit
            </button>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <h3 className="font-medium mb-4">Frequently Asked Questions</h3>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-1">How does the Job Fit Analyzer work?</p>
              <p className="text-gray-600">
                Our AI compares your resume and profile with the job description, analyzing keyword matches,
                skill relevance, and experience alignment to generate a match percentage and personalized recommendations.
              </p>
            </div>

            <div>
              <p className="font-medium mb-1">Can I cancel my subscription anytime?</p>
              <p className="text-gray-600">
                Yes, you can cancel at any time. Your premium features will remain active until the end of your billing period.
              </p>
            </div>

            <div>
              <p className="font-medium mb-1">Is my payment info secure?</p>
              <p className="text-gray-600">
                Absolutely. We use secure, industry-standard payment processors and encryption.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
