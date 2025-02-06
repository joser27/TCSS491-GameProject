class Background {
    constructor(gameEngine, player) {
        this.gameEngine = gameEngine;
        this.zIndex = 0;
        this.ground = ASSET_MANAGER.getAsset("./assets/sprites/evenBiggerGround.png");
        this.background = ASSET_MANAGER.getAsset("./assets/sprites/background1.png");
        this.house1 = ASSET_MANAGER.getAsset("./assets/sprites/building1.png");
        this.house2 = ASSET_MANAGER.getAsset("./assets/sprites/building2.png");
        this.house3 = ASSET_MANAGER.getAsset("./assets/sprites/building3.png");
        this.player = player
        this.x = 0
        
        
        this.groundDetails = {
            width: this.ground.width,
            height: this.ground.height,
        }
        this.backgroundDetails = {
            width: this.ground.width,
            height: this.ground.height,
        }
        this.houseDetails = {
            width: this.house1.width/2,
            height: this.house1.height/2,
        }

        


    }

    update() {
        
        if(this.player.x - this.gameEngine.camera.x > PARAMS.canvasWidth / 2){
            this.gameEngine.camera.x += 3;
        }
        if(this.player.x - this.gameEngine.camera.x < 70){
            this.gameEngine.camera.x -= 3;
        }



    }   

    draw(ctx) {
        const cameraX = this.gameEngine.camera.x;
        
        for (let i = 0; i < 5; i++) {
            //Draw background
            ctx.drawImage(this.background, this.x + i * (this.backgroundDetails.width - 5) - cameraX/2, 0, this.backgroundDetails.width, this.backgroundDetails.height);
            //Draw ground
            ctx.drawImage(this.ground, this.x + i * (this.groundDetails.width -5) - cameraX, 220, this.groundDetails.width, this.groundDetails.height);
       
        }
       
        ctx.drawImage(this.house1, this.x + 1 * this.houseDetails.width - cameraX, 120, this.houseDetails.width, this.houseDetails.height);
        ctx.drawImage(this.house2, this.x + 2 * this.houseDetails.width - cameraX, 120, this.houseDetails.width, this.houseDetails.height);
        ctx.drawImage(this.house3, this.x + 3 * this.houseDetails.width - cameraX, 120, this.houseDetails.width, this.houseDetails.height);
        



       
        
       
    }
}