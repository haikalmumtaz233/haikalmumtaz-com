interface DockSection {
  id: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

export const sectionEyebrow = (id: string, sections: readonly DockSection[]) => {
  const index = sections.findIndex((section) => section.id === id);
  return index === -1 ? '' : `${pad(index + 1)} / ${pad(sections.length)}`;
};
