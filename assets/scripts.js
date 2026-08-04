/**
   * Motor de Partículas Atmosféricas (Componente Independiente)
   */
class ParticleEngine {
  constructor(hostId, options = {}) {
    this.host = document.getElementById(hostId);
    this.colors = options.colors || ['#4f7cff', '#9b5cff', '#2ee6d6'];
    this.densityFactor = options.densityFactor || 640;
  }

  init() {
    if (!this.host) return;
    const particleCount = window.innerWidth < this.densityFactor ? 16 : 32;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < particleCount; i++) {
      fragment.appendChild(this._createParticle());
    }
    this.host.appendChild(fragment);
  }

  _createParticle() {
    const particle = document.createElement('div');
    particle.className = 'scenic-background__particle';

    const size = Math.random() * 3 + 1.5;
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    const duration = 12 + Math.random() * 14;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${100 + Math.random() * 20}vh`;
    particle.style.background = randomColor;
    particle.style.boxShadow = `0 0 6px ${randomColor}`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * duration}s`;

    return particle;
  }
}

/**
 * Origen de datos con la nueva IA "Vibes AI" agregada
 */
const ASSISTANTS_DATABASE = [
  {
    "id": "chatgpt",
    "name": "ChatGPT",
    "description": "Conversación, programación, análisis y generación de contenido.",
    "url": "https://chatgpt.com/",
    "iconClass": "bi bi-chat-dots-fill",
    "categories": ["programacion", "imagen"]
  },
  {
    "id": "gemini",
    "name": "Gemini",
    "description": "IA de Google para productividad, búsqueda, video y asistencia.",
    "url": "https://gemini.google.com/app",
    "iconClass": "bi bi-stars",
    "categories": ["programacion", "imagen", "video"]
  },
  {
    "id": "grok",
    "name": "Grok",
    "description": "Asistente de IA con acceso a información en tiempo real e imagen.",
    "url": "https://grok.com/",
    "iconClass": "bi bi-rocket-takeoff-fill",
    "categories": ["programacion", "imagen"]
  },
  {
    "id": "claude",
    "name": "Claude",
    "description": "Modelo de IA especializado en escritura, análisis, programación y documentos.",
    "url": "https://claude.ai/new",
    "iconClass": "bi bi-cpu-fill",
    "categories": ["programacion"]
  },
  {
    "id": "qwen",
    "name": "Qwen",
    "description": "Plataforma de IA desarrollada por Alibaba para múltiples tareas y código.",
    "url": "https://chat.qwen.ai/",
    "iconClass": "bi bi-globe2",
    "categories": ["programacion", "imagen", "audio"]
  },
  {
    "id": "kimi",
    "name": "Kimi",
    "description": "Asistente de IA desarrollado por Moonshot AI con gran contexto.",
    "url": "https://www.kimi.com/",
    "iconClass": "bi bi-lightning-charge-fill",
    "categories": ["programacion"]
  },
  {
    "id": "deepseek",
    "name": "DeepSeek",
    "description": "Modelo avanzado enfocado en razonamiento complejo, matemáticas y código.",
    "url": "https://chat.deepseek.com/",
    "iconClass": "bi bi-compass-fill",
    "categories": ["programacion"]
  },
  {
    "id": "vibes",
    "name": "Vibes AI",
    "description": "Plataforma creativa de inteligencia artificial para audio, video y contenido.",
    "url": "https://vibes.ai/",
    "iconClass": "bi bi-soundwave",
    "categories": ["audio", "video"]
  }
];

/**
 * Gestor de la Aplicación con Colores Aleatorios y Filtrado
 */
class AIHubApp {
  constructor(database) {
    this.database = database;
    this.currentFilter = 'all';
    this.cardsContainer = document.getElementById('cards-container');
    this.statusText = document.getElementById('connection-status-text');
    this.filterContainer = document.getElementById('filter-container');

    this.colorPalette = [
      '#3fd8c4', '#4f7cff', '#9b5cff', '#ff6b6b',
      '#ff9d5c', '#2ee6d6', '#ffc93c', '#ff5252', '#a66eff'
    ];
  }

  init() {
    const ambientFX = new ParticleEngine('particles-host');
    ambientFX.init();

    this.setupEventListeners();
    this.renderCards();
    this.updateStatusBadge(this.database.length);
  }

  setupEventListeners() {
    if (!this.filterContainer) return;

    this.filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      this.filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      this.currentFilter = btn.getAttribute('data-filter');
      this.renderCards();
    });
  }

  getRandomColors() {
    const c1 = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
    let c2 = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
    while (c1 === c2) {
      c2 = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
    }
    return { c1, c2 };
  }

  renderCards() {
    if (!this.cardsContainer) return;

    const filteredData = this.currentFilter === 'all'
      ? this.database
      : this.database.filter(item => item.categories && item.categories.includes(this.currentFilter));

    const incrementalDelay = 0.07;
    const htmlMarkup = filteredData.map((item, index) => {
      const delay = index * incrementalDelay;
      const { c1, c2 } = this.getRandomColors();

      const tagsHtml = item.categories
        ? item.categories.map(cat => `<span class="ai-card__tag">${cat}</span>`).join('')
        : '';

      return `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <article class="ai-card" style="--card-c1: ${c1}; --card-c2: ${c2}; animation-delay: ${delay}s">
                <div class="ai-card__header">
                  <div class="ai-card__icon-container">
                    <i class="${item.iconClass}"></i>
                  </div>
                  <div class="ai-card__indicator"></div>
                </div>
                <h3 class="ai-card__title">${item.name}</h3>
                <div class="ai-card__tags">
                  ${tagsHtml}
                </div>
                <p class="ai-card__description">${item.description}</p>
                <a href="${item.url}" target="_blank" rel="noopener" class="ai-card__action-btn">
                  Abrir 
                  <i class="bi bi-arrow-up-right ai-card__action-btn-icon"></i>
                </a>
              </article>
            </div>
          `;
    }).join('');

    this.cardsContainer.innerHTML = htmlMarkup || `<div class="text-center text-muted py-5 w-100">No hay asistentes disponibles para esta categoría.</div>`;
    this.updateStatusBadge(filteredData.length);
  }

  updateStatusBadge(count) {
    if (!this.statusText) return;
    this.statusText.textContent = `${count} plataformas conectadas`;
  }
}

/**
 * Arranque de la Aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
  const app = new AIHubApp(ASSISTANTS_DATABASE);
  app.init();
});