class BossEnemy extends Enemy {
    constructor(gameEngine, scene, x, y) {
        super(gameEngine, scene, x, y);

        this.health = 500; // Boss has more health
        this.speed = 3; 
        this.attackTimer = 0;
        this.attackInterval = 2 + Math.random() * 3; // Random interval between 2 to 5 sec
        this.attackRange = 70; // Slightly larger attack range
        this.isBoss = true;
        this.headbuttAttack = false;

        // Override enemy animations with boss-specific ones
        this.bossAnimations = {
            idle: new Animator(
                ASSET_MANAGER.getAsset("./assets/sprites/boss_sprite/boss_point.png"),
                512 * 0, 0, 512, 512, 1, 1, 0.8, true
            ),
            run: new Animator(
                ASSET_MANAGER.getAsset("./assets/sprites/boss_sprite/boss_sprint.png"),
                512 * 0, 0, 512, 512, 8, 0.1, 0.8, true
            ),
            death: new Animator(
                ASSET_MANAGER.getAsset("./assets/sprites/boss_sprite/boss_death.png"),
                512 * 0, 0, 512, 512, 8, 0.1, 0.8, false
            ),
            headbutt: new Animator(
                ASSET_MANAGER.getAsset("./assets/sprites/boss_sprite/boss_headbutt.png"),
                512 * 0, 0, 512, 512, 6, 0.1, 0.8, false
            )
        };

        this.currentAttack = null;
    }

    update() {
        super.update(); // Keep base enemy movement logic

        console.log("boss", this.boundingbox);
        if(this.isDead && this.bossAnimations.death.isDone()){
            this.isMoving = false;
            this.headbuttAttack = false;
            this.removeFromWorld = true;
            return;
        }

        const player = this.scene.player;
        const distanceToPlayer = Math.abs(this.x - player.x);

        // Follow the player like other enemies
        if (distanceToPlayer > this.attackRange) {
            this.x += this.x < player.x ? this.speed : -this.speed;
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }

        
        this.attackTimer += this.gameEngine.clockTick;
        if (this.attackTimer >= this.attackInterval && !this.headbuttAttack) {
            this.attackTimer = 0;
            this.performHeadbutt();
        }

        if(this.headbuttAttack && this.bossAnimations.headbutt.isDone()){
            this.headbuttAttack = false;
            this.bossAnimations.headbutt.elapsedTime = 0;
        }
    }

    performHeadbutt() {
        if (this.headbuttAttack) return; // Prevent spamming attacks

        this.headbuttAttack = true;

        //ASSET_MANAGER.playAsset("./assets/sound/boss_headbutt.mp3"); // Play headbutt sound

        setTimeout(() => {
            if (this.scene.player.isCollidingWithEnemy(this)) {
                this.scene.player.takeDamage(25); // Higher boss attack damage
            }
        }, 500); // Attack delay for animation
    }

    draw(ctx) {

        const healthBarWidth = 100; // Bigger health bar
        const healthBarHeight = 10;
        const healthPercentage = this.health / 500;
        const xPosition = this.x - healthBarWidth / 2 - this.gameEngine.camera.x;
        const yPosition = this.y - 30;

        ctx.fillStyle = "red";
        ctx.fillRect(xPosition, yPosition, healthBarWidth, healthBarHeight);
        ctx.fillStyle = "green";
        ctx.fillRect(xPosition, yPosition, healthBarWidth * healthPercentage, healthBarHeight);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(xPosition, yPosition, healthBarWidth, healthBarHeight);

        const offsetX = 165;
        const offsetY = 210;
        const screenX = this.x - this.gameEngine.camera.x;

        ctx.save();
        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.translate(-screenX * 2 - (512 * 1) + (offsetX * 2), 0);
        }

        if (this.isDead) {
            this.bossAnimations.death.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else if (this.headbuttAttack) {
            this.bossAnimations.headbutt.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else if (this.isMoving) {
            this.bossAnimations.run.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else {
            this.bossAnimations.idle.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        }

        ctx.restore();

        if (PARAMS.DEBUG) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            ctx.fillRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
        }
    }
}
