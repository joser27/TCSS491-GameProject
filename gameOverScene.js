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
 
        ctx.font = "64px Arial";
        ctx.fillText("GAME OVER", PARAMS.canvasWidth / 2, PARAMS.canvasHeight / 2);

        ctx.font = "24px Arial";
        ctx.fillText("Press ENTER to Restart", PARAMS.canvasWidth / 2, PARAMS.canvasHeight / 2 + 50);
    }
}
