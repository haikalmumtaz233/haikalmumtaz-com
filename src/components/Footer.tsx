import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
    { name: 'Github', icon: Github, url: '#' },
    { name: 'Email', icon: Mail, url: 'mailto:' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* === COPYRIGHT === */}
          <p className="text-sm md:text-base text-gray-300 text-center md:text-left">
            © {currentYear} Muhammad Raditya Haikal Mumtaz. Built with React & Tailwind.
          </p>

          {/* === SOCIAL LINKS === */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
