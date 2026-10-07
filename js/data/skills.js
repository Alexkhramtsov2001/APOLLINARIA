export const SKILLS = Object.freeze([
    { number: '01', title: { ru: 'Полиграфия', en: 'Print Design' }, description: { ru: 'Макеты для печати, подготовка файлов и внимание к техническим требованиям.', en: 'Print layouts, file preparation and attention to production requirements.' }, tools: ['InDesign', 'Photoshop', 'CorelDRAW'] },
    { number: '02', title: { ru: 'Брендинг', en: 'Branding' }, description: { ru: 'Логотипы, фирменный стиль и визуальные элементы бренда.', en: 'Logos, visual identity and brand design elements.' }, tools: ['Illustrator', 'Photoshop'] },
    { number: '03', title: { ru: 'Motion Design', en: 'Motion Design' }, description: { ru: 'Анимация логотипов, микро-анимации и оживление статичной графики.', en: 'Logo animation, micro-interactions and motion for static graphics.' }, tools: ['After Effects'] },
    { number: '04', title: { ru: 'Digital / Social', en: 'Digital / Social' }, description: { ru: 'Баннеры, оформление и визуальный контент для digital-площадок.', en: 'Banners, platform visuals and content for digital channels.' }, tools: ['Photoshop', 'Illustrator', 'Figma'] }
]);
export const TOOLS = Object.freeze(['Photoshop', 'Illustrator', 'After Effects', 'InDesign', 'CorelDRAW', 'Figma']);
export function renderSkills(root = document) {
    const grid = root.querySelector('[data-skills]');
    const toolsRoot = root.querySelector('[data-tools]');
    if (!grid || !toolsRoot)
        return;
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
    const existingCards = [...grid.querySelectorAll('.skill-card')];
    if (existingCards.length === SKILLS.length) {
        existingCards.forEach((card, index) => {
            const skill = SKILLS[index];
            const heading = card.querySelector('h3');
            const description = card.querySelector('p');
            if (heading)
                heading.textContent = skill.title[lang];
            if (description)
                description.textContent = skill.description[lang];
        });
        return;
    }
    grid.replaceChildren(...SKILLS.map((skill) => {
        const article = document.createElement('article');
        article.className = 'skill-card';
        article.dataset.reveal = '';
        article.dataset.skill = skill.title.en;
        const heading = document.createElement('h3');
        heading.textContent = skill.title[lang];
        const description = document.createElement('p');
        description.textContent = skill.description[lang];
        const number = document.createElement('span');
        number.className = 'skill-card__num';
        number.textContent = skill.number;
        const icon = document.createElement('div');
        icon.className = `skill-card__visual skill-card__visual--${skill.number}`;
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = skill.number === '01'
            ? '<span class="print-sheet"><i></i><b></b><em></em></span><span class="print-scan"></span>'
            : skill.number === '02'
                ? '<span class="brand-node n1"></span><span class="brand-node n2"></span><span class="brand-node n3"></span><span class="brand-node n4"></span><span class="brand-link l1"></span><span class="brand-link l2"></span><span class="brand-link l3"></span><span class="brand-core">A</span>'
                : skill.number === '03'
                    ? '<span class="motion-track"><i></i><i></i><i></i><i></i><b></b></span><span class="motion-play"></span>'
                    : '<span class="digital-frame f1"></span><span class="digital-frame f2"></span><span class="digital-frame f3"></span><span class="digital-dot"></span>';
        const tags = document.createElement('ul');
        tags.className = 'skill-tags';
        skill.tools.forEach((tool) => { const li = document.createElement('li'); li.textContent = tool; tags.append(li); });
        article.append(number, icon, heading, description, tags);
        return article;
    }));
    toolsRoot.replaceChildren(...TOOLS.map((tool) => { const item = document.createElement('span'); item.textContent = tool; return item; }));
    window.dispatchEvent(new CustomEvent('portfolio:content-rendered', { detail: { type: 'skills' } }));
}
