class MenuScene {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
    }
    update() {

    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText("Menu Press Enter to Start", 100, 100);
    }
}