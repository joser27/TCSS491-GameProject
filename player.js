// import { Character } from "./character.js";
class Player extends Character {
    constructor(gameEngine, scene) {
        super(gameEngine, "./assets/sprites/white_fight_spritesheet.png", scene); // Pass player sprite sheet
        this.x = 75;
        this.y = 400;
        this.hasDealtDamage = false; // Flag to prevent multiple damage during a single attack
        this.hasWeapon = false;
        this.weapon = null;
    }

    update() {
        super.update();

        if (this.deathCompleted) {
            console.log("Game Over");
        }

        if (this.gameEngine.keys.z) {
            this.takeDamage(this.health); // Instantly kill player for testing
        }

        if(this.gameEngine.keys.g && !this.hasWeapon) {
            this.equipWeapon(new Pistol(this.scene));
            this.hasWeapon = true;
        }

        if(this.gameEngine.keys.f && this.weapon instanceof Pistol) {
            this.weapon.attack(this);
        }

        if(this.weapon) {
            this.weapon.update(this.gameEngine.clockTick);
        }
        if (!this.currentAttack) {
            const movingRight = this.gameEngine.keys.d || this.gameEngine.keys["ArrowRight"];
            const movingLeft = this.gameEngine.keys.a || this.gameEngine.keys["ArrowLeft"];
            const movingUp = this.gameEngine.keys.w || this.gameEngine.keys["ArrowUp"];
            const movingDown = this.gameEngine.keys.s || this.gameEngine.keys["ArrowDown"];

            this.isMoving = movingRight || movingLeft || movingUp || movingDown;

            if (movingRight) {
                this.facingLeft = false;
                this.x += this.speed;
            }
            if (movingLeft) {
                this.facingLeft = true;
                this.x -= this.speed;
            }
            if (movingUp) this.y -= this.speed;
            if (movingDown) this.y += this.speed;
        }

        // Perform attacks
        if (this.gameEngine.keys.c) {
            this.performAttack("chop");
            this.attackEnemy(10); // Chop deals 10 damage
        }
        if (this.gameEngine.keys.k) {
            this.performAttack("kick");
            this.attackEnemy(25); // Kick deals 25 damage
        }
        if (this.gameEngine.keys.p) {
            this.performAttack("punch");
            this.attackEnemy(15); // Punch deals 15 damage
        }

        // Reset the damage flag when the attack animation is done
        if (!this.currentAttack) {
            this.hasDealtDamage = false;
        }

        this.zIndex = this.y;
    }

    attackEnemy(damage) {
        const enemy = this.scene.enemy; // Assuming the enemy is stored in the scene

        // Only apply damage if the attack has not already dealt damage
        if (this.isCollidingWithEnemy(enemy) && !this.hasDealtDamage) {
            enemy.takeDamage(damage);
            this.hasDealtDamage = true; // Mark damage as dealt for this attack
        }
    }

    isCollidingWithEnemy(enemy) {
        return (
            this.boundingbox.x < enemy.boundingbox.x + enemy.boundingbox.width &&
            this.boundingbox.x + this.boundingbox.width > enemy.boundingbox.x &&
            this.boundingbox.y < enemy.boundingbox.y + enemy.boundingbox.height &&
            this.boundingbox.y + this.boundingbox.height > enemy.boundingbox.y
        );
    }

    draw(ctx) {
        
        if(!this.hasWeapon){
            super.draw(ctx);
        } else {
            if (this.weapon instanceof Pistol) {
                this.weapon.shootAnimation.drawFrame(
                    this.gameEngine.clockTick,
                    ctx,
                    this.x -165,
                    this.y - 210
                );
            }
        }
        // Draw health bar fixed at the top center of the screen
        const canvasWidth = ctx.canvas.width;
        const healthBarWidth = 300; // Width of the health bar
        const healthBarHeight = 30; // Height of the health bar
        const xPosition = (canvasWidth - healthBarWidth) / 2; // Center horizontally
        const yPosition = 10; // Position near the top
        const healthPercentage = this.health / 100;

        // Draw the red background (full health bar)
        ctx.fillStyle = "red";
        ctx.fillRect(xPosition, yPosition, healthBarWidth, healthBarHeight);

        // Draw the green foreground (current health)
        ctx.fillStyle = "green";
        ctx.fillRect(xPosition, yPosition, healthBarWidth * healthPercentage, healthBarHeight);

        // Optionally, add a black border around the health bar
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(xPosition, yPosition, healthBarWidth, healthBarHeight);
    }

    equipWeapon(weapon) {
        this.weapon = weapon; 
    }
}
