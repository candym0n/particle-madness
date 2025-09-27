/**
 * Initial particle system configuration.
 * @type {{ x:number, y:number, vx:number, vy:number, color:{r:number,g:number,b:number}, life:number }[]}
 */
export const INITIAL_SYSTEM = [
    { x: 0,    y: 0,    vx: 0, vy: 0, color: { r: 255, g: 0,   b: 0   }, life: 100 },
    { x: 50,   y: 50,   vx: 0, vy: 0, color: { r: 0,   g: 255, b: 0   }, life: 100 },
    { x: -50,  y: 50,   vx: 0, vy: 0, color: { r: 0,   g: 0,   b: 255 }, life: 100 }
];

/** 
 * Particle vicinity constant (in pixels, radius for neighbor search).
 * @type {number}
 */
export const PARTICLE_VICINITY = 80;

/** 
 * Particle radius for display (in pixels).
 * @type {number}
 */
export const PARTICLE_RADIUS = 10;
