class RedEnemy extends Character {
    constructor(gameEngine, scene, x, y){
        super(gameEngine, "N/A", scene, "./assets/sprites/red_pistol_spritesheet.png", "N/A");
        this.x = x;
        this.y = y;
        this.attackTimer = 0;
        this.attackInterval = 2 + Math.random() * 3;
        this.attackRange = 300;
        this.isUsingPistol = true;
        this.weapon = new Pistol(this.scene);
        this.speed = 2; 
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

        // Bullet collision detection for Red Enemy bullets hitting the player
        this.weapon.bullets.forEach(bullet => {
            if (player.isCollidingWithBullet(bullet)) {
                console.log("Player hit by Red Enemy bullet");
                player.takeDamage(this.weapon.damage);
                bullet.offScreen = true;
            }
        });

        // Bullet collision detection for player bullets hitting Red Enemy
        if (player.weapon instanceof Pistol) {
            player.weapon.bullets.forEach(bullet => {
                if (this.isCollidingWithBullet(bullet)) {
                    console.log("Red Enemy hit by player bullet");
                    this.takeDamage(player.weapon.damage);
                    this.scene.sceneManager.gameState.playerStats.coins += 1;
                    bullet.offScreen = true;
                }
            });
        }

        if (this.weapon) {
            this.weapon.update(this.gameEngine.clockTick);
        }

        // Ensure RedEnemy faces the player
    if (player.x > this.x) {
        this.facingLeft = false; // Face right
    } else {
        this.facingLeft = true; // Face left
    }

    const distanceToPlayerX = Math.abs(this.x - player.x);
    const distanceToPlayerY = Math.abs(this.y - player.y);

    // Move left or right towards the player but stop at attack range
    if (distanceToPlayerX > this.attackRange) {
        this.x += this.facingLeft ? -this.speed : this.speed;
        this.isMoving = true;
    }

    // Move up/down towards the player **until they are aligned in the Y direction**
    if (this.y !== player.y + 1) {
        this.y += player.y > this.y-1 ? this.speed : -this.speed;
        this.isMoving = true;
    }

    // Stop moving if within attack range
    if (distanceToPlayerX <= this.attackRange && distanceToPlayerY <= this.attackRange) {
        this.isMoving = false;
    }


        // Attack when within range and cooldown is over
        this.attackTimer += this.gameEngine.clockTick;
        if (this.attackTimer >= this.attackInterval && !this.isMoving) {
            if ((this.facingLeft && player.x < this.x) || (!this.facingLeft && player.x > this.x)) {
                this.attackTimer = 0;
                this.attackInterval = 2 + Math.random() * 3;
                this.performPistolAttack();
            } 
        }
        this.zIndex = this.y;
    }

    performPistolAttack() {
        console.log("Red Enemy fires!");
        if (this.weapon.cooldownTimer <= 0) {
            this.weapon.attack(this);
            this.weapon.cooldownTimer = this.weapon.cooldown;
        }
    }

    draw(ctx) {
        if (!this.isActive) return;
        
        super.draw(ctx);

        if (this.health < 0) {
            this.health = 0;
        }

        // Draw health bar above enemy
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
