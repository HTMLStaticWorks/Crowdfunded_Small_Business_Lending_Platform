function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = newTheme;
  localStorage.setItem('lendcircle-theme', newTheme);
}

function toggleRTL() {
  const isRTL = document.documentElement.dir === 'rtl';
  const newDir = isRTL ? 'ltr' : 'rtl';
  document.documentElement.dir = newDir;
  localStorage.setItem('lendcircle-rtl', newDir);
}

// Immediately apply theme and RTL to prevent flickering
(function() {
  const savedTheme = localStorage.getItem('lendcircle-theme');
  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
  }
  const savedRTL = localStorage.getItem('lendcircle-rtl');
  if (savedRTL) {
    document.documentElement.dir = savedRTL;
  }
})();

function toggleMobileMenu() {
  const links = document.querySelector('.nav-links');
  const actions = document.querySelector('.nav-actions');
  if (links) links.classList.toggle('show');
  if (actions) actions.classList.toggle('show');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  let scrollTopBtn = document.querySelector('.scroll-top');
  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollTopBtn.onclick = scrollToTop;
    document.body.appendChild(scrollTopBtn);
  }

  const navInner = document.querySelector('.nav-inner');
  if (navInner && !document.querySelector('.hamburger')) {
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    hamburger.onclick = toggleMobileMenu;
    navInner.insertBefore(hamburger, navInner.children[1]);
  }

  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    
    if (scrollTopBtn) {
      if (window.scrollY > 300) scrollTopBtn.style.display = 'grid';
      else scrollTopBtn.style.display = 'none';
    }
  });
});
