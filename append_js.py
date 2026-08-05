with open(r'd:\My website\js\theme-2026.js', 'a', encoding='utf-8') as f:
    f.write('''

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
''')
