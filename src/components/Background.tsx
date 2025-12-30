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

        // Mouse parallax target
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseX = (e.clientX - width / 2) * 0.05;
            targetMouseY = (e.clientY - height / 2) * 0.05;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();

        // --- CLASSES ---

        class Star {
            x: number;
            y: number;
            z: number;
            size: number;
            baseAlpha: number; // Opasitas dasar
            alpha: number;     // Opasitas saat ini (untuk twinkling)
            twinkleSpeed: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 1.5 + 0.5; // Depth multiplier
                this.size = Math.random() * 1.2;
                this.baseAlpha = Math.random() * 0.6 + 0.2; // 0.2 - 0.8
                this.alpha = this.baseAlpha;
                this.twinkleSpeed = Math.random() * 0.01 + 0.002;

                // Warna: Putih kebiruan atau keunguan halus
                const colors = ['255, 255, 255', '200, 240, 255', '230, 220, 255'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                // Twinkle
                this.alpha += this.twinkleSpeed;
                if (this.alpha > this.baseAlpha + 0.2 || this.alpha < this.baseAlpha - 0.2) {
                    this.twinkleSpeed = -this.twinkleSpeed;
                }

                // Parallax Mouse Movement (Smooth Lerp)
                mouseX += (targetMouseX - mouseX) * 0.02; // Lebih smooth/lambat
                mouseY += (targetMouseY - mouseY) * 0.02;

                // Gerakan Parallax berlawanan arah mouse
                this.x -= mouseX * this.z * 0.02;
                this.y -= mouseY * this.z * 0.02;

                // Natural Drift (Sangat lambat ke atas)
                this.y -= 0.1 * this.z;

                // Wrap Around Screen
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                // Ukuran dipengaruhi depth (z)
                const renderSize = this.size * (this.z * 0.8);
                ctx.arc(this.x, this.y, renderSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.alpha)})`;
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
                this.y = Math.random() * height * 0.5; // Muncul di setengah atas layar
                this.length = Math.random() * 80 + 20;
                this.speed = Math.random() * 8 + 4;
                this.opacity = 1;
                this.active = true;
            }

            update() {
                if (!this.active) {
                    // Chance muncul sangat kecil per frame (agar jarang)
                    if (Math.random() < 0.003) this.reset();
                    return;
                }
                this.x -= this.speed; // Bergerak ke kiri
                this.y += this.speed * 0.5; // Bergerak ke bawah (diagonal)
                this.opacity -= 0.015;

                if (this.opacity <= 0 || this.x < 0 || this.y > height) {
                    this.active = false;
                }
            }

            draw() {
                if (!this.active || !ctx) return;
                const tailX = this.x + this.length;
                const tailY = this.y - this.length * 0.5;

                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
                gradient.addColorStop(1, 'rgba(255,255,255,0)');

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        }

        // --- INIT ---
        const stars: Star[] = [];
        const starCount = Math.floor((width * height) / 10000); // Kepadatan dinamis
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
        const shootingStar = new ShootingStar();

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            stars.forEach(star => {
                star.update();
                star.draw();
            });

            shootingStar.update();
            shootingStar.draw();

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
            {/* 1. Canvas Layer */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block"
            />

            {/* 2. Gradient Mesh Overlay (Atmosphere) - Sangat halus */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 0%, #0a0a0a 90%)'
                }}
            />

            {/* 3. Global Noise Texture (Optional, adds grit) */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==)',
                }}
            />
        </div>
    );
};

export default Background;