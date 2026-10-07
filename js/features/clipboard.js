import { showToast } from '../components/toast.js';
export function initClipboard() {
    const buttons = [...document.querySelectorAll('[data-copy-email]')];
    if (!buttons.length)
        return () => { };
    const handlers = new Map();
    buttons.forEach((button) => {
        const handler = async () => {
            const email = button.dataset.copyEmail;
            if (!email)
                return;
            let copied = false;
            try {
                await navigator.clipboard.writeText(email);
                copied = true;
            }
            catch {
                copied = fallbackCopy(email);
            }
            showToast(copied ? 'EMAIL СКОПИРОВАН' : 'НЕ УДАЛОСЬ СКОПИРОВАТЬ');
        };
        handlers.set(button, handler);
        button.addEventListener('click', handler);
    });
    return () => handlers.forEach((handler, button) => button.removeEventListener('click', handler));
}
function fallbackCopy(value) {
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.append(input);
    input.select();
    let copied = false;
    try {
        copied = document.execCommand('copy');
    }
    catch {
        copied = false;
    }
    input.remove();
    return copied;
}
