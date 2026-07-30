import { accentForCategory, gradientForCategory } from './categoryAccents';

export interface Project {
    id: number;
    name: string;
    subtitle: string;
    category: string;
    description: string;
    stack: string[];
    image: string;
    gradient: string;
    accentColor: string;
    repoLink: string;
    liveLink: string;
    isFeatured: boolean;
}

type ProjectSeed = Omit<Project, 'accentColor' | 'gradient'>;

const projectSeeds: ProjectSeed[] = [
    {
        id: 1,
        name: 'TixNow',
        subtitle: 'Cinema Booking Platform',
        category: 'Fullstack Web Development',
        description:
            'End-to-end cinema ticketing system with admin dashboard and seamless user booking experience.',
        stack: ['Java Spring Boot', 'Java Spring Security', 'Thymeleaf', 'MySQL', 'Bootstrap'],
        image: '/projects/tixnow.webp',
        repoLink: 'https://github.com/haikalmumtaz233/TixNow',
        liveLink: '#',
        isFeatured: true,
    },
    {
        id: 2,
        name: 'Street Beats',
        subtitle: 'Roblox Game',
        category: 'Game Development',
        description:
            'Multiplayer rhythm game on Roblox platform where players hit notes in sync with music tracks to score points and compete on leaderboards.',
        stack: ['Lua', 'Roblox Studio'],
        image: '/projects/streetBeats.webp',
        repoLink: 'https://discord.gg/sc6F4e8VhN',
        liveLink: 'https://www.roblox.com/games/98953012685374/Street-Beats',
        isFeatured: true,
    },
    {
        id: 3,
        name: 'Portfolio',
        subtitle: 'Personal Portfolio Website',
        category: 'Frontend Development',
        description:
            'Modern, interactive portfolio website showcasing projects with advanced animations and smooth user experience.',
        stack: ['React', 'Framer Motion', 'Tailwind', 'GSAP', 'Lenis'],
        image: '/projects/portfolio.webp',
        repoLink: 'https://github.com/haikalmumtaz233/haikalmumtaz-com',
        liveLink: 'https://haikalmumtaz.com',
        isFeatured: true,
    },
    {
        id: 4,
        name: 'SMP Muhdela Yogyakarta Website',
        subtitle: 'School Profile Website',
        category: 'Frontend Development',
        description:
            'Responsive school profile website for SMP Muhdela Yogyakarta',
        stack: [
            'Vue 3',
            'Pinia',
            'Axios',
            'Tailwind CSS'
        ],
        image: '/projects/smpmuhdela.webp',
        repoLink: '#',
        liveLink: 'https://smpmuhdelajogja.sch.id/',
        isFeatured: true,
    },
    {
        id: 5,
        name: 'SIMASET Asahan',
        subtitle: 'Regional Asset Management System',
        category: 'Frontend Development',
        description:
            'Web-based asset management system for Asahan Regency covering master data, KIB-based inventory, procurement transactions, maintenance workflows, and GIS-assisted asset mapping.',
        stack: [
            'Vue 3',
            'Pinia',
            'TanStack Query',
            'Axios',
            'Leaflet',
            'Tailwind CSS',
        ],
        image: '/projects/simaset.webp',
        repoLink: '#',
        liveLink: '#',
        isFeatured: false,
    },
    {
        id: 6,
        name: 'Content Management System',
        subtitle: 'School CMS Website',
        category: 'Frontend Development',
        description:
            'Content management system for SMP Muhdela Yogyakarta, enabling easy updates to school information, news, and events by non-technical staff.',
        stack: [
            'Vue 3',
            'Vuexy',
            'Axios',
            'Tailwind CSS'
        ],
        image: '/projects/cms.webp',
        repoLink: '#',
        liveLink: '#',
        isFeatured: false,
    },
    {
        id: 7,
        name: 'KostKu',
        subtitle: 'Kost Management Platform',
        category: 'Fullstack Web Development',
        description:
            'Fullstack kost operations platform for landlords and tenants, covering auth, billing, inventory, notifications, and analytics with a microservices architecture, plus a PWA implementation for a mobile-first experience.',
        stack: [
            'Next.js',
            'TypeScript',
            'Tailwind CSS',
            'Golang',
            'Gin',
            'PostgreSQL',
            'Redis',
            'NATS',
        ],
        image: '/projects/kostku.webp',
        repoLink: '#',
        liveLink: '#',
        isFeatured: false,
    },
    {
        id: 8,
        name: 'Vehicle Route LeafletJS',
        subtitle: 'Bus Route Mapping Application',
        category: 'Frontend Development',
        description:
            'Bus route mapping application using LeafletJS for interactive visualization and navigation of vehicle routes.',
        stack: ['JavaScript', 'Leaflet', 'HTML', 'CSS'],
        image: '/projects/vehicleroute.webp',
        repoLink: 'https://github.com/haikalmumtaz233/vehicle-route-leafletjs',
        liveLink: 'https://haikalmumtaz233.github.io/vehicle-route-leafletjs/',
        isFeatured: false,
    },
];

export const projects: Project[] = projectSeeds.map((seed) => ({
  ...seed,
  accentColor: accentForCategory(seed.category),
  gradient: gradientForCategory(seed.category),
}));
