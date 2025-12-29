import React, { useState } from "react";
import PaymentModal from "../components/PaymentModal";
import { Link } from "react-router-dom";

const demoCourses = [
  { id: "c1", title: "Frontend Bootcamp", price: 15000, duration: "8 weeks", desc: "HTML, CSS, JS, React." },
  { id: "c2", title: "Cybersecurity 101", price: 18000, duration: "6 weeks", desc: "Endpoint security basics." },
  { id: "c3", title: "UI/UX Fundamentals", price: 12000, duration: "5 weeks", desc: "Design thinking & prototyping." },
  { id: "c4", title: "Backend Essentials", price: 20000, duration: "8 weeks", desc: "Node, Express, DB." },
  { id: "c5", title: "Mobile Web", price: 14000, duration: "6 weeks", desc: "Responsive & PWA basics." },
  { id: "c6", title: "Data Structures", price: 16000, duration: "6 weeks", desc: "DSA fundamentals." },
  { id: "c7", title: "DevOps Intro", price: 17000, duration: "5 weeks", desc: "CI/CD & containers." },
  { id: "c8", title: "Python for Beginners", price: 10000, duration: "4 weeks", desc: "Python basics." },
  { id: "c9", title: "SQL & Databases", price: 11000, duration: "4 weeks", desc: "Relational DB basics." },
  { id: "c10", title: "Interview Prep", price: 9000, duration: "3 weeks", desc: "Problem solving & soft skills." },
];

export default function Courses() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="container py-12">
      <h2 className="text-2xl font-bold">Courses</h2>
      <p className="text-slate-300 mt-2">Click any course to view details and enroll.</p>

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoCourses.map((c) => (
          <article key={c.id} className="glass p-5 cursor-pointer hover:scale-102 transition" onClick={() => setSelected(c)}>
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-slate-300 mt-1">{c.desc}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="font-semibold">₦{c.price.toLocaleString()}</span>
              <span className="text-xs text-slate-400">{c.duration}</span>
            </div>
            <div className="mt-3">
              <Link to={`/courses/${c.id}`} className="text-sm text-blue-300">See more</Link>
            </div>
          </article>
        ))}
      </div>

      <PaymentModal open={!!selected} course={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
