import { describe, expect, it } from 'vitest';
import { lockScroll } from './scrollLock';

const page = (viewportWidth: number, clientWidth: number) => ({
  root: { clientWidth, style: { scrollbarGutter: '' } },
  body: { style: { overflow: '' } },
  viewportWidth,
});

describe('lockScroll', () => {
  it('hides overflow and reserves the scrollbar gutter when a scrollbar is showing', () => {
    const target = page(1440, 1425);
    lockScroll(target);

    expect(target.body.style.overflow).toBe('hidden');
    expect(target.root.style.scrollbarGutter).toBe('stable');
  });

  it('leaves the gutter alone when the page has no scrollbar', () => {
    const target = page(1440, 1440);
    lockScroll(target);

    expect(target.body.style.overflow).toBe('hidden');
    expect(target.root.style.scrollbarGutter).toBe('');
  });

  it('restores the previous styles on unlock', () => {
    const target = page(1440, 1425);
    target.body.style.overflow = 'auto';
    const unlock = lockScroll(target);
    unlock();

    expect(target.body.style.overflow).toBe('auto');
    expect(target.root.style.scrollbarGutter).toBe('');
  });

  it('unwinds nested locks in reverse order', () => {
    const target = page(1440, 1425);
    const unlockOuter = lockScroll(target);
    target.root.clientWidth = 1440;
    const unlockInner = lockScroll(target);
    unlockInner();

    expect(target.body.style.overflow).toBe('hidden');
    expect(target.root.style.scrollbarGutter).toBe('stable');

    unlockOuter();
    expect(target.body.style.overflow).toBe('');
    expect(target.root.style.scrollbarGutter).toBe('');
  });
});
