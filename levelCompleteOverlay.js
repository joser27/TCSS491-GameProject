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
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        
        // Background
        const img1 = new Image();
        img1.src = './assets/sprites/Box_Orange.png';

        ctx.drawImage(img1 , ctx.canvas.width / 2 - 250, 90 ,500 ,500);

        // Title
        img1.src = './assets/sprites/Title_UI.png';
        ctx.drawImage(img1,ctx.canvas.width/ 2 - 250, 100,500,150);
        ctx.font = "36px Courier New";
        ctx.fillText(`Level ${this.levelManager.sceneManager.gameState.currentLevel} Complete!`, ctx.canvas.width / 2, 200);

        // Grade
        img1.src = './assets/sprites/UI.png';
        ctx.drawImage(img1,ctx.canvas.width/ 2 - 125, 270,250,50);
        ctx.font = "24px Arial";
        ctx.fillText(`Grade: ${this.grade}`, ctx.canvas.width / 2, 300);
        
        // Stats
        ctx.drawImage(img1,ctx.canvas.width/ 2 - 125, 320,250,50);
        ctx.font = "20px Arial";
        ctx.fillText(`Coins Earned: ${this.coins}`, ctx.canvas.width / 2, 350);
        ctx.drawImage(img1,ctx.canvas.width/ 2 - 125, 370,250,50);
        ctx.fillText(`Health Remaining: ${this.health}%`, ctx.canvas.width / 2, 400);
        
        // Press Enter prompt
        ctx.drawImage(img1,ctx.canvas.width/ 2 - 125, 470,250,50);
        ctx.fillText("Press Enter to continue", ctx.canvas.width / 2, 500);
    }
}
