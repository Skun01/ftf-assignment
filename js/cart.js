const CART_STORAGE_KEY = "cart";

/* cart action */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent("cart:change"));
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  let nextCart;
  if (existingItem) {
    nextCart = cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    const newItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    nextCart = [...cart, newItem];
  }

  saveCart(nextCart);
}

function changeQuantity(id, delta) {
  const cart = getCart();
  const nextCart = cart
    .map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + delta } : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(nextCart);
}

function removeFromCart(id) {
  const nextCart = getCart().filter((item) => item.id !== id);
  saveCart(nextCart);
}

/* templates */
function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function cartItemTemplate(item) {
  return `
    <article class="flex flex-col gap-4 rounded-lg border bg-white p-4 sm:flex-row sm:items-center" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" class="h-24 w-24 flex-shrink-0 self-center object-contain" />
      <div class="flex-1">
        <h2 class="line-clamp-2 text-sm font-medium">${item.title}</h2>
        <p class="mt-1 text-sm text-gray-500">${formatPrice(item.price)}</p>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" data-action="decrease" aria-label="Decrease quantity"
          class="h-8 w-8 rounded border text-lg leading-none hover:bg-gray-100">&minus;</button>
        <span class="w-8 text-center" aria-label="Quantity">${item.quantity}</span>
        <button type="button" data-action="increase" aria-label="Increase quantity"
          class="h-8 w-8 rounded border text-lg leading-none hover:bg-gray-100">+</button>
      </div>
      <div class="flex items-center justify-between gap-4 sm:w-32 sm:justify-end">
        <span class="font-semibold">${formatPrice(item.price * item.quantity)}</span>
        <button type="button" data-action="remove" aria-label="Remove item"
          class="text-sm text-red-600 hover:underline">Remove</button>
      </div>
    </article>
  `;
}

function emptyCartTemplate() {
  return `
    <div class="rounded-lg border bg-white p-10 text-center">
      <p class="text-gray-500">Your cart is empty.</p>
      <a href="index.html" class="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
        Browse products
      </a>
    </div>
  `;
}

/* render cart */
function renderCartPage() {
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  if (!itemsEl) return; // Not on the cart page.

  const cart = getCart();

  if (cart.length === 0) {
    itemsEl.innerHTML = emptyCartTemplate();
    if (totalEl) totalEl.textContent = formatPrice(0);
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  itemsEl.innerHTML = cart.map(cartItemTemplate).join("");
  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function initCartPage() {
  const itemsEl = document.getElementById("cart-items");
  if (!itemsEl) return;

  renderCartPage();

  itemsEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const row = button.closest("[data-id]");
    const id = Number(row.dataset.id);
    const action = button.dataset.action;

    if (action === "increase") changeQuantity(id, 1);
    else if (action === "decrease") changeQuantity(id, -1);
    else if (action === "remove") removeFromCart(id);

    renderCartPage();
  });

  // demo checkout
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length === 0) return;
      saveCart([]); 
      renderCartPage();
      if (typeof showToast === "function") {
        showToast("Order placed successfully. Thank you!");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initCartPage);
