import React, { useEffect, useState } from "react";
import NewsBanner from "../components/NewsBanner";
import Testimonies from "./Admin/Testimonies";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import supabase from "../lib/supabaseClient";

// Updated imports - make sure the file name matches exactly
import { 
  fetchActiveBanners, 
  fetchPublicTestimonies  // Changed from fetchApprovedTestimonies
} from "../services/adminContentService"; // Note: Capital 'A' if your file is AdminContentService.js

export default function Home() {
  const [quote, setQuote] = useState({
    text: "Science is a way of thinking much more than it is a body of knowledge.",
    author: "Carl Sagan",
  });
  const [banners, setBanners] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ banners: null, testimonies: null, quote: null });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrors({ banners: null, testimonies: null, quote: null });

        // Load all data in parallel
        const [bannerData, testimonyData, quoteData] = await Promise.allSettled([
          fetchActiveBanners(),
          fetchPublicTestimonies(), // Use the safer public function
          fetchQuote()
        ]);

        // Handle banners
        if (bannerData.status === 'fulfilled') {
          setBanners(bannerData.value || []);
        } else {
          console.error("Error loading banners:", bannerData.reason);
          setErrors(prev => ({ ...prev, banners: "Failed to load news banners" }));
        }

        // Handle testimonies
        if (testimonyData.status === 'fulfilled') {
          setTestimonies(testimonyData.value || []);
        } else {
          console.error("Error loading testimonies:", testimonyData.reason);
          setErrors(prev => ({ ...prev, testimonies: "Failed to load testimonials" }));
        }

        // Handle quote
        if (quoteData.status === 'fulfilled') {
          setQuote(quoteData.value);
        } else {
          console.error("Error loading quote:", quoteData.reason);
          setErrors(prev => ({ ...prev, quote: "Using default quote" }));
        }

      } catch (error) {
        console.error("Unexpected error loading home page data:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchQuote() {
      try {
        const { data, error } = await supabase
          .from("site_meta")
          .select("value")
          .eq("key", "home_quote")
          .single();

        if (error) {
          console.log("No custom quote found, using default");
          throw error;
        }

        if (data?.value) {
          try {
            const parsed = JSON.parse(data.value);
            return parsed;
          } catch (parseError) {
            console.error("Error parsing quote:", parseError);
          }
        }
        
        // Return default quote
        return {
          text: "Science is a way of thinking much more than it is a body of knowledge.",
          author: "Carl Sagan",
        };
      } catch (error) {
        // Return default quote on any error
        return {
          text: "Science is a way of thinking much more than it is a body of knowledge.",
          author: "Carl Sagan",
        };
      }
    }

    loadData();
  }, []);

  // Show a loading state while fetching critical content
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">Loading essential content...</p>
        <p className="text-sm text-slate-400 mt-2">This may take a moment</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-[#031025] to-[#071028] text-slate-100">
      {/* Show error messages if any */}
      {errors.banners && (
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 p-3 text-center">
          {errors.banners}
        </div>
      )}
      
      {/* Pass the fetched banners data as a prop */}
      <NewsBanner banners={banners} />

      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/services" className="hidden md:inline px-3 py-2 rounded-md bg-white/6 hover:bg-white/10 transition-colors">
              Services
            </Link>
            <Link to="/courses" className="hidden md:inline px-3 py-2 rounded-md bg-white/6 hover:bg-white/10 transition-colors">
              Courses
            </Link>
            <Link to="/portfolio" className="hidden md:inline px-3 py-2 rounded-md bg-white/6 hover:bg-white/10 transition-colors">
              Founder
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 main-pt">
        <section className="grid gap-8 md:grid-cols-2 items-center py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Teach. Empower. Transform.<br />
              <span className="text-blue-400">Learn with BerryRay.</span>
            </h1>

            <p className="text-slate-300 max-w-xl">
              Practical courses, guided registration services, and trusted student support — designed for real success.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/portfolio"
                className="glass-card inline-flex items-center justify-center px-4 py-3 rounded-lg shadow hover:scale-[1.01] transition hover:bg-white/10"
                aria-label="Our Founder"
              >
                <span className="font-semibold">Our Founder</span>
              </Link>

              <Link
                to="/courses"
                className="btn-primary inline-flex items-center justify-center px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                aria-label="View Courses"
              >
                View Courses
              </Link>
            </div>

            <blockquote className="mt-4 p-4 rounded-md bg-white/5 border border-white/6">
              <p className="italic">"{quote.text}"</p>
              <footer className="mt-2 text-sm text-slate-300">— {quote.author}</footer>
              {errors.quote && (
                <p className="text-xs text-yellow-500 mt-1">{errors.quote}</p>
              )}
            </blockquote>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-white/6 flex items-center justify-center text-3xl font-bold">
                B
              </div>
              <div>
                <h3 className="text-xl font-semibold">Why BerryRay?</h3>
                <p className="text-slate-300">
                  Hands-on courses, friendly support, and payment-based enrolment. Everything built for students.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-white/4 hover:bg-white/6 transition-colors">
                <div className="text-sm text-slate-300">Flexible learning</div>
                <div className="font-semibold">Self-paced & live sessions</div>
              </div>
              <div className="p-4 rounded bg-white/4 hover:bg-white/6 transition-colors">
                <div className="text-sm text-slate-300">Trusted payments</div>
                <div className="font-semibold">Bank transfer & proof upload</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Testimonies Section */}
        <section className="py-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">What students say</h2>
            {errors.testimonies && (
              <span className="text-sm text-yellow-500">{errors.testimonies}</span>
            )}
          </div>
          
          {testimonies.length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-lg">
              <p className="text-slate-400">No testimonials available yet.</p>
              <p className="text-sm text-slate-500 mt-2">Check back soon for student feedback!</p>
            </div>
          ) : (
            <Testimonies testimonies={testimonies} />
          )}
        </section>

        {/* Quick CTA */}
        <section className="py-8">
          <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Ready to start?</h3>
              <p className="text-slate-300">
                Choose a course or reach out — we'll guide you through registration and payment.
              </p>
            </div>
            <div className="flex gap-3">
              <Link 
                to="/courses" 
                className="btn-primary px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Browse Courses
              </Link>
              <Link 
                to="/contact" 
                className="px-4 py-2 rounded bg-white/6 hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-400 border-t border-white/10">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} BerryRay Technologies. All rights reserved.</p>
          <p className="text-sm text-slate-500 mt-2">
            Practical education for real-world success
          </p>
        </div>
      </footer>
    </div>
  );
}