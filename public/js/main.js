document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");

  if (!hamburger || !mobileMenu || !overlay) return;

  function toggleMenu() {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    overlay.classList.toggle("hide");
    document.body.classList.toggle("menu-open");
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      toggleMenu();
    }
  });

  document.addEventListener("click", (e) => {
    const isClickInsideMenu = mobileMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideMenu && !isClickOnHamburger && !overlay.classList.contains("hide")) {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      overlay.classList.add("hide");
      document.body.classList.remove("menu-open");
    }
  });
});
