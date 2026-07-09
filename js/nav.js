/**
 * Site navigation — behavior only (markup is static HTML on every page).
 */
(function () {
    'use strict';

    function getMobileMenuElements() {
        return {
            btn: document.getElementById('mobileMenuBtn'),
            menu: document.getElementById('mobileMenu'),
            closeBtn: document.getElementById('mobileMenuClose')
        };
    }

    function closeMobileMenu() {
        const { btn, menu } = getMobileMenuElements();
        if (menu) {
            menu.classList.add('hidden');
            menu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('overflow-hidden');
        }
        if (btn) {
            btn.setAttribute('aria-expanded', 'false');
        }
    }

    window.closeMobileMenu = closeMobileMenu;

    function initMobileMenu() {
        const { btn, menu, closeBtn } = getMobileMenuElements();
        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
            const isOpen = !menu.classList.contains('hidden');
            if (isOpen) {
                closeMobileMenu();
            } else {
                menu.classList.remove('hidden');
                menu.setAttribute('aria-hidden', 'false');
                btn.setAttribute('aria-expanded', 'true');
                document.body.classList.add('overflow-hidden');
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', closeMobileMenu);
        }

        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
                closeMobileMenu();
            }
        });

        // Mobile Services accordion
        const mobileServicesToggle = document.getElementById('mobileServicesToggle');
        const mobileServicesPanel = document.getElementById('mobileServicesPanel');
        if (mobileServicesToggle && mobileServicesPanel) {
            mobileServicesToggle.addEventListener('click', () => {
                const isExpanded = mobileServicesToggle.getAttribute('aria-expanded') === 'true';
                mobileServicesToggle.setAttribute('aria-expanded', String(!isExpanded));
                mobileServicesPanel.classList.toggle('hidden', isExpanded);
            });
        }
    }

    function initNavScroll() {
        const mainNav = document.getElementById('mainNav');
        if (!mainNav) return;

        const updateScrollState = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            mainNav.classList.toggle('is-scrolled', scrollTop > 50);
        };

        updateScrollState();
        window.addEventListener('scroll', updateScrollState, { passive: true });
    }

    /** Services dropdown (desktop) */
    function initServicesDropdown() {
        const dropdown = document.getElementById('servicesDropdown');
        if (!dropdown) return;

        const trigger = dropdown.querySelector('.nav-dropdown__trigger');
        const panel = dropdown.querySelector('.nav-dropdown__panel');
        if (!trigger || !panel) return;

        let closeTimer = null;

        function openDropdown() {
            clearTimeout(closeTimer);
            dropdown.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
        }

        function closeDropdown() {
            closeTimer = setTimeout(() => {
                dropdown.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            }, 120);
        }

        // Hover behaviour
        dropdown.addEventListener('mouseenter', openDropdown);
        dropdown.addEventListener('mouseleave', closeDropdown);

        // Click/touch toggle
        trigger.addEventListener('click', () => {
            const isOpen = dropdown.classList.contains('is-open');
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        // Keyboard: close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dropdown.classList.contains('is-open')) {
                closeDropdown();
                trigger.focus();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /** Progressive enhancement: sync active link if hardcoded state differs from URL */
    function verifyActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const servicePages = ['laptop-repair.html', 'mobile-repair.html', 'macbook-repair.html', 'gaming-pc.html', 'surface-repair.html'];

        document.querySelectorAll('[data-nav]').forEach((link) => {
            const navPage = link.getAttribute('data-nav');
            const isActive = navPage === currentPage;

            if (isActive) {
                link.classList.remove('text-on-surface-variant');
                link.classList.add('nav-link-active');
                link.setAttribute('aria-current', 'page');
            }
        });

        // Also highlight Services trigger when on a service page
        const dropdown = document.getElementById('servicesDropdown');
        if (dropdown && servicePages.includes(currentPage)) {
            const trigger = dropdown.querySelector('.nav-dropdown__trigger');
            if (trigger) {
                trigger.classList.remove('text-on-surface-variant');
                trigger.classList.add('nav-link-active');
            }
        }
    }

    function init() {
        initMobileMenu();
        initNavScroll();
        initServicesDropdown();
        verifyActiveNavLink();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
