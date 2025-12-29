import React from "react";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  return (
    <section className="container py-12">
      <h2 className="text-2xl font-bold">Product {id}</h2>
      <p className="text-slate-300 mt-2">Product details (replace with real backend data).</p>
    </section>
  );
}
