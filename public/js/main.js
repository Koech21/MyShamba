document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  function toggleMenu() {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent it from immediately closing
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    const isClickInsideNav = navLinks.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideNav && !isClickOnHamburger) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
});
