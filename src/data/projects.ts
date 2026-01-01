export interface Project {
    id: number;
    name: string;
    subtitle: string;
    category: string;
    description: string;
    stack: string[];
    image: string;
    gradient: string;
    repoLink: string;
    liveLink: string;
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
        image: '/projects/tixnow.png',
        gradient: 'from-purple-900/20 via-transparent to-blue-900/20',
        repoLink: 'https://github.com/haikalmumtaz233/TixNow',
        liveLink: '#',
    },
    {
        id: 2,
        name: 'Street Beats',
        subtitle: 'Roblox Game',
        category: 'Game Development',
        description:
            'Multiplayer rhythm game on Roblox platform where players hit notes in sync with music tracks to score points and compete on leaderboards.',
        stack: ['Lua', 'Roblox Studio'],
        image: '/projects/streetBeats.jpg',
        gradient: 'from-orange-900/20 via-transparent to-red-900/20',
        repoLink: 'https://discord.gg/sc6F4e8VhN',
        liveLink: 'https://www.roblox.com/games/98953012685374/Street-Beats',
    },
    {
        id: 3,
        name: 'Portfolio',
        subtitle: 'Personal Portfolio Website',
        category: 'Frontend Development',
        description:
            'Modern, interactive portfolio website showcasing projects with advanced animations and smooth user experience.',
        stack: ['React', 'Framer Motion', 'Tailwind'],
        image: '/projects/portfolio.png',
        gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
        repoLink: 'https://github.com/haikalmumtaz233/haikalmumtaz-com',
        liveLink: 'https://haikalmumtaz-com.vercel.app/',
    },
    {
        id: 4,
        name: 'Vehicle Route LeafletJS',
        subtitle: 'Bus Route Mapping Application',
        category: 'Frontend Development',
        description:
            'Bus route mapping application using LeafletJS for interactive visualization and navigation of vehicle routes.',
        stack: ['JavaScript', 'LeafletJS', 'HTML', 'CSS'],
        image: '/projects/vehicleroute.png',
        gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
        repoLink: 'https://github.com/haikalmumtaz233/vehicle-route-leafletjs',
        liveLink: 'https://haikalmumtaz233.github.io/vehicle-route-leafletjs/',
    },
    {
        id: 5,
        name: 'SMP Muhdela Yogyakarta Website',
        subtitle: 'School Profile Website',
        category: 'Frontend Development',
        description:
            'Responsive school profile website for SMP Muhdela Yogyakarta',
        stack: ['Vue.js', 'Tailwind CSS'],
        image: '/projects/smpmuhdela.png',
        gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
        repoLink: '#',
        liveLink: '#',
    },
    {
        id: 7,
        name: 'Content Management System',
        subtitle: 'School CMS Website',
        category: 'Frontend Development',
        description:
            'Content management system for SMP Muhdela Yogyakarta, enabling easy updates to school information, news, and events by non-technical staff.',
        stack: ['Vue.js', 'Tailwind CSS'],
        image: '/projects/cms.png',
        gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
        repoLink: '#',
        liveLink: '#',
    },
    

];