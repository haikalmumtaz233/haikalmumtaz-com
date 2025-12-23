import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Trophy, Brain, BadgeCheck, ArrowRight, Sparkles, Award } from 'lucide-react';
import { useState, useRef } from 'react';

const Achievements = () => {
  return (
    <section className="relative min-h-screen bg-transparent py-24 md:py-32 overflow-hidden">
      {/* === BACKGROUND EFFECTS === */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* === PAGE HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center mb-24"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Honors & Credentials
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Professional recognition and verified expertise that validate my commitment to excellence in technology.
          </p>
        </motion.div>

        {/* === AWARD SPOTLIGHT SECTION === */}
        <WinnerCard />

        {/* === SECTION DIVIDER === */}
        <div className="max-w-5xl mx-auto my-24">
          <div className="relative h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-sm"></div>
          </div>
        </div>

        {/* === CERTIFICATIONS SECTION === */}
        <CertificationsGrid />
      </div>
    </section>
  );
};

const WinnerCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="max-w-5xl mx-auto"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        whileHover={{ scale: 1.01, rotateX: 2, rotateY: 2 }}
        className="group relative overflow-hidden rounded-3xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* === SPOTLIGHT EFFECT === */}
        {isHovering && (
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent)`,
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
          />
        )}

        {/* === RADIAL BACKGROUND === */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),rgba(0,0,0,0.9)_70%)]"></div>
        
        {/* === FEATURED BADGE === */}
        <div className="absolute top-6 right-6 z-20">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg shadow-amber-500/50">
            <Award size={16} className="text-black" />
            <span className="text-black text-xs font-black uppercase tracking-wider">Featured</span>
          </div>
        </div>

        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-amber-950/40 via-neutral-950/60 to-black/80 border border-amber-500/30 rounded-3xl p-10 md:p-16">
          {/* === SPARKLE DECORATORS === */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-16 left-16 w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
            <div className="absolute top-24 right-24 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute bottom-16 right-16 w-2 h-2 bg-amber-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* === AMBIENT GLOW === */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-yellow-500/15 rounded-full blur-3xl"></div>

          {/* === CONTENT === */}
          <div className="relative flex flex-col md:flex-row items-center gap-10">
            {/* === GLASS TROPHY CONTAINER === */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* === OUTER GLOW === */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                
                {/* === GLASS CIRCLE === */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full backdrop-blur-xl bg-gradient-to-br from-amber-500/30 to-yellow-500/20 border-2 border-amber-400/40 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                  <Trophy size={80} className="text-amber-300" strokeWidth={1.5} />
                  
                  {/* === INNER GLOW === */}
                  <div className="absolute inset-8 bg-amber-400/20 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>

            {/* === TEXT CONTENT === */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <Sparkles size={24} className="text-amber-400" />
                <span className="text-amber-400 text-sm font-bold uppercase tracking-widest">Championship Achievement</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent mb-6 leading-tight">
                2nd Place Winner
              </h2>
              
              <p className="text-2xl md:text-3xl lg:text-4xl text-amber-200/90 font-bold mb-6">
                Best Capstone Project
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400">
                <div className="px-5 py-2.5 backdrop-blur-xl bg-amber-500/10 border border-amber-400/30 rounded-full">
                  <span className="text-amber-300 text-sm font-bold">Career Vibe Check</span>
                </div>
                <span className="text-amber-500/50 text-2xl font-bold">•</span>
                <span className="text-amber-300/80 text-lg font-bold">2025</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CertificationsGrid = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
      >
        Professional Certifications
      </motion.h3>

      <div className="grid md:grid-cols-2 gap-8">
        <CertificateCard
          icon={<Brain size={48} />}
          title="TensorFlow Developer Certificate"
          organization="Google Developers"
          year="2024"
          badge="Verified"
          color="orange"
          delay={0.5}
        />
        
        <CertificateCard
          icon={<BadgeCheck size={48} />}
          title="Associate Data Scientist"
          organization="BNSP Indonesia"
          year="2024"
          badge="Official"
          color="blue"
          delay={0.6}
        />
      </div>
    </div>
  );
};

interface CertificateCardProps {
  icon: React.ReactNode;
  title: string;
  organization: string;
  year: string;
  badge: string;
  color: 'orange' | 'blue';
  delay: number;
}

const CertificateCard = ({ icon, title, organization, year, badge, color, delay }: CertificateCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const colorClasses = {
    orange: {
      border: 'border-orange-500/30',
      bg: 'from-orange-500/20 to-red-500/20',
      text: 'text-orange-400',
      glow: 'bg-orange-500/10',
      badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      link: 'text-orange-400 hover:text-orange-300',
    },
    blue: {
      border: 'border-blue-500/30',
      bg: 'from-blue-500/20 to-indigo-500/20',
      text: 'text-blue-400',
      glow: 'bg-blue-500/10',
      badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      link: 'text-blue-400 hover:text-blue-300',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02, y: -8 }}
      className="group relative overflow-hidden rounded-2xl"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* === SPOTLIGHT EFFECT === */}
      {isHovering && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.05), transparent)`,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          }}
        />
      )}

      <div className={`relative h-full backdrop-blur-xl bg-white/5 border ${colors.border} rounded-2xl p-8 transition-all duration-500`}>
        {/* === BACKGROUND GLOW === */}
        <div className={`absolute -top-16 -right-16 w-48 h-48 ${colors.glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

        {/* === CONTENT === */}
        <div className="relative">
          {/* === FRAMED ICON === */}
          <div className="mb-6">
            <div className={`inline-flex p-5 bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl shadow-lg ${colors.text}`}>
              {icon}
              
              {/* === INNER GLOW === */}
              <div className={`absolute inset-0 ${colors.glow} blur-xl opacity-50 rounded-2xl`}></div>
            </div>
          </div>

          {/* === BADGE === */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${colors.badge} border rounded-full text-xs font-bold uppercase tracking-wider mb-6`}>
            <span className={`w-2 h-2 ${colors.text.replace('text-', 'bg-')} rounded-full animate-pulse`}></span>
            {badge}
          </div>

          {/* === TEXT === */}
          <h4 className={`text-2xl md:text-3xl font-bold text-white mb-3 group-hover:${colors.text} transition-colors duration-300`}>
            {title}
          </h4>
          
          <p className="text-gray-300 font-semibold mb-1 text-lg">{organization}</p>
          <p className="text-gray-500 text-sm mb-8">Issued {year}</p>

          {/* === TEXT LINK === */}
          <motion.a
            href="#"
            className={`inline-flex items-center gap-2 ${colors.link} font-semibold text-sm group/link transition-all duration-300`}
            whileHover={{ x: 5 }}
          >
            View Certificate
            <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform duration-300" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default Achievements;
