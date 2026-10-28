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
    title: 'Languages',
    items: [
      { name: 'JavaScript', icon: spriteIcon('tech-javascript') },
      { name: 'TypeScript', icon: spriteIcon('tech-typescript') },
      { name: 'Go', icon: spriteIcon('tech-go') },
      { name: 'Java', icon: imageIcon('/techStack/java.webp') },
      { name: 'Python', icon: spriteIcon('tech-python') },
      { name: 'Rust', icon: spriteIcon('tech-rust-white') },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'Vue', icon: spriteIcon('tech-vuedotjs') },
      { name: 'Astro', icon: spriteIcon('tech-astro') },
      { name: 'Svelte', icon: spriteIcon('tech-svelte') },
      { name: 'React', icon: spriteIcon('tech-react') },
      { name: 'Next.js', icon: spriteIcon('tech-nextdotjs-white') },
      { name: 'Tailwind CSS', icon: spriteIcon('tech-tailwindcss') },
      { name: 'Tauri', icon: spriteIcon('tech-tauri') },
    ],
  },
  {
    title: 'Mobile',
    items: [
      { name: 'Kotlin', icon: spriteIcon('tech-kotlin') },
      { name: 'Dart', icon: spriteIcon('tech-dart') },
      { name: 'Flutter', icon: spriteIcon('tech-flutter') },
      { name: 'Jetpack Compose', icon: spriteIcon('tech-jetpackcompose') },
    ],
  },
  {
    title: 'AI',
    items: [
      { name: 'TensorFlow', icon: spriteIcon('tech-tensorflow') },
      { name: 'scikit-learn', icon: spriteIcon('tech-scikitlearn') },
      { name: 'YOLOv8', icon: spriteIcon('tech-ultralytics-white') },
      { name: 'MCP', icon: spriteIcon('tech-modelcontextprotocol-white') },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'Spring Boot', icon: spriteIcon('tech-springboot') },
      { name: 'Gin', icon: spriteIcon('tech-gin') },
      { name: 'FastAPI', icon: spriteIcon('tech-fastapi') },
      { name: 'RabbitMQ', icon: spriteIcon('tech-rabbitmq') },
      { name: 'PostgreSQL', icon: spriteIcon('tech-postgresql') },
      { name: 'Supabase', icon: spriteIcon('tech-supabase') },
    ],
  },
  {
    title: 'DevOps',
    items: [
      { name: 'Docker', icon: spriteIcon('tech-docker') },
      { name: 'Kubernetes', icon: spriteIcon('tech-kubernetes') },
      { name: 'OpenShift', icon: spriteIcon('tech-redhatopenshift') },
      { name: 'Jenkins', icon: spriteIcon('tech-jenkins') },
      { name: 'GitHub Actions', icon: spriteIcon('tech-githubactions') },
      { name: 'GitLab', icon: spriteIcon('tech-gitlab') },
      { name: 'Git', icon: spriteIcon('tech-git') },
    ],
  },
  {
    title: 'Cloud',
    items: [
      { name: 'Google Cloud', icon: spriteIcon('tech-googlecloud') },
      { name: 'Cloudflare', icon: spriteIcon('tech-cloudflare') },
      { name: 'Vercel', icon: spriteIcon('tech-vercel-white') },
    ],
  },
];
