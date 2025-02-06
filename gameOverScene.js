class GameOverScene {
    constructor(gameEngine, sceneManager) {
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;
        this.zIndex = 100;
    }

    update() {
        if (this.gameEngine.keys["Enter"]) {
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
