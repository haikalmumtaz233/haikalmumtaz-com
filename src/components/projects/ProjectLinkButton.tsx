import type { ReactNode } from 'react';
import { ArrowUpRight, Download, MessageCircle } from 'lucide-react';
import type { LinkKind, ProjectLink } from '../../lib/projectIndex';
import BrandIcon from '../ui/BrandIcon';

const labels: Record<LinkKind, string> = {
  download: 'Download',
  source: 'Source code',
  community: 'Community',
  website: 'Live site',
};

const icons: Record<LinkKind, ReactNode> = {
  download: <Download size={16} aria-hidden="true" />,
  source: <BrandIcon brand="GitHub" size={16} aria-hidden="true" />,
  community: <MessageCircle size={16} aria-hidden="true" />,
  website: <ArrowUpRight size={16} aria-hidden="true" />,
};

interface ProjectLinkButtonProps {
  link: ProjectLink;
  projectName: string;
}

const ProjectLinkButton = ({ link, projectName }: ProjectLinkButtonProps) => (
  <a
    href={link.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${labels[link.kind]} for ${projectName} (opens in a new tab)`}
    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition-colors duration-300 hover:border-white/45 hover:text-white"
  >
    {icons[link.kind]}
    {labels[link.kind]}
  </a>
);

export default ProjectLinkButton;
