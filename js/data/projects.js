export const PROJECTS = Object.freeze([
    {
        number: '01',
        type: 'pulse',
        title: { ru: 'Анимация логотипа', en: 'Logo Animation' },
        description: { ru: 'Цикл оживления логотипа: сборка, вращение, пульс.', en: 'A logo animation cycle: assembly, rotation and pulse.' },
        tags: ['MOTION', 'LOGO']
    },
    {
        number: '02',
        type: 'morph',
        title: { ru: 'Идентичность бренда', en: 'Brand Identity' },
        description: { ru: 'Разработка логотипа и фирменного стиля с анимацией.', en: 'Logo and visual identity development with motion.' },
        tags: ['BRANDING', 'IDENTITY']
    },
    {
        number: '03',
        type: 'waves',
        title: { ru: 'Оформление соцсетей', en: 'Social Media Design' },
        description: { ru: 'Визуальный контент и баннеры для социальных сетей.', en: 'Visual content and banners for social media.' },
        tags: ['SMM', 'GRAPHIC']
    }
]);
function visualMarkup(type) {
    if (type === 'pulse')
        return `
    <div class="project-visual project-visual--pulse" aria-hidden="true">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="projectPulseGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="var(--neon)" stop-opacity="1"/>
            <stop offset="100%" stop-color="var(--neon)" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle class="ph-ring" cx="100" cy="100" r="40"/>
        <circle class="ph-ring ph-ring--2" cx="100" cy="100" r="40"/>
        <circle class="ph-ring ph-ring--3" cx="100" cy="100" r="40"/>
        <circle class="ph-core" cx="100" cy="100" r="22" fill="url(#projectPulseGrad)"/>
        <text class="ph-label" x="100" y="106" text-anchor="middle">AV</text>
      </svg>
    </div>`;
    if (type === 'morph')
        return `
    <div class="project-visual project-visual--morph" aria-hidden="true">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path class="ph-morph-path" d="M100,40 L160,100 L100,160 L40,100 Z"/>
        <circle class="ph-morph-dot" cx="100" cy="100" r="3"/>
      </svg>
    </div>`;
    return `
    <div class="project-visual project-visual--waves" aria-hidden="true">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path class="ph-wave ph-wave--1" d="M0,100 Q50,60 100,100 T200,100" fill="none"/>
        <path class="ph-wave ph-wave--2" d="M0,100 Q50,60 100,100 T200,100" fill="none"/>
        <path class="ph-wave ph-wave--3" d="M0,100 Q50,60 100,100 T200,100" fill="none"/>
      </svg>
    </div>`;
}
export function renderProjects(root = document) {
    const grid = root.querySelector('[data-projects]');
    if (!grid)
        return;
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
    const existingCards = [...grid.querySelectorAll('.project-card')];
    if (existingCards.length === PROJECTS.length) {
        existingCards.forEach((card, index) => {
            const project = PROJECTS[index];
            const badge = card.querySelector('.project-card__badge');
            const status = card.querySelector('.project-card__status');
            const title = card.querySelector('h3');
            const description = card.querySelector('p');
            if (badge)
                badge.textContent = lang === 'en' ? 'IN PROGRESS' : 'В РАЗРАБОТКЕ';
            if (status)
                status.textContent = lang === 'en' ? 'CONCEPT / IN PROGRESS' : 'КОНЦЕПТ / В РАБОТЕ';
            if (title)
                title.textContent = project.title[lang];
            if (description)
                description.textContent = project.description[lang];
        });
        return;
    }
    grid.replaceChildren(...PROJECTS.map((project) => {
        const article = document.createElement('article');
        article.className = 'project-card';
        article.dataset.reveal = '';
        article.dataset.project = project.number;
        if (project.status === 'published' && project.href)
            article.dataset.cursorLabel = 'OPEN';
        const visual = document.createElement('div');
        visual.className = 'project-card__visual';
        visual.innerHTML = visualMarkup(project.type);
        const badge = document.createElement('span');
        badge.className = 'project-card__badge';
        badge.textContent = lang === 'en' ? 'IN PROGRESS' : 'В РАЗРАБОТКЕ';
        visual.append(badge);
        const body = document.createElement('div');
        body.className = 'project-card__body';
        const status = document.createElement('span');
        status.className = 'project-card__status';
        status.textContent = lang === 'en' ? 'CONCEPT / IN PROGRESS' : 'КОНЦЕПТ / В РАБОТЕ';
        const title = document.createElement('h3');
        title.textContent = project.title[lang];
        const description = document.createElement('p');
        description.textContent = project.description[lang];
        const tags = document.createElement('div');
        tags.className = 'project-card__tags';
        project.tags.forEach((tag) => {
            const item = document.createElement('span');
            item.className = 'project-card__tag';
            item.textContent = tag;
            tags.append(item);
        });
        body.append(status, title, description, tags);
        article.append(visual, body);
        return article;
    }));
    window.dispatchEvent(new CustomEvent('portfolio:content-rendered', { detail: { type: 'projects' } }));
}
