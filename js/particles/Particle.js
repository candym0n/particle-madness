/**
 * Represents a single particle in the system.
 */
export class Particle {
    /**
     * @param {number} x - Initial x position (center-based)
     * @param {number} y - Initial y position (center-based)
     * @param {number} vx - Initial x velocity
     * @param {number} vy - Initial y velocity
     * @param {{r:number,g:number,b:number}} color - RGB color
     * @param {number} life - Initial lifeforce
     */
    constructor(x, y, vx, vy, color, life) {
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
        /** @type {number} */
        this.vx = vx;
        /** @type {number} */
        this.vy = vy;
        /** @type {{r:number, g:number, b:number}} */
        this.color = color;
        /** @type {number} */
        this.life = life;
    }

    /**
     * Update particle state.
     * @param {number} dt - Time delta
     * @param {Particle[]} neighbors - Nearby particles
     */
    update(dt, neighbors) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt * 1; // Faster decay for demo
        // Sample repulsion (basic physics)
        for (let n of neighbors) {
            const dx = this.x - n.x, dy = this.y - n.y;
            const dsq = dx * dx + dy * dy + 0.01;
            if (dsq < 10000 && dsq > 0.1) {
                this.vx += (dx / dsq) * dt * 80;
                this.vy += (dy / dsq) * dt * 80;
            }
        }
    }

    /**
     * Draw particle on canvas context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} radius
     */
    draw(ctx, radius) {
        ctx.save();
        ctx.globalAlpha = Math.max(this.life / 100, 0);
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
