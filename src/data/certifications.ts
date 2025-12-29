export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialLink: string;
}

export const certifications: Certification[] = [
  {
    id: 1,
    title: 'Bangkit Academy 2023',
    issuer: 'Google, GoTo, Traveloka',
    date: 'Jan 2024',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    credentialLink: '#',
  },
  {
    id: 2,
    title: 'TensorFlow Developer',
    issuer: 'Google',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    credentialLink: '#',
  },
  {
    id: 3,
    title: 'Associate Data Scientist',
    issuer: 'BNSP Indonesia',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    credentialLink: '#',
  },
  {
    id: 4,
    title: 'React Developer',
    issuer: 'HackerRank',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80',
    credentialLink: '#',
  },
  {
    id: 5,
    title: 'EF SET English Certificate',
    issuer: 'EF Standard English Test',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
    credentialLink: '#',
  },
];
