import { motion, type Variants } from 'framer-motion';
import { Gamepad2, Music, Film, Laptop, Trophy, Crown, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { hobbies, type HobbyItem, type GamingContent, type MusicContent, type MoviesContent, type TechContent } from '../data/hobbies';

const Hobbies = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-transparent py-24 md:py-32 overflow-hidden">
      {/* === BACKGROUND EFFECTS === */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.06),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.06),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* === PAGE HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Life & Interests
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A glimpse into what fuels my creativity when I'm AFK.
          </p>
        </motion.div>

        {/* === BENTO GRID === */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]"
        >
          {hobbies.map((hobby) => (
            <BentoWidget key={hobby.id} hobby={hobby} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const BentoWidget = ({ hobby }: { hobby: HobbyItem }) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const renderContent = () => {
    switch (hobby.type) {
      case 'gaming':
        return <GamingWidget content={hobby.content as GamingContent} title={hobby.title} />;
      case 'music':
        return <MusicWidget content={hobby.content as MusicContent} title={hobby.title} />;
      case 'movies':
        return <MoviesWidget content={hobby.content as MoviesContent} title={hobby.title} />;
      case 'tech':
        return <TechWidget content={hobby.content as TechContent} title={hobby.title} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className={`${hobby.colSpan} ${hobby.rowSpan} md:${hobby.colSpan} md:${hobby.rowSpan} col-span-1`}
    >
      <div className="group relative h-full overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 shadow-xl">
        {renderContent()}
      </div>
    </motion.div>
  );
};

const GamingWidget = ({ content, title }: { content: GamingContent; title: string }) => {
  const [hoveredGame, setHoveredGame] = useState<number | null>(null);

  return (
    <div className="relative w-full h-full grid grid-cols-2 gap-0.5">
      {content.games.map((game, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredGame(index)}
          onMouseLeave={() => setHoveredGame(null)}
          className={`relative overflow-hidden transition-all duration-500 ${
            hoveredGame === null 
              ? 'brightness-100' 
              : hoveredGame === index 
                ? 'brightness-110' 
                : 'brightness-50'
          }`}
        >
          {/* === GAME BACKGROUND === */}
          <div className="absolute inset-0">
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
          </div>

          {/* === CONTENT === */}
          <div className="relative h-full flex flex-col justify-between p-4">
            {/* === GAME ICON === */}
            <div className="flex items-center gap-2">
              <Gamepad2 size={18} className="text-cyan-400" />
            </div>

            {/* === GAME INFO === */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                {game.name}
              </h3>
              
              {/* === GLOWING RANK BADGE === */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-md border border-amber-400/40 rounded-full">
                <Crown size={14} className="text-amber-400" />
                <span className="text-amber-300 text-xs font-black uppercase tracking-wider">
                  {game.rank}
                </span>
                <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* === HOVER GLOW === */}
          <div className={`absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none ${
            hoveredGame === index ? 'opacity-100' : ''
          }`}></div>
        </div>
      ))}
    </div>
  );
};

const MusicWidget = ({ content, title }: { content: MusicContent; title: string }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative w-full h-full p-6 flex flex-col">
      {/* === HEADER === */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Music size={20} className="text-pink-400" />
          <span className="text-pink-400 text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-full transition-colors"
        >
          {isPlaying ? <Pause size={14} className="text-pink-400" /> : <Play size={14} className="text-pink-400" />}
        </button>
      </div>

      {/* === NOW PLAYING === */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-1">Now Playing</div>
        <div className="text-xl font-bold text-white mb-2">{content.nowPlaying.track}</div>
        
        {/* === PROGRESS BAR === */}
        <div className="relative w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
            animate={{
              width: isPlaying ? ['0%', '100%'] : '45%',
            }}
            transition={{
              duration: 30,
              ease: 'linear',
              repeat: isPlaying ? Infinity : 0,
            }}
          />
        </div>
      </div>

      {/* === PLAYLIST === */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {content.playlist.map((song, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
              index === 0 ? 'bg-pink-500/10 border border-pink-500/20' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex-shrink-0 w-6 text-center text-xs font-bold text-gray-500">
              {index + 1}
            </div>
            
            {/* === EQUALIZER === */}
            {index === 0 && isPlaying && (
              <div className="flex items-end gap-0.5 h-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-pink-500 rounded-full"
                    animate={{
                      height: ['30%', '100%', '40%', '80%'],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            )}
            
            <span className={`text-sm flex-1 truncate ${
              index === 0 ? 'text-white font-semibold' : 'text-gray-400'
            }`}>
              {song}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MoviesWidget = ({ content, title }: { content: MoviesContent; title: string }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* === BACKGROUND OVERLAY === */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

      {/* === POSTER GRID === */}
      <motion.div
        whileHover={{ y: -20 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 p-4"
      >
        <div className="grid grid-cols-2 gap-2 h-full">
          {content.posters.map((poster, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg"
            >
              <img
                src={poster}
                alt={`Movie ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* === HEADER === */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="flex items-center gap-2 mb-2">
          <Film size={20} className="text-purple-400" />
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <h3 className="text-2xl font-black text-white">
          {content.title}
        </h3>
      </div>

      {/* === TICKET STUB DECORATION === */}
      <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-dashed border-white/20 rounded-lg rotate-12 opacity-30"></div>
    </div>
  );
};

const TechWidget = ({ content, title }: { content: TechContent; title: string }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
      {/* === BACKGROUND GLOW === */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* === ICON === */}
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
        <div className="relative p-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl">
          <Laptop size={48} className="text-blue-400" />
        </div>
      </motion.div>

      {/* === TEXT === */}
      <div className="relative">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-2">{title}</span>
        <h3 className="text-xl font-bold text-white mb-2">
          {content.item}
        </h3>
        {content.description && (
          <p className="text-gray-400 text-sm">
            {content.description}
          </p>
        )}
      </div>

      {/* === DECORATIVE DOTS === */}
      <div className="absolute top-4 right-4 flex gap-1">
        <div className="w-1.5 h-1.5 bg-blue-400/40 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-indigo-400/40 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-purple-400/40 rounded-full"></div>
      </div>
    </div>
  );
};

export default Hobbies;