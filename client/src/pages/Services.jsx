// src/pages/Services.jsx
import React, { useState, useEffect, useRef } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
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
  
  // Refs for scrolling
  const packagesModalRef = useRef(null);
  const formModalRef = useRef(null);
  const paymentModalRef = useRef(null);
  
  // Default Bank Info
  const DEFAULT_BANK = {
    accountName: "Chinonso O Osuji-lco",
    accountNumber: "9635952887",
    bankName: "Providus Bank",
  };
  
  /* -------------------------
      DATA FETCHING HOOK
      ------------------------- */
  useEffect(() => {
    async function fetchServices() {
      setLoadingServices(true);
      
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
        `)
        .order('id', { ascending: true });

      if (error) {
        console.error("Error fetching services:", error);
      } else {
        setServices(data || []);
      }
      setLoadingServices(false);
    }
    fetchServices();
  }, []);

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
    // Reset form data
    setRegData({ name: "", email: "", phone: "", additionalInfo: "" });
  };

  const onProofChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    // Validate file size (max 5MB)
    if (f.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      e.target.value = ""; // Clear the file input
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(f.type)) {
      alert("Please upload an image file (JPEG, PNG, WEBP, GIF)");
      e.target.value = ""; // Clear the file input
      return;
    }
    
    setProofFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setProofPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email) {
      alert("Please enter your name and email.");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    
    // Phone validation (if provided)
    if (regData.phone && !/^[\d\s\-\+]+$/.test(regData.phone)) {
      alert("Please enter a valid phone number.");
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
      alert("Please upload proof of payment.");
      return;
    }

    setSubmitting(true);
    let proofUrl = null;
    let finalError = null;

    try {
      // 1. UPLOAD PAYMENT PROOF TO SUPABASE STORAGE
      const fileExtension = proofFile.name.split('.').pop();
      const fileName = `${selectedService.id}-${selectedPackage.id}-${Date.now()}.${fileExtension}`;
      
      const BUCKET_NAME = 'payment-proofs';
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, proofFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        finalError = `File upload failed: ${uploadError.message}`;
        throw new Error(finalError);
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path);
      
      proofUrl = publicUrlData.publicUrl;
      
      // Clean price string
      const cleanedPrice = parseFloat(
        String(selectedPackage.price).replace(/[^\d.]/g, '')
      );
      
      if (isNaN(cleanedPrice)) {
        finalError = "Price data is corrupted or missing.";
        throw new Error(finalError);
      }
      
      // 2. INSERT REGISTRATION DATA
      const { error: dbError } = await supabase.from('service_registrations').insert({
        full_name: regData.name,
        email: regData.email,
        phone: regData.phone || null,
        additional_info: regData.additionalInfo || null,
        service_id: selectedService.id,
        service_title: selectedService.title,
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        package_price: cleanedPrice,
        payment_proof_url: proofUrl,
        status: 'pending',
      });

      if (dbError) {
        console.error("Supabase DB Insert Error:", dbError);
        finalError = `Database insert failed: ${dbError.message}`;
        throw new Error(finalError);
      }

      // 3. SUCCESS
      alert("✅ Registration submitted successfully! We will verify your payment and contact you soon.");
      
    } catch (err) {
      console.error("Submission failed:", finalError || err.message);
      alert(`❌ Submission failed. Please try again or contact support. Error: ${finalError || err.message}`);
      
    } finally {
      setSubmitting(false);
      closeAllModals();
    }
  };

  /* -------------------------
      MOBILE-SPECIFIC FUNCTIONS
      ------------------------- */
  const openMobilePackage = (pkg, service, ev) => {
    if (ev) ev.stopPropagation();
    setSelectedService(service);
    setSelectedPackage(pkg);
    setFormOpen(true);
  };

  /* -------------------------
      RENDER LOADING & ERROR STATES
      ------------------------- */
  if (loadingServices) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#071029] to-[#0a1530]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-white">Loading services...</p>
      </div>
    );
  }

  if (services.length === 0 && !loadingServices) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#071029] to-[#0a1530]">
        <div className="text-center max-w-lg p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-white mb-3">No Services Found</h2>
          <p className="text-slate-300 mb-4">
            Please ensure your Supabase tables <strong>services</strong> and <strong>service_packages</strong> exist.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-b from-[#071029] to-[#0a1530]">
      {/* Inline CSS for better mobile control */}
      <style jsx>{`
        /* Custom styles for better mobile experience */
        .service-container {
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
        
        /* Fix for iOS Safari scrolling */
        .modal-scroll-container {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        
        /* Prevent body scroll when modal is open */
        body.modal-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
        
        /* Better scrollbar for all browsers */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.5) rgba(30, 41, 59, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }
        
        /* Touch-friendly sizing */
        @media (max-width: 768px) {
          .touch-min-height {
            min-height: 44px;
          }
          
          .touch-min-width {
            min-width: 44px;
          }
          
          .mobile-safe-padding {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
        
        /* Modal backdrop fix */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        
        /* Modal content with max height for scrolling */
        .modal-content-container {
          max-height: 85vh;
          width: 100%;
          max-width: 600px;
          background: rgba(10, 21, 48, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border-radius: 12px;
          overflow: hidden;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-12 service-container">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-3">Services — BerryRay</h1>
        <p className="text-center text-slate-300 max-w-2xl mx-auto px-4">
          Choose from our professional services. Each service offers multiple packages to fit your needs.
        </p>
      </div>

      {/* Desktop Grid View */}
      <div className="max-w-7xl mx-auto hidden md:grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, idx) => (
          <motion.article
            key={s.id}
            layout
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-xl cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col"
            onClick={() => toggleExpand(idx)}
          >
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">{s.title}</h3>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                  {s.packages?.length || 0} packages
                </span>
              </div>
              
              <p className="text-gray-200 mb-4">{s.summary}</p>
            </div>

            <div className="flex gap-3 mt-auto">
              <button
                onClick={(ev) => openPackages(s, ev)}
                className="touch-min-height flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-150 font-medium"
              >
                Start Registration
              </button>

              <button
                onClick={(ev) => { ev.stopPropagation(); toggleExpand(idx); }}
                className="touch-min-height touch-min-width px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-150"
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
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-gray-200 border-t border-white/10 pt-4"
                >
                  <p className="mb-4">{s.description}</p>

                  <div className="mt-4">
                    <h4 className="font-semibold text-white mb-3">Available Packages</h4>
                    <div className="space-y-3 custom-scrollbar max-h-[300px] overflow-y-auto pr-2">
                      {s.packages && s.packages.map((pkg) => (
                        <div key={pkg.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition duration-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-white">{pkg.name}</div>
                              <div className="text-sm text-slate-300 mt-1">{pkg.desc}</div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-bold text-lg text-blue-200 whitespace-nowrap">
                                {pkg.priceLabel || `₦${pkg.price}`}
                              </div>
                              <button
                                onClick={(ev) => { ev.stopPropagation(); setSelectedService(s); choosePackage(pkg); }}
                                className="touch-min-height mt-3 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm transition duration-150 whitespace-nowrap"
                              >
                                Select Package
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

      {/* Mobile Accordion View */}
      <div className="max-w-2xl mx-auto md:hidden space-y-4 service-container">
        {services.map((s, idx) => (
          <div key={s.id} className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(idx)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                    {s.packages?.length || 0}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{s.summary}</p>
              </div>
              <span className={`text-lg ml-2 transition-transform duration-300 ${expandedIndex === idx ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
            
            <AnimatePresence>
              {expandedIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <p className="text-slate-300 mb-4 text-sm">{s.description}</p>
                  
                  <div className="space-y-3 mb-4 custom-scrollbar max-h-[300px] overflow-y-auto pr-2">
                    {s.packages && s.packages.map((pkg) => (
                      <div key={pkg.id} className="p-3 rounded-lg bg-white/5">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 mr-3">
                            <div className="font-semibold text-white text-sm">{pkg.name}</div>
                            <div className="text-xs text-slate-300 mt-1">{pkg.desc}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-200 text-sm">{pkg.priceLabel || `₦${pkg.price}`}</div>
                            <button
                              onClick={(ev) => openMobilePackage(pkg, s, ev)}
                              className="touch-min-height mt-2 px-3 py-1.5 text-xs rounded-lg bg-green-600 hover:bg-green-700 text-white transition duration-150"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={(ev) => openPackages(s, ev)}
                    className="w-full touch-min-height py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-150 font-medium text-sm"
                  >
                    View All Packages
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* ---------------- MODALS ---------------- */}
      
      {/* Packages Modal */}
      <AnimatePresence>
        {packagesOpen && selectedService && (
          <div className="modal-backdrop" onClick={closeAllModals}>
            <motion.div
              className="modal-content-container"
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              ref={packagesModalRef}
            >
              <div className="p-4 md:p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Packages — {selectedService.title}</h2>
                    <p className="text-slate-300 mt-1 text-sm">{selectedService.summary}</p>
                  </div>
                  <button 
                    onClick={closeAllModals}
                    className="touch-min-height touch-min-width text-slate-300 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-6 modal-scroll-container custom-scrollbar overflow-y-auto max-h-[50vh]">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {selectedService.packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition duration-200">
                      <div className="text-lg font-semibold text-white mb-2">{pkg.name}</div>
                      <div className="text-2xl font-bold text-blue-200 mb-3">{pkg.priceLabel || `₦${pkg.price}`}</div>
                      <p className="text-sm text-slate-200 mb-4">{pkg.desc}</p>
                      <button
                        onClick={() => choosePackage(pkg)}
                        className="w-full touch-min-height py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-150"
                      >
                        Choose Package
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Registration Form Modal */}
      <AnimatePresence>
        {formOpen && selectedPackage && (
          <div className="modal-backdrop" onClick={closeAllModals}>
            <motion.div
              className="modal-content-container"
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              ref={formModalRef}
            >
              <div className="p-4 md:p-6 border-b border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white">Registration Form</h2>
                    <div className="text-sm text-slate-300 mt-1">
                      <span className="font-medium">{selectedPackage.name}</span>
                    </div>
                    <div className="text-lg font-bold text-blue-200 mt-2">
                      {selectedPackage.priceLabel || `₦${selectedPackage.price}`}
                    </div>
                  </div>
                  <button 
                    onClick={closeAllModals}
                    className="touch-min-height touch-min-width text-slate-300 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={onFormSubmit} className="p-4 md:p-6 space-y-4 modal-scroll-container custom-scrollbar overflow-y-auto max-h-[50vh]">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="email"
                    placeholder="email@example.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone (WhatsApp)</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+234 800 000 0000"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Additional Information</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    placeholder="Any special requirements or notes..."
                    value={regData.additionalInfo}
                    onChange={(e) => setRegData({ ...regData, additionalInfo: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    className="flex-1 touch-min-height py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-150 font-medium"
                  >
                    Proceed to Payment
                  </button>
                  <button 
                    type="button" 
                    onClick={closeAllModals}
                    className="flex-1 touch-min-height py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentOpen && selectedPackage && (
          <div className="modal-backdrop" onClick={closeAllModals}>
            <motion.div
              className="modal-content-container"
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              ref={paymentModalRef}
            >
              <div className="p-4 md:p-6 border-b border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white">Complete Payment</h2>
                    <p className="text-slate-300 mt-1">Package: <span className="font-medium text-white">{selectedPackage.name}</span></p>
                    <p className="text-lg font-bold text-blue-200 mt-1">{selectedPackage.priceLabel || `₦${selectedPackage.price}`}</p>
                  </div>
                  <button 
                    onClick={closeAllModals}
                    className="touch-min-height touch-min-width text-slate-300 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-6 modal-scroll-container custom-scrollbar overflow-y-auto max-h-[60vh]">
                <div className="bg-white/5 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-white mb-3">Bank Transfer Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-slate-300">Account Name: Chinonso O Osuji-lco</span>
                      <span className="text-blue-200 font-medium">{DEFAULT_BANK.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-slate-300">Account Number:9635952887</span>
                      <span className="text-blue-200 font-medium">{DEFAULT_BANK.accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-300">Bank:PROVIDUS BANK</span>
                      <span className="text-blue-200 font-medium">{DEFAULT_BANK.bankName}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-4 p-3 bg-blue-900/20 rounded">
                    📍 <strong>Important:</strong> Transfer the exact amount and upload proof below.
                  </p>
                </div>

                <form onSubmit={onPaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Upload Payment Proof (Image) *
                    </label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={onProofChange} 
                      required 
                      className="w-full text-white text-sm p-3 rounded-lg bg-white/10 border border-white/15"
                    />
                    <p className="text-xs text-slate-400 mt-1">Max 5MB • JPEG, PNG, WEBP, GIF</p>
                    
                    {proofPreview && (
                      <div className="mt-3">
                        <p className="text-sm text-slate-300 mb-2">Preview:</p>
                        <img 
                          src={proofPreview} 
                          alt="Payment proof preview" 
                          className="w-full max-h-[200px] object-contain rounded-lg border border-white/10"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className={`flex-1 touch-min-height py-3 rounded-lg text-white transition duration-150 font-medium ${
                        submitting 
                          ? "bg-green-700 opacity-70 cursor-not-allowed" 
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Processing...
                        </span>
                      ) : "Submit Registration"}
                    </button>
                    <button 
                      type="button" 
                      onClick={closeAllModals}
                      className="flex-1 touch-min-height py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-150"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-white/10 text-center mobile-safe-padding">
        <p className="text-slate-300 mb-4">
          Need assistance? Contact us:
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <a 
            href="mailto:berraynia@gmail.com" 
            className="touch-min-height px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-150"
          >
            📧 berraynia@gmail.com
          </a>
          <a 
            href="tel:+2347018504718" 
            className="touch-min-height px-6 py-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 transition duration-150"
          >
            📞 +234 701 850 4718
          </a>
        </div>
        <p className="text-sm text-slate-400 mt-6">
          All registrations are processed securely. You'll receive a confirmation email within 24 hours.
        </p>
      </div>
    </div>
  );
}