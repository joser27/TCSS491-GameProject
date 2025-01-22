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
    }

    update() {
        if (this.transitioningScreen) {
            if (this.gameEngine.camera.x < this.transitionTarget) {
                this.gameEngine.camera.x += this.transitionSpeed;
                const transitionProgress = (this.gameEngine.camera.x - (this.screenPosition - 1) * PARAMS.canvasWidth) / PARAMS.canvasWidth;
                
                // Smoothly move player from right side to left side
                this.screenX = this.originalX + (100 - this.originalX) * transitionProgress;
                this.x = this.screenX + this.gameEngine.camera.x;

                if (this.gameEngine.camera.x >= this.transitionTarget) {
                    this.gameEngine.camera.x = this.transitionTarget;
                    this.transitioningScreen = false;
                    this.screenX = 100;
                    this.x = this.screenX + this.gameEngine.camera.x;
                }
            }
            return;
        }

        // Normal movement controls
        if (this.gameEngine.keys.d) {
            if (this.screenX < PARAMS.canvasWidth - 100) {
                this.screenX += 5;
                this.x = this.screenX + this.gameEngine.camera.x;
            } else if (this.canProgress && !this.transitioningScreen) {
                this.transitioningScreen = true;
                this.screenPosition++;
                this.transitionTarget = this.screenPosition * PARAMS.canvasWidth;
                this.originalX = this.screenX;
            }
        }
        if (this.gameEngine.keys.a) {
            if (this.screenX > 100) {
                this.screenX -= 5;
                this.x = this.screenX + this.gameEngine.camera.x;
            }
        }
        if (this.gameEngine.keys.w) {
            if (this.y > 100) {
                this.y -= 5;
            }
        }
        if (this.gameEngine.keys.s) {
            if (this.y < PARAMS.canvasHeight - 100) {
                this.y += 5;
            }
        }

        // Keep player within vertical bounds
        if (this.y < 100) this.y = 100;
        if (this.y > PARAMS.canvasHeight - 100) this.y = PARAMS.canvasHeight - 100;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.screenX, this.y, 16, 16);
        this.runAnimation.drawFrame(
            this.gameEngine.clockTick,
            ctx,
            this.screenX-250,
            this.y-370
        );

        ctx.fillStyle = "blue";
        ctx.font = "20px Arial";
        ctx.fillText(
            "Screen: " + Math.floor(this.screenX/PARAMS.CELL_SIZE) + 
            ", World: " + Math.floor(this.x/PARAMS.CELL_SIZE) + 
            ", Y: " + Math.floor(this.y/PARAMS.CELL_SIZE), 
            100, 100
        );
    }
}

