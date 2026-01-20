/**
 * CineMatch - Canvas Animation
 * Animated floating cinema doodles (film reels, popcorn, tickets, stars, etc.)
 */

class DoodleAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.doodles = [];
        this.doodleCount = 15;
        this.animationId = null;

        this.init();
        this.createDoodles();
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createDoodles() {
        const types = ['filmReel', 'popcorn', 'ticket', 'clapboard', 'star', 'phone'];

        for (let i = 0; i < this.doodleCount; i++) {
            this.doodles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 30 + Math.random() * 40,
                type: types[Math.floor(Math.random() * types.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.5 + Math.random() * 0.5,
                opacity: 0.12 + Math.random() * 0.1
            });
        }
    }

    drawFilmReel(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        // Outer circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#c97706';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Inner circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
        this.ctx.stroke();

        // Sprocket holes
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const holeX = Math.cos(angle) * (size / 3);
            const holeY = Math.sin(angle) * (size / 3);
            this.ctx.beginPath();
            this.ctx.arc(holeX, holeY, size / 12, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawPopcorn(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.strokeStyle = '#c97706';
        this.ctx.lineWidth = 2;

        // Bucket (trapezoid)
        this.ctx.beginPath();
        this.ctx.moveTo(-size / 3, size / 2);
        this.ctx.lineTo(-size / 4, -size / 4);
        this.ctx.lineTo(size / 4, -size / 4);
        this.ctx.lineTo(size / 3, size / 2);
        this.ctx.closePath();
        this.ctx.stroke();

        // Stripes
        this.ctx.beginPath();
        this.ctx.moveTo(-size / 12, -size / 4);
        this.ctx.lineTo(-size / 6, size / 2);
        this.ctx.moveTo(size / 12, -size / 4);
        this.ctx.lineTo(size / 6, size / 2);
        this.ctx.stroke();

        // Popcorn puffs
        const puffs = [
            { x: 0, y: -size / 3 },
            { x: -size / 5, y: -size / 2.5 },
            { x: size / 5, y: -size / 2.5 },
            { x: -size / 8, y: -size / 2 },
            { x: size / 8, y: -size / 2 }
        ];
        puffs.forEach(puff => {
            this.ctx.beginPath();
            this.ctx.arc(puff.x, puff.y, size / 8, 0, Math.PI * 2);
            this.ctx.stroke();
        });

        this.ctx.restore();
    }

    drawTicket(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.strokeStyle = '#c97706';
        this.ctx.lineWidth = 2;

        // Ticket shape
        const w = size * 0.8;
        const h = size * 0.4;

        this.ctx.beginPath();
        this.ctx.roundRect(-w / 2, -h / 2, w, h, 4);
        this.ctx.stroke();

        // Perforation line
        this.ctx.setLineDash([3, 3]);
        this.ctx.beginPath();
        this.ctx.moveTo(w / 4, -h / 2);
        this.ctx.lineTo(w / 4, h / 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Star on ticket
        this.ctx.beginPath();
        this.ctx.arc(-w / 8, 0, h / 4, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawClapboard(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.strokeStyle = '#c97706';
        this.ctx.lineWidth = 2;

        const w = size * 0.8;
        const h = size * 0.6;

        // Main board
        this.ctx.strokeRect(-w / 2, -h / 4, w, h / 1.5);

        // Top clapper
        this.ctx.beginPath();
        this.ctx.moveTo(-w / 2, -h / 4);
        this.ctx.lineTo(-w / 3, -h / 2);
        this.ctx.lineTo(w / 2.5, -h / 2);
        this.ctx.lineTo(w / 2, -h / 4);
        this.ctx.closePath();
        this.ctx.stroke();

        // Stripes on clapper
        for (let i = 0; i < 4; i++) {
            const startX = -w / 3 + (i * w / 5);
            this.ctx.beginPath();
            this.ctx.moveTo(startX, -h / 2);
            this.ctx.lineTo(startX + w / 10, -h / 4);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawStar(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.strokeStyle = '#c97706';
        this.ctx.lineWidth = 2;

        const spikes = 5;
        const outerRadius = size / 2;
        const innerRadius = size / 4;

        this.ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;

            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawPhone(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.strokeStyle = '#c97706';
        this.ctx.lineWidth = 2;

        const w = size * 0.4;
        const h = size * 0.7;

        // Phone body
        this.ctx.beginPath();
        this.ctx.roundRect(-w / 2, -h / 2, w, h, 4);
        this.ctx.stroke();

        // Screen
        this.ctx.strokeRect(-w / 2 + 3, -h / 2 + 6, w - 6, h - 15);

        // Home button
        this.ctx.beginPath();
        this.ctx.arc(0, h / 2 - 5, 3, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now() / 1000;

        this.doodles.forEach(doodle => {
            // Update float position
            const floatY = Math.sin(time * doodle.floatSpeed + doodle.floatOffset) * 10;
            const currentY = doodle.y + floatY;

            // Update rotation
            doodle.rotation += doodle.rotationSpeed;

            this.ctx.globalAlpha = doodle.opacity;

            switch (doodle.type) {
                case 'filmReel':
                    this.drawFilmReel(doodle.x, currentY, doodle.size, doodle.rotation);
                    break;
                case 'popcorn':
                    this.drawPopcorn(doodle.x, currentY, doodle.size, doodle.rotation);
                    break;
                case 'ticket':
                    this.drawTicket(doodle.x, currentY, doodle.size, doodle.rotation);
                    break;
                case 'clapboard':
                    this.drawClapboard(doodle.x, currentY, doodle.size, doodle.rotation);
                    break;
                case 'star':
                    this.drawStar(doodle.x, currentY, doodle.size, doodle.rotation);
                    break;
                case 'phone':
                    this.drawPhone(doodle.x, currentY, doodle.size, doodle.rotation);
                    break;
            }
        });

        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.doodleAnimation = new DoodleAnimation('doodle-canvas');
});
