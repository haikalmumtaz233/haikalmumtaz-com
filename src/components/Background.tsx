import { useEffect, useRef } from 'react';

const Background = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
                
                // UPDATED: Membuat bintang lebih terang secara umum
                // Range sebelumnya: 0.2 - 0.8. Range baru: 0.4 - 0.95
                this.baseAlpha = Math.random() * 0.55 + 0.4; 
                this.alpha = this.baseAlpha;
                this.twinkleSpeed = Math.random() * 0.01 + 0.002;
                
                // Pilihan warna sedikit lebih terang
                const colors = ['255, 255, 255', '220, 250, 255', '240, 230, 255'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                // 1. Twinkle Effect (dengan batas brightness baru)
                this.alpha += this.twinkleSpeed;
                // Batas atas 1.0, batas bawah sedikit di bawah baseAlpha
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
                // Memastikan alpha tidak negatif
                ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.alpha)})`;
                
                // UPDATED: Menambahkan sedikit glow effect pada bintang yang terang
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

                // UPDATED: Meteor sedikit lebih terang dan kebiruan
                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, 'rgba(230,240,255,1)'); 
                gradient.addColorStop(1, 'rgba(230,240,255,0)');

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2; // Sedikit lebih tebal
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        }

        // --- INIT ---
        const stars: Star[] = [];
        // UPDATED: Menambah kepadatan bintang.
        // Pembagi yang lebih kecil = hasil yang lebih besar = lebih banyak bintang.
        // Sebelumnya 10000, sekarang 6000.
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

            // Reset shadow blur setelah menggambar bintang agar tidak mempengaruhi meteor
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
        <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
            {/* 1. Canvas Layer (Stars) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block"
            />

            {/* 2. NEW: Lenis-style Bottom Glow (Pink/Purple Fade) */}
            <div 
                className="absolute bottom-0 left-0 right-0 h-[60vh] pointer-events-none opacity-70"
                style={{
                    // Gradient dari bawah (pink/ungu terang) ke atas (transparan)
                    background: 'linear-gradient(to top, rgba(217, 70, 239, 0.3) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)',
                    // Opsional: Tambahkan blur agar perpendarannya lebih halus lagi
                    // filter: 'blur(80px)', // Hati-hati, blur besar bisa berat di performa
                }}
            />

            {/* 3. Radial Vignette Overlay (Membuat tengah lebih gelap agar konten terbaca) */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 20%, #0a0a0a 100%)'
                }}
            />
            
            {/* 4. Noise Texture (Paling atas agar memberi tekstur ke glow juga) */}
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