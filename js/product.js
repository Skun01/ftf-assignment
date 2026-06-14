function formatPrice(value) {
    return `$${value.toFixed(2)}`;
}

/* state render */ 

// loading
function showLoading() {
    const container = document.getElementById("product-detail");
    container.innerHTML = `
        <div class="col-span-full flex justify-center py-20">
        <div class="spinner" role="status" aria-label="Loading product"></div>
        </div>
    `;
}

// error
function showError(message) {
    const container = document.getElementById("product-detail");
    container.innerHTML = `
        <div class="col-span-full rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <p>${message}</p>
        <a href="home.html" class="mt-3 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Back to products
        </a>
        </div>
    `;
}

/* templates */
function ratingTemplate(rating) {
    if (!rating) return "";
    return `
        <p class="mt-2 flex items-center gap-1 text-sm text-amber-600">
        <span aria-hidden="true">★</span>
        <span>${rating.rate} / 5</span>
        <span class="text-gray-400">(${rating.count} reviews)</span>
        </p>
    `;
}

function renderProduct(product) {
    const container = document.getElementById("product-detail");
    container.innerHTML = `
        <div class="flex items-center justify-center rounded-xl border bg-white p-8">
        <img src="${product.image}" alt="${product.title}" class="max-h-96 w-full object-contain" />
        </div>
        <div class="flex flex-col">
        <span class="text-sm uppercase tracking-wide text-gray-400">${product.category}</span>
        <h1 class="mt-1 text-2xl font-bold">${product.title}</h1>
        ${ratingTemplate(product.rating)}
        <p class="mt-4 text-gray-600">${product.description}</p>
        <p class="mt-6 text-3xl font-bold">${formatPrice(product.price)}</p>
        <button type="button" id="add-to-cart-btn"
            class="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
            Add to cart
        </button>
        </div>
    `;

    // handle add to card click
    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
       
    });
}

/* loading */
async function loadProduct() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  // get id from query string
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    showError("No product specified.");
    return;
  }

  showLoading();
  try {
    const product = await fetchProductById(id);
    renderProduct(product);
  } catch (error) {
    showError(error.message);
  }
}

document.addEventListener("DOMContentLoaded", loadProduct);