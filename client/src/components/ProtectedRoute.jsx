import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }

        // Check if user is in admins table
        const { data: admin, error } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error || !admin) {
          console.log("User is not an admin:", error?.message || "No admin record");
          setIsAuthenticated(true); // User is authenticated but not admin
          setIsAdmin(false);
        } else {
          setIsAuthenticated(true);
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          setIsAuthenticated(false);
          setIsAdmin(false);
        } else {
          // Re-check admin status when auth changes
          const { data: admin } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          setIsAuthenticated(true);
          setIsAdmin(!!admin);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-300">Checking administrative access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-6">You are not authorized to view this page.</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // If authenticated AND admin, render the children
  return children;
};

export default ProtectedRoute;