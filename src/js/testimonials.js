/* ===================================================
   TESTIMONIALS - API FETCH & CENTERED CAROUSEL
=================================================== */

const avatarImages = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
];

const API_URL = 'https://jsonplaceholder.typicode.com/users';

/**
 * Inicializa a seção de depoimentos.
 */
export async function initTestimonials() {
  const cardsContainer = document.getElementById('testimonials-cards');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (!cardsContainer) {
    return;
  }

  await loadTestimonials(cardsContainer);

  setupNavigation(cardsContainer, prevBtn, nextBtn);
}

/**
 * Busca os dados da API e renderiza os cards.
 */
async function loadTestimonials(cardsContainer) {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `Erro HTTP: ${response.status} ${response.statusText}`
      );
    }

    const users = await response.json();
    const firstFiveUsers = users.slice(0, 5);

    cardsContainer.innerHTML = firstFiveUsers
      .map((user, index) => createCardHTML(user, index))
      .join('');

    initCarouselFocus(cardsContainer);
  } catch (error) {
    console.error('Erro na seção de depoimentos:', error);

    cardsContainer.innerHTML = `
      <p class="testimonials-error">
        Não foi possível carregar os depoimentos.
      </p>
    `;
  }
}

/**
 * Cria o HTML de um card.
 */
function createCardHTML(user, index) {
  const avatarUrl =
    avatarImages[index] ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;

  return `
    <article class="testimonial-card">
      <div class="card-company">
        <span class="company-name">${escapeHTML(user.company.name)}</span>
      </div>

      <p class="card-text">
        "${escapeHTML(user.company.catchPhrase)}. 
        ${escapeHTML(user.company.bs)}."
      </p>

      <div class="card-author">
        <img
          src="${avatarUrl}"
          alt="Foto de ${escapeHTML(user.name)}"
          class="author-avatar"
          loading="lazy"
        />

        <div class="author-info">
          <h4 class="author-name">
            ${escapeHTML(user.name)}
          </h4>

          <span class="author-role">
            Co-founder / ${escapeHTML(user.address.city)}
          </span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Escapa conteúdo vindo da API antes de inseri-lo no HTML.
 */
function escapeHTML(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

/**
 * Configura os botões de navegação.
 */
function setupNavigation(cardsContainer, prevBtn, nextBtn) {
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollToCard(cardsContainer, -1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollToCard(cardsContainer, 1);
    });
  }
}

/**
 * Move o carrossel para o card anterior ou próximo.
 */
function scrollToCard(cardsContainer, direction) {
  const cards = [
    ...cardsContainer.querySelectorAll('.testimonial-card')
  ];

  if (!cards.length) {
    return;
  }

  const activeCard = getClosestCard(cardsContainer, cards);
  const currentIndex = cards.indexOf(activeCard);

  if (currentIndex === -1) {
    return;
  }

  const targetIndex = Math.max(
    0,
    Math.min(currentIndex + direction, cards.length - 1)
  );

  const targetCard = cards[targetIndex];

  centerCard(cardsContainer, targetCard);
}

/**
 * Retorna o card mais próximo do centro do container.
 */
function getClosestCard(cardsContainer, cards) {
  const containerRect = cardsContainer.getBoundingClientRect();
  const containerCenter =
    containerRect.left + containerRect.width / 2;

  let closestCard = null;
  let minDistance = Infinity;

  cards.forEach((card) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distance = Math.abs(containerCenter - cardCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closestCard = card;
    }
  });

  return closestCard;
}

/**
 * Centraliza um card dentro do carrossel.
 */
function centerCard(cardsContainer, card) {
  const containerCenter = cardsContainer.offsetWidth / 2;
  const cardCenter =
    card.offsetLeft + card.offsetWidth / 2;

  cardsContainer.scrollTo({
    left: cardCenter - containerCenter,
    behavior: 'smooth'
  });
}

/**
 * Atualiza visualmente o card ativo.
 */
function updateActiveCard(cardsContainer) {
  const cards = [
    ...cardsContainer.querySelectorAll('.testimonial-card')
  ];

  if (!cards.length) {
    return;
  }

  const closestCard = getClosestCard(cardsContainer, cards);

  cards.forEach((card) => {
    card.classList.toggle('active', card === closestCard);
  });
}

/**
 * Inicializa o foco e os eventos do carrossel.
 */
function initCarouselFocus(cardsContainer) {
  const cards = [
    ...cardsContainer.querySelectorAll('.testimonial-card')
  ];

  if (!cards.length) {
    return;
  }

  // Começa pelo terceiro card quando disponível.
  const initialIndex = Math.min(2, cards.length - 1);
  const initialCard = cards[initialIndex];

  requestAnimationFrame(() => {
    centerCard(cardsContainer, initialCard);
    updateActiveCard(cardsContainer);
  });

  cardsContainer.addEventListener(
    'scroll',
    () => updateActiveCard(cardsContainer),
    { passive: true }
  );

  window.addEventListener('resize', () => {
    updateActiveCard(cardsContainer);
  });
}
