import { CONFIG } from '../core/config.js';
import { EVENTS, emit } from '../core/events.js';
const translations = {
    ru: {
        'hero.status': 'СИСТЕМА АКТИВНА · ЧЕЛЯБИНСК', 'hero.name': 'Аполлинария Воробьева',
        'hero.role': 'Графический и моушн-дизайнер', 'hero.tagline': 'Дизайн в движении — от статичного макета до ожившей анимации.',
        'hero.cta_work': 'Смотреть работы', 'hero.cta_contact': 'Связаться', 'hero.scroll': 'СКРОЛЛ',
        'nav.home': 'Главная', 'nav.about': 'Обо мне', 'nav.skills': 'Навыки', 'nav.work': 'Работы', 'nav.process': 'Процесс', 'nav.contact': 'Контакты',
        'a11y.skip': 'Перейти к содержимому', 'a11y.mainNav': 'Основная навигация', 'a11y.mobileNav': 'Мобильная навигация',
        'a11y.mobileMenu': 'Навигация', 'a11y.brand': 'АПОЛЛИНАРИЯ — на главную', 'a11y.palette': 'Сменить палитру',
        'a11y.paletteHint': 'Цветовая палитра интерфейса', 'a11y.menuOpen': 'Открыть меню',
        'skills.toolsLabel': 'ИНСТРУМЕНТЫ /', 'projects.status': 'КОНЦЕПТ / В РАБОТЕ', 'footer.online': 'В СЕТИ', 'footer.copyright': '© 2026 Аполлинария Воробьева',
        'noscript': 'Для полной работы интерактивного портфолио включите JavaScript.',
        'about.title': 'Обо мне', 'about.sub': 'Коротко о подходе, опыте и направлении развития.',
        'about.p1': 'Меня зовут Аполлинария. Я развиваюсь в графическом и моушн-дизайне и люблю превращать статичные идеи в выразительный визуальный образ.',
        'about.p2': 'Во время обучения работала с полиграфией: готовила макеты к печати, проверяла файлы и учитывала технические требования.',
        'about.p3': 'Сейчас основной фокус — визуальная айдентика, анимация логотипов и digital-контент.',
        'about.stat1': 'инструментов', 'about.stat2': 'года обучения', 'about.stat3': 'учебных и заказных работ',
        'skills.title': 'Навыки', 'skills.sub': 'Направления работы и инструменты, которые используются в проектах.',
        'work.title': 'Работы', 'work.sub': 'Сейчас портфолио готовится к наполнению реальными кейсами.',
        'process.title': 'Процесс', 'process.sub': 'Понятная последовательность от задачи до готового результата.',
        'process.s1.title': 'Задача', 'process.s1.desc': 'Разбираю цель, формат, ограничения и пожелания.',
        'process.s2.title': 'Концепция', 'process.s2.desc': 'Собираю референсы и определяю визуальное направление.',
        'process.s3.title': 'Дизайн', 'process.s3.desc': 'Создаю макет, проверяю детали и вношу правки.',
        'process.s4.title': 'Анимация', 'process.s4.desc': 'Если проект требует движения, оживляю графику в After Effects.',
        'contact.title': 'Обсудим проект?', 'contact.sub': 'Открыта для предложений о работе, стажировке и частных заказах.',
        'palette.cyan': 'Сменить палитру: фиолетовая', 'palette.violet': 'Сменить палитру: лаймовая', 'palette.lime': 'Сменить палитру: голубая'
    },
    en: {
        'hero.status': 'SYSTEM ONLINE · CHELYABINSK', 'hero.name': 'Apollinaria Vorobyeva',
        'hero.role': 'Graphic & Motion Designer', 'hero.tagline': 'Design in motion — from static layouts to living animation.',
        'hero.cta_work': 'View works', 'hero.cta_contact': 'Get in touch', 'hero.scroll': 'SCROLL',
        'nav.home': 'Home', 'nav.about': 'About', 'nav.skills': 'Skills', 'nav.work': 'Work', 'nav.process': 'Process', 'nav.contact': 'Contact',
        'a11y.skip': 'Skip to content', 'a11y.mainNav': 'Main navigation', 'a11y.mobileNav': 'Mobile navigation',
        'a11y.mobileMenu': 'Navigation', 'a11y.brand': 'АПОЛЛИНАРИЯ — home', 'a11y.palette': 'Change colour palette',
        'a11y.paletteHint': 'Interface colour palette', 'a11y.menuOpen': 'Open menu',
        'skills.toolsLabel': 'TOOLS /', 'projects.status': 'CONCEPT / IN PROGRESS', 'footer.online': 'ONLINE', 'footer.copyright': '© 2026 Аполлинария Воробьева',
        'noscript': 'Enable JavaScript for the full interactive portfolio experience.',
        'about.title': 'About me', 'about.sub': 'A short look at my approach, experience and direction.',
        'about.p1': 'I am Apollinaria. I develop in graphic and motion design and enjoy turning static ideas into expressive visual stories.',
        'about.p2': 'During my studies I worked with print: preparing layouts, checking files and following technical requirements.',
        'about.p3': 'My current focus is visual identity, logo animation and digital content.',
        'about.stat1': 'tools', 'about.stat2': 'years of study', 'about.stat3': 'study & client works',
        'skills.title': 'Skills', 'skills.sub': 'Design directions and tools used across projects.',
        'work.title': 'Work', 'work.sub': 'The portfolio is being prepared for real case studies.',
        'process.title': 'Process', 'process.sub': 'A clear sequence from brief to finished result.',
        'process.s1.title': 'Brief', 'process.s1.desc': 'I clarify the goal, format, constraints and expectations.',
        'process.s2.title': 'Concept', 'process.s2.desc': 'I collect references and define the visual direction.',
        'process.s3.title': 'Design', 'process.s3.desc': 'I build the design, check details and apply revisions.',
        'process.s4.title': 'Animation', 'process.s4.desc': 'When motion is needed, I animate the graphics in After Effects.',
        'contact.title': 'Have a project?', 'contact.sub': 'Open to job opportunities, internships and freelance projects.',
        'palette.cyan': 'Change palette: violet', 'palette.violet': 'Change palette: lime', 'palette.lime': 'Change palette: cyan'
    }
};
let currentLang = 'ru';
let boundButtons = [];
export function restoreLang() {
    try {
        currentLang = localStorage.getItem(CONFIG.storage.language) === 'en' ? 'en' : 'ru';
    }
    catch {
        currentLang = 'ru';
    }
}
export function applyTranslations() {
    apply(currentLang);
    boundButtons.forEach((button) => button.removeEventListener('click', toggleLanguage));
    boundButtons = [...document.querySelectorAll('#languageButton, #mobileLanguageButton')];
    boundButtons.forEach((button) => button.addEventListener('click', toggleLanguage));
    updateButtons();
}
function toggleLanguage() {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    try {
        localStorage.setItem(CONFIG.storage.language, currentLang);
    }
    catch { /* Storage may be blocked. */ }
    apply(currentLang);
    updateButtons();
    emit(EVENTS.LANGUAGE, { lang: currentLang });
}
function apply(lang) {
    const dictionary = translations[lang] || translations.ru;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        const value = key ? dictionary[key] : undefined;
        if (value !== undefined)
            element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
        const key = element.dataset.i18nAriaLabel;
        const value = key ? dictionary[key] : undefined;
        if (value)
            element.setAttribute('aria-label', value);
    });
    document.querySelectorAll('[data-nav-link]').forEach((link) => {
        const navKeys = { home: 'nav.home', about: 'nav.about', skills: 'nav.skills', work: 'nav.work', process: 'nav.process', contact: 'nav.contact' };
        const key = navKeys[link.getAttribute('href')?.slice(1) || ''];
        if (key)
            link.textContent = dictionary[key];
    });
    const menuButton = document.querySelector('#menuButton');
    if (menuButton)
        menuButton.setAttribute('aria-label', menuButton.getAttribute('aria-expanded') === 'true'
            ? (lang === 'en' ? 'Close menu' : 'Закрыть меню') : dictionary['a11y.menuOpen']);
    const online = document.querySelector('.site-footer__online-label');
    if (online)
        online.textContent = dictionary['footer.online'];
}
function updateButtons() {
    boundButtons.forEach((button) => {
        button.textContent = currentLang === 'ru' ? 'EN' : 'RU';
        button.setAttribute('aria-label', currentLang === 'ru' ? 'Switch to English' : 'Переключить на русский');
        button.setAttribute('aria-pressed', String(currentLang === 'en'));
    });
}
