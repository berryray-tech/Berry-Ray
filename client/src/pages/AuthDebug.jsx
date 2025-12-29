import React, { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthDebug() {
  const [session, setSession] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        console.log("Session:", session);

        // Get all admins
        const { data: adminsData } = await supabase
          .from('admins')
          .select('*');
        setAdmins(adminsData || []);
        console.log("Admins:", adminsData);

        // Get auth users (requires admin privileges - might fail)
        try {
          const { data: usersData } = await supabase
            .from('auth.users')
            .select('id, email, created_at')
            .limit(10);
          setUsers(usersData || []);
          console.log("Users:", usersData);
        } catch (err) {
          console.log("Could not fetch auth.users:", err.message);
        }

      } catch (err) {
        console.error("Debug error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateTestUser = async () => {
    const email = prompt("Enter test user email:");
    const password = prompt("Enter password:");
    
    if (!email || !password) return;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert(`User created: ${data.user?.id}`);
      window.location.reload();
    }
  };

  const handleAddAsAdmin = async () => {
    if (!session?.user) {
      alert("No user logged in");
      return;
    }

    const { error } = await supabase
      .from('admins')
      .insert([{ 
        user_id: session.user.id, 
        email: session.user.email 
      }]);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("Added to admins table");
      window.location.reload();
    }
  };

  if (loading) {
    return <div className="p-8">Loading debug info...</div>;
  }

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="mb-8">
        <button 
          onClick={() => navigate("/admin/login")}
          className="bg-blue-600 px-4 py-2 rounded mr-2"
        >
          Go to Login
        </button>
        <button 
          onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          className="bg-red-600 px-4 py-2 rounded mr-2"
        >
          Sign Out
        </button>
        <button 
          onClick={handleCreateTestUser}
          className="bg-green-600 px-4 py-2 rounded mr-2"
        >
          Create Test User
        </button>
        {session && (
          <button 
            onClick={handleAddAsAdmin}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            Add Me as Admin
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Info */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-3">Session Info</h2>
          <pre className="text-sm bg-gray-900 p-3 rounded overflow-auto">
            {JSON.stringify(session, null, 2) || "No session"}
          </pre>
        </div>

        {/* Admins Table */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-3">Admins Table ({admins.length})</h2>
          {admins.length === 0 ? (
            <p className="text-yellow-400">No admins found in database</p>
          ) : (
            <div className="space-y-2">
              {admins.map((admin) => (
                <div key={admin.id} className="bg-gray-900 p-2 rounded">
                  <p><strong>ID:</strong> {admin.id}</p>
                  <p><strong>User ID:</strong> {admin.user_id}</p>
                  <p><strong>Email:</strong> {admin.email}</p>
                  <p><strong>Created:</strong> {new Date(admin.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auth Users */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-3">Auth Users ({users.length})</h2>
          {users.length === 0 ? (
            <p className="text-yellow-400">Could not fetch auth users or none exist</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-900 p-2 rounded">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                  <p className={`text-xs ${user.id === session?.user?.id ? 'text-green-400' : 'text-gray-400'}`}>
                    {user.id === session?.user?.id ? '← CURRENT USER' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current User vs Admin Check */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-3">Admin Status Check</h2>
          {session?.user ? (
            <div>
              <p><strong>Logged in as:</strong> {session.user.email}</p>
              <p><strong>User ID:</strong> {session.user.id}</p>
              <p className="mt-3">
                <strong>Is in admins table:</strong>{" "}
                {admins.some(a => a.user_id === session.user.id) ? (
                  <span className="text-green-400">✓ YES</span>
                ) : (
                  <span className="text-red-400">✗ NO</span>
                )}
              </p>
              {!admins.some(a => a.user_id === session.user.id) && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded">
                  <p className="text-red-300">
                    This user exists in auth but NOT in admins table. 
                    They need to be added to the admins table to access admin features.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-yellow-400">Not logged in</p>
          )}
        </div>
      </div>
    </div>
  );
}