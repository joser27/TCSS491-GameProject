class Character {
    constructor(gameEngine, spriteSheet) {
        this.gameEngine = gameEngine;
        this.spriteSheet = spriteSheet;

        this.x = 0;
        this.y = 0;
        this.speed = 3;
        this.health = 100;

        this.boundingbox = new BoundingBox(this.x, this.y, 16, 16);
        this.isDead = false;
        this.deathCompleted = false;
        this.isMoving = false;
        this.currentAttack = null;
        this.attackCooldown = false;

        // Run Animation
        this.runAnimation = new Animator(
            ASSET_MANAGER.getAsset(spriteSheet),
            512 * 58, // 59th sprite
            0,
            512,
            512,
            8,
            0.1,
            0.5
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
            0.5
        );

        // Death Animation
        this.deathAnimation = new Animator(
            ASSET_MANAGER.getAsset(spriteSheet),
            512 * 30, // 31st sprite
            0,
            512,
            512,
            11,
            0.2,
            0.5
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
                0.5
            ),
            kick: new Animator(
                ASSET_MANAGER.getAsset(spriteSheet),
                512 * 10, // 11th sprite
                0,
                512,
                512,
                5,
                0.1,
                0.5
            ),
            punch: new Animator(
                ASSET_MANAGER.getAsset(spriteSheet),
                512 * 17, // 18th sprite
                0,
                512,
                512,
                6,
                0.1,
                0.5
            )
        };
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

        this.boundingbox.x = this.x;
        this.boundingbox.y = this.y;
    }

    draw(ctx) {
        if (this.isDead) {
            this.deathAnimation.drawFrame(this.gameEngine.clockTick, ctx, this.x - 125, this.y - 175);
            if (this.deathCompleted) {
                this.drawGameOver(ctx);
            }
        } else if (this.currentAttack) {
            this.attackAnimations[this.currentAttack].drawFrame(this.gameEngine.clockTick, ctx, this.x - 125, this.y - 175);
        } else if (this.isMoving) {
            this.runAnimation.drawFrame(this.gameEngine.clockTick, ctx, this.x - 125, this.y - 175);
        } else {
            this.idleAnimation.drawFrame(this.gameEngine.clockTick, ctx, this.x - 125, this.y - 175);
        }
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
