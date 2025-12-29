import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { GraduationCap, Award, Users, Download, Sparkles } from 'lucide-react';


const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white">
      <ParallaxHero scrollYProgress={scrollYProgress} />
      <TheJourney />
      <EducationStats />
      <Philosophy />
      <SignatureCTA />
    </div>
  );
};

/* ========================================
   SECTION 1: PARALLAX HERO
======================================== */
const ParallaxHero = ({ scrollYProgress }: { scrollYProgress: any }) => {
  const y = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* === GRID BACKGROUND === */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* === LEFT: TEXT === */}
          <motion.div style={{ opacity }} className="space-y-8">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
                  HELLO,
                </h1>
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
                  I'M HAIKAL.
                </h1>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-xl">
                Fullstack Developer & AI Enthusiast
              </p>
              <p className="text-base md:text-lg text-zinc-500 max-w-xl leading-relaxed">
                More than code. I build digital legacies.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="h-px w-32 bg-gradient-to-r from-white to-transparent"
            />
          </motion.div>

          {/* === RIGHT: IMAGE WITH PARALLAX === */}
          <motion.div style={{ y }} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800"
            >
              {/* === PORTRAIT PLACEHOLDER === */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950">
                <img
                  src="src/assets/itc-nobg.png"
                  alt="Portrait"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* === ACCENT LINE === */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ========================================
   SECTION 2: THE JOURNEY (STICKY SIDEBAR)
======================================== */
const TheJourney = () => {
  const [activeYear, setActiveYear] = useState('2021');

  const journeyData = [
    {
      year: '2021',
      title: 'The Foundation',
      period: '2021-2022',
      description:
        'Where it all began. Started my journey at UPN "Veteran" Yogyakarta, diving deep into Computer Science fundamentals. What began as a passion for gaming evolved into a burning curiosity to understand how virtual worlds are built.',
    },
    {
      year: '2023',
      title: 'The Acceleration',
      period: '2023-2024',
      description:
        'Joined Bangkit Academy and became a Laboratory Assistant. Mentored 200+ students across 8 technical courses including IoT, Web Development, and Databases. This is where teaching became my second passion.',
    },
    {
      year: '2025',
      title: 'The Professional',
      period: '2025-Present',
      description:
        'Graduated with 3.88 GPA and stepped into the professional world. Fullstack Developer Intern at Ruang Media Solusi and Horus Technology, building real-world applications and bringing ideas to life.',
    },
  ];

  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        {/* === SECTION HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">THE JOURNEY</h2>
          <div className="h-px w-20 bg-white" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* === LEFT: STICKY YEAR DISPLAY === */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-[12rem] md:text-[16rem] font-black leading-none text-transparent"
                style={{
                  WebkitTextStroke: '2px rgba(255,255,255,0.1)',
                }}
              >
                {activeYear}
              </motion.div>
              <div className="absolute bottom-0 left-0 text-zinc-500 text-sm font-mono">
                CHAPTER {journeyData.findIndex((j) => j.year === activeYear) + 1}/3
              </div>
            </motion.div>
          </div>

          {/* === RIGHT: STORY CARDS === */}
          <div className="lg:col-span-8 space-y-32">
            {journeyData.map((journey, index) => (
              <StoryCard
                key={journey.year}
                journey={journey}
                index={index}
                setActiveYear={setActiveYear}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StoryCard = ({
  journey,
  index,
  setActiveYear,
}: {
  journey: any;
  index: number;
  setActiveYear: (year: string) => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-50% 0px -50% 0px' });

  useEffect(() => {
    if (isInView) {
      setActiveYear(journey.year);
    }
  }, [isInView, journey.year, setActiveYear]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="relative group"
    >
      {/* === YEAR BADGE === */}
      <div className="inline-flex items-center gap-3 mb-6">
        <span className="text-sm font-mono text-zinc-500">{journey.period}</span>
        <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-zinc-700 to-transparent" />
      </div>

      {/* === CARD === */}
      <div className="relative p-8 md:p-12 border border-zinc-800 rounded-2xl bg-zinc-950/50 backdrop-blur-sm hover:border-zinc-700 transition-all duration-500 group-hover:translate-x-2">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{journey.title}</h3>
        <p className="text-lg text-zinc-400 leading-relaxed">{journey.description}</p>

        {/* === DECORATIVE DOT === */}
        <div className="absolute -left-3 top-12 w-6 h-6 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

/* ========================================
   SECTION 3: EDUCATION & STATS (BENTO GRID)
======================================== */
const EducationStats = () => {
  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-24 bg-zinc-950/50">
      <div className="container mx-auto">
        {/* === SECTION HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">CREDENTIALS</h2>
          <div className="h-px w-20 bg-white" />
        </motion.div>

        {/* === BENTO GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* === CARD 1: EDUCATION (LARGE - SPAN 2) === */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-2 relative p-8 md:p-12 border border-zinc-800 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 overflow-hidden group hover:border-yellow-500/50 transition-all duration-500"
          >
            {/* === ACCENT GLOW === */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <GraduationCap className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                  <span className="text-yellow-500 font-bold text-lg">GPA 3.88/4.00</span>
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-3">Bachelor of Informatics</h3>
              <p className="text-xl text-zinc-400 mb-2">UPN "Veteran" Yogyakarta</p>
              <p className="text-zinc-500 font-mono text-sm">2021 - 2025</p>
            </div>
          </motion.div>

          {/* === CARD 2: CERTIFICATIONS (TALL) === */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:row-span-2 relative p-8 border border-zinc-800 rounded-2xl bg-zinc-950 hover:border-zinc-700 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-zinc-400" />
              <h3 className="text-xl font-bold">Certifications</h3>
            </div>

            <div className="space-y-6">
              <div className="group/cert">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-2 h-2 bg-white rounded-full mt-2" />
                  <div>
                    <p className="font-semibold text-lg">TensorFlow Developer</p>
                    <p className="text-sm text-zinc-500">Google Developers</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              <div className="group/cert">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-2 h-2 bg-white rounded-full mt-2" />
                  <div>
                    <p className="font-semibold text-lg">Associate Data Scientist</p>
                    <p className="text-sm text-zinc-500">BNSP Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* === CARD 3: STATS === */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative p-8 border border-zinc-800 rounded-2xl bg-zinc-950 hover:border-zinc-700 transition-all duration-500 overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative">
              <Users className="w-6 h-6 text-zinc-400 mb-4" />
              <CountUpNumber target={200} />
              <p className="text-zinc-500 text-sm mt-2">Students Mentored</p>
            </div>
          </motion.div>

          {/* === CARD 4: PROJECTS === */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative p-8 border border-zinc-800 rounded-2xl bg-zinc-950 hover:border-zinc-700 transition-all duration-500 overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative">
              <Sparkles className="w-6 h-6 text-zinc-400 mb-4" />
              <CountUpNumber target={20} suffix="+" />
              <p className="text-zinc-500 text-sm mt-2">Projects Completed</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CountUpNumber = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-5xl font-black">
      {count}
      {suffix}
    </div>
  );
};

/* ========================================
   SECTION 4: PHILOSOPHY
======================================== */
const Philosophy = () => {
  const cards = [
    {
      title: 'User-Centric',
      description: 'Every line of code serves a purpose: to create experiences that users love.',
    },
    {
      title: 'Continuous Learning',
      description: 'Technology evolves fast. I evolve faster. Always exploring, always growing.',
    },
    {
      title: 'Quality First',
      description: 'Beautiful code, beautiful products. No compromises on craftsmanship.',
    },
  ];

  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        {/* === SECTION HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">PHILOSOPHY</h2>
          <div className="h-px w-20 bg-white" />
        </motion.div>

        {/* === 3-COLUMN CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative p-8 border border-zinc-800 rounded-2xl bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-white/20 transition-all duration-500 cursor-pointer"
            >
              {/* === HOVER ACCENT === */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-12 h-12 mb-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-500">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ========================================
   SECTION 5: SIGNATURE CTA
======================================== */
const SignatureCTA = () => {
  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* === SIGNATURE LINE === */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-2 h-2 bg-white rounded-full"
            />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Ready to write the next chapter?
          </h2>

          <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
            Let's create something extraordinary together.
          </p>

          <motion.a
            href="/cv.pdf"
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-md hover:bg-zinc-100 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
