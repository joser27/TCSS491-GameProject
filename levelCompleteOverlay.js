class LevelCompleteOverlay {
    constructor(gameEngine, levelManager,stats) {
        this.gameEngine = gameEngine;
        this.levelManager = levelManager;
        this.coins = stats.coins;
        this.health = stats.health/2;
        this.onComplete = stats.onComplete;
        
        this.isFixedZ = true;
        this.zIndex = 3;
        
        // Calculate grade based on health
        this.grade = this.calculateGrade(this.health);
    }

    calculateGrade(health) {
        if (health >= 80) return 'S';
        if (health >= 60) return 'A';
        if (health >= 40) return 'B';
        if (health >= 20) return 'C';
        return 'D';
    }

    update() {
        // Check for Enter key press
        if (this.gameEngine.keys["Enter"]) {
            this.onComplete();
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        // Create semi-transparent background
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw stats with white text
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        
        // Title
        ctx.font = "48px Arial";
        ctx.fillText(`Level ${this.levelManager.sceneManager.gameState.currentLevel} Complete!`, ctx.canvas.width / 2, 150);


        // Grade
        ctx.font = "36px Arial";
        ctx.fillText(`Grade: ${this.grade}`, ctx.canvas.width / 2, 250);
        
        // Stats
        ctx.font = "24px Arial";
        ctx.fillText(`Coins Earned: ${this.coins}`, ctx.canvas.width / 2, 300);
        ctx.fillText(`Health Remaining: ${this.health}%`, ctx.canvas.width / 2, 350);
        
        // Press Enter prompt
        ctx.fillText("Press Enter to continue", ctx.canvas.width / 2, 450);
    }
}
