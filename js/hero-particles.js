/**
 * Robuzta — Interactive Neural Circuit Canvas
 * A living, breathing particle network that sits behind the hero section.
 * - Particles drift slowly and form glowing circuit-like connections
 * - Mouse cursor creates a magnetic repulsion field (particles scatter away)
 * - Connections glow brighter when particles are close together
 * - Fully responsive, uses requestAnimationFrame, auto-resizes
 */
(function () {
    'use strict';

    const canvas = document.getElementById('hero-circuit-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Config
    const PARTICLE_COUNT_DESKTOP = 80;
    const PARTICLE_COUNT_MOBILE = 35;
    const CONNECTION_DISTANCE = 120;
    const MOUSE_RADIUS = 150;
    const MOUSE_FORCE = 8;
    const PARTICLE_BASE_SPEED = 0.3;
    const LINE_OPACITY_MAX = 0.25;

    // Colors from the Robuzta design system
    const COLORS = {
        particle: 'rgba(0, 88, 190, ',      // --secondary #0058be
        connection: 'rgba(0, 88, 190, ',     // --secondary
        particleAlt: 'rgba(16, 185, 129, ',  // --success-emerald
    };

    let particles = [];
    let mouse = { x: -9999, y: -9999, active: false };
    let animationId;
    let width, height;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.baseRadius = Math.random() * 2 + 1;
            this.radius = this.baseRadius;
            this.vx = (Math.random() - 0.5) * PARTICLE_BASE_SPEED * 2;
            this.vy = (Math.random() - 0.5) * PARTICLE_BASE_SPEED * 2;
            this.isAlt = Math.random() < 0.2; // 20% chance of green accent
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.01 + Math.random() * 0.02;
        }

        update() {
            // Gentle pulse
            this.pulsePhase += this.pulseSpeed;
            this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 0.5;

            // Mouse repulsion
            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    const angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force * MOUSE_FORCE * 0.05;
                    this.vy += Math.sin(angle) * force * MOUSE_FORCE * 0.05;
                }
            }

            // Friction
            this.vx *= 0.98;
            this.vy *= 0.98;

            // Maintain minimum drift speed
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed < PARTICLE_BASE_SPEED * 0.5) {
                this.vx += (Math.random() - 0.5) * 0.1;
                this.vy += (Math.random() - 0.5) * 0.1;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges softly
            if (this.x < -20) this.x = width + 20;
            if (this.x > width + 20) this.x = -20;
            if (this.y < -20) this.y = height + 20;
            if (this.y > height + 20) this.y = -20;
        }

        draw() {
            const color = this.isAlt ? COLORS.particleAlt : COLORS.particle;
            const alpha = 0.4 + Math.sin(this.pulsePhase) * 0.2;

            // Outer glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = color + (alpha * 0.15) + ')';
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = color + alpha + ')';
            ctx.fill();
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * LINE_OPACITY_MAX;

                    // Determine color — if either particle is alt, use green
                    const color = (particles[i].isAlt || particles[j].isAlt)
                        ? COLORS.particleAlt : COLORS.connection;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = color + opacity + ')';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function drawMouseGlow() {
        if (!mouse.active) return;

        const gradient = ctx.createRadialGradient(
            mouse.x, mouse.y, 0,
            mouse.x, mouse.y, MOUSE_RADIUS
        );
        gradient.addColorStop(0, 'rgba(0, 88, 190, 0.08)');
        gradient.addColorStop(1, 'rgba(0, 88, 190, 0)');

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        drawMouseGlow();
        drawConnections();

        for (const p of particles) {
            p.update();
            p.draw();
        }

        animationId = requestAnimationFrame(animate);
    }

    function resize() {
        const hero = canvas.parentElement;
        width = hero.offsetWidth;
        height = hero.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function init() {
        resize();

        const count = window.innerWidth < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        if (!prefersReducedMotion) {
            animate();
        } else {
            // Static snapshot for reduced motion
            drawConnections();
            for (const p of particles) { p.draw(); }
        }
    }

    // Mouse tracking (relative to canvas)
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Touch support
    canvas.parentElement.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
    }, { passive: true });

    canvas.parentElement.addEventListener('touchend', () => {
        mouse.active = false;
    });

    // Resize handling with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(animationId);
            resize();
            // Re-position particles within new bounds
            for (const p of particles) {
                if (p.x > width) p.x = Math.random() * width;
                if (p.y > height) p.y = Math.random() * height;
            }
            if (!prefersReducedMotion) animate();
        }, 200);
    });

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
