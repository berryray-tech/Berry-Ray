// src/lib/auth.js
import supabase from "./supabaseClient";

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getUser = () => supabase.auth.getUser();
