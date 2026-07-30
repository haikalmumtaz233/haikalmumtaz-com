import { imageIcon, spriteIcon, type TechIconSource } from './icons';

export interface TechItem {
  name: string;
  icon: TechIconSource;
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}

export const techCategories: TechCategory[] = [
  {
    title: "Languages",
    items: [
      { name: "JavaScript", icon: spriteIcon('tech-javascript') },
      { name: "TypeScript", icon: spriteIcon('tech-typescript') },
      { name: "PHP", icon: spriteIcon('tech-php') },
      { name: "Go", icon: spriteIcon('tech-go') },
      { name: "Lua", icon: spriteIcon('tech-lua-white') },
      { name: "C++", icon: spriteIcon('tech-cplusplus') },
      { name: "Python", icon: spriteIcon('tech-python') },
      { name: "Java", icon: imageIcon('/techStack/java.webp') },
      { name: "Kotlin", icon: spriteIcon('tech-kotlin') },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", icon: spriteIcon('tech-react') },
      { name: "Next.js", icon: spriteIcon('tech-nextdotjs-white') },
      { name: "Vue.js", icon: spriteIcon('tech-vuedotjs') },
      { name: "Flutter", icon: spriteIcon('tech-flutter') },
      { name: "Tailwind CSS", icon: spriteIcon('tech-tailwindcss') },
      { name: "PrimeVue", icon: spriteIcon('tech-primevue') },
      { name: "Bootstrap", icon: spriteIcon('tech-bootstrap') },
      { name: "Thymeleaf", icon: spriteIcon('tech-thymeleaf') },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js", icon: spriteIcon('tech-nodedotjs') },
      { name: "Express.js", icon: spriteIcon('tech-express-white') },
      { name: "Gin", icon: spriteIcon('tech-gin') },
      { name: "Laravel", icon: spriteIcon('tech-laravel') },
      { name: "Flask", icon: spriteIcon('tech-flask-white') },
      { name: "FastAPI", icon: spriteIcon('tech-fastapi') },
      { name: "Spring Boot", icon: spriteIcon('tech-springboot') },
    ],
  },
  {
    title: "Databases",
    items: [
      { name: "MySQL", icon: spriteIcon('tech-mysql') },
      { name: "PostgreSQL", icon: spriteIcon('tech-postgresql') },
      { name: "MongoDB", icon: spriteIcon('tech-mongodb') },
      { name: "Firebase", icon: spriteIcon('tech-firebase') },
    ],
  },
  {
    title: "Data Science & AI",
    items: [
      { name: "TensorFlow", icon: spriteIcon('tech-tensorflow') },
      { name: "Keras", icon: spriteIcon('tech-keras') },
      { name: "Scikit-Learn", icon: spriteIcon('tech-scikitlearn') },
      { name: "Pandas", icon: spriteIcon('tech-pandas-white') },
      { name: "Ultralytics", icon: spriteIcon('tech-ultralytics-white') },
      { name: "R", icon: spriteIcon('tech-r') },
    ],
  },
  {
    title: "DevOps & Cloud",
    items: [
      { name: "Docker", icon: spriteIcon('tech-docker') },
      { name: "Kubernetes", icon: spriteIcon('tech-kubernetes') },
      { name: "Jenkins", icon: spriteIcon('tech-jenkins') },
      { name: "GitLab", icon: spriteIcon('tech-gitlab') },
      { name: "Google Cloud", icon: spriteIcon('tech-googlecloud') },
    ],
  },
];
