let cleanup = () => { };
export function initMobileMenu() {
    cleanup();
    const button = document.querySelector('#menuButton');
    const menu = document.querySelector('#mobileMenu');
    if (!button || !menu)
        return cleanup;
    const getFocusable = () => [...menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hidden && element.offsetParent !== null);
    let lastFocused = null;
    const setOpen = (open) => {
        button.setAttribute('aria-expanded', String(open));
        const lang = document.documentElement.lang || 'ru';
        button.setAttribute('aria-label', open ? (lang === 'en' ? 'Close menu' : 'Закрыть меню') : (lang === 'en' ? 'Open menu' : 'Открыть меню'));
        menu.hidden = !open;
        document.documentElement.classList.toggle('menu-open', open);
        if (open) {
            lastFocused = document.activeElement;
            getFocusable()[0]?.focus();
        }
        else {
            if (lastFocused instanceof HTMLElement)
                lastFocused.focus();
            lastFocused = null;
        }
    };
    const onButton = () => setOpen(menu.hidden === true);
    const onLink = () => setOpen(false);
    const onKeydown = (event) => {
        if (menu.hidden)
            return;
        if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            return;
        }
        if (event.key !== 'Tab')
            return;
        const focusable = [button, ...getFocusable()];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last)
            return;
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };
    button.addEventListener('click', onButton);
    const links = [...menu.querySelectorAll('a[href^="#"]')];
    links.forEach((link) => link.addEventListener('click', onLink));
    document.addEventListener('keydown', onKeydown);
    cleanup = () => {
        setOpen(false);
        button.removeEventListener('click', onButton);
        links.forEach((link) => link.removeEventListener('click', onLink));
        document.removeEventListener('keydown', onKeydown);
    };
    return cleanup;
}
export function destroyMobileMenu() { cleanup(); cleanup = () => { }; }
