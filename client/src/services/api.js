const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function registerSeller(payload) {
  const res = await fetch(`${API_BASE}/sellers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function checkout(payload) {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchSellers() {
  const res = await fetch(`${API_BASE}/sellers`);
  if (!res.ok) throw new Error("Failed to fetch sellers");
  return res.json();
}

export async function addProduct(formData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    body: formData
  });
  return res.json();
}
