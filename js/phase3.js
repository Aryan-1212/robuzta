/**
 * Phase 3 — Site-Wide Motion Language
 * Lenis smooth scroll + GSAP ScrollTrigger (properly synced)
 * Section entrance animations, FAQ accordion, Swiper testimonials
 */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ─── Utility: load external script once ─── */
    function loadScript(src, id) {
        return new Promise((resolve, reject) => {
            const existingScript = id ? document.getElementById(id) : document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                if (src.includes('gsap.min.js') && window.gsap) { resolve(); return; }
                if (src.includes('ScrollTrigger.min.js') && window.ScrollTrigger) { resolve(); return; }
                if (src.includes('lenis.min.js') && window.Lenis) { resolve(); return; }
                if (src.includes('swiper-bundle.min.js') && window.Swiper) { resolve(); return; }
                existingScript.addEventListener('load', () => resolve());
                existingScript.addEventListener('error', (e) => reject(e));
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            if (id) s.id = id;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    function loadLink(href, id) {
        if (document.getElementById(id)) return;
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        l.id = id;
        document.head.appendChild(l);
    }

    /* ─── 1. Lenis + GSAP ScrollTrigger sync ─── */
    async function initLenis() {
        if (prefersReducedMotion) return;

        await loadScript('https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js', 'lenis-cdn');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', 'gsap-cdn');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', 'gsaptrigger-cdn');

        const lenis = new Lenis({
            lerp: 0.08,
            smoothWheel: true,
            syncTouch: false
        });

        // Critical: proxy Lenis scroll position into ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Expose so other modules can pause/resume (e.g., modal open)
        window._lenis = lenis;

        return lenis;
    }

    /* ─── 2. Section entrance animations ─── */
    async function initSectionEntrances() {
        const sections = document.querySelectorAll('section');
        if (!sections.length) return;

        if (prefersReducedMotion) {
            // Ensure everything is visible without animation
            sections.forEach(s => {
                s.style.opacity = '1';
                s.style.transform = 'none';
            });
            return;
        }

        // GSAP should already be loaded by initLenis; load it independently if not
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', 'gsap-cdn');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', 'gsaptrigger-cdn');
        gsap.registerPlugin(ScrollTrigger);

        sections.forEach((section, i) => {
            // Skip the very first section (hero) — it's visible on load, don't animate it in
            if (i === 0) return;

            gsap.fromTo(section,
                { opacity: 0, y: 28 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.65,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 88%',
                        toggleActions: 'play none none none', // once only — no reverse flicker
                        once: true
                    }
                }
            );
        });
    }

    /* ─── 3. FAQ Smooth Accordion ─── */
    function initFaqAccordion() {
        const items = document.querySelectorAll('details.faq-item');
        if (!items.length) return;

        items.forEach(detail => {
            const summary = detail.querySelector('summary');
            const answerEl = detail.querySelector('.faq-answer');
            if (!summary || !answerEl) return;

            // Measure natural height
            let isAnimating = false;

            summary.addEventListener('click', (e) => {
                e.preventDefault();
                if (isAnimating) return;

                const isOpen = detail.open;

                if (isOpen) {
                    // Closing: animate height from scrollHeight → 0
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
                    // Opening: set open, measure scrollHeight, animate 0 → scrollHeight
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

                    // Close other open items
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

    /* ─── 4. Swiper Testimonials Marquee ─── */
    async function initTestimonialsSwiper() {
        const swiperEl = document.getElementById('testimonialsSwiper');
        if (!swiperEl) return;

        loadLink('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', 'swiper-css');
        await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', 'swiper-cdn');

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

        // Pause on hover/focus (keyboard accessibility)
        swiperEl.addEventListener('mouseenter', () => swiper.autoplay.stop());
        swiperEl.addEventListener('mouseleave', () => swiper.autoplay.start());
        swiperEl.addEventListener('focusin', () => swiper.autoplay.stop());
        swiperEl.addEventListener('focusout', () => swiper.autoplay.start());

        if (prefersReducedMotion) {
            swiper.autoplay.stop();
        }
    }

    /* ─── 5. Card & section-header stagger reveals ─── */
    async function initContentStagger() {
        const staggerTargets = document.querySelectorAll('[data-stagger]');
        if (!staggerTargets.length || prefersReducedMotion) return;

        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', 'gsap-cdn');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', 'gsaptrigger-cdn');
        gsap.registerPlugin(ScrollTrigger);

        staggerTargets.forEach(container => {
            const children = container.children;
            if (!children.length) return;
            gsap.fromTo(Array.from(children),
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power2.out',
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });
    }

    /* ─── Init ─── */
    async function init() {
        try {
            // Lenis must run first to set up the scroll proxy before ScrollTrigger refs
            await initLenis();
            // Run section animations, stagger, FAQ, and Swiper in parallel
            await Promise.all([
                initSectionEntrances(),
                initContentStagger()
            ]);
            initFaqAccordion();
            initTestimonialsSwiper();
        } catch (err) {
            // Graceful degradation: log warning, all content remains visible
            console.warn('[Phase 3] Animation init skipped:', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
