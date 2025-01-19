class Enemy {
    constructor(gameEngine,x,y) {
        this.gameEngine = gameEngine;
        this.x = x;
        this.y = y;
    }

    update() {
        // Update logic here
    }

    draw(ctx) {

        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.gameEngine.camera.x, this.y, PARAMS.CELL_SIZE, PARAMS.CELL_SIZE);
    }
}