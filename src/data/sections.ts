export interface HomeSection {
  id: string;
  label: string;
}

export const homeSections: HomeSection[] = [
  { id: 'projects', label: 'Featured work' },
  { id: 'experience', label: 'Experience' },
  { id: 'techstack', label: 'Tech stack' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'favoritemoments', label: 'Moments' },
  { id: 'contact', label: 'Contact' },
];
