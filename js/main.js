import { INITIAL_SYSTEM } from './constants.js';
import { ParticleSystem } from './particles/ParticleSystem.js';

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

/**
 * Initialize particle system and begin animation.
 */
function init() {
    resizeCanvas();
    system = new ParticleSystem(canvas.width, canvas.height, INITIAL_SYSTEM);
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
    system.update(dt);
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
