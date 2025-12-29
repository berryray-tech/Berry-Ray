import React from "react";

export default function Portfolio() {
  return (
    <section className="container py-12 px-4 md:px-0 mx-auto">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Profile Card */}
        <div className="glass p-6 text-center rounded-xl shadow-lg">
          <div className="w-36 h-36 mx-auto rounded-full bg-slate-700 overflow-hidden border-4 border-slate-600">
            {/* Updated Image Path */}
            <img 
              src="/images/IMG.jpg" 
              alt="Osuji Chinonso Charles" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x400/374151/ffffff?text=Profile+Image";
              }}
            />
          </div>
          <h3 className="mt-4 font-semibold text-xl">Osuji Chinonso Charles</h3>
          <p className="text-sm text-slate-300 mt-2 px-2">
            Front-end dev • Malware Analyst • Virtual Assistant • Offensive/Defensive Pentester
          </p>
          
          {/* Fixed CV Download Link */}
          <a 
            href="/Osuji_Chinonso_Charles_CV.pdf" 
            download="Osuji_Chinonso_Charles_CV.pdf"
            className="btn-accent inline-block mt-6 px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all duration-300"
          >
            Download CV
          </a>
          
          {/* Social Links (Optional) */}
          <div className="mt-6 flex justify-center space-x-4">
            <a href="#" className="text-slate-400 hover:text-white">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-white">
              <i className="fab fa-github text-xl"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-white">
              <i className="fab fa-twitter text-xl"></i>
            </a>
          </div>
        </div>

        {/* Bio Section */}
        <div className="md:col-span-2 glass p-6 rounded-xl shadow-lg">
          <h3 className="font-semibold text-2xl mb-6 pb-3 border-b border-slate-700">Bio</h3>
          <div className="text-slate-300 space-y-4">
            <p>
              <strong>Osuji Chinonso Charles</strong> is a multi-skilled technology professional, 
              digital creator, and cybersecurity specialist dedicated to empowering students, 
              youths, and small businesses through innovative tech solutions. He is the founder 
              of BerryRay Technologies, a fast-growing Start-up company offering digital services, 
              university registrations, tech support, cybersecurity assistance, and youth mentorship.
            </p>
            
            <p>
              Charles holds a <strong>Degree in Cybersecurity from Lincoln University College</strong> 
              and a <strong>Diploma in Software Engineering from Lincoln College of Science, 
              Management, and Technology.</strong> He is <strong>certified by Cisco</strong> in 
              <strong> Endpoint Security</strong> and <strong>Malware Analysis</strong> and 
              <strong> certified by ALX</strong> in <strong>Virtual Assistance.</strong>
            </p>
            
            <p>
              A passionate tech educator, he volunteers regularly to teach children and youths 
              web development, helping them build confidence, digital literacy, and future-ready skills.
            </p>
            
            <div className="bg-slate-800/50 p-4 rounded-lg my-4">
              <strong>Charles is also the creator of two educational digital tools:</strong><br/><br/>
              
              <strong className="text-blue-400">K Asha Editor</strong> — a mobile-friendly code editor 
              designed for students without laptops.<br/><br/>
              
              <strong className="text-blue-400">K Asha Hall of Wisdom</strong> — a curated e-library 
              that provides students with study materials tailored to their course of study.
            </div>
            
            <p>
              <strong>Through BerryRay Technologies, he provides services in:</strong>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4 my-4">
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>POST-UTME registrations (basic to premium packages)</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>University inquiries & on-site registrations</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Matriculation attendance & acting as guardians for students</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Smartphone tracking support</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>CCTV & surveillance setup</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Software and web development</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>UI/UX design & graphics design</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Online registrations</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Virtual assistance and administrative support</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Digital content creation</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Student mentorship and academic guidance</span>
              </div>
            </div>
            
            <p>
              With a versatile blend of technical expertise, creativity, and community-driven 
              leadership, Charles aims to build accessible tech solutions that bridge educational 
              gaps, support families, and drive digital transformation across Nigeria and beyond.
            </p>
            
            <div className="bg-slate-800/50 p-4 rounded-lg my-4">
              <strong className="text-xl">⭐ Key Skills & Competencies</strong>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>Cybersecurity (Endpoint Security, Malware Analysis)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>Smartphone Tracking & Device Recovery Support</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>CCTV Surveillance & System Installation</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>Front-End Development (HTML, CSS, JavaScript)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>UI/UX Design (Wireframing, Prototyping)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>Graphics Design (Photoshop, Illustrator, Canva)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>Virtual Assistance (Admin Support, Project Management)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>Digital Content & Resource Development</span>
                </div>
              </div>
            </div>
            
            <div className="my-6">
              <strong className="text-xl">📜 Certifications</strong>
              <div className="space-y-3 mt-3">
                <div className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span><strong>Cisco Certified:</strong> Endpoint Security & Malware Analysis</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span><strong>ALX Certified:</strong> Virtual Assistance</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span><strong>Diploma:</strong> Software Engineering</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span><strong>Degree:</strong> Cybersecurity (Hons), Lincoln University College</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <strong className="text-xl">🎯 Current Roles</strong>
              <div className="space-y-3 mt-3">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <span><strong>Founder, BerryRay Technologies</strong></span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <span><strong>Co-Founder, CyberRant (Tech Startup)</strong></span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <span><strong>Tech Educator & Youth Mentor</strong></span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <span><strong>Registration Manager & Digital Services Consultant</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <h4 className="mt-8 font-semibold text-xl mb-4 pb-3 border-b border-slate-700">Projects</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-5 rounded-lg hover:bg-slate-800 transition-all duration-300">
              <h5 className="font-semibold text-lg text-blue-400 mb-2">K Asha Editor</h5>
              <p className="text-slate-300 text-sm">
                A mobile-friendly code editor designed specifically for students without laptops, 
                enabling them to practice coding on their smartphones.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">HTML/CSS</span>
                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">JavaScript</span>
                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">Mobile-first</span>
              </div>
            </div>
            <div className="bg-slate-800/50 p-5 rounded-lg hover:bg-slate-800 transition-all duration-300">
              <h5 className="font-semibold text-lg text-blue-400 mb-2">K Asha Hall of Wisdom</h5>
              <p className="text-slate-300 text-sm">
                A curated e-library platform that provides students with study materials 
                and resources tailored to their specific courses of study.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">E-Library</span>
                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">Education</span>
                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">Resource Management</span>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h5 className="font-semibold text-lg mb-3">Contact Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="text-blue-400 mr-3">📧</span>
                <span className="text-slate-300">your.email@example.com</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-3">📱</span>
                <span className="text-slate-300">+234 XXX XXX XXXX</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-3">📍</span>
                <span className="text-slate-300">Nigeria</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-3">🔗</span>
                <a href="#" className="text-slate-300 hover:text-blue-400">LinkedIn Profile</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}