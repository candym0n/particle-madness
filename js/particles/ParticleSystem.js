import { Particle } from './Particle.js';
import { randRange, distSquared, addToAverage, removeFromAverage, lerp, diversity } from '../utils.js';
import { PARTICLE_RADIUS, PARTICLE_RECOVERY, INTERACTION_PROBABILITIES } from '../constants.js';

/**
 * Manages a collection of particles.
 */
export class ParticleSystem {
    /**
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {object[]} initialParticles - Array of initial particle configs
     */
    constructor(width, height, initialParticles) {
        /** @type {Particle[]} */
        this.particles = initialParticles.map(
            cfg => new Particle(cfg.x, cfg.y, cfg.vx, cfg.vy, cfg.color, cfg.life)
        );
        /** @type {number} */
        this.width = width;
        /** @type {number} */
        this.height = height;

        /**
         * Debugging info
        */
       this.averageColor = { r: 255/3, g: 255/3, b: 255/3 };
    }

    /**
     * Update all particles in the system.
     * @param {number} dt
     */
    update(dt) {
        const self = this;

        for (let i = this.particles.length - 1; i >= 0; --i) {
            let p = this.particles[i];
            const neighbors = self.findNeighbors(p);
            p.update(dt, neighbors, self.attemptBreed.bind(self));
           
            p.recoveryTimer -= dt * 1000;
            p.life -= dt;

            // Bouncy bouncy
            if (p.x < -this.width/2) {
                p.x = -this.width/2;
                p.vx = Math.abs(p.vx);
            }

            if (p.x > this.width/2) {
                p.x = this.width/2;
                p.vx = -Math.abs(p.vx);
            }

            if (p.y < -this.height/2) {
                p.y = -this.height/2;
                p.vy = Math.abs(p.vy);
            }

            if (p.y > this.height/2) {
                p.y = this.height/2;
                p.vy = -Math.abs(p.vy);
            }

            if (p.life <= 0) {
                this.averageColor = removeFromAverage(this.averageColor, this.particles.length, p);
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Find neighbors within vicinity.
     * @param {Particle} particle
     * @returns {Particle[]}
     */
    findNeighbors(particle) {
        const neighbors = [];
        const vicinity = particle.lookingRadius;
        const r2 = vicinity * vicinity;
        for (let p of this.particles) {
            if (p === particle) continue;
            if (distSquared(particle.x, particle.y, p.x, p.y) < r2) {
                neighbors.push(p);
            }
        }
        return neighbors;
    }

    /**
     * Render all particles to canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Draw the particles
        for (let p of this.particles) {
            p.draw(ctx, PARTICLE_RADIUS);
        }

        // Draw the debug information
        const left = -this.width / 2 + 10;
        const top = this.height / 2 - 110;
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(left, top, 200, 100);
        ctx.fillStyle = 'black';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Particles: ${this.particles.length}`, left, top + 30);
        ctx.fillText(`Avg Color: (${Math.round(this.averageColor.r)},${Math.round(this.averageColor.g)},${Math.round(this.averageColor.b)})`, left, top + 60);
        ctx.restore();
    }

    /**
     * Try to create a new particle from two parents.
     * @param {Particle} parentA - ME!
     * @param {Particle} parentB - The one I want to breed with
     * @param {boolean}  dontMate - We can't mate because of whatever
     * @return {boolean} True if interaction occured
     */
    attemptBreed(parentA, parentB, dontMate) {
        // Are they both allowed to breed?
        if (parentA.inRecovery || parentB.inRecovery)
            return false;
        
        // Are they even touching?
        if (distSquared(parentA.x, parentA.y, parentB.x, parentB.y) > (PARTICLE_RADIUS * 2) ** 2)
            return false;

        parentA.recoveryTimer = PARTICLE_RECOVERY;
        parentB.recoveryTimer = PARTICLE_RECOVERY;
        
        // Probability check
        let random = Math.random();

        if (random <= INTERACTION_PROBABILITIES.IDENTITY) {
            parentA.color = { r: lerp(parentA.color.r, parentB.color.r, 0.3 + randRange(-0.1, 0.1)),
                              g: lerp(parentA.color.g, parentB.color.g, 0.3 + randRange(-0.1, 0.1)),
                              b: lerp(parentA.color.b, parentB.color.b, 0.3 + randRange(-0.1, 0.1)) };
            parentB.color = { r: lerp(parentB.color.r, parentA.color.r, 0.3 + randRange(-0.1, 0.1)),
                              g: lerp(parentB.color.g, parentA.color.g, 0.3 + randRange(-0.1, 0.1)),
                              b: lerp(parentB.color.b, parentA.color.b, 0.3 + randRange(-0.1, 0.1)) };
            return true;
        } else if (!dontMate && random <= INTERACTION_PROBABILITIES.BREED_MIN + INTERACTION_PROBABILITIES.BREED_MAX * diversity(parentA, parentB) / 100) { // up to 40% chance of breeding
            parentA.life -= 20;
            parentB.life -= 20;

            // Average position and velocity
            const x = (parentA.x + parentB.x) / 2;
            const y = (parentA.y + parentB.y) / 2;
            const vx = randRange(-1, 1);
            const vy = randRange(-1, 1);
            
            // Mix colors with some randomness
            const r = Math.min(255, Math.max(0, Math.round(lerp(parentA.color.r, parentB.color.r, randRange(0, 1)) + randRange(-30, 30))));
            const g = Math.min(255, Math.max(0, Math.round(lerp(parentA.color.g, parentB.color.g, randRange(0, 1)) + randRange(-30, 30))));
            const b = Math.min(255, Math.max(0, Math.round(lerp(parentA.color.b, parentB.color.b, randRange(0, 1)) + randRange(-30, 30))));
            const color = { r, g, b };

            // Create the particle
            let newParticle = new Particle(x, y, vx, vy, color, 100);
            this.particles.push(newParticle);
            this.averageColor = addToAverage(this.averageColor, this.particles.length, newParticle);
            return true;
        }

        // No interaction
        return false;
    }
}
