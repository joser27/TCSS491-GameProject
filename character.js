class Character {
    constructor(gameEngine, spriteSheet, scene, pistolSpriteSheet) {
        this.gameEngine = gameEngine;
        this.spriteSheet = spriteSheet;
        this.pistolSpriteSheet = pistolSpriteSheet;
        this.scene = scene;

        this.x = 0;
        this.y = 0;
        this.speed = 3;
        this.health = 100;
        this.zIndex = 2;

        this.boundingbox = new BoundingBox(this.x, this.y, 80, 80);
        this.isDead = false;
        this.deathCompleted = false;
        this.isMoving = false;
        this.currentAttack = null;
        this.attackCooldown = false;
        this.isUsingPistol = false;

        // Single run animation (right-facing)
        this.runAnimation = new Animator(
            ASSET_MANAGER.getAsset(spriteSheet),
            512 * 58, // 59th sprite
            0,
            512,
            512,
            8,
            0.1,
            .8,
            true
        );

        // Idle Animation
        this.idleAnimation = new Animator(
            ASSET_MANAGER.getAsset(spriteSheet),
            512 * 48, // 49th sprite
            0,
            512,
            512,
            1,
            1,
            0.8,
            true
        );

        // Death Animation
        this.deathAnimation = new Animator(
            ASSET_MANAGER.getAsset(spriteSheet),
            512 * 30, // 31st sprite
            0,
            512,
            512,
            10,
            0.2,
            0.8,
            false
        );

        // Attack Animations
        this.attackAnimations = {
            chop: new Animator(
                ASSET_MANAGER.getAsset(spriteSheet),
                512 * 6, // 7th sprite
                0,
                512,
                512,
                4,
                0.1,
                0.8,
                false
            ),
            kick: new Animator(
                ASSET_MANAGER.getAsset(spriteSheet),
                512 * 10, // 11th sprite
                0,
                512,
                512,
                5,
                0.1,
                0.8,
                false
            ),
            punch: new Animator(
                ASSET_MANAGER.getAsset(spriteSheet),
                512 * 17, // 18th sprite
                0,
                512,
                512,
                6,
                0.1,
                0.8,
                false
            )
        };

        this.pistolAnimations = {
            idle: new Animator(
                ASSET_MANAGER.getAsset(pistolSpriteSheet),
                512 * 26, 
                0,
                512,
                512,
                1,
                1,
                0.8,
                true
            ),
            run: new Animator (
                ASSET_MANAGER.getAsset(pistolSpriteSheet),
                512 * 39,
                0,
                512,
                512,
                8,
                0.1,
                0.8,
                true
            ),
            death: new Animator (
                ASSET_MANAGER.getAsset(pistolSpriteSheet),
                512 * 13,
                0,
                512,
                512,
                8,
                0.1,
                0.8,
                false
            )

        }

        // Direction state
        this.facingLeft = false;
    }

    update() {
        if (this.isDead) {
            if (this.deathAnimation.isDone()) {
                this.deathCompleted = true;
            }
            return;
        }

        if (this.currentAttack) {
            const currentAnimation = this.attackAnimations[this.currentAttack];
            if (currentAnimation.isDone()) {
                currentAnimation.elapsedTime = 0;
                this.currentAttack = null;
                this.attackCooldown = false;
            }
            return;
        }
        if(this.x <= 0){
            this.x = 0;
        }
        this.boundingbox.x = this.x - this.gameEngine.camera.x;
        this.boundingbox.y = this.y;

        this.zIndex = this.y;
    }

    draw(ctx) {
        // Save the current context state
        ctx.save();

        // Define offsets consistently
        const offsetX = 165;  // Adjust this value to move sprites left/right
        const offsetY = 210;


        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.translate(-this.x * 2 - (512 * 0.8) + (offsetX * 2), 0);
        }
    
        if (this.usingPistol) {
            if (this.isDead) {
                this.pistolAnimations.death.drawFrame(this.gameEngine.clockTick, ctx, this.x - offsetX, this.y - offsetY);
            } else if (this.isMoving) {
                this.pistolAnimations.run.drawFrame(this.gameEngine.clockTick, ctx, this.x - offsetX, this.y - offsetY);
            } else {
                this.pistolAnimations.idle.drawFrame(this.gameEngine.clockTick, ctx, this.x - offsetX, this.y - offsetY);
            }
        } else {
            // Default animations (for both player & enemy)
            if (this.isDead) {
                this.deathAnimation.drawFrame(this.gameEngine.clockTick, ctx, this.x - offsetX, this.y - offsetY);
            } else if (this.isMoving) {
                this.runAnimation.drawFrame(this.gameEngine.clockTick, ctx, this.x - offsetX, this.y - offsetY);
            } else if (this.currentAttack) {
                this.attackAnimations[this.currentAttack].drawFrame(this.gameEngine.clockTick, ctx, this.x - offsetX, this.y - offsetY);
            }else {
                this.idleAnimation.drawFrame(this.gameEngine.clockTick, ctx, this.x - offsetX, this.y - offsetY);
            }
        }
    
        // Restore the context state
        ctx.restore();

        // Draw bounding box ON TOP of the sprite
        if (PARAMS.DEBUG) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            ctx.fillRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
        }
    }

    drawBoundingBox(ctx) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    }

    takeDamage(amount) {
        if (!this.isDead) {
            this.health -= amount;
            if (this.health <= 0) {
                this.isDead = true;
            }
        }
    }

    performAttack(type) {
        if (this.usingPistol) {
            // If using pistol, stay idle while shooting
            return;
        }
        if (!this.attackCooldown) {
            this.currentAttack = type;
            this.attackCooldown = true;
        }
    }

    drawGameOver(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", ctx.canvas.width / 2, ctx.canvas.height / 2);

        ctx.font = "24px Arial";
        ctx.fillText("Press R to Restart", ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
    }
}