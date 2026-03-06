"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Instagram,
  ChevronDown,
  Search,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: "How do I post a job on LinkedNorth?",
      answer:
        "To post a job, create an employer account and navigate to your dashboard. From there, you can submit a new job listing, manage applications, and track performance.",
    },
    {
      question: "How long does it take to get a response?",
      answer:
        "We typically respond within 24–48 business hours. For urgent matters, please include 'Urgent' in your subject line.",
    },
    {
      question: "Do you offer partnership opportunities?",
      answer:
        "Yes. We collaborate with companies, recruiters, and communities. Please select 'Partnership' as your subject and include relevant details in your message.",
    },
    {
      question: "How do I report an issue or suspicious listing?",
      answer:
        "You can report listings directly from the job page or contact us with the listing details. Our team reviews reports promptly to maintain platform integrity.",
    },
    {
      question: "Is my personal data secure?",
      answer:
        "Absolutely. We use modern security practices and never sell personal data. You can review our Privacy Policy for detailed information.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || formData.subject === "Select a subject") {
      setStatus({
        type: "error",
        message: "Please select a subject.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "info", message: "Sending your message..." });

    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Unable to send message.");
      }

      setStatus({
        type: "success",
        message: "Message sent successfully. We'll be in touch shortly.",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ================= HEADER SECTION ================= */}
      <section className="max-w-6xl mx-auto px-6 pt-16 mt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black">
          Get in <span className="text-gray-400 font-bold">Touch</span>
        </h1>

        <p className="mt-4 text-gray-500 max-w-xl mx-auto text-sm md:text-base">
          We would love to hear from you. Whether you have a question, feedback,
          or partnership inquiry, our team is here to help.
        </p>
      </section>

      {/* ================= MAIN GRID ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ================= FORM ================= */}
          <div className="lg:col-span-2 border rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="font-bold text-lg mb-6">Send us a message</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      handleChange("firstName", e.target.value)
                    }
                    placeholder="John"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      handleChange("lastName", e.target.value)
                    }
                    placeholder="Doe"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Company / Organization (optional)
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Your company name"
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Subject *</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option>Select a subject</option>
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                  <option>Report an Issue</option>
                  <option>Press / Media</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Message *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="How can we help you?"
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                ></textarea>
              </div>

              {status && (
                <p
                  className={`text-sm ${status.type === "error"
                      ? "text-red-500"
                      : status.type === "success"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                >
                  {status.message}
                </p>
              )}

              <p className="text-xs text-gray-400">
                By submitting this form, you agree to our{" "}
                <span className="underline text-black cursor-pointer">
                  Privacy Policy
                </span>.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-black text-white text-xs px-10 py-3 rounded-lg transition ${isSubmitting
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:opacity-90"
                  }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* ================= CONTACT INFO ================= */}
          <div className="border rounded-xl p-6 md:p-8 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-6">
              Contact Information
            </h2>

            <div className="space-y-6 text-sm">
              <div className="flex gap-4">
                <div className="p-1 bg-gray-100 rounded-md w-10 h-10 flex justify-center items-center">
                  <MapPin className="text-black w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Office Address</p>
                  <p className="text-gray-500">
                    123 Business Avenue
                    <br />
                    Suite 456
                    <br />
                    San Francisco, CA 94102
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-1 bg-gray-100 rounded-md w-10 h-10 flex justify-center items-center">
                  <Clock className="text-black w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Business Hours</p>
                  <p className="text-gray-500">
                    Monday - Friday
                    <br />
                    9:00 AM - 6:00 PM PST
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-1 bg-gray-100 rounded-md w-10 h-10 flex justify-center items-center">
                  <Mail className="text-black w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-500">
                    help@linkednorth.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-1 bg-gray-100 rounded-md w-10 h-10 flex justify-center items-center">
                  <Phone className="text-black w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-500 mb-5">
                    +1 (555) 555-0123
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 p-4">
                <p className="font-semibold my-4">Follow Us</p>

                <div className="flex gap-4 mb-10">
                <div className="p-1 bg-gray-100 rounded-md w-10 h-10 flex justify-center items-center">
                  <Twitter className="text-black w-5 h-5" />
                </div>
                <div className="p-1 bg-gray-100 rounded-md w-10 h-10 flex justify-center items-center">
                  <Instagram className="text-black w-5 h-5" />
                </div>
                <div className="p-1 bg-gray-100 rounded-md w-10 h-10 flex justify-center items-center">
                  <MessageCircle className="text-black w-5 h-5" />
                </div>
                </div>

                <p className="text-xs text-gray-500">
                  <span className="text-black font-medium">Response Time: </span> We typically respond within 24–48 business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Frequently Asked{" "}
          <span className="text-gray-400 font-bold">Questions</span>
        </h2>

        <p className="text-gray-500 mt-3 text-sm">
          Find quick answers to common questions about LinkedNorth.
        </p>

        <div className="mt-8 space-y-3 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg px-4 py-3 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">
                  {faq.question}
                </p>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${openIndex === index ? "rotate-180" : ""
                    }`}
                />
              </div>

              {openIndex === index && (
                <p className="text-gray-500 text-sm mt-3">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="border rounded-2xl p-8 md:p-12 flex flex-col items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-gray-100 rounded-full hidden md:flex w-36 h-36 items-center justify-center">
              <Search className="w-16 h-16 text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-bold mb-2">
                Ready to Find Your Next{" "}
                <span className="text-gray-400 font-bold">Opportunity?</span>
              </h3>
              <p className="text-gray-500 text-sm mt-2 max-w-md">
                Our powerful matching technology will send job matches right to your inbox.
                Join thousands of professionals who found their dream role through LinkedNorth.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => router.push("/jobs")}
              className="bg-black text-white text-xs px-8 py-3 rounded-lg flex items-center gap-2">
              Browse Job Listings
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/alerts")}
              className="border border-black font-medium text-xs px-8 py-3 rounded-lg">
              Get Job Alerts
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
