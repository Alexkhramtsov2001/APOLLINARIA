let hideTimer = 0;
export function showToast(message, duration = 2400) {
    const toast = document.querySelector('#toast');
    if (!toast)
        return;
    window.clearTimeout(hideTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    hideTimer = window.setTimeout(() => toast.classList.remove('is-visible'), duration);
}
export function initToast() {
    return () => window.clearTimeout(hideTimer);
}
