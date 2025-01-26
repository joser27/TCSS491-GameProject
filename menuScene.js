class MenuScene {
    constructor(gameEngine, sceneManager) {
        this.sceneManager = sceneManager;
        this.gameEngine = gameEngine;
    }
    update() {
        if (this.gameEngine.keys["Enter"]) {
            this.sceneManager.clearEntities();
            this.sceneManager.scene = new PlayingScene(this.gameEngine, this.sceneManager);
            this.gameEngine.addEntity(this.sceneManager.scene);
        }
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText("Menu Press Enter to Start", 100, 100);
    }
}