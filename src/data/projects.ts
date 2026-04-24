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

export const projects: Project[] = [
    {
        id: 1,
        name: 'TixNow',
        subtitle: 'Cinema Booking Platform',
        category: 'Fullstack Web Development',
        description:
            'End-to-end cinema ticketing system with admin dashboard and seamless user booking experience.',
        stack: ['Java Spring Boot', 'Java Spring Security', 'Thyemeleaf', 'MySQL', 'Bootstrap'],
        image: '/projects/tixnow.webp',
        gradient: 'from-purple-900/20 via-transparent to-blue-900/20',
        accentColor: '#a855f7',
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
        gradient: 'from-orange-900/20 via-transparent to-red-900/20',
        accentColor: '#f97316',
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
        stack: ['React', 'Framer Motion', 'Tailwind'],
        image: '/projects/portfolio.webp',
        gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
        accentColor: '#ec4899',
        repoLink: 'https://github.com/haikalmumtaz233/haikalmumtaz-com',
        liveLink: 'https://haikalmumtaz-com.vercel.app/',
        isFeatured: true,
    },
    {
        id: 4,
        name: 'Vehicle Route LeafletJS',
        subtitle: 'Bus Route Mapping Application',
        category: 'Frontend Development',
        description:
            'Bus route mapping application using LeafletJS for interactive visualization and navigation of vehicle routes.',
        stack: ['JavaScript', 'LeafletJS', 'HTML', 'CSS'],
        image: '/projects/vehicleroute.webp',
        gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
        accentColor: '#22d3ee',
        repoLink: 'https://github.com/haikalmumtaz233/vehicle-route-leafletjs',
        liveLink: 'https://haikalmumtaz233.github.io/vehicle-route-leafletjs/',
        isFeatured: false,
    },
    {
        id: 5,
        name: 'SMP Muhdela Yogyakarta Website',
        subtitle: 'School Profile Website',
        category: 'Frontend Development',
        description:
            'Responsive school profile website for SMP Muhdela Yogyakarta',
        stack: ['Vue.js', 'Tailwind CSS'],
        image: '/projects/smpmuhdela.webp',
        gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
        accentColor: '#34d399',
        repoLink: '#',
        liveLink: 'https://smpmuhdelajogja.sch.id/',
        isFeatured: false,
    },
    {
        id: 6,
        name: 'Content Management System',
        subtitle: 'School CMS Website',
        category: 'Frontend Development',
        description:
            'Content management system for SMP Muhdela Yogyakarta, enabling easy updates to school information, news, and events by non-technical staff.',
        stack: ['Vue.js', 'Tailwind CSS'],
        image: '/projects/cms.webp',
        gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
        accentColor: '#60a5fa',
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
            'Platform manajemen operasional kost untuk landlord dan tenant, mencakup auth, billing, inventory, notifikasi, dan analytics berbasis arsitektur microservices.',
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
        image: '/projects/cms.webp',
        gradient: 'from-emerald-900/20 via-transparent to-cyan-900/20',
        accentColor: '#14b8a6',
        repoLink: 'https://github.com/haikalmumtaz233/kostku-be',
        liveLink: '#',
        isFeatured: false,
    },
];
