const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNavigation = (path: string) => {
    if (path === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0a0a0a] pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* === BRAND / NAME === */}
          <div className="col-span-2 md:col-span-6 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                Haikal Mumtaz
              </h2>
              <p className="text-slate-400 text-lg max-w-sm">
                Fullstack Developer crafting digital experiences with code and creativity.
              </p>
            </div>
          </div>

          {/* === NAVIGATION === */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-6">Navigate</h3>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => handleNavigation('#top')}
                  className="text-slate-300 hover:text-white transition-colors text-lg text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('#projects')}
                  className="text-slate-300 hover:text-white transition-colors text-lg text-left"
                >
                  Projects
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('#experience')}
                  className="text-slate-300 hover:text-white transition-colors text-lg text-left"
                >
                  Experience
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('#contact')}
                  className="text-slate-300 hover:text-white transition-colors text-lg text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* === SOCIALS === */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-6">Connect</h3>
            <ul className="space-y-4">
              {[
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/haikal-mumtaz/' },
                { name: 'GitHub', url: 'https://github.com/haikalmumtaz233' },
                { name: 'Instagram', url: 'https://www.instagram.com/haikal_mumtaz23/' },
                { name: 'Email', url: 'mailto:hmumtaz70@gmail.com' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white transition-colors text-lg flex items-center gap-2 group"
                  >
                    {link.name}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* === BOTTOM BAR === */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Haikal Mumtaz. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-slate-500 text-sm font-mono">
              Yogyakarta, Indonesia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;