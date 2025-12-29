import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabaseClient";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  // News/Testimonies Data
  const [newsItems, setNewsItems] = useState([]);
  const [testimonies, setTestimonies] = useState([]);

  // Form Fields
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState("");

  const [testimonyName, setTestimonyName] = useState("");
  const [testimonyText, setTestimonyText] = useState("");
  const [testimonyLoading, setTestimonyLoading] = useState(false);
  const [testimonyError, setTestimonyError] = useState("");

  useEffect(() => {
    const checkAuthAndAdmin = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setAuthError("Authentication error. Please login again.");
          navigate("/admin/login");
          return;
        }

        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/admin/login");
          return;
        }

        setUser(session.user);
        console.log("User found:", session.user.id);

        // Check if user is in admins table
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        console.log("Admin check result:", { admin, adminError });

        if (adminError) {
          if (adminError.code === 'PGRST116') {
            // No admin record found
            console.error("User is not an admin");
            setAuthError("You are not authorized as an administrator.");
            await supabase.auth.signOut();
            navigate("/admin/login");
            return;
          }
          console.error("Admin query error:", adminError);
          setAuthError("Error checking admin status.");
          return;
        }

        if (!admin) {
          console.error("No admin data found");
          setAuthError("Administrator record not found.");
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        setAdminData(admin);
        
        // Load data if user is admin
        loadNews();
        loadTestimonies();
        
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthError("An unexpected error occurred.");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndAdmin();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed in dashboard:", event);
        if (!session && event === 'SIGNED_OUT') {
          navigate("/admin/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Debug function for testimonies table
  const debugTestimoniesTable = async () => {
    try {
      console.log("Debugging testimonies table...");
      
      // Try to insert a test record to see the exact error
      const { data, error } = await supabase
        .from('testimonies')
        .insert([{ 
          student_name: 'Test Student', 
          testimony: 'Test testimony',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error("Insert error details:", error);
        alert(`Error: ${error.message}\n\nCheck your table structure in Supabase.`);
        
        // Try alternative column names
        console.log("Trying alternative column names...");
        
        // Try with 'name' column
        const { error: error2 } = await supabase
          .from('testimonies')
          .insert([{ 
            name: 'Test Student', 
            content: 'Test testimony'
          }]);
        
        if (!error2) {
          alert("Success! Your table uses 'name' and 'content' columns.");
          return;
        }
        
        // Try with 'author' column
        const { error: error3 } = await supabase
          .from('testimonies')
          .insert([{ 
            author: 'Test Student', 
            message: 'Test testimony'
          }]);
        
        if (!error3) {
          alert("Success! Your table uses 'author' and 'message' columns.");
          return;
        }
      } else {
        console.log("Test insert successful!", data);
        alert("Test insert successful! Table structure is correct.");
      }
    } catch (err) {
      console.error("Debug error:", err);
      alert("Debug error: " + err.message);
    }
  };

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news_banners")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error loading news:", error);
        return;
      }
      setNewsItems(data || []);
    } catch (error) {
      console.error("Error loading news:", error);
    }
  };

  const loadTestimonies = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonies")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error loading testimonies:", error);
        return;
      }
      
      // Transform data to handle different column names
      const formattedTestimonies = data.map(item => ({
        id: item.id,
        student_name: item.student_name || item.name || item.author || "Anonymous",
        testimony: item.testimony || item.content || item.message || "",
        created_at: item.created_at || item.createdAt || new Date().toISOString()
      }));
      
      setTestimonies(formattedTestimonies);
    } catch (error) {
      console.error("Error loading testimonies:", error);
    }
  };

  const addNews = async () => {
    if (!newsTitle.trim() || !newsBody.trim()) {
      setNewsError("Please fill in all fields");
      return;
    }

    try {
      setNewsLoading(true);
      setNewsError("");

      const { error } = await supabase
        .from("news_banners")
        .insert([{ 
          title: newsTitle.trim(), 
          content: newsBody.trim(),
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error("Error saving news:", error);
        setNewsError(`Error: ${error.message}`);
        return;
      }

      // Clear form
      setNewsTitle("");
      setNewsBody("");
      
      // Reload news
      await loadNews();
      
    } catch (error) {
      console.error("Unexpected error:", error);
      setNewsError("An unexpected error occurred");
    } finally {
      setNewsLoading(false);
    }
  };

  const addTestimony = async () => {
    if (!testimonyName.trim() || !testimonyText.trim()) {
      setTestimonyError("Please fill in all fields");
      return;
    }

    try {
      setTestimonyLoading(true);
      setTestimonyError("");

      console.log("Attempting to insert testimony with:", {
        student_name: testimonyName.trim(),
        testimony: testimonyText.trim()
      });

      // First try with standard column names
      const { data, error } = await supabase
        .from("testimonies")
        .insert([{ 
          student_name: testimonyName.trim(), 
          testimony: testimonyText.trim(),
          created_at: new Date().toISOString()
        }])
        .select();

      console.log("Insert result:", { data, error });

      if (error) {
        console.error("Detailed error:", error);
        
        // Try alternative column names
        if (error.message.includes("student_name") || error.message.includes("testimony")) {
          console.log("Trying alternative column names...");
          
          // Try with 'name' and 'content' columns
          const { error: error2 } = await supabase
            .from("testimonies")
            .insert([{ 
              name: testimonyName.trim(), 
              content: testimonyText.trim(),
              created_at: new Date().toISOString()
            }]);
          
          if (!error2) {
            console.log("Success with 'name' and 'content' columns!");
            setTestimonyName("");
            setTestimonyText("");
            await loadTestimonies();
            return;
          }
          
          // Try with 'author' and 'message' columns
          const { error: error3 } = await supabase
            .from("testimonies")
            .insert([{ 
              author: testimonyName.trim(), 
              message: testimonyText.trim(),
              created_at: new Date().toISOString()
            }]);
          
          if (!error3) {
            console.log("Success with 'author' and 'message' columns!");
            setTestimonyName("");
            setTestimonyText("");
            await loadTestimonies();
            return;
          }
          
          // Try with just 'text' column
          const { error: error4 } = await supabase
            .from("testimonies")
            .insert([{ 
              text: testimonyText.trim(),
              created_at: new Date().toISOString()
            }]);
          
          if (!error4) {
            console.log("Success with 'text' column only!");
            setTestimonyName("");
            setTestimonyText("");
            await loadTestimonies();
            return;
          }
        }
        
        setTestimonyError(`Error: ${error.message}. Check table columns.`);
        return;
      }

      // Success with standard columns
      setTestimonyName("");
      setTestimonyText("");
      await loadTestimonies();
      
    } catch (error) {
      console.error("Unexpected error:", error);
      setTestimonyError("An unexpected error occurred");
    } finally {
      setTestimonyLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black-100">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-red-400 mb-4">{authError}</p>
          <button
            onClick={() => navigate("/admin/login")}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user || !adminData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black-100">
        <p className="text-center text-xl text-red-600">Access Denied. Please login as Admin.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6 bg-black-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Debug Info */}
      <div className="mb-6 p-4 bg-gray-800 rounded text-sm text-gray-300">
        <p>User ID: {user.id}</p>
        <p>Admin ID: {adminData.id}</p>
        <button 
          onClick={debugTestimoniesTable} 
          className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Debug Testimonies Table
        </button>
        <p className="mt-2 text-xs text-gray-400">Click this button if you're having issues adding testimonies</p>
      </div>

      {/* NEWS SECTION */}
      <div className="bg-black p-5 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-3 text-white">Add News Banner</h2>

        <input
          className="w-full p-2 border rounded mb-3 bg-gray-800 text-white border-gray-700"
          placeholder="News Title"
          value={newsTitle}
          onChange={(e) => setNewsTitle(e.target.value)}
          disabled={newsLoading}
        />

        <textarea
          className="w-full p-2 border rounded mb-3 bg-gray-800 text-white border-gray-700"
          placeholder="News Content"
          value={newsBody}
          onChange={(e) => setNewsBody(e.target.value)}
          rows="4"
          disabled={newsLoading}
        ></textarea>

        {newsError && (
          <div className="mb-3 p-2 bg-red-900/30 border border-red-700 rounded">
            <p className="text-red-400 text-sm">{newsError}</p>
          </div>
        )}

        <button
          onClick={addNews}
          disabled={newsLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {newsLoading ? "Adding News..." : "Add News"}
        </button>

        <h3 className="font-bold text-lg mt-6 mb-2 text-white">Existing News</h3>
        
        {newsItems.length === 0 ? (
          <p className="text-gray-400">No news added yet.</p>
        ) : (
          <div className="space-y-3">
            {newsItems.map((item) => (
              <div key={item.id} className="p-3 border rounded bg-gray-800 border-gray-700">
                <strong className="text-white block mb-1">{item.title}</strong>
                <p className="text-gray-300">{item.content}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TESTIMONIES SECTION */}
      <div className="bg-black p-5 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-3 text-white">Add Student Testimony</h2>

        <input
          className="w-full p-2 border rounded mb-3 bg-gray-800 text-white border-gray-700"
          placeholder="Student Name"
          value={testimonyName}
          onChange={(e) => setTestimonyName(e.target.value)}
          disabled={testimonyLoading}
        />

        <textarea
          className="w-full p-2 border rounded mb-3 bg-gray-800 text-white border-gray-700"
          placeholder="Testimony"
          value={testimonyText}
          onChange={(e) => setTestimonyText(e.target.value)}
          rows="4"
          disabled={testimonyLoading}
        ></textarea>

        {testimonyError && (
          <div className="mb-3 p-2 bg-red-900/30 border border-red-700 rounded">
            <p className="text-red-400 text-sm">{testimonyError}</p>
          </div>
        )}

        <button
          onClick={addTestimony}
          disabled={testimonyLoading}
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testimonyLoading ? "Adding Testimony..." : "Add Testimony"}
        </button>

        <h3 className="font-bold text-lg mt-6 mb-2 text-white">Existing Testimonies</h3>
        
        {testimonies.length === 0 ? (
          <p className="text-gray-400">No testimonies added yet.</p>
        ) : (
          <div className="space-y-3">
            {testimonies.map((item) => (
              <div key={item.id} className="p-3 border rounded bg-gray-800 border-gray-700">
                <strong className="text-white block mb-1">{item.student_name}</strong>
                <p className="text-gray-300">{item.testimony}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;