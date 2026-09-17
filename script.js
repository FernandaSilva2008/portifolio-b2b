// ===================================================
// MAIN SCRIPT
// ===================================================

import { initMenuToggle } from './src/js/nav.js';
import { initTestimonials } from './src/js/testimonials.js';

/**
 * Inicializa as funcionalidades da aplicação.
 */
function initApp() {
  initMenuToggle();
  initTestimonials();
}

// Inicializa quando o DOM estiver disponível.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
