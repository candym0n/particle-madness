import { PARTICLE_RADIUS } from './constants.js';
import { ParticleSystem } from './particles/ParticleSystem.js';
import { Particle } from './particles/Particle.js';

/** Main entry point for modular particle canvas. */

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const playPauseBtn = document.getElementById('playPauseBtn');

let system;
let running = true;

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
    for (let i = 0; i < 10; ++i) {
        system.update(dt);
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
