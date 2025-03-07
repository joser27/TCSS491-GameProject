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
        this.isAttacking = false;

        this.weapon = null;
        this.speed = 5;
        this.health = 200;
        this.scene = scene; // Make sure we have a reference to the scene
        
        this.basicComboCount = 0; // Tracks which attack is next
        this.comboTimeout = null; // Timeout to reset combo if no input
        this.comboDelay = 1000; // Max time between presses to continue combo (in milliseconds)
        this.swordComboCount = 0;

        // notification properties
        this.notification = null;
        this.notificationTimer = 0;

        this.cheatMode = false;
        this.cheatCodeBuffer = "";

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
        
        if(this.notification && (this.notificationTimer > 0)) {
            this.notificationTimer -= this.gameEngine.clockTick * 1000;
            if(this.notificationTimer <= 0) {
                this.notification = null;
            }
        }

        this.handleCheatCodeInput();
       
        if(this.cheatMode){
            this.health = 200;
        }

        
        if (this.gameEngine.keys.h) { // Ensures key press is detected once
            if (this.scene.sceneManager.gameState.playerStats.inventory.healthKits > 0) {
                if (this.health < 200) {
                    this.health = 200;
                    this.scene.sceneManager.gameState.playerStats.inventory.healthKits--;
                    this.showNotification("Health kit used", "green");
                } else {
                    this.showNotification("Health is already full!", "red");
                }
            } else {
                this.showNotification("No health kits left!", "red");
            }
        }
        

        if (this.deathCompleted) {
            console.log("Game Over");
        }
    
        if (this.gameEngine.keys.z) {
            this.takeDamage(this.health); // Instantly kill player for testing
        }

        
        
        
        if(!this.isAttacking) {
            if (this.gameEngine.keys.g && !this.gKeyPressed) {
                if (!this.hasWeapon && this.scene.sceneManager.gameState.playerStats.upgrades.unlockGun) {
                    this.equipWeapon(new Pistol(this.scene));
                    this.hasWeapon = true;
                } else if(!this.scene.sceneManager.gameState.playerStats.upgrades.unlockGun) {
                    this.showNotification("You need to buy Pistol from shop, press 'b' to open shop", "red")
                }else {
                    this.unequipWeapon();
                    this.hasWeapon = false;
                }
                this.gKeyPressed = true; // Prevent multiple toggles in one press
            }
            
            // Reset key state when released
            if (!this.gameEngine.keys.g) {
                this.gKeyPressed = false;
            }

            if(this.gameEngine.keys.q && !this.qKeyPressed) {
                if(!this.hasWeapon && this.scene.sceneManager.gameState.playerStats.upgrades.unlockSword) {
                    this.equipWeapon(new Sword(this.scene));
                    this.hasWeapon = true;
                } else if(!this.scene.sceneManager.gameState.playerStats.upgrades.unlockSword) {
                    this.showNotification("You need to buy Sword from shop, press 'b' to open shop", "red")
                }else {
                    this.unequipWeapon();
                    this.hasWeapon = false;
                }
                this.qKeyPressed = true;
                
            }
            if(!this.gameEngine.keys.q) {
                this.qKeyPressed = false;
            }
        }

        if (this.gameEngine.keys.f && this.weapon instanceof Pistol) {
            this.weapon.attack(this);
        }

        if(this.weapon instanceof Pistol && this.gameEngine.keys.t) {
            if(this.weapon.ammo === this.weapon.magazineSize ) return;
            this.weapon.reload();
        }
        
        
    
        if(this.gameEngine.keys.r && this.weapon instanceof Sword && !this.rKeyPressed) {
            this.performSwordCombo();
            this.rKeyPressed = true;
            
        }
        if(!this.gameEngine.keys.r) {
            this.rKeyPressed = false;
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
            if (this.gameEngine.keys.p && !this.pKeyPressed) {
                this.performComboAttack();
                this.pKeyPressed = true; // Prevent multiple detections in one press
            }
            if (!this.gameEngine.keys.p) {
                this.pKeyPressed = false; // Reset when key is released
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
    
            // Ensure the enemy is in attack range AND in front of the player
            const isInRange = this.isCollidingWithEntity(enemy);
            const isInFront = this.facingLeft ? (enemy.x < this.x) : (enemy.x > this.x);
    
            if (isInRange && isInFront && !this.hasDealtDamage) {
                hasHitAny = true;
    
                setTimeout(() => {
                    if (this.isCollidingWithEntity(enemy)) {
                        enemy.takeDamage(damage);
                    }
                }, 250);
    
                break; // Stop after hitting the first enemy
            }
        }
    
        // Only set hasDealtDamage if we actually hit something
        if (hasHitAny) {
            this.hasDealtDamage = true;
        }
    }
    

   
    performComboAttack() {
        this.basicComboCount++; // Increase combo count

        if (this.basicComboCount === 1) {
            this.performAttack("punch");
            this.attackEnemy(15);
            console.log("Performed Punch");
        } else if (this.basicComboCount === 2) {
            console.log("Pressed twice, waiting for third...");
        } else if (this.basicComboCount >= 3) {
            console.log("Executing full combo: Chop & Kick!");
            this.performAttack("chop");
                this.attackEnemy(10);
                console.log("Performed Chop");
                
            
                setTimeout(() => {
                    this.performAttack("kick");
                    this.attackEnemy(25);
                    console.log("Performed Kick");
        
                    // **Reset the combo ONLY after Chop completes**
                    setTimeout(() => {
                        this.basicComboCount = 0;
                        console.log("Combo Reset");
                    }, 300); // Small delay to allow Chop animation to finish
                }, 600); 
           

            clearTimeout(this.comboTimeout); // Prevent timeout from resetting early
        }

        // Reset combo if player waits too long between presses
        clearTimeout(this.comboTimeout);
        this.comboTimeout = setTimeout(() => {
            this.basicComboCount = 0; // Reset combo after delay
            console.log("Combo reset");
        }, this.comboDelay);
    }

    performSwordCombo() {
        this.swordComboCount++;

        if(this.swordComboCount === 1){
            this.weapon.attack(this);
            this.isAttacking = true;
            this.performAttack("slash");
        } else if (this.swordComboCount >= 3) {
            console.log("Executing Sword Combo!");

            this.swordComboAttack = true;  // Set flag to enable animation
           // this.currentAttack = "combo";  // Set animation to combo

            this.weapon.attack(this);
            setTimeout(() => {
                this.weapon.attack(this);
            }, 200);

            // **Reset after animation duration**
            setTimeout(() => {
                this.swordComboAttack = false;
                this.swordComboCount = 0; // Reset combo count
                this.isAttacking = false;
            }, 1000);  // Adjust based on animation speed

        }
        clearTimeout(this.comboTimeout);
        this.comboTimeout = setTimeout(() => {
            this.swordComboCount = 0; // Reset combo after delay
            console.log("Sword Combo reset");
        }, this.comboDelay);
    }
    
    unequipWeapon() {
        this.weapon = null;
        if(this.isUsingPistol) {
            this.isUsingPistol = false;
        }
        if(this.isUsingSword) {
            this.isUsingSword = false;
        }
        
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
    drawInventory(ctx) {
        // Draw inventory box
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
        ctx.fillRect(20, ctx.canvas.height - 90, 160, 80); // Adjusted height for all items

        // Draw inventory label
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText("Inventory", 30, ctx.canvas.height - 65);

        // Load item icons
        const healthKitIcon = new Image();
        healthKitIcon.src = "./assets/sprites/health_kit.png"; 

        const pistolIcon = new Image();
        pistolIcon.src = "./assets/sprites/pistol_icon.png"; // Add a pistol icon

        const swordIcon = new Image();
        swordIcon.src = "./assets/sprites/sword_icon.png"; // Add a sword icon

        // Get player upgrades
        const upgrades = this.scene.sceneManager.gameState.playerStats.upgrades;
        const inventory = this.scene.sceneManager.gameState.playerStats.inventory;

        // Display Health Kit Count
        ctx.drawImage(healthKitIcon, 30, ctx.canvas.height - 50, 20, 20);
        // If at max limit, highlight it
        if (inventory.healthKits >= 10) {
            ctx.fillStyle = "red";  // Turn text red to indicate full
            ctx.fillText(`x ${inventory.healthKits}`, 60, ctx.canvas.height - 35);
        } else {
            ctx.fillStyle = "white";
            ctx.fillText(`x ${inventory.healthKits}`, 60, ctx.canvas.height - 35);
        }

        // Display Pistol (Greyed out if not owned)
        ctx.globalAlpha = upgrades.unlockGun ? 1.0 : 0.3; // Transparent if not owned
        ctx.drawImage(pistolIcon, 100, ctx.canvas.height - 50, 20, 20);
        ctx.globalAlpha = 1.0; // Reset transparency
        if (upgrades.unlockGun) {
            ctx.fillText("✔", 120, ctx.canvas.height - 35);
        }

        // Display Sword (Greyed out if not owned)
        ctx.globalAlpha = upgrades.unlockSword ? 1.0 : 0.3;
        ctx.drawImage(swordIcon, 140, ctx.canvas.height - 50, 20, 20);
        ctx.globalAlpha = 1.0;
        if (upgrades.unlockSword) {
            ctx.fillText("✔", 160, ctx.canvas.height - 35);
        }

        // Instruction for Health Kit usage
        ctx.font = "14px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Press 'H' to use", 30, ctx.canvas.height - 15);

    }

    draw(ctx) {
        super.draw(ctx);
        
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
            ctx.fillText("'F': Shoot, 'T': Reload ", xPosition + 450, yPosition + 45);

            const ammoText = `Ammo: ${this.weapon.ammo}/ ${this.weapon.magazineSize}`;
            ctx.fillStyle = "white";
            ctx.font = "bold 20px Arial";
            ctx.textAlign = "left";

            ctx.fillText(ammoText, 75, ctx.canvas.height - 100);
        } else if(this.isUsingSword){
            ctx.fillText("Use 'R' to attack", xPosition + 450, yPosition + 45);
        } else{
            ctx.fillText("'Q': Sword, 'G' : Pistol", xPosition + 450, yPosition + 45);
        }

        if(this.cheatMode) {
            ctx.font = "bold 24px Arial";
            ctx.textAlign = "left";
            ctx.fillStyle = "red";
            ctx.fillText("CHEAT MODE", xPosition + 70, yPosition + 45 );
        }
        this.drawDebugStats(ctx);
        this.drawInventory(ctx);

        //Show Notifications
        if(this.notification) {
            ctx.font = '24px Arial';
            ctx.fillStyle = this.notification.color;
            ctx.textAlign = "center";
            ctx.fillText(this.notification.message, ctx.canvas.width/2, ctx.canvas.height - 50);
        }
    }

    showNotification(message, color) {
        this.notification = {
            message: message,
            color: color
        };
        this.notificationTimer = 2000;
    }

    equipWeapon(weapon) {
        this.weapon = weapon;
        this.isUsingPistol = weapon instanceof Pistol;
        this.isUsingSword = weapon instanceof Sword;
    }

    handleCheatCodeInput() {
        // Read keys only when pressed once
        const keys = ["c", "h", "e", "a", "t"];
        for (const key of keys) {
            if (this.gameEngine.isKeyPressed(key)) {
                this.cheatCodeBuffer += key;
            }
        }

        // Keep only last 5 characters
        if (this.cheatCodeBuffer.length > 5) {
            this.cheatCodeBuffer = this.cheatCodeBuffer.slice(-5);
        }

        // Activate cheat mode if "cheat" is typed
        if (this.cheatCodeBuffer === "cheat") {
            this.cheatMode = !this.cheatMode;
            console.log(`CHEAT MODE ${this.cheatMode ? "ACTIVATED" : "DEACTIVATED"}`);
            this.showNotification(`CHEAT MODE ${this.cheatMode ? "ON" : "OFF"}`, "red");
            this.cheatCodeBuffer = ""; // Reset buffer
        }
    }
}
