class Bullet {
    constructor(player, scene) {
        this.direction = player.facingLeft ? -1 : 1;
        
        // Adjust starting position based on facing direction
        this.x = (player.x - scene.gameEngine.camera.x) + (this.direction === -1 ? -100: 100);
        this.y = player.y + 20;
        this.speed = 5;
        this.width = 19; //38
        this.height = 12;   //24
        this.zIndex = 3;
        this.offScreen = false;
        this.isPlaying = false;
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
            this.isPlaying = false;
        }
    }
    

    draw(ctx) {
        //debuging
        //ctx.fillStyle = "yellow";
        //ctx.fillRect(this.x, this.y, 50, 50);
        ctx.save();

        if(this.direction === -1) {
            ctx.scale(-1,1);
            ctx.translate(-this.x*2 -this.width, 0);
        }

        ctx.drawImage(this.sprite, this.x , this.y, this.width, this.height);
        if(!this.isPlaying){
            this.isPlaying = true;
            ASSET_MANAGER.playAsset("./assets/sound/shoot.mp3");
        }
        ctx.restore();
    }
    
}
