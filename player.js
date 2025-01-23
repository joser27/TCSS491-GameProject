class Player {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.x = 0;        // Absolute position in world
        this.y = 0;
        this.screenX = 0;  // Relative position on screen
        this.screenPosition = 0;
        this.transitioningScreen = false;
        this.transitionSpeed = 15;
        this.transitionTarget = 0;
        this.canProgress = true;
        this.originalX = 0;
        this.runSheet = {
            width: 512,      // Width of a single frame
            height: 512,     // Height of a single frame
            startX: 512 * 58 // Starting X position (59th frame)
        }
        
        this.runAnimation = new Animator(
            ASSET_MANAGER.getAsset("./assets/sprites/white_fight_spritesheet.png"),
            this.runSheet.startX,  // xStart
            0,                     // yStart
            this.runSheet.width,   // width of each frame
            this.runSheet.height,  // height of each frame
            8,                     // frameCount
            0.1,                   // frameDuration
            1                      // scale
        );
        this.boundingbox = new BoundingBox(this.x,this.y,32,32)
    }

    update() {
        if (this.gameEngine.keys.d) {
            this.x += 3;
        }
        if (this.gameEngine.keys.s) {
            this.y += 3;
        }
        if (this.gameEngine.keys.w) {
            this.y -= 3;
        }
        if (this.gameEngine.keys.a) {
            this.x -= 3;
        }
        this.boundingbox.x = this.x;
        this.boundingbox.y = this.y;
        
    }

    draw(ctx) {

        this.runAnimation.drawFrame(
            this.gameEngine.clockTick,
            ctx,
            this.x-250, // position x sprite on boundingbox
            this.y-350  // position y sprite on boundingbox
        );
        ctx.fillStyle = "rgba(0, 179, 255, 0.68)";
        ctx.fillRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);

    }
}

