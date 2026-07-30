export type TechIconSource =
  | { kind: 'sprite'; id: string }
  | { kind: 'image'; src: string };

export const spriteIcon = (id: string): TechIconSource => ({ kind: 'sprite', id });

export const imageIcon = (src: string): TechIconSource => ({ kind: 'image', src });
