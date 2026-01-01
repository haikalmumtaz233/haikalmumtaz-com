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
        company: "Ruang Media Solusi",
        role: "Fullstack Developer",
        year: "2025",
        period: "NOV — PRESENT",
        description:
            "Building modern web solutions with Vue.js and Tailwind CSS. Developing responsive school profile websites with engaging UI/UX designs, collaborating closely with the team on fullstack development tasks to deliver polished digital experiences.",
    },
    {
        company: "Horus Technology",
        role: "Fullstack Developer Intern",
        year: "2025",
        period: "OCT — NOV",
        description:
            "Contributed to the TING App using modern web technologies. Designed and developed compelling landing pages with pixel-perfect attention to detail, working across both frontend and backend to implement robust features.",
    },
    {
        company: "IT Club - UPN Veteran Yogyakarta",
        role: "Deputy Head of Web Development",
        year: "2023",
        period: "JUL — AUG 2024",
        description:
            "Led training programs for React and Express.js, organized workshops and coding bootcamps for aspiring developers. Managed the web development team and coordinated projects that fostered a collaborative learning environment.",
    },
    {
        company: "Bangkit Academy 2023",
        subtitle: "By Google, GoTo, & Traveloka",
        role: "Machine Learning Cohort",
        year: "2023",
        period: "AUG 23 — JAN 24",
        description:
            "Selected as a Machine Learning Cohort in a competitive program led by Google. Completed specialized curriculum in Python, Data Processing, and Model Deployment. Built a capstone project for IoT-based electricity forecasting using LSTM neural networks, achieving high-accuracy time-series predictions.",
    },
    {
        company: "Informatics Lab - UPN Veteran Yogyakarta",
        role: "Laboratory Assistant",
        year: "2022",
        period: "AUG — JUL 2025",
        description:
            "Mentored over 200 students across 8 different technical courses including Database Systems, IoT, and Web Development. Created comprehensive teaching materials and hands-on lab exercises that bridged theoretical knowledge with practical application.",
    },
];
