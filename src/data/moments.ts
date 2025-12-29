export interface Moment {
  id: number;
  title: string;
  category: string;
  image: string;
  className: string;
}

export const moments: Moment[] = [
  {
    id: 1,
    title: 'Esports Champion',
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    className: 'aspect-[16/9] w-[500px]', // Landscape
  },
  {
    id: 2,
    title: 'Teaching Code',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    className: 'aspect-[9/16] w-[350px]', // Portrait
  },
  {
    id: 3,
    title: 'Hackathon Winner',
    category: 'Competition',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    className: 'aspect-square w-[400px]', // Square
  },
  {
    id: 4,
    title: 'Late Night Coding',
    category: 'Development',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    className: 'aspect-[16/9] w-[550px]', // Landscape
  },
  {
    id: 5,
    title: 'Graduation Day',
    category: 'Achievement',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    className: 'aspect-[9/16] w-[380px]', // Portrait
  },
  {
    id: 6,
    title: 'Bangkit Academy',
    category: 'Learning',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
    className: 'aspect-square w-[420px]', // Square
  },
];
