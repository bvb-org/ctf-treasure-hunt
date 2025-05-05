/**
 * CTF Treasure Hunt - Portal Canvas Effects
 * This script adds interactive particle effects to the challenge portal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add canvas to challenge portal
    addPortalCanvas();
    
    // Add floating particles to challenge screens
    addFloatingParticles();
    
    // Add glow effects to important elements
    addGlowEffects();
    
    // Add interactive hover effects
    enhanceHoverEffects();
    
    // Add scroll animations
    initScrollAnimations();
});

/**
 * Add canvas with particle animation to the portal
 */
function addPortalCanvas() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'portal-canvas';
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    `;
    
    // Add canvas to challenge area
    const challengeArea = document.querySelector('.challenge-area');
    if (challengeArea) {
        challengeArea.style.position = 'relative';
        challengeArea.insertBefore(canvas, challengeArea.firstChild);
        
        // Initialize canvas animation
        initCanvasAnimation(canvas);
    }
}

/**
 * Initialize canvas animation with particles
 */
function initCanvasAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full width/height of its container
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
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
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.3 + 0.1;
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
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connect particles with lines if they're close enough
    function connectParticles() {
        const maxDistance = 120;
        
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
                    ctx.globalAlpha = opacity * 0.15;
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
        radius: 120
    };
    
    canvas.parentElement.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    
    canvas.parentElement.addEventListener('mouseleave', function() {
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
                    
                    particles[i].x += forceDirectionX * force * 3;
                    particles[i].y += forceDirectionY * force * 3;
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
 * Add floating particles to challenge screens
 */
function addFloatingParticles() {
    const challengeScreens = document.querySelectorAll('.challenge-screen');
    
    challengeScreens.forEach(screen => {
        // Create particles container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
        `;
        
        // Add particles
        const particleCount = Math.floor(Math.random() * 5) + 3; // 3-7 particles per section
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // Randomize particle properties
            const size = Math.floor(Math.random() * 6) + 3; // 3-8px
            const posX = Math.floor(Math.random() * 100); // 0-100%
            const posY = Math.floor(Math.random() * 100); // 0-100%
            const duration = Math.floor(Math.random() * 20) + 10; // 10-30s
            const delay = Math.floor(Math.random() * 5); // 0-5s
            
            // Determine color based on section
            let color;
            if (Math.random() > 0.7) {
                color = '#ff6200'; // ING orange
            } else if (Math.random() > 0.4) {
                color = '#ff8800'; // Lighter orange
            } else if (Math.random() > 0.2) {
                color = '#0066cc'; // Blue
            } else {
                color = 'rgba(255, 255, 255, 0.5)'; // White
            }
            
            // Set particle style
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                border-radius: 50%;
                top: ${posY}%;
                left: ${posX}%;
                opacity: 0.3;
                filter: blur(1px);
                box-shadow: 0 0 ${size * 2}px ${color};
                animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
            `;
            
            particlesContainer.appendChild(particle);
        }
        
        // Insert particles container at the beginning of the screen
        screen.style.position = 'relative';
        screen.insertBefore(particlesContainer, screen.firstChild);
    });
    
    // Add floating animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes floatParticle {
            0% { transform: translate(0, 0); }
            25% { transform: translate(20px, 20px); }
            50% { transform: translate(-20px, 40px); }
            75% { transform: translate(-30px, 10px); }
            100% { transform: translate(0, 0); }
        }
    `;
    document.head.appendChild(styleSheet);
}

/**
 * Add glow effects to important elements
 */
function addGlowEffects() {
    // Add glow to headings
    const headings = document.querySelectorAll('.challenge-header h2, #welcome-screen h2, .completion-message h2');
    
    headings.forEach(heading => {
        heading.style.position = 'relative';
        heading.style.zIndex = '1';
        
        // Create glow element
        const glow = document.createElement('div');
        glow.className = 'heading-glow';
        glow.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, rgba(255, 98, 0, 0.2) 0%, transparent 70%);
            filter: blur(10px);
            z-index: -1;
            pointer-events: none;
        `;
        
        // Insert glow behind heading
        heading.parentNode.insertBefore(glow, heading);
    });
    
    // Add subtle pulse to buttons
    const buttons = document.querySelectorAll('.btn-submit, .download-btn, .btn-return');
    
    buttons.forEach(button => {
        // Add glow effect
        button.style.boxShadow = '0 0 20px rgba(255, 98, 0, 0.5)';
        
        // Create pulsing animation
        const pulseAnimation = document.createElement('style');
        pulseAnimation.textContent = `
            @keyframes buttonPulse {
                0% { box-shadow: 0 0 20px rgba(255, 98, 0, 0.5); }
                50% { box-shadow: 0 0 30px rgba(255, 98, 0, 0.7); }
                100% { box-shadow: 0 0 20px rgba(255, 98, 0, 0.5); }
            }
            
            .btn-submit, .download-btn, .btn-return {
                animation: buttonPulse 2s infinite;
            }
        `;
        document.head.appendChild(pulseAnimation);
    });
}

/**
 * Enhance hover effects for interactive elements
 */
function enhanceHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-submit, .download-btn, .btn-return');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const rippleAnimation = document.createElement('style');
    rippleAnimation.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleAnimation);
    
    // Add particle burst effect on challenge item hover
    const challengeItems = document.querySelectorAll('.challenge-item');
    
    challengeItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Create particle burst container
            const burstContainer = document.createElement('div');
            burstContainer.className = 'particle-burst';
            burstContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            `;
            
            // Add particles
            for (let i = 0; i < 5; i++) {
                const particle = document.createElement('div');
                
                // Randomize particle properties
                const size = Math.floor(Math.random() * 3) + 2; // 2-4px
                const angle = Math.random() * Math.PI * 2; // 0-360 degrees
                const distance = Math.random() * 15 + 10; // 10-25px
                const duration = Math.random() * 0.5 + 0.5; // 0.5-1s
                
                // Calculate position
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                // Set particle style
                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background-color: rgba(255, 98, 0, 0.8);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 1;
                    animation: burstParticle ${duration}s ease-out forwards;
                    --end-x: ${x}px;
                    --end-y: ${y}px;
                `;
                
                burstContainer.appendChild(particle);
            }
            
            // Add burst animation
            const burstAnimation = document.createElement('style');
            burstAnimation.textContent = `
                @keyframes burstParticle {
                    0% { 
                        transform: translate(-50%, -50%);
                        opacity: 1;
                    }
                    100% { 
                        transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y)));
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(burstAnimation);
            
            // Add burst container to challenge item
            item.style.position = 'relative';
            item.appendChild(burstContainer);
            
            // Remove burst container after animation
            setTimeout(() => {
                item.removeChild(burstContainer);
            }, 1000);
        });
    });
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.challenge-description, .challenge-submission, .rules-reminder');
        
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
    document.querySelectorAll('.challenge-description, .challenge-submission, .rules-reminder').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run once on load
    setTimeout(animateOnScroll, 100);
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
}