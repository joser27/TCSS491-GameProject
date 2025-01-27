class Background {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.ground = ASSET_MANAGER.getAsset("./assets/sprites/evenBiggerGround.png");
        this.background = ASSET_MANAGER.getAsset("./assets/sprites/background1.png");
        this.house1 = ASSET_MANAGER.getAsset("./assets/sprites/building1.png");
        this.house2 = ASSET_MANAGER.getAsset("./assets/sprites/building2.png");
        this.house3 = ASSET_MANAGER.getAsset("./assets/sprites/building3.png");
        this.groundDetails = {
            width: this.ground.width,
            height: this.ground.height,
        }
        this.backgroundDetails = {
            width: this.background.width/3,
            height: this.background.height/3,
        }
        this.houseDetails = {
            width: this.house1.width/2,
            height: this.house1.height/2,
        }




    }

    update() {

    }   

    draw(ctx) {
        ctx.drawImage(this.background, 0, 0, this.backgroundDetails.width, this.backgroundDetails.height);
        ctx.drawImage(this.background, this.backgroundDetails.width-4, 0, this.backgroundDetails.width, this.backgroundDetails.height);

        ctx.drawImage(this.ground, 0, 220, this.groundDetails.width, this.groundDetails.height);
        ctx.drawImage(this.ground, this.groundDetails.width-4, 220, this.groundDetails.width, this.groundDetails.height);

        ctx.drawImage(this.house1, 0, 120, this.houseDetails.width, this.houseDetails.height);
        ctx.drawImage(this.house2, this.houseDetails.width, 120, this.houseDetails.width, this.houseDetails.height);
        ctx.drawImage(this.house3, this.houseDetails.width*2-4, 120, this.houseDetails.width , this.houseDetails.height);
        
        
        
    }
}
