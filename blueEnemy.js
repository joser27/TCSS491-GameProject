class BlueEnemy extends Character {
    constructor(gameEngine, scene, x, y){
        super(gameEngine, "N/A", scene,"N/A", "./assets/sprites/blue_sword_spritesheet.png");
        this.x = x;
        this.y = y;
        this.attackTimer = 0;
        this.attackRange = 70;
        this.attackInterval = 2 + Math.random() * 3; // Random between 2 to 5 sec
        this.isUsingSword = true;
        this.weapon = new Sword(scene); // Assign sword weapon
    }

    update() {
        if (!this.isActive) return; // Skip update if not active
        
        super.update();
        if (this.isDead) {
            this.isMoving = false;
            this.currentAttack = null;
            return;
        }
        const player = this.scene.player;
    
        // Bullet collision detection
        if (player.weapon instanceof Pistol) {
            player.weapon.bullets.forEach(bullet => {
                if (this.isCollidingWithBullet(bullet)) {
                    console.log("Enemy hit by bullet");
                    this.takeDamage(player.weapon.damage);
                    this.scene.sceneManager.gameState.playerStats.coins += 1;
                    bullet.offScreen = true;
                }
            });
        }
        if (this.weapon) {
            this.weapon.update(this.gameEngine.clockTick);
        }

        const distanceToPlayerX = Math.abs(this.x - player.x); // Horizontal distance to the player
        const distanceToPlayerY = Math.abs(this.y - player.y); //Vertical distance
        const distanceToPlayer = Math.sqrt(distanceToPlayerX **2 + distanceToPlayerY ** 2); //Total distance

        // Move towards the player but stop at the attack range
        if (distanceToPlayerX > this.attackRange) {
            if (player.x > this.x) {
                this.x += 1;
                this.isMoving = true;
                this.facingLeft = false;
            } else if (player.x < this.x) {
                this.x -= 1;
                this.isMoving = true;
                this.facingLeft = true;
            }
        } 

        if(distanceToPlayerY > this.attackRange) {
            if (player.y > this.y) {
                this.y += 1;
                this.isMoving = true;
            } else if (player.y < this.y) {
                this.y -= 1;
                this.isMoving = true;
            }
        }
        
        if (distanceToPlayer <= this.attackRange || (distanceToPlayerX <= this.attackRange && distanceToPlayerY <= this.attackRange)) {
            this.isMoving = false; // Stop moving if within attack range
        }
    
        // **Random Attack Timer Logic**
        this.attackTimer += this.gameEngine.clockTick;
        if (this.attackTimer >= this.attackInterval && this.isEntityInAttackRange(player)) {
            this.attackTimer = 0;
            this.attackInterval = 2 + Math.random() * 3; // Reset timer for next attack
            this.performSwordAttack();
        }
    }
    

    performSwordAttack() {
        console.log("BlueEnemy swings sword!");
        
        if (this.weapon.cooldownTimer <= 0) {
            this.weapon.attack(this); // Use the sword's attack method
            this.performAttack("slash");
            // Ensure attack cooldown resets so BlueEnemy can keep attacking
            this.weapon.cooldownTimer = this.weapon.cooldown; 
        }
    }


    draw(ctx) {
        if (!this.isActive) return;
        
        super.draw(ctx);

        if (this.health < 0) this.health = 0;

        // Draw a small health bar
        const healthBarWidth = 75;
        const healthBarHeight = 10;
        const healthPercentage = this.health / 100;
        const xPosition = this.x - healthBarWidth / 2 - this.gameEngine.camera.x;
        const yPosition = this.y - 50;

        ctx.fillStyle = "red";
        ctx.fillRect(xPosition, yPosition, healthBarWidth, healthBarHeight);
        ctx.fillStyle = "green";
        ctx.fillRect(xPosition, yPosition, healthBarWidth * healthPercentage, healthBarHeight);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(xPosition, yPosition, healthBarWidth, healthBarHeight);
    }
}
