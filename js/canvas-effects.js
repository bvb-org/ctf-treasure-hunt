/**
 * ING Tech Treasure Hunt - Canvas-like Effects
 * This script adds canvas-like particle effects to various sections of the page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add floating particles to all sections
    addFloatingParticles();
    
    // Add glow effects to important elements
    addGlowEffects();
    
    // Add interactive hover effects
    enhanceHoverEffects();
});

/**
 * Add floating particles to sections
 */
function addFloatingParticles() {
    const sections = document.querySelectorAll('#about, #rules, #registration, #leaderboard');
    
    sections.forEach(section => {
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
        const particleCount = Math.floor(Math.random() * 5) + 5; // 5-10 particles per section
        
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
        
        // Insert particles container at the beginning of the section
        section.style.position = 'relative';
        section.insertBefore(particlesContainer, section.firstChild);
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
    const headings = document.querySelectorAll('h2');
    
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
    const buttons = document.querySelectorAll('.btn-register, .btn-start');
    
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
            
            .btn-register, .btn-start {
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
    // Add particle burst effect on button hover
    const buttons = document.querySelectorAll('.btn-register, .btn-start');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
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
                z-index: -1;
            `;
            
            // Add particles
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                
                // Randomize particle properties
                const size = Math.floor(Math.random() * 4) + 2; // 2-5px
                const angle = Math.random() * Math.PI * 2; // 0-360 degrees
                const distance = Math.random() * 20 + 20; // 20-40px
                const duration = Math.random() * 0.5 + 0.5; // 0.5-1s
                
                // Calculate position
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                // Set particle style
                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 1;
                    animation: burstParticle ${duration}s ease-out forwards;
                `;
                
                // Set custom properties for animation
                particle.style.setProperty('--end-x', `${x}px`);
                particle.style.setProperty('--end-y', `${y}px`);
                
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
            
            // Add burst container to button
            button.appendChild(burstContainer);
            
            // Remove burst container after animation
            setTimeout(() => {
                button.removeChild(burstContainer);
            }, 1000);
        });
    });
    
    // Add connection lines between features on hover
    const features = document.querySelectorAll('.feature');
    
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            // Find all other features
            const otherFeatures = Array.from(features).filter(f => f !== feature);
            
            // Create connection lines
            otherFeatures.forEach(otherFeature => {
                // Create line element
                const line = document.createElement('div');
                line.className = 'connection-line';
                
                // Get positions
                const rect1 = feature.getBoundingClientRect();
                const rect2 = otherFeature.getBoundingClientRect();
                
                // Calculate line position and length
                const x1 = rect1.left + rect1.width / 2;
                const y1 = rect1.top + rect1.height / 2;
                const x2 = rect2.left + rect2.width / 2;
                const y2 = rect2.top + rect2.height / 2;
                
                const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                
                // Set line style
                line.style.cssText = `
                    position: fixed;
                    top: ${y1}px;
                    left: ${x1}px;
                    width: ${length}px;
                    height: 1px;
                    background: linear-gradient(to right, rgba(255, 98, 0, 0.5), rgba(255, 98, 0, 0));
                    transform: rotate(${angle}deg);
                    transform-origin: 0 0;
                    opacity: 0;
                    z-index: 99;
                    pointer-events: none;
                    animation: fadeInLine 0.3s forwards;
                `;
                
                // Add line to body
                document.body.appendChild(line);
                
                // Add fade in animation
                const lineAnimation = document.createElement('style');
                lineAnimation.textContent = `
                    @keyframes fadeInLine {
                        0% { opacity: 0; }
                        100% { opacity: 0.3; }
                    }
                `;
                document.head.appendChild(lineAnimation);
            });
        });
        
        feature.addEventListener('mouseleave', function() {
            // Remove all connection lines
            const lines = document.querySelectorAll('.connection-line');
            lines.forEach(line => {
                line.remove();
            });
        });
    });
}