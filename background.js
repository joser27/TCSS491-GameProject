class Background {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.ground = ASSET_MANAGER.getAsset("./assets/sprites/evenBiggerGround.png");
        this.groundDetails = {
            width: this.ground.width,
            height: this.ground.height,
        }


    }

    update() {

    }   

    draw(ctx) {
        ctx.drawImage(this.ground, 0, 220, this.groundDetails.width, this.groundDetails.height);
        ctx.drawImage(this.ground, this.groundDetails.width-4, 220, this.groundDetails.width, this.groundDetails.height);
    }
}
