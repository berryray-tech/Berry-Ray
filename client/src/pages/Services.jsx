// src/pages/Services.jsx
import React, { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
// import { createClient } from '@supabase/supabase-js'; // ❌ REMOVED: No longer create client here

// ✅ FIX: Import the single, already-initialized client instance.
import supabase from '../lib/supabaseClient'; 


export default function Services() {
  // Data state
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true); 

  // UI state
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // selection state
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // registration form state
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    phone: "",
    additionalInfo: "",
  });

  // payment/proof state
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Default Bank Info (can stay local)
  const DEFAULT_BANK = {
    accountName: "Chinonso O Osuji-lco",
    accountNumber: "9635952887",
    bankName: "Providus Bank",
  };
  
  /* -------------------------
      DATA FETCHING HOOK
      Fetches services and their associated packages (joined) from Supabase
      ------------------------- */
  useEffect(() => {
    async function fetchServices() {
      // NOTE: Removed the placeholder key checks, as they should be handled 
      // in the central ../lib/supabaseClient.js file.
      
      setLoadingServices(true);
      
      // Fetch all services and all associated service_packages using the Foreign Key relation
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          title,
          summary,
          description,
          packages:service_packages (
            id,
            name,
            price,
            priceLabel,
            desc
          )
        `);

      if (error) {
        console.error("Error fetching services:", error);
      } else {
        // The data array now contains services with a nested 'packages' array
        setServices(data || []);
      }
      setLoadingServices(false);
    }
    fetchServices();
  }, []); // Run once on component mount


  /* -------------------------
      HELPER FUNCTIONS
      ------------------------- */

  const toggleExpand = (i) => {
    setExpandedIndex((prev) => (prev === i ? null : i));
  };

  const openPackages = (service, ev) => {
    if (ev) ev.stopPropagation();
    setSelectedService(service);
    setSelectedPackage(null);
    setPackagesOpen(true);
  };

  const choosePackage = (pkg) => {
    setSelectedPackage(pkg);
    setPackagesOpen(false);
    setFormOpen(true);
  };

  const closeAllModals = () => {
    setPackagesOpen(false);
    setFormOpen(false);
    setPaymentOpen(false);
    setSelectedPackage(null);
    setSelectedService(null);
    setProofFile(null);
    setProofPreview("");
  };

  const onProofChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProofFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setProofPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email) {
      console.error("Validation failed: Please enter your name and email.");
      return;
    }
    setFormOpen(false);
    setPaymentOpen(true);
  };
  
  /* -------------------------
      SUPABASE SUBMISSION FUNCTION
      ------------------------- */
  const onPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!proofFile) {
        console.error("Validation failed: Please upload proof of payment.");
        return;
    }

    setSubmitting(true);
    let proofUrl = null;
    let finalError = null;

    try {
        // --- 1. UPLOAD PAYMENT PROOF TO SUPABASE STORAGE ---
        const fileExtension = proofFile.name.split('.').pop();
        const fileName = `${selectedService.id}-${selectedPackage.id}-${Date.now()}.${fileExtension}`;
        
        // Ensure BUCKET_NAME matches the bucket you created in Supabase
        const BUCKET_NAME = 'payment-proofs'; 
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME) 
            .upload(fileName, proofFile, {
                cacheControl: '3600',
                upsert: false 
            });

        if (uploadError) {
            console.error("Supabase Storage Upload Error:", uploadError);
            finalError = `File upload failed: ${uploadError.message}. Check Storage RLS.`;
            throw new Error(finalError);
        }

        const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(uploadData.path);
        
        proofUrl = publicUrlData.publicUrl;
        
        // --- FIX: Clean price string for numeric database column insertion ---
        // This handles formatted strings like "15,000" by converting them to the number 15000.
        const cleanedPrice = parseFloat(
            String(selectedPackage.price).replace(/[^\d.]/g, '')
        );
        
        if (isNaN(cleanedPrice)) {
            finalError = "Price data is corrupted or missing.";
            throw new Error(finalError);
        }
        
        // --- 2. INSERT REGISTRATION DATA INTO 'service_registrations' TABLE ---
        const { error: dbError } = await supabase.from('service_registrations').insert({
            full_name: regData.name, 
            email: regData.email,
            phone: regData.phone || null,
            additional_info: regData.additionalInfo || null,
            service_id: selectedService.id,
            service_title: selectedService.title,
            package_id: selectedPackage.id,
            package_name: selectedPackage.name,
            package_price: cleanedPrice, // *** USING CLEANED NUMERIC PRICE ***
            payment_proof_url: proofUrl, 
            status: 'pending', 
        });

        if (dbError) {
            console.error("Supabase DB Insert Error:", dbError);
            finalError = `Database insert failed: ${dbError.message}. Check Table RLS.`;
            throw new Error(finalError);
        }

        // --- 3. SUCCESS ---
        alert("Registration submitted successfully! We will verify your payment soon.");
        
    } catch (err) {
        // Log the error
        console.error("Submission failed:", finalError || err.message);
        alert(`Submission failed. Please try again or contact support. Error: ${finalError || err.message}`);
        
    } finally {
        setSubmitting(false);
        setRegData({ name: "", email: "", phone: "", additionalInfo: "" });
        closeAllModals();
    }
  };


  /* -------------------------
      Render
      ------------------------- */
  
  // Show loading indicator while fetching data
  if (loadingServices) {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg,#071029 0%, #0a1530 100%)" }}>
            <p className="text-xl text-white">Loading services...</p>
        </div>
    );
  }

  // Show message if no services are found after loading
  if (services.length === 0 && !loadingServices) {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg,#071029 0%, #0a1530 100%)" }}>
            <p className="text-xl text-red-400 text-center max-w-lg p-4">
                ❌ No services found. Please ensure your Supabase tables **services** and **service_packages** exist, and that **RLS policies** allow public reading.
            </p>
        </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "linear-gradient(180deg,#071029 0%, #0a1530 100%)" }}>
      <style>{`
        /* Custom Styles for Glassmorphism Effect */
        .glass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        .glass-modal {
            background: rgba(10, 21, 48, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .input {
            padding: 0.75rem;
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
        }
        .input::placeholder {
            color: #ccc;
        }
        .input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }
      `}</style>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">Services — BerryRay</h1>

      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Mapping over the services array fetched from Supabase */}
        {services.map((s, idx) => ( 
          <motion.article
            key={s.id}
            layout
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-xl cursor-pointer"
            onClick={() => toggleExpand(idx)}
          >
            <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
            <p className="text-gray-200 mb-4">{s.summary}</p>

            <div className="flex gap-3">
              <button
                onClick={(ev) => openPackages(s, ev)}
                className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition duration-150"
              >
                Start Registration
              </button>

              <button
                onClick={(ev) => { ev.stopPropagation(); setExpandedIndex(idx === expandedIndex ? null : idx); }}
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white transition duration-150"
              >
                {expandedIndex === idx ? "Hide" : "Details"}
              </button>
            </div>

            <AnimatePresence>
              {expandedIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28 }}
                  className="mt-4 text-gray-200 border-t border-white/6 pt-4"
                >
                  <p>{s.description}</p>

                  <div className="mt-4">
                    <h4 className="font-semibold text-white">Packages</h4>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      {/* Mapping over the nested packages array */}
                      {s.packages && s.packages.map((pkg) => (
                        <div key={pkg.id} className="p-3 rounded bg-white/5">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-white">{pkg.name}</div>
                              <div className="text-sm text-slate-300 mt-1">{pkg.desc}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-200">{pkg.priceLabel || `₦${pkg.price}`}</div>
                              <button
                                onClick={(ev) => { ev.stopPropagation(); setSelectedService(s); choosePackage(pkg); }}
                                className="mt-3 px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm transition duration-150"
                              >
                                Fill Form
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        ))}
      </div>

      {/* ---------------- MODALS ---------------- */}
      
      {/* ... Packages Modal ... */}
      <AnimatePresence>
        {packagesOpen && selectedService && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setPackagesOpen(false); setSelectedService(null); }}
          >
            <motion.div
              className="glass-modal max-w-3xl w-full p-6 rounded"
              initial={{ y: -10, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -10, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Packages — {selectedService.title}</h2>
                <button onClick={() => { setPackagesOpen(false); setSelectedService(null); }} className="text-slate-300 hover:text-white">Close</button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {selectedService.packages.map((pkg) => (
                  <div key={pkg.id} className="glass-card p-4 rounded text-center">
                    <div className="text-lg font-semibold text-white">{pkg.name}</div>
                    <div className="text-blue-200 font-bold mt-2">{pkg.priceLabel || `₦${pkg.price}`}</div>
                    <p className="text-sm mt-2 text-slate-200">{pkg.desc}</p>
                    <button
                      onClick={() => choosePackage(pkg)}
                      className="mt-3 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition duration-150"
                    >
                      Fill Form
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ... Registration Form Modal ... */}
      <AnimatePresence>
        {formOpen && selectedPackage && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setFormOpen(false); setSelectedPackage(null); }}>
            <motion.div className="glass-modal max-w-lg w-full p-6 rounded"
              initial={{ y: -10, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -10, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}>

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedPackage.name} Registration</h2>
                  <div className="text-sm text-slate-300 mt-1">{selectedPackage.desc}</div>
                </div>
                <button onClick={() => { setFormOpen(false); setSelectedPackage(null); }} className="text-slate-300 hover:text-white">Close</button>
              </div>

              <form onSubmit={onFormSubmit} className="mt-4 space-y-3">
                <input className="input w-full" placeholder="Full name" value={regData.name} onChange={(e) => setRegData({ ...regData, name: e.target.value })} required />
                <input className="input w-full" type="email" placeholder="Email address" value={regData.email} onChange={(e) => setRegData({ ...regData, email: e.target.value })} required />
                <input className="input w-full" placeholder="Phone (WhatsApp Only)" value={regData.phone} onChange={(e) => setRegData({ ...regData, phone: e.target.value })} />
                <textarea className="input w-full" placeholder="Additional info (optional)" value={regData.additionalInfo} onChange={(e) => setRegData({ ...regData, additionalInfo: e.target.value })} />

                <div className="flex gap-3 mt-2">
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition duration-150">Proceed to Payment</button>
                  <button type="button" onClick={() => { setFormOpen(false); setSelectedPackage(null); }} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white transition duration-150">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ... Payment Modal ... */}
      <AnimatePresence>
        {paymentOpen && selectedPackage && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPaymentOpen(false)}>
            <motion.div className="glass-modal max-w-md w-full p-6 rounded"
              initial={{ y: -10, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -10, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}>

              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-white">Payment — {selectedPackage.name}</h2>
                <button onClick={() => setPaymentOpen(false)} className="text-slate-300 hover:text-white">Close</button>
              </div>

              <div className="bg-white/6 p-3 rounded mt-3">
                <p><strong>Account Name:</strong> <span className="text-blue-200">{DEFAULT_BANK.accountName}</span></p>
                <p><strong>Account Number:</strong> <span className="text-blue-200">{DEFAULT_BANK.accountNumber}</span></p>
                <p><strong>Bank:</strong> <span className="text-blue-200">{DEFAULT_BANK.bankName}</span></p>
                <p className="text-sm text-slate-300 mt-2">Pay the amount: <strong>{selectedPackage.priceLabel || `₦${selectedPackage.price}`}</strong></p>
              </div>

              <form onSubmit={onPaymentSubmit} className="mt-4 space-y-3">
                <label className="text-sm text-slate-300 block">Upload proof of payment (image)</label>
                <input type="file" accept="image/*" onChange={onProofChange} required className="text-white w-full text-sm" />
                {proofPreview && <img src={proofPreview} alt="proof preview" className="w-full rounded mt-2 border border-white/10" />}

                <div className="flex gap-3 mt-3">
                  <button type="submit" disabled={submitting} className={`px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition duration-150 ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}>
                    {submitting ? "Submitting..." : "Submit & Finish"}
                  </button>
                  <button type="button" onClick={() => { setPaymentOpen(false); setProofFile(null); setProofPreview(""); }} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white transition duration-150">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* helper footer */}
      <div className="max-w-4xl mx-auto mt-10 text-center text-slate-300">
        <p>Questions? Email <a href="mailto:berryraytechnologies@gmail.com" className="text-blue-300 underline">berryraytechnologies@gmail.com</a></p>
      </div>
    </div>
  );
}