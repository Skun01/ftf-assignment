/* Shared UI behaviors used across every page: toast, cart badge, mobile nav. */

const TOAST_DURATION = 2500;

/* toast */
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-4 right-4 z-50 flex flex-col gap-2";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className =
    "toast rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast--out");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, TOAST_DURATION);
}

/* cart badge */
function updateCartBadge() {
  const count = typeof getCartCount === "function" ? getCartCount() : 0;

  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  });
}

/* mobile nav toggle */
function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = !menu.classList.toggle("hidden");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initNavToggle();
});

document.addEventListener("cart:change", updateCartBadge);
