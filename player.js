class Player {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.x = 0;
        this.y = 0;
        this.runSheet = {
            width: 512,      // Width of a single frame
            height: 512,     // Height of a single frame
            startX: 512 * 58 // Starting X position (59th frame)
        }
        
        this.runAnimation = new Animator(
            ASSET_MANAGER.getAsset("./white_fight_spritesheet.png"),
            this.runSheet.startX,  // xStart
            0,                     // yStart
            this.runSheet.width,   // width of each frame
            this.runSheet.height,  // height of each frame
            8,                     // frameCount
            0.1,                   // frameDuration
            1                      // scale
        );
    }

    update() {
        if (this.gameEngine.keys.d) {
            this.x += 5;
        }
        if (this.gameEngine.keys.a) {
            this.x -= 5;
        }
        if (this.gameEngine.keys.w) {
            this.y -= 5;
        }
        if (this.gameEngine.keys.s) {
            this.y += 5;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 32, 32);
        this.runAnimation.drawFrame(
            this.gameEngine.clockTick,
            ctx,
            this.x,
            this.y
        );
    }
}

