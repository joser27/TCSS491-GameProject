class Enemy extends Character {
    constructor(gameEngine, scene) {
        super(gameEngine, "./assets/sprites/yellow_fight_spritesheet.png", scene); // Pass enemy sprite sheet
        this.x = 500;
        this.y = 400;
        this.attackTimer = 0; // Timer to track random punch intervals
        this.attackInterval = 2 + Math.random() * 3; // Random interval between 2 to 5 seconds
        this.attackRange = 70; // Minimum distance from the player to attack
    }

    update() {
        if (this.isDead) {
            // Stop all actions if the enemy is dead
            this.isMoving = false;
            this.currentAttack = null;
            return;
        }

        super.update();

        const player = this.scene.player;
        const distanceToPlayer = Math.abs(this.x - player.x); // Horizontal distance to the player

        // Move towards the player but stop at the attack range
        if (distanceToPlayer > this.attackRange) {
            if (player.x > this.x) {
                this.x += 1;
                this.isMoving = true;
                this.facingLeft = false;
            } else if (player.x < this.x) {
                this.x -= 1;
                this.isMoving = true;
                this.facingLeft = true;
            }
        } else {
            this.isMoving = false; // Stop moving if within attack range
        }

        // Handle random punch
        this.attackTimer += this.gameEngine.clockTick; // Increment timer by elapsed time
        if (this.attackTimer >= this.attackInterval && distanceToPlayer <= this.attackRange) {
            this.performAttack("punch"); // Perform a punch attack
            this.attackTimer = 0; // Reset the timer
            this.attackInterval = 2 + Math.random() * 3; // Set a new random interval

            // Check if the punch hits the player
            if (this.isCollidingWithPlayer()) {
                player.takeDamage(5); // Inflict damage to the player
            }
        }
    }

    draw(ctx) {
        super.draw(ctx);

        // Draw a small health bar above the enemy's head
        const healthBarWidth = 50; // Width of the health bar
        const healthBarHeight = 5; // Height of the health bar
        const healthPercentage = this.health / 100; // Percentage of health remaining
        const xPosition = this.x - healthBarWidth / 2 - this.gameEngine.camera.x; // Center health bar above the enemy
        const yPosition = this.y - 30; // Position the health bar above the sprite

        // Draw the red background (full health bar)
        ctx.fillStyle = "red";
        ctx.fillRect(xPosition, yPosition, healthBarWidth, healthBarHeight);

        // Draw the green foreground (current health)
        ctx.fillStyle = "green";
        ctx.fillRect(xPosition, yPosition, healthBarWidth * healthPercentage, healthBarHeight);

        // Add a black border around the health bar
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(xPosition, yPosition, healthBarWidth, healthBarHeight);
    }

    isCollidingWithPlayer() {
        const player = this.scene.player;
        return (
            this.boundingbox.x < player.boundingbox.x + player.boundingbox.width &&
            this.boundingbox.x + this.boundingbox.width > player.boundingbox.x &&
            this.boundingbox.y < player.boundingbox.y + player.boundingbox.height &&
            this.boundingbox.y + this.boundingbox.height > player.boundingbox.y
        );
    }
}
