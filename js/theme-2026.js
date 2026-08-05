// Reveal on scroll
const els = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });

els.forEach(el => io.observe(el));

// Hero slideshow (optional)
const heroImgs = document.querySelectorAll(".hero-img");
let idx = 0;
setInterval(() => {
  if (!heroImgs.length) return;
  heroImgs.forEach(im => im.classList.remove("is-active"));
  idx = (idx + 1) % heroImgs.length;
  heroImgs[idx].classList.add("is-active");
}, 3500);


// Theme toggle logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIconMoon = document.getElementById('theme-icon-moon');
const themeIconSun = document.getElementById('theme-icon-sun');

if (themeToggleBtn) {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      themeIconMoon.style.display = 'block';
      themeIconSun.style.display = 'none';
    } else {
      themeIconMoon.style.display = 'none';
      themeIconSun.style.display = 'block';
    }
  };

  // Initial theme setup
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(systemPrefersDark ? 'dark' : 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });
}
