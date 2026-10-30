export type SocialPlatform = 'GitHub' | 'LinkedIn' | 'Instagram';

export interface SocialProfile {
  label: SocialPlatform;
  href: string;
}

export const profile = {
  name: 'Haikal Mumtaz',
  fullName: 'Muhammad Raditya Haikal Mumtaz',
  headline: 'Application Developer',
  employer: 'Bank Negara Indonesia via Mitra Integrasi Informatika',
  location: 'Jakarta, Indonesia',
  email: 'hmumtaz70@gmail.com',
  siteUrl: 'https://haikalmumtaz.com',
};

export interface NameMeaning {
  word: string;
  script: string;
  meaning: string;
}

export const nameMeanings: NameMeaning[] = [
  { word: 'Haikal', script: 'هيكل', meaning: 'The Frame' },
  { word: 'Mumtaz', script: 'ممتاز', meaning: 'The Distinguished' },
];

export const socialProfiles: SocialProfile[] = [
  { label: 'GitHub', href: 'https://github.com/haikalmumtaz233' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/haikal-mumtaz/' },
  { label: 'Instagram', href: 'https://www.instagram.com/haikal_mumtaz23/' },
];
