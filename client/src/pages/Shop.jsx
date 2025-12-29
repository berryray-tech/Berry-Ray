import React from "react";
import { Link } from "react-router-dom";

const products = [
  { id: "p1", title: "Math Workbook", price: 1200 },
  { id: "p2", title: "Physics Notes", price: 1500 },
  { id: "p3", title: "Calculator", price: 5500 },
  { id: "p4", title: "Study Lamp", price: 4200 }
];

export default function Shop() {
  return (
    <section className="container py-12">
      <h2 className="text-2xl font-bold">Shopping Mall</h2>
      <p className="text-slate-300 mt-2">Buy study materials and gadgets from sellers.</p>

      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="glass p-4">
            <div className="h-36 bg-slate-800 rounded flex items-center justify-center text-slate-400">Image</div>
            <h4 className="mt-3 font-semibold">{p.title}</h4>
            <p className="mt-1">₦{p.price.toLocaleString()}</p>
            <div className="mt-3 flex justify-between items-center">
              <Link to={`/shop/${p.id}`} className="text-blue-300 text-sm">View</Link>
              <button className="btn-accent text-sm">Buy</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
