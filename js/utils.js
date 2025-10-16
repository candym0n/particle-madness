import { Particle } from "./particles/Particle.js";

/**
 * Generate a random float between min and max.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Compute the squared distance between two points.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function distSquared(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy;
}

/**
 * Compute the diversity between two particles based on color.
 * @param {Particle} p0 
 * @param {Particle} p1 
 * @returns {number} Higher is more diverse, 0 is identical
 */
export function diversity(p0, p1) {
    let a = [p0.color.r, p0.color.g, p0.color.b];
    let b = [p1.color.r, p1.color.g, p1.color.b];
    let c0 = b[0] > a[0] ? Math.sqrt(b[0] - a[0]) : 0;
    let c1 = b[1] > a[1] ? Math.sqrt(b[1] - a[1]) : 0;
    let c2 = b[2] > a[2] ? Math.sqrt(b[2] - a[2]) : 0;
    return (c0 + c1 + c2) * 2.08; // 2.08 is approx 1/sqrt(3*255) to normalize to [0,100]
}

/**
 * Compute the new average color after adding a particle
 * @param {number} existingAverage
 * @param {number} count
 * @param {Particle} newParticle
 * @returns {number}
 */

export function addToAverage(existingAverage, count, newParticle) {
    return {
        r: (existingAverage.r * count + newParticle.color.r) / (count + 1),
        g: (existingAverage.g * count + newParticle.color.g) / (count + 1),
        b: (existingAverage.b * count + newParticle.color.b) / (count + 1)
    };
}

/**
 * Compute the new average color after removing a particle.
 * @param {number} existingAverage 
 * @param {number} count 
 * @param {Particle} oldParticle 
 * @returns {number}
 */
export function removeFromAverage(existingAverage, count, oldParticle) {
    if (count <= 1) {
        return { r: 85, g: 85, b: 85 }; // reset to neutral
    }

    return {
        r: (existingAverage.r * count - oldParticle.color.r) / (count - 1),
        g: (existingAverage.g * count - oldParticle.color.g) / (count - 1),
        b: (existingAverage.b * count - oldParticle.color.b) / (count - 1)
    };
}

/**
 * Linear interpolation between a and b by t (0 to 1).
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
