// Robuzta Techlabs - Merged Website JavaScript

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    });
}

// Close mobile menu function
function closeMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

// Sticky Navbar Scroll Effect
const mainNav = document.getElementById('mainNav');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        mainNav.classList.add('shadow-lg');
        mainNav.classList.add('py-2');
        mainNav.classList.remove('py-stack-md');
    } else {
        mainNav.classList.remove('shadow-lg');
        mainNav.classList.remove('py-2');
        mainNav.classList.add('py-stack-md');
    }
    
    lastScrollTop = scrollTop;
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            closeMobileMenu();
            
            // Smooth scroll to target
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update URL without jumping
            history.pushState(null, null, href);
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

// Intersection Observer for Section Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
    observer.observe(section);
});

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

// Stats Counter Animation (for the About section)
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = formatNumber(value);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = formatNumber(end);
        }
    };
    window.requestAnimationFrame(step);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'k+';
    }
    return num + '+';
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statElements = entry.target.querySelectorAll('.font-display-lg');
            
            statElements.forEach(stat => {
                const text = stat.textContent;
                // Only animate numeric stats
                if (text.includes('10+')) {
                    animateCounter(stat, 0, 10, 1500);
                } else if (text.includes('4.8★')) {
                    // Rating doesn't need animation, it's already static
                    stat.style.opacity = '1';
                } else if (text.includes('100%')) {
                    const percentElement = stat;
                    let current = 0;
                    const target = 100;
                    const interval = setInterval(() => {
                        current++;
                        percentElement.textContent = current + '%';
                        if (current >= target) {
                            clearInterval(interval);
                        }
                    }, 15);
                }
                // "Free" doesn't need animation
            });
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.getElementById('about');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

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

// Parallax Effect for Hero Background (subtle)
const heroSection = document.querySelector('.hero-gradient');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        heroSection.style.transform = `translateY(${rate}px)`;
    });
}

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

// Handle page load - highlight correct nav based on URL hash
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }, 100);
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
