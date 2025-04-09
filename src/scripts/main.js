// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add active class to current navigation item
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  // TODO: Add more interactive features as needed
  // - Form validation
  // - Smooth scrolling
  // - Mobile menu toggle
  // - Dark mode toggle
});
