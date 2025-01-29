class Bullet {
    constructor(x, y, direction, scene) {
        this.x = x + (direction === -1 ? -30 : 30); // Offset for better gun alignment
        this.y = y - 10;
        this.direction = direction;
        this.speed = 5;
        this.width = 38;
        this.height = 24;
        this.offScreen = false;
        this.scene = scene;
        this.sprite = ASSET_MANAGER.getAsset("./assets/sprites/bullet.png");

       this.bulletAnimation = new Animator(
            this.sprite,
            this.x,
            this.y,
            this.width,
            this.height,
            1,
            1,
            1,
            false
       );
    }

    update(clockTick) {
        this.x += this.speed * this.direction;
        if (this.x < 0 || this.x > this.scene.gameEngine.ctx.canvas.width) {
            this.offScreen = true;
        }
        if (this.offScreen) {
            this.removeFromWorld = true; 
        }
    }

    draw(ctx) {
        this.bulletAnimation.drawFrame(
            this.scene.gameEngine.clockTick,
            ctx,
            this.x,
            this.y
        );
        
    }
}
