class Character {
    constructor(gameEngine, spriteSheet, scene, pistolSpriteSheet, swordSpriteSheet) {
        this.gameEngine = gameEngine;
        this.spriteSheet = spriteSheet;
        this.pistolSpriteSheet = pistolSpriteSheet;
        this.swordSpriteSheet = swordSpriteSheet;
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
        this.damageTaken = false;
        this.isUsingSword = false;
        this.isBoss = false;

        this.isJumping = false;
        this.velocity = 0;
        this.gravity = 0.7;
        this.jumpStrength = -15;

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

        // Jump animation
        this.jumpAnimation = new Animator(
            ASSET_MANAGER.getAsset(spriteSheet),
            512*53,
            0,
            512,
            512,
            5,
            0.2,
            0.8,
            true
        );

        //damage animation
        this.damageAnimation = new Animator (
            ASSET_MANAGER.getAsset(spriteSheet),
            512 * 41,
            0,
            512,
            512,
            4,
            0.1,
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
                0.2,
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

        //Pistol animations
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
                0.2,
                0.8,
                false
            ),
            damage: new Animator (
                ASSET_MANAGER.getAsset(pistolSpriteSheet),
                512 * 22,
                0,
                512,
                512,
                4,
                0.1,
                0.8,
                false
            ),
            jump: new Animator (
                ASSET_MANAGER.getAsset(pistolSpriteSheet),
                512*34,
                0,
                512,
                512,
                5,
                0.2,
                0.8,
                true
            )

        }

        //Sword animations
        this.swordAnimations = {
            idle: new Animator(
                ASSET_MANAGER.getAsset(swordSpriteSheet),
                512 * 41, 
                0,
                512,
                512,
                1,
                1,
                0.8,
                true
            ),
            run: new Animator (
                ASSET_MANAGER.getAsset(swordSpriteSheet),
                512 * 51,
                0,
                512,
                512,
                8,
                0.1,
                0.8,
                true
            ),
            death: new Animator (
                ASSET_MANAGER.getAsset(swordSpriteSheet),
                512 * 25,
                0,
                512,
                512,
                8,
                0.2,
                0.8,
                false
            ),
            damage: new Animator (
                ASSET_MANAGER.getAsset(swordSpriteSheet),
                512 * 35,
                0,
                512,
                512,
                4,
                0.1,
                0.8,
                false
            ),
            attack: new Animator (
                ASSET_MANAGER.getAsset(swordSpriteSheet),
                512 * 0,
                0,
                512,
                512,
                2,
                0.2,
                0.8,
                false
            ),
            jump: new Animator (
                ASSET_MANAGER.getAsset(swordSpriteSheet),
                512*46,
                0,
                512,
                512,
                5,
                0.2,
                0.8,
                true
            )

        }

        // Direction state
        this.facingLeft = false;

        this.attackSound = {
            chop: "./assets/sound/chop.mp3",
            kick: "./assets/sound/kick.mp3",
            punch: "./assets/sound/punch.mp3",
        };

        this.getHurtSound = [
            "./assets/sound/oof1.mp3",
            "./assets/sound/oof2.mp3"
        ];
    }

    update() {
        if (this.isDead) {
            this.performDeath();
            if(this.isUsingPistol){
                if(this.pistolAnimations.death.isDone()){
                    this.deathCompleted = true;
                    this.isPlaying = false;
                    this.removeFromWorld = true;
                }
            } else if (this.isUsingSword) {
                if(this.swordAnimations.death.isDone()) {
                    this.deathCompleted = true;
                    this.isPlaying = false;
                    this.removeFromWorld = true;
                }
            } else {
                if (this.deathAnimation.isDone()) {
                    this.deathCompleted = true;
                    this.isPlaying = false;
                    this.removeFromWorld = true;
                }
            }
            return;
        }

        if(this.damageTaken){
            this.performHits();
            if(this.isUsingPistol){
                if(this.pistolAnimations.damage.isDone()){
                    this.damageTaken = false;
                    this.pistolAnimations.damage.elapsedTime = 0;
                    this.isPlaying = false;
                }
            } else if (this.isUsingSword) {
                if(this.swordAnimations.damage.isDone()){
                    this.damageTaken = false;
                    this.swordAnimations.damage.elapsedTime = 0;
                    this.isPlaying = false;
                }
            }else {
                if(this.damageAnimation.isDone()){
                    this.damageTaken = false;
                    this.damageAnimation.elapsedTime = 0;
                    this.isPlaying = false;
                }
            }
            return;
        }

        if(this.isJumping) {
            if(this.isUsingPistol){
                if(this.pistolAnimations.jump.isDone()) {
                    this.isJumping = false;
                    this.pistolAnimations.jump.elapsedTime = 0;
                }
            }else if(this.isUsingSword) {
                if(this.swordAnimations.jump.isDone()){
                    this.isJumping = false;
                    this.swordAnimations.jump.elapsedTime = 0;
                }
            } else {
                if(this.jumpAnimation.isDone()) {
                    this.isJumping = false;
                    this.jumpAnimation.elapsedTime = 0;
                }
            }
        }
        

        // if (this.isUsingPistol) {
        //     if (this.damageTaken && this.pistolAnimations.damage.isDone()) {
        //         this.damageTaken = false;
        //         this.pistolAnimations.damage.elapsedTime = 0;
        //     }
        // } else {
        //     if (this.damageTaken && this.damageAnimation.isDone()) {
        //         this.damageTaken = false;
        //         this.damageAnimation.elapsedTime = 0;
        //     }
        // }

        if (this.currentAttack) {
            if(this.isUsingSword){
                if(this.swordAnimations.attack.isDone()){
                    this.swordAnimations.attack.elapsedTime = 0;
                    this.currentAttack = null;
                    this.attackCooldown = false;
                }
            } else {
                const currentAnimation = this.attackAnimations[this.currentAttack];
                if (currentAnimation && currentAnimation.isDone()) {
                    currentAnimation.elapsedTime = 0;
                    this.currentAttack = null;
                    this.attackCooldown = false;
                }
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
        const screenX = this.x - this.gameEngine.camera.x;

        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.translate(-screenX * 2 - (512 * 0.8) + (offsetX * 2), 0);
        }
    
        if (this.isUsingPistol) {
            if (this.isDead) {
                this.pistolAnimations.death.drawFrame(this.gameEngine.clockTick, ctx, screenX- offsetX, this.y - offsetY);
            } else if(this.damageTaken) {
                this.pistolAnimations.damage.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            } else if(this.isJumping){
                this.pistolAnimations.jump.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            } else if (this.isMoving) {
                this.pistolAnimations.run.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            }else {
                this.pistolAnimations.idle.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            }
        } else if (this.isUsingSword) {
            if (this.isDead) {
                this.swordAnimations.death.drawFrame(this.gameEngine.clockTick, ctx, screenX- offsetX, this.y - offsetY);
            } else if(this.damageTaken) {
                this.swordAnimations.damage.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            } else if (this.currentAttack) {
                this.swordAnimations.attack.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            }else if(this.isJumping) {
                this.swordAnimations.jump.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            }else if(this.isMoving){
                this.swordAnimations.run.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            } else {
                this.swordAnimations.idle.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            }
        } else {
            // Default animations (for both player & enemy)
            if (this.isDead) {
                this.deathAnimation.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            } else if(this.damageTaken){
                this.damageAnimation.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            } else if (this.currentAttack) {
                this.attackAnimations[this.currentAttack].drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            } else if (this.isJumping){
                this.jumpAnimation.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            }else if (this.isMoving) {
                this.runAnimation.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            } else {
                this.idleAnimation.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
            }
        }
    
        // Restore the context state
        ctx.restore();

        // Draw bounding box ON TOP of the sprite
        if (PARAMS.DEBUG) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            ctx.fillRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
        }
        if (this.isUsingSword && PARAMS.DEBUG) {
            const attackBox = this.getAttackBoundingBox();
            ctx.strokeStyle = "red";
            ctx.strokeRect(attackBox.x , attackBox.y, attackBox.width, attackBox.height);
        }
    
    }

    drawBoundingBox(ctx) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    }

    isCollidingWithEntity(entity) {
        return (
            this.boundingbox.x < entity.boundingbox.x + entity.boundingbox.width &&
            this.boundingbox.x + this.boundingbox.width > entity.boundingbox.x &&
            this.boundingbox.y < entity.boundingbox.y + entity.boundingbox.height &&
            this.boundingbox.y + this.boundingbox.height > entity.boundingbox.y
        );
    }

    isCollidingWithBullet(bullet) {
        return (
            bullet.x < this.boundingbox.x + this.boundingbox.width &&
            bullet.x + bullet.width > this.boundingbox.x &&
            bullet.y < this.boundingbox.y + this.boundingbox.height &&
            bullet.y + bullet.width > this.boundingbox.y
        );
    }

    isEntityInAttackRange(entity) {
        if (!entity || !entity.boundingbox) return false;
    
        const attackBox = this.getAttackBoundingBox();
        const targetBox = entity.boundingbox;
    
        return (
            attackBox.x < targetBox.x + targetBox.width &&
            attackBox.x + attackBox.width > targetBox.x &&
            attackBox.y < targetBox.y + targetBox.height &&
            attackBox.y + attackBox.height > targetBox.y
        );
    }
    
    getAttackBoundingBox() {
        if(this.isUsingSword) {
            const attackWidth = this.weapon.range; // Sword range
            const attackHeight = this.boundingbox.height; // Same height as enemy

            let attackX = this.facingLeft
                ? this.boundingbox.x - attackWidth  // Attack to the left
                : this.boundingbox.x + this.boundingbox.width; // Attack to the right

            return new BoundingBox(attackX, this.boundingbox.y, attackWidth, attackHeight);
        } else return;
    }

    takeDamage(amount) {
        if (!this.isDead) {
            this.health -= amount;
            this.isMoving = false;
           // this.currentAttack = null;

            if (this.isUsingPistol) {
                this.pistolAnimations.damage.elapsedTime = 0;
            } else {
                this.damageAnimation.elapsedTime = 0;
            }
            this.damageTaken = true;
            
            if (this.health <= 0) {
                this.isDead = true;
            }
        }
    }

    performAttack(type) {
        const currentSound = this.attackSound[type];
        if (this.isUsingPistol) {
            // If using pistol, stay idle while shooting
            return;
        }
        if(this.isUsingSword) {
            this.currentAttack = type;
            this.attackCooldown = true;
        }
        if (!this.attackCooldown) {
            ASSET_MANAGER.playAsset(currentSound);
            this.currentAttack = type;
            this.attackCooldown = true;
        }
    }
    

    performDeath() {
        if(!this.isPlaying){
            ASSET_MANAGER.playAsset("./assets/sound/death.mp3")
            this.isPlaying = true;
        }         
    }

    performHits() {
        const randomIndex = Math.floor(Math.random() * this.getHurtSound.length);
        const currentSound = this.getHurtSound[randomIndex];
        if(!this.isPlaying){
            ASSET_MANAGER.playAsset(currentSound);
            this.isPlaying = true;
        }         
    }

    // drawGameOver(ctx) {
    //     ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    //     ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //     ctx.fillStyle = "white";
    //     ctx.font = "48px Arial";
    //     ctx.textAlign = "center";
    //     ctx.fillText("Game Over", ctx.canvas.width / 2, ctx.canvas.height / 2);

    //     ctx.font = "24px Arial";
    //     ctx.fillText("Press R to Restart", ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
    // }
}