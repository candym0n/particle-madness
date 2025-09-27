import { Particle } from './Particle.js';
import { randRange, distSquared } from '../utils.js';
import { PARTICLE_VICINITY, PARTICLE_RADIUS } from '../constants.js';

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
        this.vicinity = PARTICLE_VICINITY;
        /** @type {number} */
        this.width = width;
        /** @type {number} */
        this.height = height;
    }

    /**
     * Update all particles in the system.
     * @param {number} dt
     */
    update(dt) {
        for (let p of this.particles) {
            const neighbors = this.findNeighbors(p);
            p.update(dt, neighbors);

            // Respawn dead particles at a random position near center
            if (p.life <= 0) {
                p.x = randRange(-this.width/4, this.width/4);
                p.y = randRange(-this.height/4, this.height/4);
                p.vx = randRange(-60, 60);
                p.vy = randRange(-60, 60);
                p.life = 100;
                p.color = {
                    r: Math.floor(randRange(100,255)),
                    g: Math.floor(randRange(80,200)),
                    b: Math.floor(randRange(60,180))
                };
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
        const r2 = this.vicinity * this.vicinity;
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
        for (let p of this.particles) {
            p.draw(ctx, PARTICLE_RADIUS);
        }
    }
}
