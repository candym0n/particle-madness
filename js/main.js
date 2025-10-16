import { CONTROL_ELEMENTS, PARTICLE_RADIUS } from './constants.js';
import { ParticleSystem } from './particles/ParticleSystem.js';
import { Particle } from './particles/Particle.js';

/** Main entry point for modular particle canvas. */

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const playPauseBtn = document.getElementById('playPauseBtn');

let system;
let running = true;
let speed = 5; // 1-10
let diversity = 70; // 0-100
let inertiaMultiplier = 0.9; // 0 - 1

/**
 * Resize canvas and re-center origin.
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.translate(canvas.width/2, canvas.height/2); // set center as origin
    if (system) {
        system.width = canvas.width;
        system.height = canvas.height;
    }
}
window.addEventListener('resize', resizeCanvas);

// Returns a list of particles
function circle(center, radius, color, list=[]) {
    for (let t = 0; t < Math.PI * 2; t += Math.PI / 3) {
        let dirX = Math.cos(t);
        let dirY = Math.sin(t);

        for (let i = 0; i < radius; ++i) {
            list.push(new Particle(
                center[0] + dirX * PARTICLE_RADIUS * i * 5,
                center[1] + dirY * PARTICLE_RADIUS * i * 5,
                0,
                0,
                color,
                100
            ));
        }
    }
}

/**
 * Initialize particle system and begin animation.
 */
function init() {
    resizeCanvas();
    
    const redCenter = [100, 100];
    const greenCenter = [-100, 100];
    const blueCenter = [0, 0];

    let initialSystem = [];
    circle(redCenter, 2, { r: 255, g: 0, b: 0 }, initialSystem);
    circle(greenCenter, 2, { r: 0, g: 255, b: 0 }, initialSystem);
    circle(blueCenter, 2, { r: 0, g: 0, b: 255 }, initialSystem);
    
    system = new ParticleSystem(canvas.width, canvas.height, initialSystem);
}
init();

let lastTime = performance.now();
function animate(now) {
    if (!running) return;
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear with default origin

    ctx.translate(canvas.width/2, canvas.height/2); // move origin to center
    for (let i = 0; i < speed; ++i) {
        system.update(dt, diversity, inertiaMultiplier);
    }
    system.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

/**
 * Pause or resume animation.
 */
function togglePlayPause() {
    running = !running;
    playPauseBtn.textContent = running ? 'Pause' : 'Play';
    if (running) {
        lastTime = performance.now();
        requestAnimationFrame(animate);
    }
}

playPauseBtn.addEventListener('click', togglePlayPause);
CONTROL_ELEMENTS.SPEED_SLIDER.addEventListener('input', (e) => {
    speed = e.target.value;
    CONTROL_ELEMENTS.SPEED_VALUE.textContent = speed;
});

CONTROL_ELEMENTS.DIVERSITY_SLIDER.addEventListener('input', (e) => {
    diversity = e.target.value;
    CONTROL_ELEMENTS.DIVERSITY_VALUE.textContent = diversity + "%";
});

CONTROL_ELEMENTS.INERTIA_SLIDER.addEventListener('input', (e) => {
    inertiaMultiplier = e.target.value;
    CONTROL_ELEMENTS.INERTIA_VALUE.textContent = inertiaMultiplier;
})

const collapseBtn = document.getElementById('collapseToggle');
const controls = document.querySelector('.particle-controls');

collapseBtn.addEventListener('click', () => {
    controls.classList.toggle('collapsed');
    // Change icon based on state
    if (controls.classList.contains('collapsed')) {
        collapseBtn.textContent = '+';
        collapseBtn.setAttribute('aria-label', 'Expand');
    } else {
        collapseBtn.textContent = '-';
        collapseBtn.setAttribute('aria-label', 'Collapse');
    }
});
