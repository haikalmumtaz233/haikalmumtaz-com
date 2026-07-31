import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useJourney } from '../journey/useJourney';

const STAR_DENSITY = 8000;
const SCROLL_PARALLAX = 0.08;
const MIN_STREAK = 0.5;
const MAX_STREAK_DESKTOP = 55;
const MAX_STREAK_COMPACT = 28;
const WARP_BOOST = 1.6;
const COMPACT_BREAKPOINT = 768;
const ARRIVAL_START = 0.75;
const ARRIVAL_DRIFT = 0.3;

interface Star {
    x: number;
    y: number;
    depth: number;
    size: number;
    baseAlpha: number;
    alpha: number;
    twinkleSpeed: number;
    color: string;
}

const wrap = (value: number, max: number) => ((value % max) + max) % max;

const Background = () => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { progress, velocity, warp } = useJourney();
    const { scrollYProgress } = useScroll();

    const orb1Y = useTransform(scrollYProgress, [0, 1], ['0vh', '50vh']);
    const orb2Y = useTransform(scrollYProgress, [0, 1], ['0vh', '30vh']);
    const orb3Y = useTransform(scrollYProgress, [0, 1], ['0vh', '40vh']);

    const orb1Opacity = useTransform(progress, [0, 0.45, 1], [0.4, 0.22, 0.15]);
    const orb2Opacity = useTransform(progress, [0, 0.45, 1], [0.18, 0.4, 0.22]);
    const orb3Opacity = useTransform(progress, [0, 0.55, 1], [0.15, 0.22, 0.4]);

    const idleDrift = (range: number, duration: number) =>
        prefersReducedMotion
            ? {}
            : {
                  animate: { x: [-range, range, -range] },
                  transition: {
                      duration,
                      repeat: Infinity,
                      ease: 'easeInOut' as const,
                  },
              };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
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
            const colors = ['255, 255, 255', '220, 250, 255', '240, 230, 255'];

            for (let i = 0; i < starCount; i++) {
                const baseAlpha = Math.random() * 0.55 + 0.4;
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    depth: Math.random() * 1.5 + 0.5,
                    size: Math.random() * 1.2,
                    baseAlpha,
                    alpha: baseAlpha,
                    twinkleSpeed: Math.random() * 0.01 + 0.002,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
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

        let streakUnit = 0;

        const drawStar = (star: Star) => {
            const parallax = smoothScrollY * star.depth * SCROLL_PARALLAX;
            const x = wrap(star.x, width);
            const y = wrap(star.y - parallax, height);
            const radius = star.size * (star.depth * 0.8);
            const alpha = Math.max(0, star.alpha);
            const streak = streakUnit * star.depth;

            if (Math.abs(streak) > MIN_STREAK) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${star.color}, ${alpha})`;
                ctx.lineWidth = Math.max(0.4, radius * 2);
                ctx.lineCap = 'round';
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + streak);
                ctx.stroke();
                return;
            }

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
            ctx.fill();
        };

        const renderStaticField = () => {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(drawStar);
        };

        if (prefersReducedMotion) {
            const handleStaticResize = () => {
                handleResize();
                renderStaticField();
            };

            renderStaticField();
            window.addEventListener('resize', handleStaticResize);

            return () => {
                window.removeEventListener('resize', handleStaticResize);
            };
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;
            smoothScrollY += (window.scrollY - smoothScrollY) * 0.08;

            const maxStreak =
                width < COMPACT_BREAKPOINT ? MAX_STREAK_COMPACT : MAX_STREAK_DESKTOP;
            const warpBoost = 1 + (WARP_BOOST - 1) * Math.sin(warp.get() * Math.PI);
            streakUnit = velocity.get() * maxStreak * warpBoost;

            const arrival = Math.min(
                1,
                Math.max(0, (progress.get() - ARRIVAL_START) / (1 - ARRIVAL_START))
            );
            const driftScale = 1 - (1 - ARRIVAL_DRIFT) * arrival;

            for (const star of stars) {
                star.alpha += star.twinkleSpeed;
                if (star.alpha > 1 || star.alpha < star.baseAlpha - 0.15) {
                    star.twinkleSpeed = -star.twinkleSpeed;
                }

                star.x -= mouseX * star.depth * 0.05;
                star.y -= mouseY * star.depth * 0.05;
                star.y -= 0.2 * star.depth * driftScale;

                drawStar(star);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [prefersReducedMotion, progress, velocity, warp]);

    return (
        <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block"
            />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-[20%] -left-[10%]"
                    style={{ y: prefersReducedMotion ? 0 : orb1Y, willChange: 'transform' }}
                >
                    <motion.div
                        {...idleDrift(50, 15)}
                        className="w-[600px] h-[600px] rounded-full bg-purple-600 mix-blend-screen filter blur-[100px]"
                        style={{
                            opacity: prefersReducedMotion ? 0.4 : orb1Opacity,
                            willChange: 'transform',
                        }}
                    />
                </motion.div>

                <motion.div
                    className="absolute -bottom-[10%] -right-[5%]"
                    style={{ y: prefersReducedMotion ? 0 : orb2Y, willChange: 'transform' }}
                >
                    <motion.div
                        {...idleDrift(40, 18)}
                        className="w-[400px] h-[400px] rounded-full bg-cyan-500 mix-blend-screen filter blur-[100px]"
                        style={{
                            opacity: prefersReducedMotion ? 0.4 : orb2Opacity,
                            willChange: 'transform',
                        }}
                    />
                </motion.div>

                <motion.div
                    className="absolute top-[30%] right-[10%]"
                    style={{ y: prefersReducedMotion ? 0 : orb3Y, willChange: 'transform' }}
                >
                    <motion.div
                        {...idleDrift(60, 12)}
                        className="w-[250px] h-[250px] rounded-full bg-fuchsia-500 mix-blend-screen filter blur-[100px]"
                        style={{
                            opacity: prefersReducedMotion ? 0.4 : orb3Opacity,
                            willChange: 'transform',
                        }}
                    />
                </motion.div>
            </div>

            <div
                className="absolute bottom-0 left-0 right-0 h-[60vh] pointer-events-none opacity-70"
                style={{
                    background: 'linear-gradient(to top, rgba(217, 70, 239, 0.3) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)',
                }}
            />

            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 20%, #0a0a0a 100%)'
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
