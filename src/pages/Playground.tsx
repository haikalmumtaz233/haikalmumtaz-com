import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Sparkles, Zap } from 'lucide-react';

interface Experiment {
  id: number;
  title: string;
  type: string;
  date: string;
  preview: string;
  icon: 'code' | 'sparkles' | 'zap';
}

const Playground = () => {
  const experiments: Experiment[] = [
    {
      id: 1,
      title: 'Neon Button',
      type: 'UI Component',
      date: '2024-01',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: 'sparkles',
    },
    {
      id: 2,
      title: '3D Card Tilt',
      type: 'Animation',
      date: '2024-02',
      preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: 'zap',
    },
    {
      id: 3,
      title: 'Infinite Text Scroll',
      type: 'Animation',
      date: '2024-02',
      preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: 'code',
    },
    {
      id: 4,
      title: 'Grainy Gradient',
      type: 'Shader',
      date: '2024-03',
      preview: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: 'sparkles',
    },
    {
      id: 5,
      title: 'Magnetic Cursor',
      type: 'UI Component',
      date: '2024-03',
      preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      icon: 'zap',
    },
  ];

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'code':
        return <Code2 className="w-5 h-5" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'zap':
        return <Zap className="w-5 h-5" />;
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
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

      {/* === NOISE TEXTURE === */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==)',
        }}
      />

      <div className="relative z-10 px-6 md:px-12 lg:px-24 py-32">
        {/* === HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-white/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-4">
            PLAYGROUND
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl font-mono">
            // Experimental lab for UI/UX concepts, animations, and interactive components.
          </p>
        </motion.div>

        {/* === EXPERIMENTS GRID === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {experiments.map((experiment, index) => (
            <motion.div
              key={experiment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              onHoverStart={() => setHoveredId(experiment.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="group relative"
            >
              {/* === CARD === */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden cursor-pointer"
              >
                {/* === GRADIENT PREVIEW === */}
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                  style={{
                    background: experiment.preview,
                  }}
                />

                {/* === NOISE OVERLAY === */}
                <div
                  className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage:
                      'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==)',
                  }}
                />

                {/* === CONTENT === */}
                <div className="relative h-full flex flex-col justify-between p-6">
                  {/* === TYPE TAG === */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-xs font-mono text-white uppercase tracking-wider">
                      {getIcon(experiment.icon)}
                      {experiment.type}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{experiment.date}</span>
                  </div>

                  {/* === TITLE === */}
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                      {experiment.title}
                    </h3>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: hoveredId === experiment.id ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                      className="h-1 bg-white rounded-full"
                    />
                  </div>
                </div>

                {/* === HOVER GLOW === */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === experiment.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* === COMING SOON NOTICE === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400 font-mono">
              More experiments coming soon...
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Playground;
