import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PaymentModal({ open, onClose, course }) {
  const [filePreview, setFilePreview] = useState(null);
  const bank = {
    name: "Zenith Bank",
    accountName: "Osuji Chinonso Charles",
    accountNumber: "1234567890",
  };

  if (!open) return null;

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return setFilePreview(null);
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result);
    reader.readAsDataURL(f);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass max-w-xl w-full p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">Confirm Payment - {course?.title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">Close</button>
        </div>

        <div className="mt-4">
          <h4 className="text-sm text-slate-300">Bank details</h4>
          <div className="mt-2 bg-slate-800 p-3 rounded">
            <p><strong>Bank:</strong> {bank.name}</p>
            <p><strong>Account name:</strong> {bank.accountName}</p>
            <p><strong>Account number:</strong> {bank.accountNumber}</p>
          </div>

          <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Payment proof submitted (demo)."); onClose(); }}>
            <div>
              <label className="block text-sm mb-1">Upload proof of payment</label>
              <input type="file" accept="image/*,application/pdf" onChange={handleFile} />
            </div>

            {filePreview && (
              <div className="mt-2">
                <p className="text-sm">Preview:</p>
                <img src={filePreview} alt="preview" className="max-h-40 mt-1 rounded" />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-slate-700">Cancel</button>
              <button type="submit" className="btn-accent">Submit Proof</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
