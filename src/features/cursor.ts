export function initCursor(): () => void {
  const root = document.querySelector<HTMLElement>('#cursor');
  if (!root) return () => {};
  const dot = root.querySelector<HTMLElement>('.cursor__dot');
  const ring = root.querySelector<HTMLElement>('.cursor__ring');
  const label = root.querySelector<HTMLElement>('.cursor__label');
  if (!dot || !ring || !label) return () => {};

  const finePointer = window.matchMedia('(pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reduced.matches) {
    root.hidden = true;
    return () => {};
  }

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let targetX = x;
  let targetY = y;
  let rafId = 0;
  let disposed = false;

  const render = (): void => {
    rafId = 0;
    if (disposed) return;
    x += (targetX - x) * 0.22;
    y += (targetY - y) * 0.22;
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    label.style.transform = `translate3d(${targetX + 18}px, ${targetY + 18}px, 0)`;
    if (Math.abs(targetX - x) > 0.2 || Math.abs(targetY - y) > 0.2) rafId = requestAnimationFrame(render);
  };

  const schedule = (): void => {
    if (!rafId) rafId = requestAnimationFrame(render);
  };
  const onMove = (event: PointerEvent): void => {
    targetX = event.clientX;
    targetY = event.clientY;
    schedule();
  };
  const getInteractive = (target: EventTarget | null): HTMLElement | null => {
    return target instanceof Element ? target.closest<HTMLElement>('a, button, [data-cursor-label]') : null;
  };
  const onOver = (event: PointerEvent): void => {
    const target = getInteractive(event.target);
    if (!target) return;
    root.classList.add('is-hovering');
    const text = target.dataset.cursorLabel || '';
    label.textContent = text;
    label.classList.toggle('is-visible', Boolean(text));
  };
  const onOut = (event: PointerEvent): void => {
    const from = getInteractive(event.target);
    const to = getInteractive(event.relatedTarget);
    if (from && !to) {
      root.classList.remove('is-hovering');
      label.classList.remove('is-visible');
    }
  };
  const onLeave = (): void => root.classList.remove('is-visible');
  const onEnter = (): void => root.classList.add('is-visible');

  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver, { passive: true });
  document.addEventListener('pointerout', onOut, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave, { passive: true });
  document.documentElement.addEventListener('pointerenter', onEnter, { passive: true });
  document.documentElement.classList.add('has-custom-cursor');
  root.classList.add('is-visible');

  return () => {
    disposed = true;
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    document.removeEventListener('pointerout', onOut);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    document.documentElement.removeEventListener('pointerenter', onEnter);
    root.classList.remove('is-visible', 'is-hovering');
    document.documentElement.classList.remove('has-custom-cursor');
    label.classList.remove('is-visible');
  };
}
