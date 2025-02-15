class GoIndicator {
    constructor(x, y, player, zoneEndX, timer) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.zoneEndX = zoneEndX;
        this.timer = timer;
        this.alpha = 1;
        this.pulseSpeed = 3;
    }

    update() {
        // Remove the indicator if player has moved past the zone end
        if (this.player.x >= this.zoneEndX) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Use Timer
        const pulse = Math.sin(this.timer.gameTime * this.pulseSpeed);
        this.alpha = 0.5 + (pulse * 0.5);

        ctx.fillStyle = `rgba(255, 255, 0, ${this.alpha})`;
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.alpha})`;
        ctx.lineWidth = 4;

        // Draw "GO!" text
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeText("GO!", this.x, this.y);
        ctx.fillText("GO!", this.x, this.y);

        // Draw a arrow
        const arrowX = this.x + 50;
        const arrowY = this.y;

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + 20, arrowY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(arrowX + 20, arrowY);
        ctx.lineTo(arrowX + 15, arrowY - 5);
        ctx.lineTo(arrowX + 15, arrowY + 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
//update