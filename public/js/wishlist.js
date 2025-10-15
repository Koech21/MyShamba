const wishlistGrid = document.getElementById("wishlistGrid");
const emptyState = document.getElementById("emptyState");
const wishlistSearch = document.getElementById("wishlistSearch");
let wishlist = JSON.parse(localStorage.getItem("plottosha-wishlist") || "[]");

function renderWishlist(items) {
  wishlistGrid.innerHTML = "";

  if (items.length === 0) {
    wishlistGrid.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  wishlistGrid.classList.remove("hidden");
  emptyState.classList.add("hidden");

  items.forEach((listing) => {
    const card = document.createElement("div");
    card.className = "wishlist-card";
    card.innerHTML = `
      <img src="${listing.image_url}" alt="${listing.title}">
      <div class="card-body">
        <h2>${listing.title}</h2>
        <p class="location">${listing.location}</p>
        <p class="category">${listing.category}</p>
        <p class="price">${listing.price}</p>
        <div class="actions">
          <button class="remove-btn" onclick="removeFromWishlist('${listing.id}')">Remove</button>
          <a href="/listing/${listing.id}" class="view-btn">View Details</a>
        </div>
      </div>
    `;
    wishlistGrid.appendChild(card);
  });
}

function removeFromWishlist(id) {
  wishlist = wishlist.filter((item) => item.id !== id);
  localStorage.setItem("plottosha-wishlist", JSON.stringify(wishlist));
  showToast("Removed from wishlist");
  renderWishlist(wishlist);
}

wishlistSearch.addEventListener("input", () => {
  const query = wishlistSearch.value.toLowerCase();
  const filtered = wishlist.filter(
    (listing) =>
      listing.title.toLowerCase().includes(query) ||
      listing.location.toLowerCase().includes(query) ||
      listing.category.toLowerCase().includes(query)
  );
  renderWishlist(filtered);
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Initial render
renderWishlist(wishlist);
