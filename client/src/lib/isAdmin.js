import supabase from "./supabaseClient";

export async function isAdmin(userId) {
  if (!userId) return false;

  const { data, error } = await supabase
    .from("admins")
    .select("id")
    .eq("id", userId)
    .single();

  if (error) {
    console.warn("Admin check error:", error);
    return false;
  }

  return !!data;
}
