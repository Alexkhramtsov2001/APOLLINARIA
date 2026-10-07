let hideTimer = 0;

export function showToast(message: string, duration = 2400): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  window.clearTimeout(hideTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  hideTimer = window.setTimeout(() => toast.classList.remove('is-visible'), duration);
}

export function initToast(): () => void {
  return () => window.clearTimeout(hideTimer);
}
