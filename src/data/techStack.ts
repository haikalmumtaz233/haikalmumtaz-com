export interface TechItem {
  name: string;
  logo: string;
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}

export const techCategories: TechCategory[] = [
  {
    title: "Languages",
    items: [
      { name: "JavaScript", logo: "https://cdn.simpleicons.org/javascript" },
      { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript" },
      { name: "PHP", logo: "https://cdn.simpleicons.org/php" },
      { name: "Go", logo: "https://cdn.simpleicons.org/go" },
      { name: "Lua", logo: "https://cdn.simpleicons.org/lua/white" },
      { name: "C++", logo: "https://cdn.simpleicons.org/cplusplus" },
      { name: "Python", logo: "https://cdn.simpleicons.org/python" },
      { name: "Java", logo: "/techStack/java.webp" },
      { name: "Kotlin", logo: "https://cdn.simpleicons.org/kotlin" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", logo: "https://cdn.simpleicons.org/react" },
      { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/white" },
      { name: "Vue.js", logo: "https://cdn.simpleicons.org/vuedotjs" },
      { name: "Flutter", logo: "https://cdn.simpleicons.org/flutter" },
      { name: "Tailwind CSS", logo: "https://cdn.simpleicons.org/tailwindcss" },
      { name: "PrimeVue", logo: "https://cdn.simpleicons.org/primevue" },
      { name: "Bootstrap", logo: "https://cdn.simpleicons.org/bootstrap" },
      { name: "Thymeleaf", logo: "https://cdn.simpleicons.org/thymeleaf" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs" },
      { name: "Express.js", logo: "https://cdn.simpleicons.org/express/white" },
      { name: "Gin", logo: "https://cdn.simpleicons.org/gin" },
      { name: "Laravel", logo: "https://cdn.simpleicons.org/laravel" },
      { name: "Flask", logo: "https://cdn.simpleicons.org/flask/white" },
      { name: "FastAPI", logo: "https://cdn.simpleicons.org/fastapi" },
      { name: "Spring Boot", logo: "https://cdn.simpleicons.org/springboot" },
    ],
  },
  {
    title: "Databases",
    items: [
      { name: "MySQL", logo: "https://cdn.simpleicons.org/mysql" },
      { name: "PostgreSQL", logo: "https://cdn.simpleicons.org/postgresql" },
      { name: "MongoDB", logo: "https://cdn.simpleicons.org/mongodb" },
      { name: "Firebase", logo: "https://cdn.simpleicons.org/firebase" },
    ],
  },
  {
    title: "Data Science & AI",
    items: [
      { name: "TensorFlow", logo: "https://cdn.simpleicons.org/tensorflow" },
      { name: "Keras", logo: "https://cdn.simpleicons.org/keras" },
      { name: "Scikit-Learn", logo: "https://cdn.simpleicons.org/scikitlearn" },
      { name: "Pandas", logo: "https://cdn.simpleicons.org/pandas/white" },
      { name: "Ultralytics", logo: "https://cdn.simpleicons.org/ultralytics/white" },
      { name: "R", logo: "https://cdn.simpleicons.org/r" },
    ],
  },
  {
    title: "DevOps & Cloud",
    items: [
      { name: "Docker", logo: "https://cdn.simpleicons.org/docker" },
      { name: "Kubernetes", logo: "https://cdn.simpleicons.org/kubernetes" },
      { name: "Jenkins", logo: "https://cdn.simpleicons.org/jenkins" },
      { name: "GitLab", logo: "https://cdn.simpleicons.org/gitlab" },
      { name: "Google Cloud", logo: "https://cdn.simpleicons.org/googlecloud" },
    ],
  },
];
