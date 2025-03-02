// import { Character } from "./character.js";
class Player extends Character {
    constructor(gameEngine, scene, x, y) {
        super(gameEngine, "./assets/sprites/white_fight_spritesheet.png", scene,
             "./assets/sprites/white_pistol_spritesheet.png", "./assets/sprites/white_sword_spritesheet.png"); // Pass player sprite sheet
        this.x = x;
        this.y = y;
        this.initialGroundY = y;
        this.hasDealtDamage = false; // Flag to prevent multiple damage during a single attack
        this.hasWeapon = false;

        this.weapon = null;
        this.speed = 5;
        this.health = 200;
        this.scene = scene; // Make sure we have a reference to the scene
        this.outfit = new Outfit(this.scene.sceneManager.gameState, this.gameEngine);
        this.outfit.equip('hat','mafiaHat');
    }


    update() {
        // Open upgrade menu
        if (this.scene.upgradeMenu.isOpen) {
            if (this.gameEngine.keys['b']) {
                this.scene.upgradeMenu.toggle();
                this.gameEngine.keys['b'] = false;
            }
            return;
        }

        // If level is complete, don't process movement or attacks
        if (this.isLevelComplete) {
            return;
        }

        super.update();
        //console.log("player ", this.boundingbox);

       // this.handleCheatCodeInput();
       
       if(this.gameEngine.keys.h) {
            this.health = 200;
       }

        if (this.deathCompleted) {
            console.log("Game Over");
        }
    
        if (this.gameEngine.keys.z) {
            this.takeDamage(this.health); // Instantly kill player for testing
        }
    
        if (this.gameEngine.keys.g && !this.gKeyPressed) {
            if (!this.hasWeapon) {
                this.equipWeapon(new Pistol(this.scene));
                this.hasWeapon = true;
            } else {
                this.unequipWeapon();
                this.hasWeapon = false;
            }
            this.gKeyPressed = true; // Prevent multiple toggles in one press
        }
        
        // Reset key state when released
        if (!this.gameEngine.keys.g) {
            this.gKeyPressed = false;
        }

        if (this.gameEngine.keys.f && this.weapon instanceof Pistol) {
            this.weapon.attack(this);
        }
        
        if(this.gameEngine.keys.q && !this.qKeyPressed) {
            if(!this.hasWeapon) {
                this.equipWeapon(new Sword(this.scene));
                this.hasWeapon = true;
            } else {
                this.unequipWeapon();
                this.hasWeapon = false;
            }
            this.qKeyPressed = true;
            
        }
        if(!this.gameEngine.keys.q) {
            this.qKeyPressed = false;
        }
    
        if(this.gameEngine.keys.r && this.weapon instanceof Sword) {
            this.weapon.attack(this);
            this.performAttack("slash");
        }
    
        if (this.weapon) {
            this.weapon.update(this.gameEngine.clockTick);
        }
    
        if (!this.currentAttack) {
            const movingRight = this.gameEngine.keys.d || this.gameEngine.keys["ArrowRight"];
            const movingLeft =  this.gameEngine.keys.a || this.gameEngine.keys["ArrowLeft"]; 
            const movingUp = !this.isJumping && (this.gameEngine.keys.w || this.gameEngine.keys["ArrowUp"]);
            const movingDown = !this.isJumping && (this.gameEngine.keys.s || this.gameEngine.keys["ArrowDown"]);
            const jump = this.gameEngine.keys[" "];

            this.isMoving = movingRight || movingLeft || movingUp || movingDown;
    
            let newX = this.x;
            let newY = this.y;
    
            if (movingRight) {
                this.facingLeft = false;
                newX += this.speed;
            }
            if (movingLeft) {
                this.facingLeft = true;
                // Prevent moving backward beyond the camera's left edge
                if (newX - this.speed > this.scene.camera.x) {
                    newX -= this.speed;
                } else {
                    newX = this.scene.camera.x; // Snap to the camera's left edge
                }
            }
            if (movingUp) {
                newY -= this.speed;
                this.initialGroundY = newY;
            }
            if (movingDown) {
                newY += this.speed;
                this.initialGroundY = newY;
            }

            if(jump && !this.isJumping){
                console.log("Player is jumping");
                this.isJumping = true;
                this.velocity = this.jumpStrength;
                this.isPlaying = false;
            }
    
            // Add vertical movement constraints
            const minY = 5 * PARAMS.CELL_SIZE;
            const maxY = 9 * PARAMS.CELL_SIZE;
            if (newY < minY) newY = minY;
            if (newY > maxY) newY = maxY;
    
            // Check combat zone boundaries before applying movement
            const currentZone = this.scene.levelManager.currentCombatZone;
            if (currentZone && !currentZone.isCompleted) {
                // Don't allow moving past zone boundaries
                if (newX < currentZone.startX) {
                    newX = currentZone.startX;
                }
                if (newX > currentZone.endX - this.boundingbox.width) {
                    newX = currentZone.endX - this.boundingbox.width;
                }
            } else {
                // When not in a combat zone, only prevent going backwards
                const previousZone = this.scene.levelManager.combatZones
                    .find(zone => zone.isCompleted && zone.endX < newX);
    
                if (previousZone) {
                    // Don't allow going back into completed zones
                    if (newX < previousZone.endX) {
                        newX = previousZone.endX;
                    }
                }
            }
    
            // Apply the validated position
            this.x = newX;
            this.y = newY;
    
            // Update the camera to follow the player when moving forward
            if (movingRight && newX > this.scene.camera.x + this.scene.camera.width / 2) {
                this.scene.camera.x = newX - this.scene.camera.width / 2;
            }

            
        }
        
        if(!this.isUsingPistol && !this.isUsingSword) {
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
        }
    
        // Reset the damage flag when the attack animation is done
        if (!this.currentAttack) {
            this.hasDealtDamage = false;
        }

        if(this.isJumping){
            this.velocity += this.gravity;
            this.y += this.velocity;
         if(this.y >= this.initialGroundY) {
            this.isJumping = false;
            this.velocity = 0;
            this.y = this.initialGroundY;
            }
            console.log("this.y " + this.y);
            console.log("Initial y: " + this.initialGroundY);
        }

        this.zIndex = this.y;
    }    
    

    attackEnemy(damage) {
        let hasHitAny = false;

        // Use PlayingScene's enemies array directly
        for (const enemy of this.scene.enemies) {
            if (!enemy.isActive || enemy.isDead) continue;

            // For sword attacks, use the attack range box
            // if (this.isUsingSword) {
            //     if (this.isEntityInAttackRange(enemy) && !this.hasDealtDamage) {
            //         hasHitAny = true;
            //         this.scene.sceneManager.gameState.playerStats.coins += 1;
                    
            //         setTimeout(() => {
            //             if(this.isEntityInAttackRange(enemy)){
            //                 enemy.takeDamage(damage);
            //             }
            //         }, 250);
            //     }
            // } 
            // For regular attacks, use direct collision
            if (this.isCollidingWithEntity(enemy) && !this.hasDealtDamage) {
                hasHitAny = true;
                this.scene.sceneManager.gameState.playerStats.coins += 1;
                
                setTimeout(() => {
                    if(this.isCollidingWithEntity(enemy)){
                        enemy.takeDamage(damage);
                    }
                }, 250);
            }
        }

        // Only set hasDealtDamage if we actually hit something
        if (hasHitAny) {
            this.hasDealtDamage = true;
        }
    }

    // isEnemyInAttackRange(enemy) {
    //     if (!enemy || !enemy.boundingbox) return false;
    
    //     const range = (this.boundingbox.x + this.weapon.range);
    //     const leftRange = this.boundingbox.x - this.weapon.range;
    //     if(this.facingLeft){
    //         return (
    //             leftRange - this.boundingbox.width < enemy.boundingbox.x + enemy.boundingbox.width &&
    //             leftRange + this.boundingbox.width > enemy.boundingbox.x &&
    //             this.boundingbox.y < enemy.boundingbox.y + enemy.boundingbox.height &&
    //             this.boundingbox.y + this.boundingbox.height > enemy.boundingbox.y
    //         );
    //     } else {
    //         return (
    //             range < enemy.boundingbox.x + enemy.boundingbox.width &&
    //             range + this.boundingbox.width > enemy.boundingbox.x &&
    //             this.boundingbox.y < enemy.boundingbox.y + enemy.boundingbox.height &&
    //             this.boundingbox.y + this.boundingbox.height > enemy.boundingbox.y
    //         );
    //     }
    // }
    

    unequipWeapon() {
        this.weapon = null;
        if(this.isUsingPistol) {
            this.isUsingPistol = false;
        }
        if(this.isUsingSword) {
            this.isUsingSword = false;
        }
        
    }
    
    // isCollidingWithEnemy(enemy) {
    //     if (!enemy || !enemy.boundingbox) return false;


    //     return (
    //         this.boundingbox.x < enemy.boundingbox.x + enemy.boundingbox.width &&
    //         this.boundingbox.x + this.boundingbox.width > enemy.boundingbox.x  &&
    //         this.boundingbox.y < enemy.boundingbox.y + enemy.boundingbox.height &&
    //         this.boundingbox.y + this.boundingbox.height > enemy.boundingbox.y
    //     );
    // }

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
        super.draw(ctx);
        // if(!this.hasWeapon){
        //     super.draw(ctx);
        // } else {
        //     if (this.weapon instanceof Pistol) {
        //         this.weapon.shootAnimation.drawFrame(
        //             this.gameEngine.clockTick,
        //             ctx,
        //             this.x -165,
        //             this.y - 210
        //         );
        //     }
        // }
        // Draw health bar fixed at the top center of the screen
        const canvasWidth = ctx.canvas.width;
        const healthBarWidth = 300; // Width of the health bar
        const healthBarHeight = 70; // Height of the health bar
        const xPosition = 20; // Center horizontally
        const yPosition = 30; // Position near the top
        const healthPercentage = this.health / 200;

        const img = new Image();
        img.src = './assets/sprites/healthbar.png';

        
        ctx.fillStyle = "green";
        ctx.fillRect(xPosition+ 60, yPosition +25, 236 * healthPercentage, 25);
        ctx.drawImage(img,xPosition, yPosition, healthBarWidth, healthBarHeight);

        ctx.beginPath(); 
        ctx.rect(xPosition + 430, yPosition + 10, 350, 50); 
        ctx.lineWidth = 5; 
        ctx.strokeStyle = 'purple'; 
        ctx.fillStyle = 'lightyellow'; 
        ctx.stroke(); 
        ctx.fill(); 
 
        ctx.fillStyle = "black";
        
        if(this.isUsingPistol){
            ctx.fillText("Use 'F' to shoot", xPosition + 450, yPosition + 45);
        } else if(this.isUsingSword){
            ctx.fillText("Use 'R' to attack", xPosition + 450, yPosition + 45);
        } else{
            ctx.fillText("'Q': Sword, 'G' : Pistol", xPosition + 450, yPosition + 45);
        }
        this.outfit.draw(ctx, this.x, this.y, this.facingLeft, this.isMoving);
    
        this.drawDebugStats(ctx);
    }

    equipWeapon(weapon) {
        this.weapon = weapon;
        this.isUsingPistol = weapon instanceof Pistol;
        this.isUsingSword = weapon instanceof Sword;
    }

    handleCheatCodeInput() {
        // Listen for keydown events
        document.addEventListener("keydown", (event) => {
            // Append the latest key to the buffer (convert to lowercase for consistency)
            this.cheatCodeBuffer += event.key.toLowerCase();

            // Keep only the last 4 characters (length of "heal")
            if (this.cheatCodeBuffer.length > 4) {
                this.cheatCodeBuffer = this.cheatCodeBuffer.slice(-4);
            }

            // Check if the cheat code "heal" is entered
            if (this.cheatCodeBuffer === "heal") {
                this.health = 200; // Restore full health
                console.log("CHEAT ACTIVATED: Player healed to full health!");
                
                // Clear the buffer so it doesn't trigger again immediately
                this.cheatCodeBuffer = "";
            }
        });
    }
}
