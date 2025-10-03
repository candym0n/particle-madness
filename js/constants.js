/**
 * Initial particle system configuration.
 * @type {{ x:number, y:number, vx:number, vy:number, color:{r:number,g:number,b:number}, life:number }[]}
 */
export const INITIAL_SYSTEM = [
    { x: 0,    y: 0,    vx: 0, vy: 0, color: { r: 255, g: 0,   b: 0   }, life: 100 },
    { x: 100,   y: 100,   vx: 0, vy: 0, color: { r: 0,   g: 255, b: 0   }, life: 100 },
    { x: -100,  y: 100,   vx: 0, vy: 0, color: { r: 0,   g: 0,   b: 255 }, life: 100 }
];

/** 
 * Default particle vicinity constant (in pixels, radius for neighbor search).
 * @type {number}
 */
export const PARTICLE_VICINITY = 100;

/** 
 * Particle radius for display (in pixels).
 * @type {number}
 */
export const PARTICLE_RADIUS = 5;

/**
 * The recovery time after interaction (in milliseconds).
 * @type {number}
 */
export const PARTICLE_RECOVERY = 2000;

export const INTERACTION_PROBABILITIES = {
    // Always 10 percent
    IDENTITY: 0.1,

    // Changes based on diversity
    BREED_MIN: 0.3, // 0 diversity
    BREED_MAX: 0.6, // Add this if there's 100% diversity (nearly impossible)
}

export const CONTROL_ELEMENTS = {
    SPEED_SLIDER: document.getElementById('speedSlider'),
    SPEED_VALUE: document.getElementById('speedValue'),

    DIVERSITY_SLIDER: document.getElementById('diversitySlider'),
    DIVERSITY_VALUE: document.getElementById('diversityValue'),

    PARTICLE_COUNT: document.getElementById('particleCount'),

    AVG_COLOR_RGB: document.getElementById('avgColorRGB'),
    AVG_COLOR_SWATCH: document.getElementById('avgColorSwatch'),

    INERTIA_SLIDER: document.getElementById('inertiaSlider'),
    INERTIA_VALUE: document.getElementById('inertiaValue')
}
