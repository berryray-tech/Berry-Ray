import React, { useState } from "react";
import { motion } from "framer-motion";
import { registerSeller } from "../services/api.js";

export default function SellerRegister({ onClose, onRegistered }) {
  const [form, setForm] = useState({ name: "", shopName: "", email: "", phone: "", bankName: "", accountNumber: "", accountName: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerSeller(form);
      if (res?.error) throw new Error(res.error || "Failed");
      alert("Seller registered");
      onRegistered && onRegistered();
    } catch (err) {
      alert(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.form initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={submit} className="relative z-10 w-full max-w-xl glass-modal p-6 rounded">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Register as Seller</h3>
          <button type="button" onClick={onClose} className="text-slate-300">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <input name="name" placeholder="Full name" value={form.name} onChange={change} className="input" required />
          <input name="shopName" placeholder="Shop name" value={form.shopName} onChange={change} className="input" required />
          <input name="email" placeholder="Email" value={form.email} onChange={change} className="input" required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={change} className="input" required />
          <input name="bankName" placeholder="Bank name" value={form.bankName} onChange={change} className="input" required />
          <input name="accountNumber" placeholder="Account number" value={form.accountNumber} onChange={change} className="input" required />
          <input name="accountName" placeholder="Account name" value={form.accountName} onChange={change} className="input" required />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-primary bg-transparent">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving..." : "Register"}</button>
        </div>
      </motion.form>
    </div>
  );
}
