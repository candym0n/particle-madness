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
