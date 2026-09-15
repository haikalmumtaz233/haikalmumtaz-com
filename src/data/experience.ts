export interface Experience {
    company: string;
    role: string;
    year: string;
    period: string;
    description: string;
    subtitle?: string;
}

export const experiences: Experience[] = [
    {
        company: "PT. Mitra Integrasi Informatika (MII)",
        role: "Application Developer Jr.",
        year: "2026",
        period: "Feb 2026 – Present",
        description:
            "Assigned as an Application Developer for PT Bank Negara Indonesia (Persero), Tbk., placed within the Center of Excellence (COE) Core Banking department.",
        
    },
    {
        company: "Ruang Media Solusi",
        role: "Fullstack Developer",
        year: "2025",
        period: "Nov 2025 – Feb 2026",
        description:
            "Developed the SIMASET asset management system covering inventory and procurement modules, and built a public profile website alongside a content management dashboard for SMP Muhammadiyah 8 Yogyakarta.",
    },
    {
        company: "Horus Technology",
        role: "Fullstack Developer Intern",
        year: "2025",
        period: "Oct 2025 – Nov 2025",
        description:
            "Contributed to the development of the company's landing page and maintained features for the TING business application, specifically focusing on the Settings and Promotion modules.",
    },
    {
        company: "IT Club - UPN Veteran Yogyakarta",
        role: "Deputy Head of Web Development",
        year: "2023",
        period: "Jul 2023 – Aug 2024",
        description:
            "Led training programs for React and Express.js, organized workshops and coding bootcamps for aspiring developers. Managed the web development team and coordinated projects that fostered a collaborative learning environment.",
    },
    {
        company: "Bangkit Academy 2023",
        subtitle: "By Google, GoTo, & Traveloka",
        role: "Machine Learning Cohort",
        year: "2023",
        period: "Aug 2023 – Jan 2024",
        description:
            "Selected as a Machine Learning Cohort in a competitive program led by Google. Completed specialized curriculum in Python, Data Processing, and Model Deployment. Built a capstone project for IoT-based electricity forecasting using LSTM neural networks, achieving high-accuracy time-series predictions.",
    },
    {
        company: "Informatics Lab - UPN Veteran Yogyakarta",
        role: "Laboratory Assistant",
        year: "2022",
        period: "Aug 2022 – Jul 2025",
        description:
            "Mentored over 200 students across 8 different technical courses including Database Systems, IoT, and Web Development. Created comprehensive teaching materials and hands-on lab exercises that bridged theoretical knowledge with practical application.",
    },
];
