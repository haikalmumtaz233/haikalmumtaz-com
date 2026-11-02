interface ScrollLockTarget {
  root: { clientWidth: number; style: { scrollbarGutter: string } };
  body: { style: { overflow: string } };
  viewportWidth: number;
}

const currentPage = (): ScrollLockTarget => ({
  root: document.documentElement,
  body: document.body,
  viewportWidth: window.innerWidth,
});

export const lockScroll = (target: ScrollLockTarget = currentPage()) => {
  const { root, body, viewportWidth } = target;
  const previousOverflow = body.style.overflow;
  const previousGutter = root.style.scrollbarGutter;

  if (viewportWidth > root.clientWidth) root.style.scrollbarGutter = 'stable';
  body.style.overflow = 'hidden';

  return () => {
    body.style.overflow = previousOverflow;
    root.style.scrollbarGutter = previousGutter;
  };
};
