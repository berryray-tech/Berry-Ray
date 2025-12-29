import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaTiktok } from "react-icons/fa";
import supabase from "../lib/supabaseClient"; // <-- NEW: Import Supabase client

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  // NEW: State for loading and submission message
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', or null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // <-- Made the function async
    e.preventDefault();
    setLoading(true);
    setSubmissionStatus(null);
    
    // NEW: Data object must match the column names in your Supabase table
    const submissionData = {
      full_name: form.name, // Matches your DB column name (full_name)
      email: form.email,
      subject: form.subject,
      message: form.message,
    };

    // 1. Send data to Supabase
    const { error } = await supabase
        .from('contact_messages') // Ensure this table name is correct
        .insert([submissionData]);

    setLoading(false);
    
    // 2. Handle response
    if (error) {
      console.error("Supabase submission error:", error);
      setSubmissionStatus('error');
    } else {
      setSubmissionStatus('success');
      // Clear the form only on success
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div
      className="min-h-screen p-6 flex items-center justify-center"
      style={{ background: "linear-gradient(180deg,#071029 0%, #0a1530 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl max-w-4xl w-full p-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">
          Contact Us
        </h1>

        <p className="text-center text-gray-200 mb-8">
          Have questions? Need help? Reach out to us through the form or social
          links below.
        </p>

        {/* Submission Status Message */}
        {submissionStatus === 'success' && (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
            Message sent successfully! We will get back to you shortly.
          </div>
        )}
        {submissionStatus === 'error' && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            Failed to send message. Please try again later.
          </div>
        )}

        {/* CONTACT FORM */}
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* ... all your input fields remain the same ... */}
          
          <div>
            <label className="text-white block mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-white/10 text-white border border-white/20 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-white block mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-white block mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
              placeholder="What is your message about?"
            />
          </div>

          <div>
            <label className="text-white block mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
              placeholder="Type your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading} // Disable button while submitting
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {/* CONTACT ICONS */}
        <div className="mt-10 text-center">
          <h2 className="text-xl text-white mb-4 font-semibold">
            Or reach us on:
          </h2>

          <div className="flex justify-center gap-8 text-white text-3xl">
            {/* WhatsApp */}
            <a
              href="https://wa.me/2349058515139"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition"
            >
              <FaWhatsapp />
            </a>

            {/* Gmail */}
            <a
              href="mailto:berryraytechnologies@gmail.com"
              className="hover:text-red-400 transition"
            >
              <FaEnvelope />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@Berryraytech"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition"
            >
              <FaTiktok />
            </a>
          </div>

          <p className="text-gray-300 text-sm mt-6">
            We reply within minutes!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
