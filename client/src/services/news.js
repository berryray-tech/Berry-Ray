// src/services/news.js
import supabase from "../lib/supabaseClient";

export async function fetchNews(limit = 5) {
  const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return data;
}
