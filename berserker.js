class Berserker extends Enemy {
    constructor(gameEngine, scene, x, y) {
        super(gameEngine, scene, x, y);
        
        this.spriteSheet = ASSET_MANAGER.getAsset("./assets/sprites/berserker.png");
        
        this.isUsingSword = true;
        this.isBoss = true;
        
        this.health = 1200;
        this.maxHealth = 1200;
        this.speed = 2;
        this.attackRange = 120;
        
        this.weapon = {
            range: 120,
            damage: 15
        };
        
        // state machine
        this.states = {
            IDLE: 'idle',
            CHASE: 'chase',
            ATTACK: 'attack',
            COMBO_ATTACK: 'combo_attack',
            RAGE: 'rage',
            DASH_CHARGE: 'dash_charge',
            DASH_ATTACK: 'dash_attack',
            DEATH: 'death'
        };
        this.currentState = this.states.IDLE;
        
        // animations with the new spritesheet
        this.animations = {
            idle: new Animator(
                this.spriteSheet,
                512 * 41, 
                0,
                512,
                512,
                1,
                1,
                0.8,
                true
            ),
            run: new Animator(
                this.spriteSheet,
                512 * 51,
                0,
                512,
                512,
                8,
                0.1,
                0.8,
                true
            ),
            death: new Animator(
                this.spriteSheet,
                512 * 25,
                0,
                512,
                512,
                8,
                0.2,
                0.8,
                false
            ),
            attack: new Animator(
                this.spriteSheet,
                512 * 0,
                0,
                512,
                512,
                2,
                0.2,
                0.8,
                false
            ),
            comboAttack: new Animator(
                this.spriteSheet,
                512 * 7,
                0,
                512,
                512,
                10,
                0.1,
                0.8,
                false
            ),
            jump: new Animator(
                this.spriteSheet,
                512*46,
                0,
                512,
                512,
                5,
                0.2,
                0.8,
                true
            )
        };
        
        // Berserker-specific properties
        this.rageMode = false;
        this.rageModeThreshold = this.maxHealth * 0.5; // Enter rage mode at 50% health
        this.rageModeMultiplier = 1.3; // Speed and damage multiplier when enraged
        this.attackCooldown = false;
        this.attackTimer = 0;
        this.attackInterval = 2; // Time between attacks
        this.isActive = false;
        
        // Dash attack properties
        this.dashChargeTime = 2; // Seconds to charge before dashing
        this.chargeTimer = 0;
        this.dashSpeed = 10;
        this.dashTarget = { x: 0, y: 0 };
        
        // Combo attack properties
        this.comboChance = 0.4; // 40% chance to perform combo attack instead of regular attack
    }

    update() {
        if (!this.isActive) return;

        // Update bounding box
        this.boundingbox.x = this.x - this.gameEngine.camera.x;
        this.boundingbox.y = this.y;
        
        super.update();
        
        if (this.isDead) {
            this.setState(this.states.DEATH);
           
            
            return;
        }
        
        // Check if should enter rage mode
        if (!this.rageMode && this.health <= this.rageModeThreshold) {
            this.enterRageMode();
        }
        
        // Update state machine
        this.updateStateMachine();
        
        // Update attack timer
        this.attackTimer += this.gameEngine.clockTick;
        
        if (PARAMS.DEBUG) {
            console.log(`Current State: ${this.currentState}, Rage: ${this.rageMode}`);
        }
    }
    
    updateStateMachine() {
        const player = this.scene.player;
        
        // Calculate distance to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        
        // Face the player
        this.facingLeft = dx < 0;
        
        const minDashDistance = 250;
        
        // State transitions
        switch (this.currentState) {
            case this.states.IDLE:
                // Transition to CHASE if player is far
                if (distanceToPlayer > this.attackRange) {
                    this.setState(this.states.CHASE);
                }
                // Try dash attack if in rage mode and player is far enough away
                else if (this.rageMode && Math.random() < 0.05 && distanceToPlayer > minDashDistance) {
                    this.setState(this.states.DASH_CHARGE);
                }
                // Transition to ATTACK if player is in range and cooldown is over
                else if (distanceToPlayer <= this.attackRange && 
                         this.attackTimer >= this.attackInterval && 
                         !this.attackCooldown) {
                    // Increase combo chance to make it more likely to happen
                    if (Math.random() < (this.rageMode ? 0.6 : 0.3)) {
                        this.setState(this.states.COMBO_ATTACK);
                        if (PARAMS.DEBUG) console.log("Starting COMBO ATTACK");
                    } else {
                        this.setState(this.states.ATTACK);
                        if (PARAMS.DEBUG) console.log("Starting regular ATTACK");
                    }
                }
                break;
                
            case this.states.CHASE:
                // Try dash attack if in rage mode and player is far enough away
                if (this.rageMode && Math.random() < 0.05 && distanceToPlayer > minDashDistance) {
                    this.setState(this.states.DASH_CHARGE);
                }
                // Transition to ATTACK if player is in range and cooldown is over
                else if (distanceToPlayer <= this.attackRange && 
                    this.attackTimer >= this.attackInterval && 
                    !this.attackCooldown) {
                    // Increase combo chance to make it more likely to happen
                    if (Math.random() < (this.rageMode ? 0.6 : 0.3)) {
                        this.setState(this.states.COMBO_ATTACK);
                        if (PARAMS.DEBUG) console.log("Starting COMBO ATTACK");
                    } else {
                        this.setState(this.states.ATTACK);
                        if (PARAMS.DEBUG) console.log("Starting regular ATTACK");
                    }
                }
                // Transition to IDLE if no longer chasing
                else if (distanceToPlayer <= this.attackRange) {
                    this.setState(this.states.IDLE);
                }
                break;
                
            case this.states.ATTACK:
                // Transition back to IDLE when attack is done
                if (this.animations.attack.isDone()) {
                    this.animations.attack.elapsedTime = 0;
                    this.setState(this.states.IDLE);
                }
                break;
                
            case this.states.COMBO_ATTACK:
                // Transition back to IDLE when combo attack is done
                if (this.animations.comboAttack.isDone()) {
                    this.animations.comboAttack.elapsedTime = 0;
                    this.setState(this.states.IDLE);
                }
                break;
                
            case this.states.DASH_CHARGE:
                // Explicitly set isMoving to false to prevent any movement
                this.isMoving = false;
                this.velocity.x = 0;
                this.velocity.y = 0;
                
                // Update charge timer
                this.chargeTimer += this.gameEngine.clockTick;
                if (this.chargeTimer >= this.dashChargeTime) {
                    // Charge complete, start dashing
                    this.chargeTimer = 0;
                    this.setState(this.states.DASH_ATTACK);
                }
                break;
                
            case this.states.DASH_ATTACK:
                // Check if we've reached the target or close enough
                const targetDx = this.dashTarget.x - this.x;
                const targetDy = this.dashTarget.y - this.y;
                const distanceToTarget = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
                
                if (distanceToTarget < 10) {
                    this.setState(this.states.IDLE);
                }
                break;
                
            case this.states.RAGE:
                // Transition back to IDLE when rage animation is done
                if (!this.isTransforming) {
                    this.setState(this.states.IDLE);
                }
                break;
                
            case this.states.DEATH:
                // Remove from world when death animation is done
                if (this.animations.death.isDone()) {
                    this.removeFromWorld = true;
                }
                break;
        }
        
        // State behaviors
        switch (this.currentState) {
            case this.states.IDLE:
                this.isMoving = false;
                break;
                
            case this.states.CHASE:
                this.chasePlayer();
                break;
                
            case this.states.ATTACK:
                this.performAttack();
                break;
                
            case this.states.COMBO_ATTACK:
                this.performComboAttack();
                break;
                
            case this.states.DASH_CHARGE:
                // Stop moving during charge - reinforcing this in both places
                this.isMoving = false;
                this.velocity = { x: 0, y: 0 };
                
                // Set target to player's current position
                this.dashTarget = { 
                    x: player.x,
                    y: player.y
                };
                break;
                
            case this.states.DASH_ATTACK:
                this.performDashAttack();
                break;
                
            case this.states.DEATH:
                this.isMoving = false;
                break;
        }
    }
    
    setState(newState) {
        // Don't change state if dead (except to DEATH state)
        if (this.isDead && newState !== this.states.DEATH) {
            return;
        }
        
        // Reset animation states when changing states
        if (this.currentState !== newState) {
            if (PARAMS.DEBUG) {
                console.log(`State change: ${this.currentState} -> ${newState}`);
            }
            
            this.currentState = newState;
            
            // Reset specific animations when entering states
            switch (newState) {
                case this.states.ATTACK:
                    this.animations.attack.elapsedTime = 0;
                    break;
                case this.states.COMBO_ATTACK:
                    this.animations.comboAttack.elapsedTime = 0;
                    break;
                case this.states.DASH_CHARGE:
                    this.chargeTimer = 0;
                    this.isMoving = false;
                    this.velocity = { x: 0, y: 0 };
                    // Play charge sound
                    ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
                    break;
                case this.states.DASH_ATTACK:
                    const player = this.scene.player;
                    this.dashTarget = { 
                        x: player.x,
                        y: player.y
                    };
                    break;
                case this.states.DEATH:
                    this.animations.death.elapsedTime = 0;
                    break;
            }
        }
    }
    
    chasePlayer() {
        const player = this.scene.player;
        const moveSpeed = this.rageMode ? this.speed * this.rageModeMultiplier : this.speed;
        
        // Face the player
        this.facingLeft = player.x < this.x;
        
        if (player.x > this.x) {
            this.x += moveSpeed;
        } else if (player.x < this.x) {
            this.x -= moveSpeed;
        }
        
        if (player.y > this.y) {
            this.y += moveSpeed;
        } else if (player.y < this.y) {
            this.y -= moveSpeed;
        }
        
        this.isMoving = true;
    }
    
    performAttack() {
        if (this.attackCooldown) return;
        
        // Set attack cooldown
        this.attackCooldown = true;
        this.attackTimer = 0;
        
        // Play attack sound
        ASSET_MANAGER.playAsset("./assets/sound/sword.mp3");
        
        // Apply damage after a delay to match animation
        setTimeout(() => {
            const player = this.scene.player;
            
            // Calculate distance to player
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if player is in front of the berserker
            const inFrontOfBerserker = (this.facingLeft && dx < 0) || (!this.facingLeft && dx > 0);
            
            // Apply damage if player is in range and in front
            if (distance <= this.attackRange && inFrontOfBerserker) {
                const damage = this.rageMode ? this.weapon.damage * this.rageModeMultiplier : this.weapon.damage;
                player.takeDamage(damage);
            }
            
            // Reset attack cooldown after a delay
            setTimeout(() => {
                this.attackCooldown = false;
            }, 700);
        }, 300);
    }
    
    performComboAttack() {
        if (this.attackCooldown) return;
        
        // Set attack cooldown
        this.attackCooldown = true;
        this.attackTimer = 0;
        
        // Play attack sound
        ASSET_MANAGER.playAsset("./assets/sound/sword.mp3");
        
        // Apply damage in multiple hits
        let hitCount = 0;
        const maxHits = 3;
        const hitInterval = 200; // ms between hits
        
        const applyComboHit = () => {
            hitCount++;
            
            const player = this.scene.player;
            
            // Calculate distance to player
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if player is in front of the berserker
            const inFrontOfBerserker = (this.facingLeft && dx < 0) || (!this.facingLeft && dx > 0);
            
            // Apply damage if player is in range and in front
            if (distance <= this.attackRange * 1.2 && inFrontOfBerserker) {
                // Each hit of the combo does less damage than a regular attack
                const damagePerHit = this.rageMode ? 
                    (this.weapon.damage * this.rageModeMultiplier) * 0.4 : 
                    this.weapon.damage * 0.4;
                
                player.takeDamage(damagePerHit);
                
                if (PARAMS.DEBUG) {
                    console.log(`Combo hit ${hitCount} dealt ${damagePerHit} damage`);
                }
            }
            
            // Continue combo if more hits remain
            if (hitCount < maxHits) {
                setTimeout(applyComboHit, hitInterval);
            }
        };
        
        // Start the combo after a short delay
        setTimeout(applyComboHit, 300);
        
        // Reset attack cooldown after the full combo duration
        setTimeout(() => {
            this.attackCooldown = false;
        }, 1200);
    }
    
    performDashAttack() {
        // Calculate direction to target
        const dx = this.dashTarget.x - this.x;
        const dy = this.dashTarget.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 10) {
            // We've reached the target, apply damage in area
            const player = this.scene.player;
            const playerDx = player.x - this.x;
            const playerDy = player.y - this.y;
            const playerDistance = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
            
            // Increase the area of effect for the dash attack
            const dashAttackRange = this.attackRange * 1.5;
            
            if (playerDistance < dashAttackRange) {
                // Increase dash attack damage for longer range attacks
                const dashDamageMultiplier = 1.5;
                const damage = this.rageMode ? 
                    this.weapon.damage * this.rageModeMultiplier * dashDamageMultiplier : 
                    this.weapon.damage * dashDamageMultiplier;
                
                player.takeDamage(damage);
                
                // Add visual effect for dash impact
                this.showDashImpact();
            }
            
            // Transition to IDLE
            this.setState(this.states.IDLE);
            return;
        }
        
        // Normalize direction and apply dash speed
        const moveX = (dx / distance) * this.dashSpeed;
        const moveY = (dy / distance) * this.dashSpeed;
        
        // Move berserker
        this.x += moveX;
        this.y += moveY;
        
        // Check for collision with player during dash
        const player = this.scene.player;
        const playerDx = player.x - this.x;
        const playerDy = player.y - this.y;
        const playerDistance = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
        
        if (playerDistance < 80) {
            // Apply damage if we hit the player during dash
            const damage = this.rageMode ? this.weapon.damage * this.rageModeMultiplier : this.weapon.damage;
            player.takeDamage(damage);
            
            // End dash early if we hit the player
            this.setState(this.states.IDLE);
        }
    }
    
    enterRageMode() {
        this.setState(this.states.RAGE);
        this.rageMode = true;
        this.isTransforming = true;
        
        // Attack significantly faster when enraged (50% faster instead of 30%)
        this.attackInterval *= 0.5;
        
        // Reduce rage mode multiplier from 1.5 to 1.3
        this.rageModeMultiplier = 1.3;
        
        // Increase weapon damage in rage mode
        this.weapon.damage *= this.rageModeMultiplier;
        
        // Play rage sound
        ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
        
        // End transformation after a delay
        setTimeout(() => {
            this.isTransforming = false;
        }, 1500);
    }
    
    takeDamage(amount) {
        super.takeDamage(amount);
        
        // Check if dead
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
            this.setState(this.states.DEATH);
            return;
        }
        
        // Check for rage mode transition
        if (!this.rageMode && this.health <= this.rageModeThreshold) {
            this.enterRageMode();
            return;
        }
        
        // If taking damage while idle, transition to chase
        if (this.currentState === this.states.IDLE && !this.isDead) {
            this.setState(this.states.CHASE);
        }
    }
    
    draw(ctx) {
        if (!this.isActive) return;
        
        // Draw boss health bar
        const healthBarWidth = 300;
        const healthBarHeight = 70;
        const healthPercentage = this.health / this.maxHealth;
        const xPosition = 950;
        const yPosition = 30;

        const img = new Image();
        img.src = './assets/sprites/healthbar.png';

        // Use red for normal mode, fiery orange/red for rage mode
        ctx.fillStyle = this.rageMode ? "rgba(255, 100, 0, 0.9)" : "red";
        ctx.fillRect(xPosition + 60, yPosition + 25, 236 * healthPercentage, 25);
        ctx.drawImage(img, xPosition, yPosition, healthBarWidth, healthBarHeight);
        
        // Draw "BERSERKER" text
        ctx.font = "20px Arial";
        ctx.fillStyle = this.rageMode ? "orange" : "white";
        ctx.textAlign = "right";
        ctx.fillText("BERSERKER", xPosition , yPosition + 40);
        
        // Draw character
        const screenX = this.x - this.gameEngine.camera.x;
        const offsetX = 165;
        const offsetY = 210;
        
        ctx.save();
        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.translate(-screenX * 2 - (512 * 0.8) + (offsetX * 2), 0);
        }
        
        // Draw based on current state
        if (this.isDead) {
            this.animations.death.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else if (this.currentState === this.states.DASH_ATTACK) {
            // Use jump animation for dash
            this.animations.jump.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else if (this.currentState === this.states.DASH_CHARGE) {
            // Use attack animation for charging, but freeze on first frame
            this.animations.attack.drawFrame(0, ctx, screenX - offsetX, this.y - offsetY);
        } else if (this.currentState === this.states.ATTACK) {
            this.animations.attack.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else if (this.currentState === this.states.COMBO_ATTACK) {
            this.animations.comboAttack.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else if (this.isMoving) {
            this.animations.run.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else {
            this.animations.idle.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        }
        
        ctx.restore();
        
        // Draw rage mode visual indicator
        if (this.rageMode) {
            // Draw red aura
            ctx.fillStyle = "rgba(255, 50, 0, 0.2)";
            ctx.beginPath();
            ctx.arc(screenX + 40, this.y + 40, 60, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw rage text
            ctx.font = "20px Arial";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("ENRAGED!", screenX + 40, this.y - 20);
        }
        
        // Draw attack type indicator for debugging
        if (PARAMS.DEBUG) {
            if (this.currentState === this.states.COMBO_ATTACK) {
                ctx.font = "16px Arial";
                ctx.fillStyle = "yellow";
                ctx.textAlign = "center";
                ctx.fillText("COMBO ATTACK!", screenX + 40, this.y - 40);
            } else if (this.currentState === this.states.ATTACK) {
                ctx.font = "16px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText("REGULAR ATTACK", screenX + 40, this.y - 40);
            }
        }
        
        // Draw charge effect
        if (this.currentState === this.states.DASH_CHARGE) {
            // Draw charging circle
            const chargeProgress = this.chargeTimer / this.dashChargeTime;
            const pulseSize = 20 + Math.sin(Date.now() / 100) * 10;
            
            ctx.fillStyle = `rgba(255, 0, 0, 0.5)`;
            ctx.beginPath();
            ctx.arc(screenX + 40, this.y + 40, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw "CHARGING!" text
            ctx.font = "16px Arial";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("CHARGING!", screenX + 40, this.y - 20);
            
            // Draw progress bar
            ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
            ctx.fillRect(screenX - 30, this.y - 40, 140 * chargeProgress, 10);
            ctx.strokeStyle = "white";
            ctx.strokeRect(screenX - 30, this.y - 40, 140, 10);
        }
        
        if (PARAMS.DEBUG) {
            // Draw attack range
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.arc(screenX, this.y, this.attackRange, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw state text
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`State: ${this.currentState}`, screenX, this.y - 60);
            ctx.fillText(`Rage: ${this.rageMode}`, screenX, this.y - 45);
            
            // Draw bounding box
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
        }
    }
    
    toggleDebug() {
        PARAMS.DEBUG = !PARAMS.DEBUG;
        console.log(`Debug mode: ${PARAMS.DEBUG ? 'ON' : 'OFF'}`);
    }

    showDashImpact() {
        const screenX = this.x - this.gameEngine.camera.x;
        
        // Play impact sound
        ASSET_MANAGER.playAsset("./assets/sound/sword.mp3");
        
        // Add visual effect
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const size = 3 + Math.random() * 5;
            
            const particle = {
                x: screenX,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                alpha: 1,
                update: function() {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.alpha -= 0.05;
                    return this.alpha <= 0;
                },
                draw: function(ctx) {
                    ctx.fillStyle = `rgba(255, 0, 0, ${this.alpha})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            
            // Add the particle to the game engine
            this.gameEngine.addEntity({
                update: function() {
                    return particle.update();
                },
                draw: function(ctx) {
                    particle.draw(ctx);
                },
                zIndex: 10
            });
        }
    }

}
