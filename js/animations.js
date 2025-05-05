/**
 * CTF Treasure Hunt - Canvas Animations
 * This script creates an interactive particle animation in the hero section
 * using ING brand colors.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the canvas animation
    initHeroCanvas();

    // Add scroll animations
    initScrollAnimations();
});

/**
 * Initialize the hero canvas with particle animation
 */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas to full width/height of its container
    function resizeCanvas() {
        const heroSection = document.getElementById('hero');
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }
    
    // Call once to set initial size
    resizeCanvas();
    
    // Update canvas size when window is resized
    window.addEventListener('resize', resizeCanvas);

    // ING brand colors
    const colors = [
        '#ff6200', // Primary orange
        '#ff8800', // Lighter orange
        '#0066cc', // Blue accent
        '#ffffff'  // White
    ];

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Create particle array
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Connect particles with lines if they're close enough
    function connectParticles() {
        const maxDistance = 150;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // The closer they are, the more opaque the line
                    const opacity = 1 - (distance / maxDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = '#ff6200';
                    ctx.globalAlpha = opacity * 0.2;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    // Mouse interaction
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // Animation loop
    function animate() {
        // Clear canvas with semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Mouse interaction - particles move away from mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    particles[i].x += forceDirectionX * force * 5;
                    particles[i].y += forceDirectionY * force * 5;
                }
            }
        }
        
        // Connect particles with lines
        connectParticles();
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature, .rule, .registration-info, #leaderboard-table');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for elements
    document.querySelectorAll('.feature, .rule, .registration-info, #leaderboard-table').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run once on load
    setTimeout(animateOnScroll, 100);
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const heroSection = document.getElementById('hero');
        const scrollPosition = window.scrollY;
        
        if (heroSection && scrollPosition < heroSection.offsetHeight) {
            const parallaxOffset = scrollPosition * 0.4;
            heroSection.style.backgroundPositionY = `-${parallaxOffset}px`;
        }
    });
}

/**
 * Add hover effects for interactive elements
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-register, .btn-start');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add tilt effect to feature cards
    const features = document.querySelectorAll('.feature');
    
    features.forEach(feature => {
        feature.addEventListener('mousemove', function(e) {
            const rect = feature.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 20;
            const tiltY = (centerX - x) / 20;
            
            feature.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-15px)`;
        });
        
        feature.addEventListener('mouseleave', function() {
            feature.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});