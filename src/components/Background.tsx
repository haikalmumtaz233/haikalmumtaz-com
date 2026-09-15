import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { easing } from '../lib/motion';
import { useJourney } from '../journey/useJourney';

const STAR_DENSITY = 8000;
const SCROLL_PARALLAX = 0.08;
const ARRIVAL_START = 0.75;
const ARRIVAL_DRIFT = 0.3;
const ROUND_STAR_RADIUS = 1.1;
const STAR_COLORS = ['rgb(255, 255, 255)', 'rgb(220, 250, 255)', 'rgb(240, 230, 255)'];

interface Star {
    x: number;
    y: number;
    depth: number;
    radius: number;
    baseAlpha: number;
    alpha: number;
    twinkleSpeed: number;
    color: number;
}

const wrap = (value: number, max: number) => ((value % max) + max) % max;

const glow = (rgb: string) => `radial-gradient(circle at center, rgba(${rgb}, 1) 0%, rgba(${rgb}, 0.55) 28%, rgba(${rgb}, 0) 68%)`;

const orbs = [
    { position: '-top-[32%] -left-[22%]', size: 'w-[900px] h-[900px]', color: glow('147, 51, 234'), drift: [50, 15] as const },
    { position: '-bottom-[26%] -right-[16%]', size: 'w-[640px] h-[640px]', color: glow('6, 182, 212'), drift: [40, 18] as const },
    { position: 'top-[16%] right-[0%]', size: 'w-[460px] h-[460px]', color: glow('217, 70, 239'), drift: [60, 12] as const },
];

const Background = () => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { progress } = useJourney();
    const { scrollYProgress } = useScroll();

    const orbY = [
        useTransform(scrollYProgress, [0, 1], ['0vh', '50vh']),
        useTransform(scrollYProgress, [0, 1], ['0vh', '30vh']),
        useTransform(scrollYProgress, [0, 1], ['0vh', '40vh']),
    ];

    const orbOpacity = [
        useTransform(progress, [0, 0.45, 1], [0.4, 0.22, 0.15]),
        useTransform(progress, [0, 0.45, 1], [0.18, 0.4, 0.22]),
        useTransform(progress, [0, 0.55, 1], [0.15, 0.22, 0.4]),
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId = 0;
        let width = window.innerWidth;
        let height = window.innerHeight;

        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        let smoothScrollY = window.scrollY;

        const stars: Star[] = [];

        const populate = () => {
            stars.length = 0;
            const starCount = Math.floor((width * height) / STAR_DENSITY);

            for (let i = 0; i < starCount; i++) {
                const baseAlpha = Math.random() * 0.55 + 0.4;
                const depth = Math.random() * 1.5 + 0.5;
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    depth,
                    radius: Math.random() * 1.2 * depth * 0.8,
                    baseAlpha,
                    alpha: baseAlpha,
                    twinkleSpeed: Math.random() * 0.01 + 0.002,
                    color: Math.floor(Math.random() * STAR_COLORS.length),
                });
            }

            stars.sort((a, b) => a.color - b.color);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            populate();
        };

        const handleMouseMove = (event: MouseEvent) => {
            targetMouseX = (event.clientX - width / 2) * 0.02;
            targetMouseY = (event.clientY - height / 2) * 0.02;
        };

        handleResize();

        const drawField = () => {
            ctx.clearRect(0, 0, width, height);
            let activeColor = -1;

            for (const star of stars) {
                if (star.color !== activeColor) {
                    activeColor = star.color;
                    ctx.fillStyle = STAR_COLORS[activeColor];
                }

                const x = wrap(star.x, width);
                const y = wrap(star.y - smoothScrollY * star.depth * SCROLL_PARALLAX, height);
                ctx.globalAlpha = star.alpha > 0 ? star.alpha : 0;

                if (star.radius > ROUND_STAR_RADIUS) {
                    ctx.beginPath();
                    ctx.arc(x, y, star.radius, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    const diameter = star.radius * 2;
                    ctx.fillRect(x - star.radius, y - star.radius, diameter, diameter);
                }
            }

            ctx.globalAlpha = 1;
        };

        if (prefersReducedMotion) {
            const handleStaticResize = () => {
                handleResize();
                drawField();
            };

            drawField();
            window.addEventListener('resize', handleStaticResize);

            return () => {
                window.removeEventListener('resize', handleStaticResize);
            };
        }

        const animate = () => {
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;
            smoothScrollY += (window.scrollY - smoothScrollY) * 0.08;

            const arrival = Math.min(
                1,
                Math.max(0, (progress.get() - ARRIVAL_START) / (1 - ARRIVAL_START))
            );
            const drift = 0.2 * (1 - (1 - ARRIVAL_DRIFT) * arrival);
            const pullX = mouseX * 0.05;
            const pullY = mouseY * 0.05;

            for (const star of stars) {
                star.alpha += star.twinkleSpeed;
                if (star.alpha > 1 || star.alpha < star.baseAlpha - 0.15) {
                    star.twinkleSpeed = -star.twinkleSpeed;
                }

                star.x -= pullX * star.depth;
                star.y -= (pullY + drift) * star.depth;
            }

            drawField();
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [prefersReducedMotion, progress]);

    return (
        <div className="fixed inset-0 z-[-1] bg-[#09080e]">
            <motion.canvas
                ref={canvasRef}
                className="absolute inset-0 block"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.4, ease: easing.smooth }}
            />

            <motion.div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.8, ease: easing.expo }}
            >
                {orbs.map((orb, index) => (
                    <motion.div
                        key={orb.position}
                        className={`absolute ${orb.position}`}
                        style={{ y: prefersReducedMotion ? 0 : orbY[index] }}
                    >
                        <motion.div
                            className={`${orb.size} rounded-full`}
                            style={{
                                backgroundImage: orb.color,
                                opacity: prefersReducedMotion ? 0.4 : orbOpacity[index],
                                willChange: 'transform, opacity',
                            }}
                            {...(prefersReducedMotion
                                ? {}
                                : {
                                      animate: { x: [-orb.drift[0], orb.drift[0], -orb.drift[0]] },
                                      transition: { duration: orb.drift[1], repeat: Infinity, ease: 'easeInOut' as const },
                                  })}
                        />
                    </motion.div>
                ))}
            </motion.div>

            <div
                className="absolute bottom-0 left-0 right-0 h-[60vh] pointer-events-none opacity-70"
                style={{
                    background: 'linear-gradient(to top, rgba(217, 70, 239, 0.3) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)',
                }}
            />

            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 20%, #09080e 100%)'
                }}
            />

            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==)',
                }}
            />
        </div>
    );
};

export default Background;
