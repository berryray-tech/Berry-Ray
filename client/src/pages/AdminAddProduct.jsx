import React, { useEffect, useState } from "react";
import { fetchSellers, addProduct } from "../services/api.js";

export default function AdminAddProduct() {
  const [sellers, setSellers] = useState([]);
  const [form, setForm] = useState({ sellerId: "", title: "", description: "", price: "" });
  const [file, setFile] = useState(null);

  useEffect(() => { fetchSellers().then(setSellers).catch(console.error); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.sellerId) return alert("Select seller");
    const fd = new FormData();
    fd.append("sellerId", form.sellerId);
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("price", form.price);
    if (file) fd.append("image", file);

    try {
      const res = await addProduct(fd);
      if (res?.error) throw new Error(res.error || "Add failed");
      alert("Product added");
      setForm({ sellerId: "", title: "", description: "", price: "" });
      setFile(null);
    } catch (err) {
      alert(err.message || "Error");
    }
  };

  return (
    <div className="container main-pt py-8">
      <h2 className="text-2xl font-bold mb-4">Admin — Add Product</h2>
      <form onSubmit={submit} className="glass-card p-6 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select required className="input" value={form.sellerId} onChange={e => setForm({ ...form, sellerId: e.target.value })}>
            <option value="">Select seller</option>
            {sellers.map(s => <option key={s._id} value={s._id}>{s.shopName} — {s.email}</option>)}
          </select>
          <input className="input" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input className="input" placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          <input type="file" onChange={e => setFile(e.target.files[0])} className="input" />
          <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button type="submit" className="btn-primary">Add product</button>
        </div>
      </form>
    </div>
  );
}
