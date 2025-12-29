import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient'; 

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      setError(null);
      
      // Select all messages, ordered by creation date (newest first)
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false }); 

      if (error) {
        console.error('Error fetching messages:', error);
        setError(error.message);
      } else {
        setMessages(data);
      }
      setLoading(false);
    }

    fetchMessages();
  }, []);

  if (loading) return <p className="p-8">Loading messages...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">User Contact Messages ({messages.length})</h2>
      
      {messages.length === 0 ? (
        <p>No messages received yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 border border-slate-700 rounded-md">
              <p className="font-semibold">{msg.full_name} <span className="text-sm text-slate-400">({msg.email})</span></p>
              <p className="text-sm italic text-slate-500">Submitted: {new Date(msg.created_at).toLocaleString()}</p>
              <p className="mt-2 font-medium">{msg.subject}</p>
              <p className="mt-1">{msg.message}</p>
              {/* You can add a Delete button here using supabase.from().delete() */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}