import type { KeyboardEvent } from 'react';

export const activateOnEnterOrSpace =
  (onActivate: () => void) =>
  (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onActivate();
  };
