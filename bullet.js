class Bullet {
    constructor(x, y, direction, scene) {
        this.x = x + (direction === -1 ? -100 : 100); // Offset for better gun alignment
        this.y = y + 15;
        this.direction = direction;
        this.speed = 5;
        this.width = 38;
        this.height = 24;
        this.zIndex = 3;
        this.offScreen = false;
        this.scene = scene;
        this.sprite = ASSET_MANAGER.getAsset("./assets/sprites/bullet.png");
        
    }

    update(clockTick) {
        this.x += this.speed * this.direction;

        this.zIndex = Math.max(this.scene.player.y, this.scene.enemy) + 10;

        if (this.x < 0 || this.x > this.scene.gameEngine.ctx.canvas.width) {
            this.offScreen = true;
        }
        if (this.offScreen) {
            this.removeFromWorld = true; 
        }
    }
    

    draw(ctx) {
        ctx.save();

        if(this.direction === -1) {
            ctx.scale(-1,1);
            ctx.translate(-this.x*2 -this.width, 0);
        }

        ctx.drawImage(this.sprite, this.x + 10, this.y, this.width, this.height);

        ctx.restore();
    }
    
}
