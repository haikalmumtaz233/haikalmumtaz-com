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
        stack: ['Vue.js', 'Tailwind CSS', 'Backend API'],
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
        gradient: 'from-purple-900/20 via-transparent to-blue-900/20',
        repoLink: '#',
        liveLink: '#',
    },
    {
        id: 2,
        name: 'StreetBeats',
        subtitle: 'Music & Urban Culture Platform',
        category: 'Frontend Development',
        description:
            'Dynamic platform celebrating urban music culture with curated playlists, artist profiles, and community features for music enthusiasts.',
        stack: ['React', 'Tailwind CSS', 'Supabase'],
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        gradient: 'from-orange-900/20 via-transparent to-red-900/20',
        repoLink: '#',
        liveLink: '#',
    },
    {
        id: 3,
        name: 'Portfolio',
        subtitle: 'Creative Developer Showcase',
        category: 'Frontend Development',
        description:
            'Modern, interactive portfolio website showcasing projects with advanced animations and smooth user experience.',
        stack: ['React', 'Framer Motion', 'Tailwind'],
        image: 'https://images.unsplash.com/photo-1545665277-5937bf04a560?w=800&q=80',
        gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
        repoLink: '#',
        liveLink: '#',
    },
];