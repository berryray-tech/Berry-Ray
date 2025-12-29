import React, { useState } from "react";
import { motion } from "framer-motion";

export default function RegisterModal({ open, onClose, onRegistered }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass max-w-md w-full p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Register</h3>
          <button onClick={onClose} className="text-slate-400">Close</button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); onRegistered?.(form); onClose(); }}>
          <input required placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input w-full" />
          <input required placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input w-full" />
          <input required placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input w-full" />
          <div className="flex justify-end">
            <button type="submit" className="btn-accent">Continue to Payment</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
