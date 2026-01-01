export interface Moment {
  id: number;
  title: string;
  year: string;
  image: string; // Kembali ke single string
  className: string; // Container sizing class
  alignment: 'start' | 'center' | 'end';
  textPos: 'below' | 'above' | 'side';
}

export const moments: Moment[] = [
  {
    id: 1,
    title: 'Hack@On Event',
    year: '2022',
    image: '/moments/hackon.jpg',
    className: 'aspect-[16/12] w-[400px] md:w-[500px]',
    alignment: 'end',
    textPos: 'above',
  },
  {
    id: 2,
    title: 'Github Seminar',
    year: '2023',
    image: '/moments/itc.jpg',
    className: 'aspect-[3/4] w-[300px] md:w-[350px]',
    alignment: 'start',
    textPos: 'below',
  },
  {
    id: 3,
    title: 'Lab Assistant 2023',
    year: '2023',
    image: '/moments/assistant2023.jpg',
    className: 'aspect-[3/4] w-[300px] md:w-[350px]',
    alignment: 'end',
    textPos: 'above',
  },
  {
    id: 4,
    title: 'Baparekraf Developer Day',
    year: '2024',
    image: '/moments/bdd.jpg',
    className: 'aspect-square w-[320px] md:w-[400px]',
    alignment: 'center',
    textPos: 'below',
  },
  {
    id: 5,
    title: 'Top 4 Yogyakomtek',
    year: '2024',
    image: '/moments/yogyakomtek.jpg',
    className: 'aspect-[16/9] w-[450px] md:w-[500px]',
    alignment: 'center',
    textPos: 'above',
  },
  {
    id: 6,
    title: 'POMDA BAPOMI DIY',
    year: '2024',
    image: '/moments/pomda.jpg',
    className: 'aspect-[10/16] w-[280px] md:w-[320px]',
    alignment: 'end',
    textPos: 'below',
  },
  {
    id: 7,
    title: 'Lab Assistant 2024',
    year: '2024',
    image: '/moments/assistant2024.JPEG',
    className: 'aspect-[16/9] w-[580px] md:w-[580px]',
    alignment: 'end',
    textPos: 'above',
  },
  {
    id: 8,
    title: 'Lab Assistant 2025',
    year: '2025',
    image: '/moments/assistant2025.jpg',
    className: 'aspect-[16/9] w-[580px] md:w-[580px]',
    alignment: 'start',
    textPos: 'below',
  },
  {
    id: 9,
    title: 'Graduation Day',
    year: '2025',
    image: '/moments/graduation.jpg',
    className: 'aspect-square w-[320px] md:w-[380px]',
    alignment: 'center',
    textPos: 'above',
  },
  {
    id: 10,
    title: 'Career Vibe Check',
    year: '2025',
    image: '/moments/tixnow.jpg',
    className: 'aspect-square w-[320px] md:w-[380px]',
    alignment: 'center',
    textPos: 'below',
  },
];