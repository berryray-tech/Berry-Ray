import React, { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("berryraytechnologies@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in and is an admin
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Found existing session, user:", session.user.email);
          
          // Check if user is in admins table
          const { data: admin, error: adminError } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (adminError) {
            console.log("Not an admin or error checking:", adminError.message);
            await supabase.auth.signOut();
          } else if (admin) {
            console.log("User is admin, redirecting to dashboard");
            navigate("/admin/dashboard");
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Attempting login with:", email);
      
      // Step 1: Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        
        // Provide user-friendly error messages
        if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please check your email to verify your account first.");
        } else {
          setError(`Login failed: ${authError.message}`);
        }
        setLoading(false);
        return;
      }

      console.log("Login successful, user ID:", authData.user.id);
      
      // Step 2: Check if user exists in admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      console.log("Admin check result:", { adminData, adminError });

      if (adminError) {
        if (adminError.code === 'PGRST116') {
          // No admin record found
          console.error("User not found in admins table");
          setError("Access denied. You are not authorized as an administrator.");
          await supabase.auth.signOut();
        } else {
          console.error("Error checking admin status:", adminError);
          setError("Error checking administrator privileges.");
        }
        setLoading(false);
        return;
      }

      if (!adminData) {
        console.error("No admin data returned");
        setError("Access denied. Administrator account not found.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      console.log("Admin access granted, redirecting to dashboard");
      
      // Step 3: Successful login - redirect to dashboard
      navigate("/admin/dashboard");
      
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-100">Admin Login</h2>
        
        <div className="mb-4">
          <label className="block text-slate-300 mb-2 text-sm font-medium">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-slate-700 text-slate-100 border border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-slate-300 mb-2 text-sm font-medium">Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-slate-700 text-slate-100 border border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || checkingSession}
          className="w-full p-3 bg-indigo-600 rounded hover:bg-indigo-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : "Log In"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Open browser console (F12) for debugging info
          </p>
        </div>
      </form>
    </div>
  );
}