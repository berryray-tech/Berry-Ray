import React from "react";

export default function Portfolio() {
  return (
    <section className="container py-12">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="glass p-6 text-center">
          <div className="w-36 h-36 mx-auto rounded-full bg-slate-700 overflow-hidden">
            {/* placeholder, replace with your image path */}
            <img src="/src/assets/profile.jpg/IMG.jpg" alt="profile" className="w-full h-full object-cover" />
          </div>
          <h3 className="mt-4 font-semibold">Osuji Chinonso Charles</h3>
          <p className="text-sm text-slate-300">Front-end dev • Malware Analyst • Virtual Assistant • Offensive/Defensive Pentester</p>
          <a href="/public/Osuji Chinonso Charles cv.pdf" className="btn-accent inline-block mt-4">Download CV</a>
        </div>

        <div className="md:col-span-2 glass p-6">
          <h3 className="font-semibold">Bio</h3>
          <p className="text-slate-300 mt-2"><strong>Osuji Chinonso Charles</strong> is a multi-skilled technology professional, digital creator, and cybersecurity specialist dedicated to empowering students, youths, and small businesses through innovative tech solutions. He is the founder of BerryRay Technologies, a fast-growing Start-up company offering digital services, university registrations, tech support, cybersecurity assistance, and youth mentorship.

Charles holds a <strong>Degree in Cybersecurity from Lincoln University College</strong> and a <strong>Diploma in Software Engineering from Lincoln College of Science, Management, and Technology.</strong> He is <strong>certified by Cisco</strong> in <strong>Endpoint Security</strong> and <strong>Malware Analysis</strong> and <strong>certified by ALX</strong> in <strong>Virtual Assistance.</strong>

A passionate tech educator, he volunteers regularly to teach children and youths web development, helping them build confidence, digital literacy, and future-ready skills.<br></br>

<strong>Charles is also the creator of two educational digital tools:</strong><br></br>

<strong>K Asha Editor</strong> — a mobile-friendly code editor designed for students without laptops.

<strong>K Asha Hall of Wisdom</strong> — a curated e-library that provides students with study materials tailored to their course of study.<br></br>

<strong>Through BerryRay Technologies, he provides services in:</strong><br></br>

POST-UTME registrations (basic to premium packages)<br></br>

University inquiries & on-site registrations<br></br>

Matriculation attendance & acting as guardians for students<br></br>

Smartphone tracking support<br></br>

CCTV & surveillance setup<br></br>

Software and web development<br></br>

UI/UX design & graphics design<br></br>

Online registrations<br></br>

Virtual assistance and administrative support<br></br>

Digital content creation<br></br>

Student mentorship and academic guidance<br></br>

With a versatile blend of technical expertise, creativity, and community-driven leadership, Charles aims to build accessible tech solutions that bridge educational gaps, support families, and drive digital transformation across Nigeria and beyond.<br></br>

<strong>⭐ Key Skills & Competencies Includes</strong><br></br>

Cybersecurity (Endpoint Security, Malware Analysis)<br></br>

Smartphone Tracking & Device Recovery Support<br></br>

CCTV Surveillance & System Installation<br></br>

Front-End Development (HTML, CSS, JavaScript)<br></br>

UI/UX Design (Wireframing, Prototyping, User-Centric Design)<br></br>

Graphics Design (Photoshop, Illustrator, Canva, CorelDraw)<br></br>

Virtual Assistance (Admin Support, Project Management)<br></br>

Digital Content & Resource Development<br></br>

Website Maintenance<br></br>

Problem-Solving & Critical Thinking<br></br>

<strong>📜 Certifications</strong><br></br>

<strong>Cisco Certified:</strong> Endpoint Security & Malware Analysis<br></br>

<strong>ALX Certified:</strong> Virtual Assistance<br></br>

<strong>Diploma:</strong> Software Engineering<br></br>

<strong>Degree:</strong> Cybersecurity(Hons), Lincoln University College Keffi, Nigeria<br></br>

Other foundational certifications in digital tools, tech operations, and cybersecurity essentials.<br></br>

<strong>🎯 Current Roles</strong><br></br>

<strong>Founder, BerryRay Technologies</strong><br></br>

<strong>Co-Founder, CyberRant (Tech Startup)</strong><br></br>

<strong>Tech Educator & Youth Mentor</strong><br></br>
<strong>Registration Manager & Digital Services Consultant</strong></p>

          <h4 className="mt-6 font-semibold">Projects</h4>
          <ul className="list-disc ml-5 mt-2 text-slate-300">
            <li>K Asha Editor — code editor for students</li>
            <li>K Asha Hall of Wisdom — e-library</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
