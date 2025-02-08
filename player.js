// import { Character } from "./character.js";
class Player extends Character {
    constructor(gameEngine, scene) {
        super(gameEngine, "./assets/sprites/white_fight_spritesheet.png", scene); // Pass player sprite sheet
        this.x = 75;
        this.y = 400;
        this.hasDealtDamage = false; // Flag to prevent multiple damage during a single attack
        this.hasWeapon = false;

        this.weapon = null;
        this.speed = 5;
        
    }


    update() {
        // If level is complete, don't process movement or attacks
        if (this.isLevelComplete) {
            return;
        }

        super.update();
    
        if (this.deathCompleted) {
            console.log("Game Over");
        }
    
        if (this.gameEngine.keys.z) {
            this.takeDamage(this.health); // Instantly kill player for testing
        }
    
        if (this.gameEngine.keys.g && !this.hasWeapon) {
            this.equipWeapon(new Pistol(this.scene));
            this.hasWeapon = true;
        }
    
        if (this.gameEngine.keys.f && this.weapon instanceof Pistol) {
            this.weapon.attack(this);
        }
    
        if (this.weapon) {
            this.weapon.update(this.gameEngine.clockTick);
        }
    
        if (!this.currentAttack) {
            const movingRight = this.gameEngine.keys.d || this.gameEngine.keys["ArrowRight"];
            const movingLeft = this.gameEngine.keys.a || this.gameEngine.keys["ArrowLeft"];
            const movingUp = this.gameEngine.keys.w || this.gameEngine.keys["ArrowUp"];
            const movingDown = this.gameEngine.keys.s || this.gameEngine.keys["ArrowDown"];

            this.isMoving = movingRight || movingLeft || movingUp || movingDown;
    
            let newX = this.x;
            let newY = this.y;
    
            if (movingRight) {
                this.facingLeft = false;
                newX += this.speed;
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
        // Get current combat zone's enemies from level manager
        const currentZone = this.scene.levelManager.currentCombatZone;
        


        if (!currentZone) return;

        // Check collision with all active enemies in the zone
        for (const enemy of currentZone.enemies) {
            // TODO: Check if enemy is dead

            // Only apply damage if the attack has not already dealt damage
            if (this.isCollidingWithEnemy(enemy) && !this.hasDealtDamage) {
                this.scene.sceneManager.gameState.playerStats.coins += 1;
                enemy.takeDamage(damage);
                this.hasDealtDamage = true; // Mark damage as dealt for this attack
                break; // Only damage one enemy per attack
            }
        }
    }

    isCollidingWithEnemy(enemy) {
        if (!enemy || !enemy.boundingbox) return false;

        return (
            this.boundingbox.x < enemy.boundingbox.x + enemy.boundingbox.width &&
            this.boundingbox.x + this.boundingbox.width > enemy.boundingbox.x &&
            this.boundingbox.y < enemy.boundingbox.y + enemy.boundingbox.height &&
            this.boundingbox.y + this.boundingbox.height > enemy.boundingbox.y
        );
    }

    drawDebugStats(ctx) {
        if (PARAMS.DEBUG) {
            // Set text properties
            ctx.font = '12px Arial';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;

            const statsX = 100;  
            const startY = 120;
            const lineHeight = 15;
            const padding = 5;

            // Add upgrades to stats display
            const stats = [
                `Player Position: (${Math.floor(this.x/PARAMS.CELL_SIZE)}, ${Math.floor(this.y/PARAMS.CELL_SIZE)})`,
                `Health: ${this.health}/100`,
                `Coins: ${this.coins}`,
                `Has Weapon: ${this.hasWeapon}`,
                `Current Attack: ${this.currentAttack || 'None'}`,
                `Is Moving: ${this.isMoving}`,
                `Facing Left: ${this.facingLeft}`,
                '--- Upgrades ---',
                `Berserker: ${this.scene.sceneManager.gameState.playerStats.upgrades.berserkerMode}`,
                `Titan Guard: ${this.scene.sceneManager.gameState.playerStats.upgrades.titanGuard}`,
                `Sharp Steel: ${this.scene.sceneManager.gameState.playerStats.upgrades.sharpenedSteel}`,
                `Gunslinger: ${this.scene.sceneManager.gameState.playerStats.upgrades.gunslinger}`,
                `Shadow Step: ${this.scene.sceneManager.gameState.playerStats.upgrades.shadowStep}`
            ];

            // Calculate background dimensions
            const textWidth = ctx.measureText(stats.reduce((a, b) => 
                ctx.measureText(a).width > ctx.measureText(b).width ? a : b
            )).width;
            const backgroundHeight = (stats.length * lineHeight) + (padding * 2);
            const backgroundWidth = textWidth + (padding * 2);

            // Draw semi-transparent background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(
                statsX - padding-60, 
                startY - padding - 12,
                backgroundWidth,
                backgroundHeight
            );

            // Draw text
            stats.forEach((stat, index) => {
                const y = startY + (lineHeight * index);
                ctx.strokeStyle = 'black';
                ctx.strokeText(stat, statsX, y);
                ctx.fillStyle = 'white';
                ctx.fillText(stat, statsX, y);
            });
        }
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



        this.drawDebugStats(ctx);
    }

    equipWeapon(weapon) {
        this.weapon = weapon;

        if (weapon instanceof Pistol) {
            this.usingPistol = true;  // Set pistol mode
        } else {
            this.usingPistol = false; // Switch back to normal
        }
            
    }
}
