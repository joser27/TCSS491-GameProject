// import { Pistol } from "./pistol.js";
class Enemy extends Character {
    constructor(gameEngine, scene,x,y) {
        super(gameEngine, "./assets/sprites/yellow_fight_spritesheet.png", scene); // Pass enemy sprite sheet
        this.x = x;
        this.y = y;
        this.attackTimer = 0; // Timer to track random punch intervals

        this.attackInterval = 2 + Math.random() * 3; // Random interval between 2 to 5 seconds
        this.attackRange = 70; // Minimum distance from the player to attack
    }

    update() {
        if (!this.isActive) return; // Skip update if not active
        
        super.update();
        if (this.isDead) {
            // Stop all actions if the enemy is dead
            this.isMoving = false;
            this.currentAttack = null;
            if(this.deathAnimation.isDone()){
                this.scene.sceneManager.gameState.playerStats.coins += 5;
            }

            return;
        }
        
        const player = this.scene.player;

        if (player.weapon instanceof Pistol) {
            player.weapon.bullets.forEach(bullet => {
                if (this.isCollidingWithBullet(bullet)) {
                    console.log("Enemy hit by bullet");
                    this.takeDamage(player.weapon.damage);
                    bullet.offScreen = true;
                }
            });
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

        

        if (!this.isBoss) {
            // Handle random punch
            this.attackTimer += this.gameEngine.clockTick; // Increment timer by elapsed time
            if (this.attackTimer >= this.attackInterval && (distanceToPlayer <= this.attackRange || distanceToPlayerX <=this.attackRange)) {
                let currentMove = this.randomAttack();
                this.performAttack(currentMove); // Perform a punch attack
                this.attackTimer = 0; // Reset the timer
                this.attackInterval = 2 + Math.random() * 3; // Set a new random interval

                // Check if the punch hits the player
                if (this.isCollidingWithEntity(player)) {
                    let damageDelay = 500; // Half-second delay in milliseconds
            
                    setTimeout(() => {
                        if (this.isCollidingWithEntity(player)) { // Recheck if still colliding
                           if(currentMove == "punch") player.takeDamage(10);
                           else if(currentMove == "chop") player.takeDamage(5);
                           else if(currentMove == "kick") player.takeDamage(15);
                        }
                    }, damageDelay);
                }
            }
        }

        this.zIndex = this.y;
    }

    draw(ctx) {
        if (!this.isActive) return; // Skip drawing if not active
        
        super.draw(ctx);

        if(this.health < 0){
            this.health = 0;
        }

        // Draw a small health bar above the enemy's head
        const healthBarWidth = 75; // Width of the health bar
        const healthBarHeight = 10; // Height of the health bar
        const healthPercentage = this.health / 100; // Percentage of health remaining
        const xPosition = this.x - healthBarWidth / 2 - this.gameEngine.camera.x; // Center health bar above the enemy
        const yPosition = this.y - 50; // Position the health bar above the sprite

        // Draw the red background (full health bar)
        ctx.fillStyle = "red";
        ctx.fillRect(xPosition, yPosition, healthBarWidth, healthBarHeight);

        // Draw the green foreground (current health)
        ctx.fillStyle = "green";
        ctx.fillRect(xPosition, yPosition, healthBarWidth * healthPercentage, healthBarHeight);

        // Add a black border around the health bar
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(xPosition, yPosition, healthBarWidth, healthBarHeight);
    }

    randomAttack() {
        const attacks = ["punch", "kick", "chop"];
        const randomIndex = Math.floor(Math.random() * attacks.length);
        return attacks[randomIndex];
    }

   
}
