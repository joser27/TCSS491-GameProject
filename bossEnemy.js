class BossEnemy extends Enemy {
    constructor(gameEngine, scene, x, y) {
        super(gameEngine, scene, x, y);

        this.health = 500; // Boss has more health
        this.speed = 2; 
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
        this.isActive = false;
    }

    update() {

        if (!this.isActive) return; // Skip drawing if not active
        
        
        //Update bounding box before calling super.updater()
        this.boundingbox.x = this.x - this.gameEngine.camera.x;
        this.boundingbox.y = this.y;

        super.update(); // Keep base enemy movement logic

        //console.log("boss", this.boundingbox);
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
            if (this.isCollidingWithEntity(this.scene.player)) {
                this.scene.player.takeDamage(25); // Higher boss attack damage
            }
        }, 500); // Attack delay for animation
    }

    draw(ctx) {
        if (this.isActive) {
            const healthBarWidth = 300; 
            const healthBarHeight = 70;
            const healthPercentage = this.health / 500;
            const xPosition = 950;
            const yPosition = 30;

            const img = new Image();
            img.src = './assets/sprites/healthbar.png';

            ctx.fillStyle = "red";
            ctx.fillRect(xPosition+60, yPosition+25, 236*healthPercentage, 25);
            ctx.drawImage(img, xPosition, yPosition, healthBarWidth, healthBarHeight);
        }
        

        const offsetX = 165;
        const offsetY = 210;
        const screenX = this.x - this.gameEngine.camera.x;

        ctx.save();
        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.translate(-screenX * 2 - (512 * 0.8) + (offsetX * 2), 0);
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
