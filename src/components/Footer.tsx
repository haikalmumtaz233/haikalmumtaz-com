import { ArrowUp } from 'lucide-react';
import { useLenis } from 'lenis/react';
import { profile } from '../data/profile';

const Footer = () => {
  const lenis = useLenis();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#09080e]">
      <div className="shell flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-8 md:py-10">
        <p className="text-sm text-white/50">
          &copy; {currentYear} {profile.name}
        </p>
        <p className="order-3 w-full text-sm text-white/50 sm:order-none sm:w-auto">{profile.location}</p>
        <button
          type="button"
          onClick={scrollToTop}
          className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 hover:text-white"
        >
          Back to top
          <ArrowUp className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
