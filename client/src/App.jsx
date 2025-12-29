import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Portfolio from "./pages/Portfolio";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact"; 

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard"; // Changed from Admin/AdminDashboard

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-900 text-slate-100 transition-colors duration-300">
                <Navbar />
                <main className="pt-20">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/services/*" element={<Services />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/courses/:id" element={<CourseDetail />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/shop/:id" element={<ProductDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        
                        {/* Admin Login Route (Publicly accessible) */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        
                        {/* Protected Admin Route */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Optional: Add a catch-all route for 404 */}
                        <Route path="*" element={
                            <div className="text-center py-20">
                                <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
                                <p className="text-slate-400">The page you're looking for doesn't exist.</p>
                            </div>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}