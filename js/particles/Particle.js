import { PARTICLE_RADIUS, PARTICLE_VICINITY } from "../constants.js";
import { distSquared, diversity } from "../utils.js";
import { ParticleSystem } from "./ParticleSystem.js";

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


        /** @type {Particle} */
        this.following = null; // particle this one wants to breed with
        /** @type {number} */
        this.followingDiversity = NaN; // diversity of the above relative to this
        
        /** @type {number} */
        this.recoveryTimer = 5; // time in ms until can interact again

        /** @type {number} */
        this.lookingRadius = PARTICLE_VICINITY; // The radius of the neighborhood
    }

    /**
     * Whether or not this particle is in recovery
     */
    get inRecovery() {
        return this.recoveryTimer > 0;
    }

    /**
     * Update particle state.
     * @param {number} dt - Time delta
     * @param {Particle[]} neighbors - Nearby particles
     * @param {(parentA: Particle, parentB: Particle) => void} interact - A function to breed
     * @param {number} diversityNum - Tendancy to explore diversity (0-100)
     * @param {number} inertiaMultiplier - % velocity retained for next update
     */
    update(dt, neighbors, interact, diversityNum, inertiaMultiplier) {
        // Update the position
        this.x += this.vx;
        this.y += this.vy;

        let localDiv = 0;

        if (this.inRecovery) {
            // Xenophobia during recovery
            for (let n of neighbors) {
                const dx = n.x - this.x;
                const dy = n.y - this.y;
                const lenSquared = dx * dx + dy * dy;
                if (lenSquared < 0.1) continue;
                this.vx -= (dx / lenSquared) * dt;
                this.vy -= (dy / lenSquared) * dt;
            }
        } else {
            // We are lonely :(
            if (neighbors.length === 0)
                this.lookingRadius += dt * 100; // Increase search radius
            else
                this.lookingRadius = PARTICLE_VICINITY; // Reset search radius

            let neighborCounter = 0;

            for (let n of neighbors) {
                // Diversity of neighbor
                const div = diversity(this, n);

                // Update the local diversity average
                localDiv = (localDiv * neighborCounter++ + div) / neighborCounter;
                
                // Follow the neighbor if it's good
                if (
                    (localDiv < diversityNum && !(div < this.followingDiversity)) ||
                    (localDiv > diversityNum && !(div > this.followingDiversity))
                ) {
                    this.following = n;
                    this.followingDiversity = div;
                }

                // Try to interact with any open neighbor that we are touching
                interact(this, n, neighbors.length > 20);
            }

            // Move towards the particle we follow
            if (this.following) {
                const dx = this.following.x - this.x;
                const dy = this.following.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 1) {
                    this.vx += (dx / dist) * dt;
                    this.vy += (dy / dist) * dt;
                }
            }
        }

        // Friction
        this.vx *= inertiaMultiplier;
        this.vy *= inertiaMultiplier;
    }

    /**
     * Draw particle on canvas context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} radius
     */
    draw(ctx, radius) {
        ctx.save();
        //ctx.globalAlpha = Math.max(this.life / 100, 0);
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
