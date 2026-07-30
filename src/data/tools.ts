import { imageIcon, spriteIcon, type TechIconSource } from './icons';

export interface Tool {
  name: string;
  icon: TechIconSource;
}

export const tools: Tool[] = [
  {
    name: 'Git',
    icon: spriteIcon('tech-git'),
  },
  {
    name: 'GitHub',
    icon: spriteIcon('tech-github-white'),
  },
  {
    name: 'VS Code',
    icon: imageIcon('/tools/vscode.svg'),
  },
  {
    name: 'Google Colab',
    icon: spriteIcon('tech-googlecolab'),
  },
  {
    name: 'Google Cloud',
    icon: spriteIcon('tech-googlecloud'),
  },
  {
    name: 'Cursor',
    icon: spriteIcon('tech-cursor-white'),
  },
  {
    name: 'Android Studio',
    icon: spriteIcon('tech-androidstudio'),
  },
  {
    name: 'Laragon',
    icon: spriteIcon('tech-laragon'),
  },
  {
    name: 'Postman',
    icon: spriteIcon('tech-postman'),
  },
  {
    name: 'Apidog',
    icon: imageIcon('/tools/apidog.svg'),
  },
  {
    name: 'Canva',
    icon: imageIcon('/tools/canva.svg'),
  },
  {
    name: 'Figma',
    icon: spriteIcon('tech-figma'),
  },
  {
    name: 'CapCut',
    icon: imageIcon('/tools/capcut.svg'),
  },
];
