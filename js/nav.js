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

    /** Progressive enhancement: sync active link if hardcoded state differs from URL */
    function verifyActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const homePages = ['index.html', 'home.html', ''];

        document.querySelectorAll('[data-nav]').forEach((link) => {
            const navPage = link.getAttribute('data-nav');
            const isActive = navPage === currentPage;
            const isHome = homePages.includes(currentPage) && navPage === 'index.html';

            if (isActive && !isHome) {
                link.classList.remove('text-on-surface-variant');
                link.classList.add('nav-link-active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    function init() {
        initMobileMenu();
        initNavScroll();
        verifyActiveNavLink();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
