/**
 * Robuzta Techlabs — Unified Animation & Motion Engine (Phase 2, 3, 4, 5)
 * Handles Before/After Slider, Scroll-Animated Timelines, Bento Stagger,
 * Stats Counters, FAQ Accordions, Swiper Marquee, and Lenis Smooth Scroll.
 * Fully lazy-loads GSAP, Swiper, and Lenis only when needed.
 */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Loader helper
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                if (src.includes('gsap') && window.gsap) { resolve(); return; }
                if (src.includes('ScrollTrigger') && window.ScrollTrigger) { resolve(); return; }
                if (src.includes('lenis') && window.Lenis) { resolve(); return; }
                if (src.includes('swiper') && window.Swiper) { resolve(); return; }
                existing.addEventListener('load', () => resolve());
                existing.addEventListener('error', (e) => reject(e));
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function loadLink(href) {
        if (document.querySelector(`link[href="${href}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Singleton Library Loaders
    let gsapPromise = null;
    function loadGSAP() {
        if (window.gsap && window.ScrollTrigger) return Promise.resolve();
        if (!gsapPromise) {
            gsapPromise = (async () => {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
                window.gsap.registerPlugin(window.ScrollTrigger);
            })();
        }
        return gsapPromise;
    }

    let lenisPromise = null;
    function loadLenisScroll() {
        if (window.Lenis) return Promise.resolve();
        if (!lenisPromise) {
            lenisPromise = loadScript('https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js');
        }
        return lenisPromise;
    }

    let swiperPromise = null;
    function loadSwiper() {
        if (window.Swiper) return Promise.resolve();
        if (!swiperPromise) {
            loadLink('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
            swiperPromise = loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
        }
        return swiperPromise;
    }

    /* ─── 1. Hero Before/After Comparison Slider (Pure JS) ─── */
    function initComparisonSlider() {
        const slider = document.getElementById('heroComparison');
        if (!slider) return;

        const afterLayer = slider.querySelector('.comparison-slider__after');
        const handle = slider.querySelector('.comparison-slider__handle');
        if (!afterLayer || !handle) return;

        let position = 50;
        let isDragging = false;

        const setPosition = (percent) => {
            position = Math.min(Math.max(percent, 4), 96);
            afterLayer.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
            handle.style.left = `${position}%`;
            handle.setAttribute('aria-valuenow', Math.round(position));
        };

        const getPercentFromEvent = (e) => {
            const rect = slider.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            return ((clientX - rect.left) / rect.width) * 100;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            setPosition(getPercentFromEvent(e));
        };

        const onEnd = () => {
            isDragging = false;
            slider.classList.remove('is-dragging');
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        };

        const onStart = (e) => {
            isDragging = true;
            slider.classList.add('is-dragging');
            setPosition(getPercentFromEvent(e));
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        };

        handle.addEventListener('mousedown', onStart);
        handle.addEventListener('touchstart', onStart, { passive: true });
        slider.addEventListener('click', (e) => {
            if (e.target === handle || handle.contains(e.target)) return;
            setPosition(getPercentFromEvent(e));
        });

        handle.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition(position - 4); }
            if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(position + 4); }
        });

        setPosition(50);

        if (prefersReducedMotion) {
            handle.setAttribute('tabindex', '-1');
            handle.style.pointerEvents = 'none';
        }
    }

    /* ─── 2. FAQ Accordion (Pure JS, Smooth Heights) ─── */
    function initFaqAccordion() {
        const items = document.querySelectorAll('details.faq-item');
        if (!items.length) return;

        items.forEach(detail => {
            const summary = detail.querySelector('summary');
            const answerEl = detail.querySelector('.faq-answer');
            if (!summary || !answerEl) return;

            let isAnimating = false;

            summary.addEventListener('click', (e) => {
                e.preventDefault();
                if (isAnimating) return;

                const isOpen = detail.open;

                if (isOpen) {
                    isAnimating = true;
                    const startH = answerEl.scrollHeight;
                    answerEl.style.height = startH + 'px';
                    answerEl.style.overflow = 'hidden';

                    requestAnimationFrame(() => {
                        answerEl.style.transition = 'height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease';
                        answerEl.style.height = '0';
                        answerEl.style.opacity = '0';

                        const icon = summary.querySelector('.material-symbols-outlined');
                        if (icon) icon.style.transform = 'rotate(0deg)';

                        answerEl.addEventListener('transitionend', function onEnd() {
                            answerEl.removeEventListener('transitionend', onEnd);
                            detail.open = false;
                            answerEl.style.height = '';
                            answerEl.style.overflow = '';
                            answerEl.style.transition = '';
                            answerEl.style.opacity = '';
                            isAnimating = false;
                        }, { once: true });
                    });
                } else {
                    detail.open = true;
                    isAnimating = true;
                    const endH = answerEl.scrollHeight;
                    answerEl.style.height = '0';
                    answerEl.style.overflow = 'hidden';
                    answerEl.style.opacity = '0';

                    requestAnimationFrame(() => {
                        answerEl.style.transition = 'height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease 50ms';
                        answerEl.style.height = endH + 'px';
                        answerEl.style.opacity = '1';

                        const icon = summary.querySelector('.material-symbols-outlined');
                        if (icon) icon.style.transform = 'rotate(180deg)';

                        answerEl.addEventListener('transitionend', function onEnd() {
                            answerEl.removeEventListener('transitionend', onEnd);
                            answerEl.style.height = '';
                            answerEl.style.overflow = '';
                            answerEl.style.transition = '';
                            isAnimating = false;
                        }, { once: true });
                    });

                    // Auto-close others
                    items.forEach(other => {
                        if (other !== detail && other.open) {
                            const otherAnswer = other.querySelector('.faq-answer');
                            const otherIcon = other.querySelector('summary .material-symbols-outlined');
                            if (otherAnswer) {
                                const h = otherAnswer.scrollHeight;
                                otherAnswer.style.height = h + 'px';
                                otherAnswer.style.overflow = 'hidden';
                                requestAnimationFrame(() => {
                                    otherAnswer.style.transition = 'height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease';
                                    otherAnswer.style.height = '0';
                                    otherAnswer.style.opacity = '0';
                                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                                    otherAnswer.addEventListener('transitionend', function onOtherEnd() {
                                        otherAnswer.removeEventListener('transitionend', onOtherEnd);
                                        other.open = false;
                                        otherAnswer.style.height = '';
                                        otherAnswer.style.overflow = '';
                                        otherAnswer.style.transition = '';
                                        otherAnswer.style.opacity = '';
                                    }, { once: true });
                                });
                            }
                        }
                    });
                }
            });
        });
    }

    /* ─── 3. Lenis Smooth Scroll ─── */
    async function initLenisScroll() {
        if (prefersReducedMotion) return;
        await loadLenisScroll();

        const lenis = new Lenis({
            lerp: 0.08,
            smoothWheel: true,
            syncTouch: false
        });

        // Sync with GSAP ScrollTrigger if GSAP is loaded
        if (window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
            lenis.on('scroll', window.ScrollTrigger.update);
            window.gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            window.gsap.ticker.lagSmoothing(0);
        } else {
            // Standalone RAF loop
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        window._lenis = lenis;
    }

    /* ─── 4. Section Entrance Animations ─── */
    async function initSectionEntrances() {
        const sections = document.querySelectorAll('section');
        if (!sections.length || prefersReducedMotion) return;

        await loadGSAP();

        sections.forEach((section, i) => {
            if (i === 0) return; // Skip Hero
            window.gsap.fromTo(section,
                { opacity: 0, y: 28 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.65,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 88%',
                        once: true
                    }
                }
            );
        });
    }

    /* ─── 5. Process Timelines ─── */
    async function initProcessTimelines() {
        const timelines = document.querySelectorAll('[data-process-timeline]');
        if (!timelines.length || prefersReducedMotion) return;

        await loadGSAP();

        timelines.forEach((timeline) => {
            const line = timeline.querySelector('.process-timeline__line');
            const steps = timeline.querySelectorAll('.process-timeline__step');

            if (line) {
                line.classList.remove('no-js');
                window.gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
                window.gsap.to(line, {
                    scaleX: 1,
                    duration: 1.4,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: timeline,
                        start: 'top 75%',
                        end: 'bottom 60%',
                        scrub: 0.6
                    }
                });
            }

            steps.forEach((step, i) => {
                window.gsap.set(step, { opacity: 0, y: 24, scale: 0.92 });
                window.gsap.to(step, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 85%',
                        once: true
                    },
                    delay: i * 0.08
                });
            });
        });
    }

    /* ─── 6. Services Bento Stagger ─── */
    async function initServicesStagger() {
        const grid = document.querySelector('[data-services-grid]');
        if (!grid || prefersReducedMotion) return;

        const cards = grid.querySelectorAll('a, .service-card');
        if (!cards.length) return;

        await loadGSAP();

        window.gsap.set(cards, { opacity: 0, y: 40, scale: 0.96 });
        window.gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: grid,
                start: 'top 80%',
                once: true
            }
        });
    }

    /* ─── 7. Stats Counter Animation ─── */
    function animateStat(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = parseInt(el.dataset.duration || '1800', 10);
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = prefix + (decimals ? value.toFixed(decimals) : Math.floor(value)) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + (decimals ? target.toFixed(decimals) : Math.round(target)) + suffix;
        };

        requestAnimationFrame(tick);
    }

    async function initStatsCounter() {
        const counters = document.querySelectorAll('.stat-counter[data-target]');
        if (!counters.length || prefersReducedMotion) return;

        await loadGSAP();

        counters.forEach((counter) => {
            window.gsap.set(counter, { opacity: 0 });
            window.gsap.to(counter, {
                opacity: 1,
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 90%',
                    once: true,
                    onEnter: () => animateStat(counter)
                }
            });
        });
    }

    /* ─── 8. Swiper Testimonials Marquee ─── */
    async function initTestimonialsSwiper() {
        const swiperEl = document.getElementById('testimonialsSwiper');
        if (!swiperEl) return;

        await loadSwiper();

        const swiper = new Swiper(swiperEl, {
            slidesPerView: 'auto',
            spaceBetween: 32,
            loop: true,
            speed: 3000,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            grabCursor: true,
            freeMode: {
                enabled: true,
                momentum: false
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true
            },
            a11y: {
                prevSlideMessage: 'Previous testimonial',
                nextSlideMessage: 'Next testimonial'
            }
        });

        swiperEl.addEventListener('mouseenter', () => swiper.autoplay.stop());
        swiperEl.addEventListener('mouseleave', () => swiper.autoplay.start());
        swiperEl.addEventListener('focusin', () => swiper.autoplay.stop());
        swiperEl.addEventListener('focusout', () => swiper.autoplay.start());

        if (prefersReducedMotion) {
            swiper.autoplay.stop();
        }
    }

    /* ─── Main Orchestrator ─── */
    async function orchestrate() {
        // Init Pure-JS components immediately
        initComparisonSlider();
        initFaqAccordion();

        // Check page requirements
        const needsGSAP = document.querySelector('section, [data-process-timeline], [data-services-grid], .stat-counter[data-target]');
        const needsLenis = !prefersReducedMotion;
        const needsSwiper = document.getElementById('testimonialsSwiper');

        try {
            // Load libraries in parallel
            const tasks = [];
            if (needsGSAP) tasks.push(loadGSAP());
            if (needsLenis) tasks.push(loadLenisScroll());
            if (needsSwiper) tasks.push(initTestimonialsSwiper());

            await Promise.all(tasks);

            // Trigger GSAP Initializations once GSAP is fully ready
            if (needsGSAP) {
                await initSectionEntrances();
                await initProcessTimelines();
                await initServicesStagger();
                await initStatsCounter();
            }
        } catch (err) {
            console.warn('[Animation Engine] Visual initialization degraded gracefully:', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', orchestrate);
    } else {
        orchestrate();
    }
})();
