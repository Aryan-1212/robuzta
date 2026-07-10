// Robuzta Techlabs - Merged Website JavaScript

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
}

function initNavScroll() {
    const mainNav = document.getElementById('mainNav');
    if (!mainNav) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        mainNav.classList.toggle('is-scrolled', scrollTop > 50);
    }, { passive: true });
}

// Smooth Scroll for Anchor Links — routes through Lenis when active
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip bare hash
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            e.preventDefault();
            closeMobileMenu();
            history.pushState(null, null, href);

            if (window._lenis) {
                // Lenis handles smooth scroll — offset for sticky nav height
                window._lenis.scrollTo(targetElement, { offset: -80, duration: 1.2 });
            } else {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }
    });
});

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Section entrance animations are handled by GSAP ScrollTrigger in js/animations.js

// FAQ Accordion - Close others when one opens
document.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
        if (detail.open) {
            document.querySelectorAll('details').forEach((otherDetail) => {
                if (otherDetail !== detail && otherDetail.open) {
                    otherDetail.open = false;
                }
            });
        }
    });
});

// Stats counter handled by animations.js (Phase 2)

// Testimonials Horizontal Scroll Snap
const testimonialsContainer = document.querySelector('.overflow-x-auto');
if (testimonialsContainer) {
    testimonialsContainer.style.scrollSnapType = 'x mandatory';
    
    const testimonialCards = testimonialsContainer.querySelectorAll('.min-w-\\[400px\\]');
    testimonialCards.forEach(card => {
        card.style.scrollSnapAlign = 'start';
    });
}

// Form Validation (for footer email subscription)
const emailInputs = document.querySelectorAll('input[type="email"]');
emailInputs.forEach(input => {
    input.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
            input.style.borderColor = 'var(--error)';
        } else {
            input.style.borderColor = '';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--secondary)';
    });
});

// Newsletter Subscription Handler
const subscribeButtons = document.querySelectorAll('button:has(.material-symbols-outlined)');
subscribeButtons.forEach(button => {
    if (button.querySelector('.material-symbols-outlined')?.textContent === 'send') {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const emailInput = button.previousElementSibling;
            if (emailInput && emailInput.type === 'email') {
                const email = emailInput.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (emailRegex.test(email)) {
                    // Show success message
                    showNotification('Thank you for subscribing!', 'success');
                    emailInput.value = '';
                } else {
                    showNotification('Please enter a valid email address', 'error');
                }
            }
        });
    }
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification-toast fixed top-24 right-8 z-50 px-6 py-4 rounded-lg shadow-xl transition-all duration-300 transform translate-x-0';
    
    if (type === 'success') {
        notification.style.backgroundColor = 'var(--success-emerald)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'var(--error)';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = 'var(--secondary)';
        notification.style.color = 'white';
    }
    
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'info'}</span>
            <span class="font-medium">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Quote Modal Logic
const quoteModal = document.getElementById('quoteModal');
const closeQuoteModal = document.getElementById('closeQuoteModal');
const quoteForm = document.getElementById('quoteForm');

function openModal() {
    if (quoteModal) {
        quoteModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

function closeModal() {
    if (quoteModal) {
        quoteModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

// Bind Quote Buttons to open modal
document.querySelectorAll('button').forEach(button => {
    if (button.textContent.includes('Get Free Quote') || button.textContent.includes('Get a Free Quote') || button.textContent.includes('Get Your Free Quote')) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }
});

if (closeQuoteModal) {
    closeQuoteModal.addEventListener('click', closeModal);
}

// Close modal when clicking outside content card
if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
        if (e.target === quoteModal) {
            closeModal();
        }
    });
}

// Handle Form Submission
if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientName = document.getElementById('clientName')?.value || 'Customer';
        const device = document.getElementById('deviceDropdown')?.value || 'Device';
        
        // Show success notification and close modal
        showNotification(`Thank you ${clientName}! Our team will contact you shortly regarding your ${device} repair.`, 'success');
        quoteForm.reset();
        closeModal();
    });
}

// Parallax is handled by GSAP/Lenis in js/animations.js — removed to prevent scroll conflicts

// Lazy Loading for Images (if needed in future)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Print initialization message
console.log('%cRobuzta Techlabs Website Loaded! 🔧', 'color: #0058be; font-size: 18px; font-weight: bold;');
console.log('%cPrecision Engineered Repairs', 'color: #10b981; font-size: 14px;');

// Handle page load - nav behavior is in nav.js; only handle hash scroll here
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                if (window._lenis) {
                    window._lenis.scrollTo(targetElement, { offset: -80, duration: 1.2 });
                } else {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }, 300); // Wait for Lenis to initialise
        }
    }

    // Initial nav highlight
    highlightNavigation();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});
