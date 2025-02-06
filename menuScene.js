class MenuScene {
    constructor(gameEngine, sceneManager) {
        this.sceneManager = sceneManager;
        this.gameEngine = gameEngine;
    }
    update() {
        if (this.gameEngine.keys["Enter"] && this.canReturn) {
            this.sceneManager.clearEntities();
            this.sceneManager.scene = new MenuScene(this.gameEngine, this.sceneManager);
            this.gameEngine.addEntity(this.sceneManager.scene);
        }
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Title
        ctx.font = "64px eager___";
        ctx.fillStyle = "#FFD700"; // Gold color
        ctx.textAlign = "center";
        ctx.fillText("Credits", ctx.canvas.width / 2, 100);

        // Team members
        ctx.font = "32px eager___";
        ctx.fillStyle = "white";
        const centerX = ctx.canvas.width / 2;
        const startY = 200;
        const spacing = 50;

        // Development Team
        ctx.fillStyle = "#FFD700";
        ctx.fillText("TCSS491 - Blue 4 Team", centerX, startY);
        
        ctx.fillStyle = "white";
        ctx.fillText("Charankamal Brar", centerX, startY + spacing);
        ctx.fillText("Shu-Ren Shen", centerX, startY + spacing * 2);
        ctx.fillText("Jose Rodriguez", centerX, startY + spacing * 3);

        // Assets
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Assets", centerX, startY + spacing * 5);
        
        ctx.fillStyle = "white";
        ctx.font = "24px eager___";
        ctx.fillText("Spritesheets by rgsdev", centerX, startY + spacing * 6);
        ctx.fillText("rgsdev.itch.io", centerX, startY + spacing * 6.5);
        
        ctx.fillText("Keyboard sprites by BeamedEighth", centerX, startY + spacing * 7.5);
        ctx.fillText("beamedeighth.itch.io", centerX, startY + spacing * 8);

        // Return instruction
        ctx.font = "20px eager___";
        ctx.fillStyle = "#808080";
        ctx.fillText("Press Enter to return to Menu", ctx.canvas.width / 2, ctx.canvas.height - 50);
    }
}
