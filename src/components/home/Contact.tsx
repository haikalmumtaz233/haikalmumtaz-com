import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Contact = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const yogyakartaTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
      });
      setTime(yogyakartaTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#0a0a0a] min-h-[80vh] flex flex-col">
      {/* === MAIN CTA CONTENT === */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* === HUGE TEXT === */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] as const }}
          className="text-center mb-16"
        >
          <h2
            className="font-black uppercase leading-none text-transparent"
            style={{
              fontSize: 'clamp(3rem, 12vw, 12rem)',
              WebkitTextStroke: '2px white',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <motion.span
              className="block"
              whileHover={{
                WebkitTextFillColor: 'white',
              }}
              transition={{ duration: 0.3 }}
            >
              LET'S WORK
            </motion.span>
            <motion.span
              className="block"
              whileHover={{
                WebkitTextFillColor: 'white',
              }}
              transition={{ duration: 0.3 }}
            >
              TOGETHER
            </motion.span>
          </h2>
        </motion.div>

        {/* === MAGNETIC BUTTON === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.a
            href="mailto:haikalmumtaz@example.com"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56 rounded-full bg-white text-black overflow-hidden cursor-pointer"
          >
            {/* === BACKGROUND ANIMATION === */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* === TEXT === */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                Get in touch
              </span>
              <ArrowUpRight
                size={32}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform group-hover:text-white"
              />
            </div>
          </motion.a>
        </motion.div>
      </div>

      {/* === FOOTER INFO === */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="border-t border-white/10 px-6 py-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          {/* === COPYRIGHT === */}
          <div className="flex items-center gap-2">
            <span>© 2025 Haikal Mumtaz</span>
          </div>

          {/* === LOCAL TIME === */}
          <div className="flex items-center gap-2 font-mono">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Local Time Yogyakarta: {time}</span>
          </div>
        </div>
      </motion.footer>
    </section>
  );
};

export default Contact;
