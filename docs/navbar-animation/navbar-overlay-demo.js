const navbar = document.querySelector('[data-navbar]');
const toggleButton = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

const SCROLLED_THRESHOLD = 36;
const HIDE_THRESHOLD = 140;

let lastScrollY = window.scrollY;
let isMenuOpen = false;

function syncNavbarState() {
  const currentY = window.scrollY;
  const scrollingDown = currentY > lastScrollY;
  const shouldBeScrolled = currentY > SCROLLED_THRESHOLD;
  const shouldHide = !isMenuOpen && scrollingDown && currentY > HIDE_THRESHOLD;

  navbar.classList.toggle('is-scrolled', shouldBeScrolled);
  navbar.classList.toggle('is-hidden', shouldHide);

  lastScrollY = currentY;
}

function setMenuState(nextOpen) {
  isMenuOpen = nextOpen;
  navbar.classList.toggle('is-menu-open', nextOpen);
  toggleButton.setAttribute('aria-expanded', String(nextOpen));

  if (!nextOpen) {
    navbar.classList.remove('is-hidden');
  }
}

toggleButton?.addEventListener('click', () => {
  setMenuState(!isMenuOpen);
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuState(false);
  });
});

window.addEventListener(
  'scroll',
  () => {
    syncNavbarState();
  },
  { passive: true }
);

window.addEventListener('resize', () => {
  if (window.innerWidth > 920 && isMenuOpen) {
    setMenuState(false);
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isMenuOpen) {
    setMenuState(false);
  }
});

syncNavbarState();
