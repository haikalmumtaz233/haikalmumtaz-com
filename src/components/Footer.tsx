const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* === BRAND / NAME === */}
          <div className="md:col-span-6 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                Haikal Mumtaz
              </h2>
              <p className="text-gray-500 text-lg max-w-sm">
                Fullstack Developer crafting digital experiences with code and creativity.
              </p>
            </div>
          </div>

          {/* === NAVIGATION === */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-6">Sitemap</h3>
            <ul className="space-y-4">
              {['Home', 'Portfolio', 'Achievements', 'Hobbies'].map((item) => (
                <li key={item}>
                  <a href={`/${item === 'Home' ? '' : item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors text-lg">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* === SOCIALS === */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-6">Connect</h3>
            <ul className="space-y-4">
              {[
                { name: 'LinkedIn', url: 'https://linkedin.com' },
                { name: 'GitHub', url: 'https://github.com' },
                { name: 'Instagram', url: 'https://instagram.com' },
                { name: 'Email', url: 'mailto:hmumtaz70@gmail.com' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-lg flex items-center gap-2 group"
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
          <p className="text-gray-500 text-sm">
            © {currentYear} Haikal Mumtaz. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-500 text-sm font-mono">
              Yogyakarta, Indonesia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;