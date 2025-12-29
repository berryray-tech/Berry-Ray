import React from "react";
import { useParams } from "react-router-dom";

export default function CourseDetail() {
  const { id } = useParams();
  return (
    <section className="container py-12">
      <h2 className="text-2xl font-bold">Course - {id}</h2>
      <p className="mt-3 text-slate-300">Detailed course page (replace with real data fetched from your backend).</p>
    </section>
  );
}
