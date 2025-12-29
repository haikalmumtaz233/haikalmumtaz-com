export interface Moment {
  id: number;
  title: string;
  year: string;
  image: string;
  className: string;
  alignment: 'start' | 'center' | 'end';
  textPos: 'below' | 'above' | 'side';
}

export const moments: Moment[] = [
  {
    id: 1,
    title: 'Esports Champion',
    year: '2021',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    className: 'aspect-[16/10] w-[600px]',
    alignment: 'end',
    textPos: 'above',
  },
  {
    id: 2,
    title: 'Teaching Code',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    className: 'aspect-[3/4] w-[400px]',
    alignment: 'start',
    textPos: 'below',
  },
  {
    id: 3,
    title: 'Hackathon Winner',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    className: 'aspect-square w-[450px]',
    alignment: 'center',
    textPos: 'below',
  },
  {
    id: 4,
    title: 'Late Night Coding',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    className: 'aspect-[16/9] w-[550px]',
    alignment: 'start',
    textPos: 'below',
  },
  {
    id: 5,
    title: 'Graduation Day',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    className: 'aspect-[9/16] w-[350px]',
    alignment: 'end',
    textPos: 'above',
  },
  {
    id: 6,
    title: 'Bangkit Academy',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
    className: 'aspect-square w-[400px]',
    alignment: 'center',
    textPos: 'side',
  },
];
