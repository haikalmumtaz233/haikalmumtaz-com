export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialLink?: string;
}

export const certifications: Certification[] = [
  {
    id: 1,
    title: 'Bangkit Academy 2023',
    issuer: 'Google, GoTo, Traveloka',
    date: '2024',
    image: '/certifications/bangkit.webp',
  },
  {
    id: 2,
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google',
    date: '2024',
    image: '/certifications/tfdc.webp',
    credentialLink: 'https://www.credential.net/26ca09d8-f7a9-4573-ae59-44a47a713e7f',
  },
  {
    id: 3,
    title: 'Associate Data Scientist',
    issuer: 'BNSP Indonesia',
    date: '2024',
    image: '/certifications/bnsp.webp',
  },
  {
    id: 4,
    title: 'VSGA Certification - Data Science',
    issuer: 'Komdigi Indonesia',
    date: '2024',
    image: '/certifications/vsga.webp',
  },
  {
    id: 5,
    title: 'TOEFL ITP',
    issuer: 'ELTI Gramedia Yogyakarta',
    date: '2025',
    image: '/certifications/toefl.webp',
  },
  {
    id: 6,
    title: 'TixNow - II Place Best Project',
    issuer: 'Career Vibe Check',
    date: '2025',
    image: '/certifications/tixnow.webp',
  },
  {
    id: 7,
    title: 'Nominator Best Project Pitching',
    issuer: 'Career Vibe Check',
    date: '2025',
    image: '/certifications/pitching.webp',
  },
  {
    id: 8,
    title: 'Laboratory Assistant Certificate',
    issuer: 'Laboratorium Informatika - UPNVY',
    date: '2025',
    image: '/certifications/asistenlab.webp',
  },
  {
    id: 9,
    title: 'POMDA DIY - II Place E-Sport Valorant',
    issuer: 'BAPOMI DIY',
    date: '2024',
    image: '/certifications/pomda.webp',
  },
];
