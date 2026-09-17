// ===================================================
// RESPONSIVE MENU
// ===================================================

export function initMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Evita erros caso os elementos não existam
  if (!menuToggle || !navMenu) {
    return;
  }

  const navLinks = document.querySelectorAll('.nav-links a');

  // Abre / fecha o menu
  menuToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');

    menuToggle.setAttribute('aria-expanded', String(isActive));
  });

  // Fecha o menu ao clicar em um link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
