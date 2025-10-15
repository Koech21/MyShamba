const searchInput = document.getElementById("searchInput");
const listingsContainer = document.getElementById("listingsContainer");
let wishlist = JSON.parse(localStorage.getItem("plottosha-wishlist") || "[]");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".listing-card");

  cards.forEach(card => {
    const title = card.querySelector("h2").textContent.toLowerCase();
    const location = card.querySelector(".location").textContent.toLowerCase();
    const category = card.querySelector(".category").textContent.toLowerCase();

    card.style.display =
      title.includes(query) || location.includes(query) || category.includes(query)
        ? "block"
        : "none";
  });
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
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
