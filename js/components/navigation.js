import { subscribeScroll } from '../core/scroll-manager.js';
let cleanup = () => { };
export function initNavigation() {
    cleanup();
    const links = [...document.querySelectorAll('[data-nav-link]')];
    const sections = [...document.querySelectorAll('[data-section]')];
    if (!links.length || !sections.length)
        return cleanup;
    const setActive = (id) => {
        links.forEach((link) => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', active);
            if (active)
                link.setAttribute('aria-current', 'location');
            else
                link.removeAttribute('aria-current');
        });
    };
    const onClick = (event) => {
        const link = event.currentTarget;
        const href = link.getAttribute('href');
        if (!href?.startsWith('#'))
            return;
        const target = document.querySelector(href);
        if (!target)
            return;
        event.preventDefault();
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        target.scrollIntoView({ behavior, block: 'start' });
        history.replaceState(null, '', href);
        if (target.getAttribute('tabindex') === '-1')
            target.focus({ preventScroll: true });
        setActive(target.id);
    };
    links.forEach((link) => link.addEventListener('click', onClick));
    const updateActive = () => {
        const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
        const marker = Math.max(headerHeight + 24, window.innerHeight * 0.18);
        let active = sections[0];
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= marker)
                active = section;
            else
                break;
        }
        if (active)
            setActive(active.id);
    };
    const unsubscribe = subscribeScroll(updateActive);
    const initial = location.hash.slice(1) || 'home';
    if (document.getElementById(initial))
        setActive(initial);
    cleanup = () => {
        links.forEach((link) => link.removeEventListener('click', onClick));
        unsubscribe();
    };
    return cleanup;
}
export function destroyNavigation() { cleanup(); cleanup = () => { }; }
