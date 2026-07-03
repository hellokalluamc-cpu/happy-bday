/**
 * Global Configuration Variables & Text Array
 */
const phrases = [
    "To my absolutely favorite person... ✨",
    "They say to love your bestie, and well... <span class='highlight'>I lowkey love you</span>. 💖",
    "You are the star in <span class='highlight'>my</span> galaxy, literally! 🚀🌌",
    "To more years of <span class='highlight'>lowkey loving</span> our friendship... and you. 💫🎂"
];

// Document Elements Connection
const spaceCanvas = document.getElementById('space-canvas');
const ctx = spaceCanvas.getContext('2d');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const mainGift = document.getElementById('main-gift');

let starsArray = [];
let fireworksArray = [];
let typewriterIndex = 0;
let phraseIndex = 0;
let isDeleting = false;
let isGiftOpened = false; // Strictly blocks multiple box explosion glitches

/**
 * 1. AUTOMATIC SOFT-VOLUME AUDIO STREAM CONTROLLER
 */
bgMusic.volume = 0.2; // Sets initial value securely to 20% volume boundary 

function startAutoplay() {
    if (bgMusic.paused) {
        bgMusic.play()
            .then(() => {
                // Synchronize graphic token values with current engine active states
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                musicToggle.style.borderColor = 'var(--neon-pink)';
                
                // Tear down global listeners instantly once operational to save process memory
                document.removeEventListener('click', startAutoplay);
                document.removeEventListener('touchstart', startAutoplay);
                document.removeEventListener('scroll', startAutoplay);
            })
            .catch(() => {
                console.log("Awaiting core interaction thread payload to bypass browser safety restrictions.");
            });
    }
}

// Hook up instant background listeners to auto-fire low volume music upon click/scroll
document.addEventListener('click', startAutoplay);
document.addEventListener('touchstart', startAutoplay);
document.addEventListener('scroll', startAutoplay);

// Manual Volume Toggle Controller Pill Action
musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Shield baseline document triggers from firing overlapping loops
    
    if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        musicToggle.style.borderColor = 'var(--neon-pink)';
    } else {
        bgMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        musicToggle.style.borderColor = 'var(--glass-border)';
    }
});

/**
 * 2. BACKGROUND STARFIELD DYNAMICS
 */
function initCanvas() {
    spaceCanvas.width = window.innerWidth;
    spaceCanvas.height = window.innerHeight;
    generateStars(100);
}

window.addEventListener('resize', () => {
    spaceCanvas.width = window.innerWidth;
    spaceCanvas.height = window.innerHeight;
});

function generateStars(count) {
    starsArray = [];
    for (let i = 0; i < count; i++) {
        starsArray.push({
            x: Math.random() * spaceCanvas.width,
            y: Math.random() * spaceCanvas.height,
            radius: Math.random() * 1.4,
            alpha: Math.random(),
            speed: 0.006 + Math.random() * 0.012
        });
    }
}

function animateSpace() {
    ctx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);
    
    // Draw Space Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    starsArray.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
        ctx.save();
        ctx.globalAlpha = Math.max(0, star.alpha);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    // Update Fireworks Particles
    fireworksArray.forEach((firework, fIdx) => {
        firework.particles.forEach((p, pIdx) => {
            p.x += p.vx; p.y += p.vy;
            p.vy += 0.045; // Simulated gravity drop vector
            p.alpha -= 0.014;

            if (p.alpha <= 0) {
                firework.particles.splice(pIdx, 1);
            } else {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });
        if (firework.particles.length === 0) fireworksArray.splice(fIdx, 1);
    });

    requestAnimationFrame(animateSpace);
}

function createFirework(x, y) {
    const colors = ['#ff007f', '#00f0ff', '#9d00ff', '#ffeb3b'];
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    const particles = [];
    
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3.5;
        particles.push({
            x: x, y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1 + Math.random() * 1.5,
            color: selectedColor,
            alpha: 1
        });
    }
    fireworksArray.push({ particles });
}

/**
 * 3. TYPEWRITER RENDERING ENGINE
 */
function handleTypewriter() {
    const targetElement = document.getElementById('typewriter');
    if (!targetElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        targetElement.innerHTML = currentPhrase.substring(0, typewriterIndex - 1);
        typewriterIndex--;
    } else {
        targetElement.innerHTML = currentPhrase.substring(0, typewriterIndex + 1);
        typewriterIndex++;
    }

    let typingSpeed = isDeleting ? 25 : 55;

    if (!isDeleting && typewriterIndex === currentPhrase.length) {
        typingSpeed = 2400; // Static reading freeze period delay
        isDeleting = true;
    } else if (isDeleting && typewriterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Delay frame count buffer before rolling next quote block
    }

    setTimeout(handleTypewriter, typingSpeed);
}

/**
 * 4. SPARKLE GENERATORS & PARTICLE DRIVERS
 */
function spawnFloatingAssets() {
    const container = document.getElementById('floating-container');
    const assetPool = ['❤️', '🌹', '🦋', '✨'];
    
    setInterval(() => {
        const item = document.createElement('div');
        item.classList.add('floating-element');
        item.textContent = assetPool[Math.floor(Math.random() * assetPool.length)];
        item.style.left = Math.random() * 100 + 'vw';
        
        const duration = 6 + Math.random() * 5;
        item.style.animationDuration = duration + 's';
        
        container.appendChild(item);
        setTimeout(() => item.remove(), duration * 1000);
    }, 850);
}

function spawnBalloons() {
    const container = document.getElementById('floating-container');
    const colors = ['rgba(255, 0, 127, 0.75)', 'rgba(0, 240, 255, 0.75)', 'rgba(157, 0, 255, 0.75)'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.classList.add('balloon-element');
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            balloon.style.background = color;
            balloon.style.boxShadow = `inset -5px -5px 15px rgba(0,0,0,0.3), 0 10px 20px ${color}`;
            balloon.style.left = Math.random() * 90 + 'vw';
            
            const duration = 6 + Math.random() * 4;
            balloon.style.animationDuration = duration + 's';
            
            container.appendChild(balloon);
            setTimeout(() => balloon.remove(), duration * 1000);
        }, i * 200);
    }
}

function triggerConfettiBurst() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ff007f', '#00f0ff', '#9d00ff', '#ffeb3b'];
    
    for(let i = 0; i < 75; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
        
        const duration = 2 + Math.random() * 2.5;
        piece.style.animationDuration = duration + 's';
        
        container.appendChild(piece);
        setTimeout(() => piece.remove(), (duration + 0.5) * 1000);
    }
}

/**
 * 5. CELEBRATION NODE INTERACTION SYSTEM (GIFT & CAKE MODULE ARCS)
 */
mainGift.addEventListener('click', () => {
    if (!isGiftOpened) {
        isGiftOpened = true; // Hard lock execution boundary
        mainGift.classList.add('open');
        
        spawnBalloons();
        triggerConfettiBurst();
        
        for(let i = 0; i < 6; i++) {
            setTimeout(() => {
                createFirework(
                    window.innerWidth * 0.25 + Math.random() * (window.innerWidth * 0.5),
                    window.innerHeight * 0.25 + Math.random() * (window.innerHeight * 0.35)
                );
            }, i * 180);
        }
    }
});

function extinguishCandle(element) {
    if(element.classList.contains('lit')) {
        element.classList.remove('lit');
        element.classList.add('extinguished');
        
        createFirework(element.getBoundingClientRect().left, element.getBoundingClientRect().top);
        
        const activeCandles = document.querySelectorAll('.candle.lit');
        if(activeCandles.length === 0) {
            document.getElementById('reset-cake-btn').classList.remove('hidden');
            triggerConfettiBurst();
        }
    }
}

function relightCandles() {
    document.querySelectorAll('.candle').forEach(c => {
        c.classList.remove('extinguished');
        c.classList.add('lit');
    });
    document.getElementById('reset-cake-btn').classList.add('hidden');
}

/**
 * 6. ANIMATED VIEWPORT OBSERVATION ENGINE Setup
 */
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.id === 'cake-section') {
                createFirework(window.innerWidth / 2, window.innerHeight * 0.4);
            }
        }
    });
}, { threshold: 0.15 });

/**
 * CORE LIFE SYSTEM RUNTIME BOOTSTRAPPING
 */
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    animateSpace();
    handleTypewriter();
    spawnFloatingAssets();
    document.querySelectorAll('.scroll-section').forEach(s => sectionObserver.observe(s));
});