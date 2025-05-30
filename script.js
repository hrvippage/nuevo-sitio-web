
import gsap from 'gsap';
import ScrollTrigger from 'scrollTrigger';
import ScrollToPlugin from 'scrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// GSAP Defaults
gsap.defaults({ ease: "power2.out", duration: 0.6 });

// Header scroll animation
const header = document.querySelector('header');
if (header) {
    ScrollTrigger.create({
        trigger: "body",
        start: "top top-=-80px", 
        end: "max",
        toggleClass: {targets: header, className: "scrolled"},
    });
}

// Hero Section Animations (Only for index.html)
if (document.getElementById('hero')) {
    gsap.from(".hero-content h1 span", { opacity: 0, y: 60, stagger: 0.25, duration: 0.8, delay: 0.2 });
    gsap.from(".hero-subtext", { opacity: 0, y: 40, duration: 0.8, delay: 0.7 });
    gsap.from(".hero-cta", { opacity: 0, scale: 0.8, duration: 0.8, delay: 1.1, ease: "elastic.out(1, 0.75)" });
    const quoteFormElement = document.getElementById('quoteForm');
    if (quoteFormElement) {
        gsap.from(quoteFormElement, { opacity: 0, y: 50, duration: 1, delay: 1.4 });
    }
}

// Animate sections on scroll
// This will apply to sections on any page, excluding #hero on index.html
gsap.utils.toArray('section:not(#hero)').forEach(section => {
    gsap.from(section.children, {
        opacity: 0,
        y: 80,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
        }
    });
});

// Staggered animation for service cards and benefit cards
// Updated to include new card types: .info-card, .step-card
gsap.utils.toArray('.service-card, .benefit-card, .contact-option-card, .info-card, .step-card, .gallery-item, .focus-point').forEach((card) => {
    gsap.from(card, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.5,
        scrollTrigger: {
            trigger: card,
            start: "top 90%", // Start animation when card is 90% from top of viewport
            toggleActions: "play none none reverse",
        }
    });
});

// Quote form functionality (primarily for index.html)
window.openQuoteForm = function() {
    const formSection = document.getElementById('quoteFormSection');
    const formElement = document.getElementById('quoteForm');
    
    if (formSection && formElement) {
        gsap.to(window, { 
            duration: 1, 
            scrollTo: { y: formSection, offsetY: 100, autoKill: true },
            ease: "power3.inOut" 
        });
        
        const firstInput = formElement.querySelector('input[name="fullName"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 1000); 
        }

        gsap.fromTo(formElement, 
            { scale: 1, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }, 
            { 
                scale: 1.03, 
                boxShadow: '0 15px 30px rgba(var(--primary-color-rgb), 0.3)', 
                duration: 0.3, 
                yoyo: true, 
                repeat: 1, 
                ease: "power1.inOut",
                delay: 0.2
            }
        );
    } else {
        // If not on index.html, redirect to index.html with hash
        window.location.href = 'index.html#quoteFormSection';
    }
}

// Form submission (Only for index.html)
const estimateForm = document.getElementById('estimateForm');
if (estimateForm) {
    estimateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const name = formData.get('fullName');
        
        alert(`Thank you, ${name}! We will contact you shortly to schedule your free estimate.`);
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sent!';
        submitButton.disabled = true;
        
        gsap.to(this, {opacity: 0.5, duration: 0.5, onComplete: () => {
            this.reset();
            gsap.to(this, {opacity: 1, duration: 0.5});
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }});
    });
}

// Smooth scroll for on-page navigation links (e.g., from CTA to form on index.html)
// This will only apply to links that start with # AND are on the current page.
// Regular navigation links (e.g., services.html) will behave normally.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        // Check if the target is on the current page
        const targetElement = document.querySelector(targetId); 

        if (targetElement) { // If target is on the current page, smooth scroll
            e.preventDefault();
            let offsetY = (header && header.classList.contains('scrolled')) ? header.offsetHeight : (header ? header.offsetHeight + 20 : 20);
            if (targetId === '#hero' || targetId === '#quoteFormSection' ) offsetY = (header ? header.offsetHeight : 0) + 20; // Custom offset for form
            
            gsap.to(window, {
                duration: 1.2,
                scrollTo: {
                    y: targetElement,
                    offsetY: offsetY
                },
                ease: "power3.inOut"
            });
        }
        // If targetElement is null, it's an anchor on another page (e.g. index.html#quoteFormSection from services.html)
        // The default browser action will handle this (jump to page and then to anchor).
    });
});




console.log("NK & Gutter Interactive Site Initialized");
