const PAGE_SIZE = 6;

const state = {
    allProducts: [],
    search: "",
    category: "all",
    sort: "default",
    visibleCount: PAGE_SIZE,
};

/* templates */
function formatPrice(value) {
    return `$${value.toFixed(2)}`;
}

function productCardTemplate(product) {
    return `
        <article class="flex flex-col overflow-hidden rounded-xl border bg-white transition hover:shadow-md" data-id="${product.id}">
        <div class="flex h-48 items-center justify-center bg-white p-4">
            <img src="${product.image}" alt="${product.title}" loading="lazy"
            class="h-full w-full object-contain" />
        </div>
        <div class="flex flex-1 flex-col p-4">
            <h3 class="line-clamp-2 text-sm font-medium" title="${product.title}">${product.title}</h3>
            <p class="mt-2 text-lg font-bold">${formatPrice(product.price)}</p>
            <div class="mt-4 flex gap-2">
            <button type="button" data-action="view"
                class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100">
                View details
            </button>
            <button type="button" data-action="add"
                class="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Add to cart
            </button>
            </div>
        </div>
        </article>
    `;
}

function skeletonCardTemplate() {
    return `
        <div class="overflow-hidden rounded-xl border bg-white">
        <div class="skeleton h-48 w-full"></div>
        <div class="space-y-3 p-4">
            <div class="skeleton h-4 w-3/4 rounded"></div>
            <div class="skeleton h-4 w-1/2 rounded"></div>
            <div class="skeleton h-9 w-full rounded"></div>
        </div>
        </div>
    `;
}

/* state renders */ 

// loading
function showSkeletons() {
    const grid = document.getElementById("product-list");
    grid.innerHTML = Array.from({ length: PAGE_SIZE }, skeletonCardTemplate).join("");
}

// error
function showError(message) {
    const grid = document.getElementById("product-list");
    grid.innerHTML = `
        <div class="col-span-full rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <p>${message}</p>
        <button type="button" id="retry-btn"
            class="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Retry
        </button>
        </div>
    `;
    document.getElementById("retry-btn").addEventListener("click", loadProducts);
}

// empty
function showEmpty() {
    const grid = document.getElementById("product-list");
    grid.innerHTML = `
        <p class="col-span-full py-10 text-center text-gray-500">
        No products match your search.
        </p>
    `;
}

/* filter products */
function getFilteredProducts() {
    let result = [...state.allProducts];

    // by category
    if (state.category !== "all") {
        result = result.filter((p) => p.category === state.category);
    }

    // by keyword
    const term = state.search.trim().toLowerCase();
    if (term) {
        result = result.filter((p) => p.title.toLowerCase().includes(term));
    }

    // sort
    switch (state.sort) {
        case "price-asc":
            result.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            result.sort((a, b) => b.price - a.price);
            break;
        case "name-asc":
            result.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "name-desc":
            result.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            break;
    }

    return result;
} 

/* render grid products */
function renderGrid() {
    const grid = document.getElementById("product-list");
    const loadMoreBtn = document.getElementById("load-more-btn");
    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
        showEmpty();
        loadMoreBtn.classList.add("hidden");
        return;
    }

    const visible = filtered.slice(0, state.visibleCount);
    grid.innerHTML = visible.map(productCardTemplate).join("");

    // display load more button when products list have more items to show
    loadMoreBtn.classList.toggle("hidden", state.visibleCount >= filtered.length);
}

/* data loading */

// render category options in select dropdown
function renderCategoryOptions(categories) {
    const select = document.getElementById("category-filter");
    const options = categories
        .map((c) => `<option value="${c}">${c}</option>`)
        .join("");
        
    // keep "All categories" option and add new options after it
    select.insertAdjacentHTML("beforeend", options);
}

// render products
async function loadProducts() {
    showSkeletons();
    try {
        const [products, categories] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        ]);

        state.allProducts = products;
        renderCategoryOptions(categories);
        renderGrid();
    } catch (error) {
        showError(error.message);
    }
}

/* even handlers */

// delay for typing in search input
function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function initHomePage() {
    const grid = document.getElementById("product-list");
    if (!grid) return; 

    // even delegation 
    grid.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const card = button.closest("[data-id]");
        const id = Number(card.dataset.id);

        if (button.dataset.action === "view") {
            // navigate to details page for this product
            window.location.href = `product.html?id=${id}`;
        } else if (button.dataset.action === "add") {
            // add to cart later
        }
    });

    // search input
    document.getElementById("search-input").addEventListener(
        "input",
        debounce((event) => {
            state.search = event.target.value;
            state.visibleCount = PAGE_SIZE;
            renderGrid();
        })
    );

    // category filter
    document.getElementById("category-filter").addEventListener("change", (event) => {
        state.category = event.target.value;
        state.visibleCount = PAGE_SIZE;
        renderGrid();
    });

    // sort
    document.getElementById("sort-select").addEventListener("change", (event) => {
        state.sort = event.target.value;
        state.visibleCount = PAGE_SIZE;
        renderGrid();
    });

    // load more
    document.getElementById("load-more-btn").addEventListener("click", () => {
        state.visibleCount += PAGE_SIZE;
        renderGrid();
    });

    loadProducts();
}

document.addEventListener("DOMContentLoaded", initHomePage);