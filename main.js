// Main JavaScript functionality for EduSphere
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all main functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initScrollToTop();
    initActiveNavigation();
    initContactForm();
    
    console.log('EduSphere loaded successfully!');
});

// Go back functionality
function goBack() {
    // Check if there's history to go back to
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // If no history, go to home page
        window.location.href = 'index.html';
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('block');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Set initial aria attributes
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-controls', 'mobile-menu');
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.subject-section, .grammar-section, .feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button if it doesn't exist
    let scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (!scrollToTopBtn) {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.id = 'scroll-to-top';
        scrollToTopBtn.className = 'fab scroll-to-top fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300';
        scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollToTopBtn);
    }
    
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Active navigation highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === '/' && linkHref === 'index.html')) {
            link.classList.add('active');
            link.classList.remove('text-gray-700');
            link.classList.add('text-blue-600');
        } else {
            link.classList.remove('active');
            link.classList.remove('text-blue-600');
            link.classList.add('text-gray-700');
        }
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message', 'privacy'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const fieldElement = document.getElementById(field);
                const value = formObject[field];
                
                if (!value || value.trim() === '') {
                    isValid = false;
                    fieldElement.classList.add('border-red-500');
                    
                    // Remove error styling after user starts typing
                    fieldElement.addEventListener('input', function() {
                        this.classList.remove('border-red-500');
                    });
                } else {
                    fieldElement.classList.remove('border-red-500');
                }
            });
            
            // Validate email format
            const email = formObject.email;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                isValid = false;
                document.getElementById('email').classList.add('border-red-500');
                showToast('Please enter a valid email address', 'error');
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (since this is static)
                setTimeout(() => {
                    // Show success message
                    const successMessage = document.getElementById('success-message');
                    if (successMessage) {
                        successMessage.classList.remove('hidden');
                        successMessage.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success toast
                    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
                    
                    // Hide success message after 10 seconds
                    setTimeout(() => {
                        if (successMessage) {
                            successMessage.classList.add('hidden');
                        }
                    }, 10000);
                    
                }, 2000); // Simulate network delay
            } else {
                showToast('Please fill in all required fields correctly', 'error');
            }
        });
    }
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${icon} mr-2"></i>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization for scroll events
const optimizedScrollHandler = throttle(function() {
    // Handle scroll-dependent functionality here
    const scrollTop = window.pageYOffset;
    const navbar = document.getElementById('navbar');
    
    // Add/remove navbar shadow based on scroll position
    if (navbar) {
        if (scrollTop > 10) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Handle Escape key to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            }
        }
    }
});

// Enhanced accessibility
function enhanceAccessibility() {
    // Add skip link if it doesn't exist
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Add main content landmark if it doesn't exist
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
    
    // Enhance focus management for modal dialogs
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modal.classList.remove('show');
            }
            
            // Trap focus within modal
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    });
}

// Initialize accessibility enhancements
enhanceAccessibility();

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('EduSphere: An error occurred:', e.error);
    // You could implement user-friendly error reporting here
});

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Only register if service worker file exists
        fetch('/sw.js')
            .then(response => {
                if (response.ok) {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('ServiceWorker registration successful');
                        })
                        .catch(error => {
                            console.log('ServiceWorker registration failed');
                        });
                }
            })
            .catch(() => {
                // Service worker file doesn't exist, which is fine
            });
    });
}

// Export functions for testing or external use
window.EduSphere = {
    showToast,
    debounce,
    throttle,
    enhanceAccessibility
};
