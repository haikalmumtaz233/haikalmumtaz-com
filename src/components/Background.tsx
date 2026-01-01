import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Background = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const orb1Ref = useRef<HTMLDivElement>(null);
    const orb2Ref = useRef<HTMLDivElement>(null);
    const orb3Ref = useRef<HTMLDivElement>(null);

    // === GSAP FLOATING ORBS ANIMATION ===
    useGSAP(() => {
        const orbs = [orb1Ref.current, orb2Ref.current, orb3Ref.current];
        if (!orbs.every(orb => orb)) return;

        // A. Perpetual Floating (Idle Animation)
        gsap.to(orb1Ref.current, {
            x: 'random(-50, 50)',
            y: 'random(-30, 30)',
            duration: 15,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        gsap.to(orb2Ref.current, {
            x: 'random(-40, 40)',
            y: 'random(-40, 40)',
            duration: 18,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        gsap.to(orb3Ref.current, {
            x: 'random(-60, 60)',
            y: 'random(-50, 50)',
            duration: 12,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        // B. Scroll Parallax (ScrollTrigger)
        gsap.to(orb1Ref.current, {
            y: '150vh',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
            },
        });

        gsap.to(orb2Ref.current, {
            y: '80vh',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2,
            },
        });

        gsap.to(orb3Ref.current, {
            y: '120vh',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5,
            },
        });
    }, { scope: containerRef });

    // === CANVAS STARFIELD ANIMATION ===
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // --- MOUSE PARALLAX VARS ---
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        // --- SCROLL PARALLAX VARS ---
        let scrollY = window.scrollY;
        let targetScrollY = window.scrollY;
        let scrollVelocity = 0;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseX = (e.clientX - width / 2) * 0.02;
            targetMouseY = (e.clientY - height / 2) * 0.02;
        };

        const handleScroll = () => {
            targetScrollY = window.scrollY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        
        handleResize();

        // --- CLASSES ---

        class Star {
            x: number;
            y: number;
            z: number;
            size: number;
            baseAlpha: number;
            alpha: number;
            twinkleSpeed: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 1.5 + 0.5;
                this.size = Math.random() * 1.2;
                
                this.baseAlpha = Math.random() * 0.55 + 0.4; 
                this.alpha = this.baseAlpha;
                this.twinkleSpeed = Math.random() * 0.01 + 0.002;
                
                // Pilihan warna sedikit lebih terang
                const colors = ['255, 255, 255', '220, 250, 255', '240, 230, 255'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                // 1. Twinkle Effect
                this.alpha += this.twinkleSpeed;
                if (this.alpha > 1 || this.alpha < this.baseAlpha - 0.15) {
                    this.twinkleSpeed = -this.twinkleSpeed;
                }

                // 2. Mouse Parallax
                mouseX += (targetMouseX - mouseX) * 0.05;
                mouseY += (targetMouseY - mouseY) * 0.05;
                this.x -= mouseX * this.z * 0.05;
                this.y -= mouseY * this.z * 0.05;

                // 3. SCROLL PHYSICS
                const scrollDiff = targetScrollY - scrollY;
                scrollVelocity += (scrollDiff - scrollVelocity) * 0.1;
                scrollY += scrollVelocity;
                this.y += scrollVelocity * this.z * 0.2; 

                // 4. Natural Drift
                this.y -= 0.2 * this.z;

                // 5. Wrap Around
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                const renderSize = this.size * (this.z * 0.8);
                ctx.arc(this.x, this.y, renderSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.alpha)})`;
                
                if (this.alpha > 0.8) {
                    ctx.shadowBlur = renderSize * 3;
                    ctx.shadowColor = `rgba(${this.color}, 0.4)`;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();
            }
        }

        class ShootingStar {
            x: number;
            y: number;
            length: number;
            speed: number;
            opacity: number;
            active: boolean;

            constructor() {
                this.x = 0; this.y = 0; this.length = 0; this.speed = 0; this.opacity = 0;
                this.active = false;
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height * 0.5;
                this.length = Math.random() * 80 + 20;
                this.speed = Math.random() * 8 + 4;
                this.opacity = 1;
                this.active = true;
            }

            update() {
                if (!this.active) {
                    if (Math.random() < 0.003) this.reset();
                    return;
                }
                this.x -= this.speed;
                this.y += this.speed * 0.5;
                this.opacity -= 0.015;
                this.y += scrollVelocity * 0.5; 

                if (this.opacity <= 0 || this.x < 0 || this.y > height) {
                    this.active = false;
                }
            }

            draw() {
                if (!this.active || !ctx) return;
                const tailX = this.x + this.length;
                const tailY = this.y - this.length * 0.5;

                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, 'rgba(230,240,255,1)'); 
                gradient.addColorStop(1, 'rgba(230,240,255,0)');

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        }

        // --- INIT ---
        const stars: Star[] = [];
        const starCount = Math.floor((width * height) / 6000); 
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
        const shootingStar = new ShootingStar();

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Menggambar bintang
            stars.forEach(star => {
                star.update();
                star.draw();
            });

            ctx.shadowBlur = 0;

            shootingStar.update();
            shootingStar.draw();

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
            {/* === CANVAS STARFIELD === */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block"
            />

            {/* === GSAP FLOATING ORBS LAYER === */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Orb 1 (Primary) - Large Purple, Top-Left */}
                <div
                    ref={orb1Ref}
                    className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-purple-600 mix-blend-screen filter blur-[100px] opacity-40"
                    style={{ willChange: 'transform' }}
                />
                
                {/* Orb 2 (Secondary) - Medium Cyan, Bottom-Right */}
                <div
                    ref={orb2Ref}
                    className="absolute -bottom-[10%] -right-[5%] w-[400px] h-[400px] rounded-full bg-cyan-500 mix-blend-screen filter blur-[100px] opacity-40"
                    style={{ willChange: 'transform' }}
                />
                
                {/* Orb 3 (Accent) - Small Pink/Magenta, Center-Right */}
                <div
                    ref={orb3Ref}
                    className="absolute top-[30%] right-[10%] w-[250px] h-[250px] rounded-full bg-fuchsia-500 mix-blend-screen filter blur-[100px] opacity-40"
                    style={{ willChange: 'transform' }}
                />
            </div>

            {/* === GRADIENT OVERLAYS === */}
            <div 
                className="absolute bottom-0 left-0 right-0 h-[60vh] pointer-events-none opacity-70"
                style={{
                    background: 'linear-gradient(to top, rgba(217, 70, 239, 0.3) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%',
                }}
            />

            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 20%, #0a0a0a 100%)'
                }}
            />
            
            {/* === NOISE TEXTURE === */}
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