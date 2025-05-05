/**
 * CTF Treasure Hunt - Hero Canvas Animation for Challenge Portal
 * This script creates an interactive particle animation in the hero section
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the hero canvas animation
    initHeroCanvas();
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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
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
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
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
        radius: 150
    };

    document.addEventListener('mousemove', function(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    document.addEventListener('mouseleave', function() {
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