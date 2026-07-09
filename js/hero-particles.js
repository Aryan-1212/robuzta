/**
 * Robuzta — Interactive Neural Circuit Canvas
 * A living, breathing particle network that covers the full viewport.
 * - Fixed behind all content; visible only where background is plain
 * - Particles drift slowly and form glowing circuit-like connections
 * - Mouse cursor creates a magnetic repulsion field
 * - Connections glow brighter when particles are close
 * - Auto-pauses when tab is hidden for zero wasted GPU cycles
 */
(function () {
    'use strict';

    const canvas = document.getElementById('hero-circuit-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Config — tuned for full-page performance
    const PARTICLE_COUNT_DESKTOP = 65;
    const PARTICLE_COUNT_MOBILE = 28;
    const CONNECTION_DISTANCE = 110;
    const MOUSE_RADIUS = 140;
    const MOUSE_FORCE = 7;
    const PARTICLE_BASE_SPEED = 0.25;
    const LINE_OPACITY_MAX = 0.2;

    // Colors from the Robuzta design system
    const COLORS = {
        particle: 'rgba(0, 88, 190, ',      // --secondary #0058be
        connection: 'rgba(0, 88, 190, ',
        particleAlt: 'rgba(16, 185, 129, ',  // --success-emerald
    };

    let particles = [];
    let mouse = { x: -9999, y: -9999, active: false };
    let animationId;
    let width, height;
    let isVisible = true;

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
            this.isAlt = Math.random() < 0.15;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.01 + Math.random() * 0.015;
        }

        update() {
            this.pulsePhase += this.pulseSpeed;
            this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 0.4;

            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                const radiusSq = MOUSE_RADIUS * MOUSE_RADIUS;
                if (distSq < radiusSq && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    const angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force * MOUSE_FORCE * 0.05;
                    this.vy += Math.sin(angle) * force * MOUSE_FORCE * 0.05;
                }
            }

            this.vx *= 0.98;
            this.vy *= 0.98;

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed < PARTICLE_BASE_SPEED * 0.4) {
                this.vx += (Math.random() - 0.5) * 0.08;
                this.vy += (Math.random() - 0.5) * 0.08;
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -20) this.x = width + 20;
            if (this.x > width + 20) this.x = -20;
            if (this.y < -20) this.y = height + 20;
            if (this.y > height + 20) this.y = -20;
        }

        draw() {
            const color = this.isAlt ? COLORS.particleAlt : COLORS.particle;
            const alpha = 0.35 + Math.sin(this.pulsePhase) * 0.15;

            // Outer glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = color + (alpha * 0.12) + ')';
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
                const distSq = dx * dx + dy * dy;
                const maxDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * LINE_OPACITY_MAX;
                    const color = (particles[i].isAlt || particles[j].isAlt)
                        ? COLORS.particleAlt : COLORS.connection;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = color + opacity + ')';
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }
    }

    function drawMouseGlow() {
        if (!mouse.active) return;
        const gradient = ctx.createRadialGradient(
            mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS
        );
        gradient.addColorStop(0, 'rgba(0, 88, 190, 0.06)');
        gradient.addColorStop(1, 'rgba(0, 88, 190, 0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    function animate() {
        if (!isVisible) return;
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
        width = window.innerWidth;
        height = window.innerHeight;
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
            drawConnections();
            for (const p of particles) { p.draw(); }
        }
    }

    // Mouse tracking (viewport-relative since canvas is fixed)
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    document.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
    }, { passive: true });

    document.addEventListener('touchend', () => {
        mouse.active = false;
    });

    // Pause when tab is hidden — zero GPU waste
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isVisible = false;
            cancelAnimationFrame(animationId);
        } else {
            isVisible = true;
            if (!prefersReducedMotion) animate();
        }
    });

    // Resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(animationId);
            resize();
            for (const p of particles) {
                if (p.x > width) p.x = Math.random() * width;
                if (p.y > height) p.y = Math.random() * height;
            }
            if (!prefersReducedMotion && isVisible) animate();
        }, 200);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
