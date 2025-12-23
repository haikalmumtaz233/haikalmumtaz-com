export interface Project {
  id: number;
  title: string;
  category: 'Web Dev' | 'Data Science' | 'Mobile & Game';
  image: string;
  description: string;
  techStack: string[];
  repoLink: string;
  demoLink?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'TixNow - Cinema Booking',
    category: 'Web Dev',
    image: 'https://placehold.co/600x400/1a1a1a/white?text=Project',
    description: 'End-to-end cinema ticketing system with admin dashboard and user booking interface.',
    techStack: ['Vue.js', 'Tailwind', 'Backend API'],
    repoLink: 'https://github.com',
    demoLink: 'https://demo.com',
  },
  {
    id: 2,
    title: 'SABER - Energy Prediction',
    category: 'Data Science',
    image: 'https://placehold.co/600x400/1a1a1a/white?text=Project',
    description: 'IoT-based electricity usage forecasting using LSTM models and Time-series analysis.',
    techStack: ['Python', 'TensorFlow', 'IoT', 'LSTM'],
    repoLink: 'https://github.com',
  },
  {
    id: 3,
    title: 'Game Galaxy',
    category: 'Mobile & Game',
    image: 'https://placehold.co/600x400/1a1a1a/white?text=Project',
    description: 'Mobile app for browsing game data with search, favorites, and authentication.',
    techStack: ['Flutter', 'Dart', 'API Integration'],
    repoLink: 'https://github.com',
    demoLink: 'https://demo.com',
  },
  {
    id: 4,
    title: 'Street Beats',
    category: 'Mobile & Game',
    image: 'https://placehold.co/600x400/1a1a1a/white?text=Project',
    description: 'Rhythm-based Roblox game with inventory systems and backend logic for passive income.',
    techStack: ['Roblox', 'Lua', 'Game Design'],
    repoLink: 'https://github.com',
  },
  {
    id: 5,
    title: 'Tegal BusRoute',
    category: 'Web Dev',
    image: 'https://placehold.co/600x400/1a1a1a/white?text=Project',
    description: 'Interactive map tracking bus routes and stops in Tegal using geospatial data.',
    techStack: ['Leaflet.js', 'OpenStreetMap', 'Vanilla JS'],
    repoLink: 'https://github.com',
    demoLink: 'https://demo.com',
  },
  {
    id: 6,
    title: 'IoT Parking System',
    category: 'Web Dev',
    image: 'https://placehold.co/600x400/1a1a1a/white?text=Project',
    description: 'Real-time parking monitoring system integrating hardware sensors with a web dashboard.',
    techStack: ['PHP', 'IoT', 'Arduino', 'Blynk'],
    repoLink: 'https://github.com',
  },
];
