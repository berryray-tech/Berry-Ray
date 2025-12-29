// src/services/testimonies.js
import supabase from "../lib/supabaseClient";

export async function fetchTestimonies(limit = 10) {
  const { data, error } = await supabase.from("testimonies").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return data;
}
