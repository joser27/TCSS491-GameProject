class Enemy extends Character {
    constructor(gameEngine, scene) {
        super(gameEngine, "./assets/sprites/yellow_fight_spritesheet.png", scene); // Pass enemy sprite sheet
        this.x = 500;
        this.y = 400;
    }

    update() {
        super.update();
        // Add enemy-specific AI or movement logic here
        if (this.scene.player.x > this.x) {
            this.x += 1;
            this.isMoving = true;
            this.facingLeft = false;
        }
        if (this.scene.player.x < this.x) {
            this.x -= 1;
            this.isMoving = true;
            this.facingLeft = true;
        }
    }
}
