export interface SiteSection {
  id: string;
  label: string;
}

export const homeSections: SiteSection[] = [
  { id: 'projects', label: 'PROJECTS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'techstack', label: 'TECH STACK' },
  { id: 'tools', label: 'TOOLS' },
  { id: 'certifications', label: 'CERTIFICATIONS' },
  { id: 'favoritemoments', label: 'MOMENTS' },
  { id: 'contact', label: 'CONTACT' },
];
