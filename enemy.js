class Enemy {
    constructor(gameEngine, scene, x, y) {
        this.gameEngine = gameEngine;
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    update() {
        if (this.x > this.scene.player.x) {
            this.x -= 2
        }
        if (this.x < this.scene.player.x) {
            this.x += 2
        }
    }

    draw(ctx) {

        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.gameEngine.camera.x, this.y, PARAMS.CELL_SIZE, PARAMS.CELL_SIZE);
    }
}