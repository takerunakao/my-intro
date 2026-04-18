document.addEventListener('DOMContentLoaded', () => {
    // Setup Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class to trigger animation
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated to keep it visible
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove class to allow re-animation when scrolling back up
                // entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Get all elements that should be animated
    const animatedElements = document.querySelectorAll('.animate-element');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Handle Parallax effect on scroll for abstract shapes or background (optional contemporary touch)
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.abstract-shape');
        
        shapes.forEach(shape => {
            const speed = 0.2;
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
        });
    });
});
