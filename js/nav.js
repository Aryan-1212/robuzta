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

    function initThemeToggle() {
        const actions = document.querySelector('.site-nav__actions');
        if (!actions) return;

        // Create diagnostics status bar
        const diagBar = document.createElement('div');
        diagBar.id = 'diagnosticsBar';
        diagBar.className = 'w-full bg-[#030604] text-[#00e676] font-mono text-[9px] md:text-[10px] px-margin-desktop flex justify-between items-center border-b border-[rgba(0,230,118,0.15)] select-none z-[100] relative';
        diagBar.style.height = '24px';
        diagBar.style.display = 'none';
        diagBar.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#00e676]" style="animation: pulse 1s infinite alternate; box-shadow: 0 0 8px #00e676;"></span>
                    SYS_DIAG: ACTIVE
                </span>
                <span class="opacity-30">|</span>
                <span class="hidden xs:inline">VOLTAGE: STABLE (5.12V)</span>
                <span class="xs:hidden">5.12V</span>
            </div>
            <div class="flex gap-4">
                <span>THERM_SENS: 34°C</span>
                <span class="opacity-30">|</span>
                <span>CALIBRATION: OK</span>
            </div>
        `;
        document.body.insertBefore(diagBar, document.body.firstChild);

        // Create desktop toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'themeToggleBtn';
        toggleBtn.type = 'button';
        toggleBtn.className = 'w-10 h-10 rounded-xl bg-white/5 border border-border-subtle flex items-center justify-center hover:bg-secondary/10 transition-colors text-primary relative';
        toggleBtn.title = 'Toggle Lab Theme (Motherboard Pattern)';
        toggleBtn.innerHTML = `<span class="material-symbols-outlined" id="themeToggleIcon" style="font-size: 20px;">developer_board</span>`;
        
        // Insert before "Get Free Quote" button
        actions.insertBefore(toggleBtn, actions.firstChild);

        // Create mobile toggle button
        const mobileLinks = document.querySelector('.mobile-menu__links');
        if (mobileLinks) {
            const mobileToggleBtn = document.createElement('button');
            mobileToggleBtn.id = 'mobileThemeToggleBtn';
            mobileToggleBtn.type = 'button';
            mobileToggleBtn.className = 'mobile-menu__link font-headline-md text-headline-md flex items-center justify-between w-full text-left py-4 border-b border-border-subtle';
            mobileToggleBtn.innerHTML = `
                <span>Lab Theme</span>
                <span class="material-symbols-outlined" id="mobileThemeToggleIcon" style="font-size: 24px;">toggle_off</span>
            `;
            // Insert before the Get Free Quote CTA
            const cta = mobileLinks.querySelector('.mobile-menu__cta');
            if (cta) {
                mobileLinks.insertBefore(mobileToggleBtn, cta);
            } else {
                mobileLinks.appendChild(mobileToggleBtn);
            }
        }

        const htmlEl = document.documentElement;
        const mainNav = document.getElementById('mainNav');
        
        // Check localStorage
        const savedTheme = localStorage.getItem('robuzta-theme');
        const isCircuit = savedTheme === 'circuit';
        
        const setTema = (enable) => {
            // Swap logos based on theme
            document.querySelectorAll('.site-nav__logo img').forEach(logoImg => {
                if (logoImg) {
                    if (enable) {
                        logoImg.src = logoImg.src.replace('robuzta_logo_scaled.png', 'robuzta_logo_white.png');
                    } else {
                        logoImg.src = logoImg.src.replace('robuzta_logo_white.png', 'robuzta_logo_scaled.png');
                    }
                }
            });

            if (enable) {
                htmlEl.classList.add('theme-circuit');
                localStorage.setItem('robuzta-theme', 'circuit');
                document.querySelectorAll('#themeToggleIcon').forEach(icon => {
                    icon.textContent = 'developer_board';
                    icon.style.color = '#00e676';
                });
                const mobileIcon = document.getElementById('mobileThemeToggleIcon');
                if (mobileIcon) {
                    mobileIcon.textContent = 'toggle_on';
                    mobileIcon.style.color = '#00e676';
                }
                diagBar.style.display = 'flex';
                // Offset navbar if at top
                if (mainNav) {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    mainNav.style.top = scrollTop > 24 ? '0' : '24px';
                }
            } else {
                htmlEl.classList.remove('theme-circuit');
                localStorage.setItem('robuzta-theme', 'light');
                document.querySelectorAll('#themeToggleIcon').forEach(icon => {
                    icon.textContent = 'developer_board';
                    icon.style.color = '';
                });
                const mobileIcon = document.getElementById('mobileThemeToggleIcon');
                if (mobileIcon) {
                    mobileIcon.textContent = 'toggle_off';
                    mobileIcon.style.color = '';
                }
                diagBar.style.display = 'none';
                if (mainNav) {
                    mainNav.style.top = '0';
                }
            }
        };

        // Initial state
        setTema(isCircuit);

        // Desktop listener
        toggleBtn.addEventListener('click', () => {
            const currentlyEnabled = htmlEl.classList.contains('theme-circuit');
            setTema(!currentlyEnabled);
        });

        // Mobile listener
        const mobToggle = document.getElementById('mobileThemeToggleBtn');
        if (mobToggle) {
            mobToggle.addEventListener('click', () => {
                const currentlyEnabled = htmlEl.classList.contains('theme-circuit');
                setTema(!currentlyEnabled);
            });
        }
    }

    function initNavScroll() {
        const mainNav = document.getElementById('mainNav');
        if (!mainNav) return;

        const updateScrollState = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            mainNav.classList.toggle('is-scrolled', scrollTop > 50);

            // Handle diagnostics bar offset in scroll calculation
            const isCircuit = document.documentElement.classList.contains('theme-circuit');
            if (isCircuit) {
                mainNav.style.top = scrollTop > 24 ? '0' : '24px';
            } else {
                mainNav.style.top = '0';
            }
        };

        updateScrollState();
        window.addEventListener('scroll', updateScrollState, { passive: true });
    }

    function init() {
        initMobileMenu();
        initNavScroll();
        initServicesDropdown();
        verifyActiveNavLink();
        initThemeToggle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
