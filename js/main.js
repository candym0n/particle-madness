import { CONTROL_ELEMENTS, PARTICLE_RADIUS } from './constants.js';
import { ParticleSystem } from './particles/ParticleSystem.js';
import { Particle } from './particles/Particle.js';

/** Main entry point for modular particle canvas. */

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const playPauseBtn = document.getElementById('playPauseBtn');

let system;
let running = false;
let speed = 5; // 1-10
let diversity = 70; // 0-100
let inertiaMultiplier = 0.9; // 0 - 1
let x, y;
let erase = false;

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
    circle(redCenter, 1, { r: 255, g: 0, b: 0 }, initialSystem);
    circle(greenCenter, 1, { r: 0, g: 255, b: 0 }, initialSystem);
    circle(blueCenter, 1, { r: 0, g: 0, b: 255 }, initialSystem);
    
    system = new ParticleSystem(canvas.width, canvas.height, initialSystem);
}
init();

let lastTime = performance.now();
function animate(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear with default origin

    ctx.translate(canvas.width/2, canvas.height/2); // move origin to center
    
    for (let i = 0; i < (running ? speed : 1); ++i) {
        system.update(running ? dt : 0, diversity, inertiaMultiplier);
    }
    
    system.draw(ctx);

    if (erase) {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    
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
document.addEventListener("keydown", ({ key }) => {
    switch (key.toLowerCase()) {
        case "p":
            togglePlayPause();
            break;
        case "arrowup":
            speed = Math.min(500, speed + 1);
            break;
        case "arrowdown":
            speed = Math.max(1, speed - 1);
            break;
        case "arrowleft":
            speed = 1;
            break;
        case "arrowright":
            speed = Math.min(500, speed + 10);
            break;
        case "control":
            erase = !erase;
            break;
    }
    
    CONTROL_ELEMENTS.SPEED_VALUE.textContent = speed;
});

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
});

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

// Logic for erasing particles
let mouseDown = false;

document.addEventListener("mousedown", () => mouseDown = true);
document.addEventListener("mouseup", () => mouseDown = false);

document.addEventListener("mousemove", ({ clientX, clientY }) => {
    if (mouseDown && erase)
        system.erase(clientX - canvas.width / 2, clientY - canvas.height / 2, 50);
    x = clientX - canvas.width / 2;
    y = clientY - canvas.height / 2;
});
