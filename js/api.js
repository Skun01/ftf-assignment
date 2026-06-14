const API_URL = "https://fakestoreapi.com";

// get products
async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);

  if (!res.ok) {
    throw new Error("Unable to load products. Please try again later.");
  }

  return res.json();
}

// get product by id
async function fetchProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`);

  if (!res.ok) {
    throw new Error("Unable to load this product. It may not exist.");
  }

  return res.json();
}

// get categories
async function fetchCategories() {
  const res = await fetch(`${API_URL}/products/categories`);

  if (!res.ok) {
    throw new Error("Unable to load categories.");
  }

  return res.json();
}