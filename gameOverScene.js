class GameOverScene {
    constructor(gameEngine, sceneManager) {
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;
        this.zIndex = 3;
        ASSET_MANAGER.pauseBackgroundMusic();
        ASSET_MANAGER.playAsset("./assets/music/gameover.mp3");
    }

    update() {
        if (this.gameEngine.keys["Enter"]) {

            // Reset player stats
            this.sceneManager.gameState.playerStats.coins = 0;
            this.sceneManager.gameState.playerStats.upgrades = {
                berserkerMode: false,
                titanGuard: false,
                sharpenedSteel: false,
                gunslinger: false,
                shadowStep: false
            };
            this.sceneManager.gameState.currentLevel = 1;
            this.sceneManager.gameState.playerStats.health = 100;

            // Reset camera and transition to playing scene
            this.sceneManager.resetCamera();
            this.sceneManager.transitionToScene(PlayingScene);

        }
    }           


    draw(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
 

        ctx.font = "128px Minecraft";
        ctx.fillText("Game Over!", PARAMS.canvasWidth / 2, PARAMS.canvasHeight / 2-250);
        this.drawGlowingOval(ctx,PARAMS.canvasWidth / 2, PARAMS.canvasHeight / 2 + 50, 150, 37.5, 'white', 40);
        this.deathAnimation = new Animator(
            ASSET_MANAGER.getAsset('./assets/sprites/white_fight_spritesheet.png'),
            512 * 40, // 31st sprite
            0,
            512,
            512,
            1,
            0.2,
            0.8,
            false
        );
        this.deathAnimation.drawFrame(this.gameEngine.clockTick, ctx, PARAMS.canvasWidth / 2-200, PARAMS.canvasHeight / 2-250);

        ctx.font = "24px Arial";
        ctx.fillText("Press Enter to restart", PARAMS.canvasWidth / 2, PARAMS.canvasHeight / 2 + 250);
        
    }
    drawGlowingOval(ctx, x, y, sizeX, sizeY,color, glowSize) {
        
        for (let i = 1; i <= glowSize; i++) {
            ctx.beginPath();

            ctx.fillStyle = `rgba(255, 255, 255, ${1 / glowSize })`;
            ctx.ellipse(x, y, sizeX +i, sizeY+ i/2, 0, 0, Math.PI * 2);
            
            ctx.fill();
          
        }
        ctx.beginPath();
        ctx.ellipse(x, y, sizeX, sizeY, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

    }
}
