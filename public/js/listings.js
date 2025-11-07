const searchInput = document.getElementById("searchInput");
const listingsContainer = document.getElementById("listingsContainer");
const wishlistToggle = document.getElementById("wishlistToggle");
const wishlistCount = document.getElementById("wishlistCount");
let wishlist = JSON.parse(localStorage.getItem("plottosha-wishlist") || "[]");
let wishlistOnly = false;

function applyFilters() {
  const query = (searchInput?.value || "").toLowerCase();
  const cards = document.querySelectorAll(".listing-card");

  const wishedIds = new Set(wishlist.map(w => String(w.id)));

  cards.forEach(card => {
    const id = String(card.getAttribute('data-id'));
    const title = card.querySelector("h2").textContent.toLowerCase();
    const location = card.querySelector(".location").textContent.toLowerCase();
    const category = card.querySelector(".category").textContent.toLowerCase();

    const matchesSearch = title.includes(query) || location.includes(query) || category.includes(query);
    const matchesWishlist = !wishlistOnly || wishedIds.has(id);

    card.style.display = matchesSearch && matchesWishlist ? "block" : "none";

    syncCardState(card, wishedIds.has(id));
  });
}

searchInput?.addEventListener("input", applyFilters);

wishlistToggle?.addEventListener("click", () => {
  wishlistOnly = !wishlistOnly;
  wishlistToggle.classList.toggle('active', wishlistOnly);
  wishlistToggle.textContent = wishlistOnly ? 'Showing Wishlist' : 'Show Wishlist';
  applyFilters();
});

function toggleWishlist(id) {
  const existing = wishlist.find(item => item.id === id);

  if (existing) {
    wishlist = wishlist.filter(item => item.id !== id);
    showToast("Removed from wishlist");
  } else {
    const card = document.querySelector(`[data-id='${id}']`);
    const listing = {
      id,
      title: card.querySelector("h2").textContent,
      location: card.querySelector(".location").textContent,
      category: card.querySelector(".category").textContent,
      price: card.querySelector(".price").textContent,
      image_url: card.querySelector("img").src,
    };
    wishlist.push(listing);
    showToast("Added to wishlist");
  }

  localStorage.setItem("plottosha-wishlist", JSON.stringify(wishlist));
  updateWishlistUI();
  applyFilters();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateWishlistUI() {
  if (wishlistCount) wishlistCount.textContent = String(wishlist.length);
}

function syncCardState(card, isSaved) {
  const btn = card.querySelector('.wishlist-btn');
  if (!btn) return;
  if (isSaved) {
    btn.textContent = '❤️ Saved';
    btn.classList.add('saved');
  } else {
    btn.textContent = '❤️ Save';
    btn.classList.remove('saved');
  }
}

// initial paint
updateWishlistUI();
applyFilters();
