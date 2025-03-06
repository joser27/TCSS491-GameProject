class ShadowKing extends Enemy {
    constructor(gameEngine, scene, x, y) {
        super(gameEngine, scene, x, y);

        // Override the default sprite sheet
        this.normalSheet = "./assets/sprites/shadowking/shadowking_normal.png";
        this.hazedSheet = "./assets/sprites/shadowking/shadowking_transformed.png"; // Hazed version
        
        this.health = 1000;
        this.speed = 2;
        this.attackTimer = 0;
        this.attackInterval = 2;
        this.attackRange = 60;
        this.isBoss = true;
        this.isActive = false;
        this.isHazed = false; // Phase 2 state
        this.currentPhase = 1;

        // State machine properties
        this.states = {
            IDLE: 'idle',
            CHASE: 'chase',
            ATTACK: 'attack',
            SUMMON: 'summon',
            TRANSFORM: 'transform',
            DEATH: 'death'
        };
        this.currentState = this.states.IDLE;
        
        // Clone properties
        this.cloneTimer = 0;
        this.cloneInterval = 8; // Seconds between clone spawns
        this.maxClones = 2; // Maximum number of clones at once
        this.clones = [];
        
        // Basic animations for both normal and hazed forms
        this.normalAnimations = {
            idle: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 48, // Adjust based on your spritesheet
                0,
                512,
                512,
                1,
                1,
                0.8,
                true
            ),
            run: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 58,
                0,
                512,
                512,
                8,
                0.1,
                0.8,
                true
            ),
            attack: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 6,
                0,
                512,
                512,
                4,
                0.1,
                0.8,
                false
            ),
            death: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 30,
                0,
                512,
                512,
                10,
                0.2,
                0.8,
                false
            ),
            transform: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 40, // Adjust frame position based on your spritesheet
                0,
                512,
                512,
                6, // Adjust number of frames
                0.15,
                0.8,
                false
            ),
            summon: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 20, // Adjust based on your spritesheet
                0,
                512,
                512,
                5, // Adjust number of frames
                0.15,
                0.8,
                false
            )
        };

        // Same animations but using hazed spritesheet
        this.hazedAnimations = {
            idle: new Animator(
                ASSET_MANAGER.getAsset(this.hazedSheet),
                512 * 48,
                0,
                512,
                512,
                1,
                1,
                0.8,
                true
            ),
            run: new Animator(
                ASSET_MANAGER.getAsset(this.hazedSheet),
                512 * 58,
                0,
                512,
                512,
                8,
                0.1,
                0.8,
                true
            ),
            attack: new Animator(
                ASSET_MANAGER.getAsset(this.hazedSheet),
                512 * 6,
                0,
                512,
                512,
                4,
                0.1,
                0.8,
                false
            ),
            death: new Animator(
                ASSET_MANAGER.getAsset(this.hazedSheet),
                512 * 30,
                0,
                512,
                512,
                10,
                0.2,
                0.8,
                false
            ),
            summon: new Animator(
                ASSET_MANAGER.getAsset(this.hazedSheet),
                512 * 20, // Adjust based on your spritesheet
                0,
                512,
                512,
                5, // Adjust number of frames
                0.15,
                0.8,
                false
            )
        };

        this.currentAttack = null;
        this.attackCooldown = false;
        this.isSummoning = false;

        // Add isTransforming state
        this.isTransforming = false;
        
        // Debug flag
        this.debug = false;
    }

    update() {
        if (!this.isActive) return;

        // Update bounding box
        this.boundingbox.x = this.x - this.gameEngine.camera.x;
        this.boundingbox.y = this.y;

        super.update();
        
        // If dead, just update death animation
        if (this.isDead) {
            if (this.currentState !== this.states.DEATH) {
                this.setState(this.states.DEATH);
            }
            return;
        }

        // Check for phase transition
        if (this.health <= 500 && this.currentPhase === 1 && !this.isTransforming) {
            this.setState(this.states.TRANSFORM);
        }

        // Update state machine
        this.updateStateMachine();
        
        // Update clones
        this.updateClones();
        
        if (this.debug) {
            console.log(`Current State: ${this.currentState}, IsTransforming: ${this.isTransforming}, IsHazed: ${this.isHazed}`);
        }
    }
    
    updateStateMachine() {
        const player = this.scene.player;
        const distanceToPlayerX = Math.abs(this.x - player.x);
        const distanceToPlayerY = Math.abs(this.y - player.y);
        const distanceToPlayer = Math.sqrt(distanceToPlayerX ** 2 + distanceToPlayerY ** 2);
        
        // State transitions
        switch (this.currentState) {
            case this.states.IDLE:
                // Transition to CHASE if player is far
                if (distanceToPlayer > this.attackRange) {
                    this.setState(this.states.CHASE);
                }
                // Transition to ATTACK if player is in range
                else if (distanceToPlayer <= this.attackRange && !this.attackCooldown) {
                    this.setState(this.states.ATTACK);
                }
                // Transition to SUMMON if in hazed form and timer is up
                else if (this.isHazed && this.cloneTimer >= this.cloneInterval && this.clones.length < this.maxClones) {
                    this.setState(this.states.SUMMON);
                }
                break;
                
            case this.states.CHASE:
                // Transition to ATTACK if player is in range
                if (distanceToPlayer <= this.attackRange && !this.attackCooldown) {
                    this.setState(this.states.ATTACK);
                }
                // Transition to IDLE if no longer chasing
                else if (distanceToPlayer <= this.attackRange) {
                    this.setState(this.states.IDLE);
                }
                break;
                
            case this.states.ATTACK:
                const currentAnimations = this.isHazed ? this.hazedAnimations : this.normalAnimations;
                // Transition back to IDLE when attack is done
                if (this.currentAttack === null || currentAnimations.attack.isDone()) {
                    currentAnimations.attack.elapsedTime = 0;
                    this.setState(this.states.IDLE);
                }
                break;
                
            case this.states.SUMMON:
                const summonAnimations = this.isHazed ? this.hazedAnimations : this.normalAnimations;
                // Transition back to IDLE when summon is done
                if (summonAnimations.summon.isDone()) {
                    summonAnimations.summon.elapsedTime = 0;
                    this.spawnClone();
                    this.setState(this.states.IDLE);
                }
                break;
                
            case this.states.TRANSFORM:
                // Don't transition out of TRANSFORM state while transforming
                // The transformToHazed method will handle the transition when done
                break;
                
            case this.states.DEATH:
                const deathAnimations = this.isHazed ? this.hazedAnimations : this.normalAnimations;
                // Remove from world when death animation is done
                if (deathAnimations.death.isDone()) {
                    this.removeFromWorld = true;
                    // Remove all clones when boss dies
                    this.clones.forEach(clone => {
                        clone.isDead = true;
                        clone.removeFromWorld = true;
                    });
                }
                break;
        }
        
        // State behaviors
        switch (this.currentState) {
            case this.states.IDLE:
                this.isMoving = false;
                this.attackTimer += this.gameEngine.clockTick;
                this.cloneTimer += this.gameEngine.clockTick;
                break;
                
            case this.states.CHASE:
                this.chasePlayer();
                this.attackTimer += this.gameEngine.clockTick;
                this.cloneTimer += this.gameEngine.clockTick;
                break;
                
            case this.states.ATTACK:
                if (!this.currentAttack) {
                    this.performAttack();
                }
                break;
                
            case this.states.SUMMON:
                this.isSummoning = true;
                this.isMoving = false;
                break;
                
            case this.states.TRANSFORM:
                if (!this.isTransforming) {
                    this.transformToHazed();
                }
                break;
                
            case this.states.DEATH:
                this.isMoving = false;
                break;
        }
    }
    
    setState(newState) {
        // Don't change state if transforming or dead
        if ((this.isTransforming && newState !== this.states.TRANSFORM) || 
            (this.isDead && newState !== this.states.DEATH)) {
            return;
        }
        
        // Reset animation states when changing states
        if (this.currentState !== newState) {
            if (this.debug) {
                console.log(`State change: ${this.currentState} -> ${newState}`);
            }
            
            this.currentState = newState;
            
            // Reset specific animations when entering states
            const currentAnimations = this.isHazed ? this.hazedAnimations : this.normalAnimations;
            
            switch (newState) {
                case this.states.ATTACK:
                    currentAnimations.attack.elapsedTime = 0;
                    break;
                case this.states.SUMMON:
                    currentAnimations.summon.elapsedTime = 0;
                    this.cloneTimer = 0;
                    this.isSummoning = true;
                    break;
                case this.states.DEATH:
                    currentAnimations.death.elapsedTime = 0;
                    break;
                case this.states.TRANSFORM:
                    this.normalAnimations.transform.elapsedTime = 0;
                    break;
            }
        }
    }
    
    chasePlayer() {
        const player = this.scene.player;
        
        if (player.x > this.x) {
            this.x += this.speed;
            this.facingLeft = false;
        } else {
            this.x -= this.speed;
            this.facingLeft = true;
        }
        
        if (player.y > this.y) {
            this.y += this.speed;
        } else if (player.y < this.y) {
            this.y -= this.speed;
        }
        
        this.isMoving = true;
    }
    
    spawnClone() {
        // Create a clone at a random position near the boss
        const offsetX = Math.random() * 200 - 100; // Random offset between -100 and 100
        const offsetY = Math.random() * 200 - 100;
        
        // Create a new ShadowKing instance as a clone
        const clone = new ShadowKingClone(
            this.gameEngine, 
            this.scene, 
            this.x + offsetX, 
            this.y + offsetY,
            this.isHazed
        );
        
        // Add the clone to the game and track it
        this.gameEngine.addEntity(clone);
        this.scene.addEnemy(clone); // Also add to the scene's enemy list
        this.clones.push(clone);
        
        if (this.debug) {
            console.log(`Spawned clone at (${clone.x}, ${clone.y}), total clones: ${this.clones.length}`);
        }
        
        // Play a sound effect for the clone spawn
        if (ASSET_MANAGER.getAsset("./assets/sound/clone.mp3")) {
            ASSET_MANAGER.playAsset("./assets/sound/clone.mp3");
        } else {
            // Fallback sound if clone.mp3 doesn't exist
            ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
        }
        
        this.isSummoning = false;
    }
    
    updateClones() {
        // Remove dead clones from the tracking array
        this.clones = this.clones.filter(clone => !clone.removeFromWorld);
        
        // If in hazed form, check if we should spawn clones
        if (this.isHazed && 
            this.currentState !== this.states.SUMMON && 
            this.cloneTimer >= this.cloneInterval && 
            this.clones.length < this.maxClones) {
            this.setState(this.states.SUMMON);
        }
    }

    transformToHazed() {
        if (this.isTransforming) return;
        
        this.isTransforming = true;
        this.isMoving = false;
        this.attackCooldown = true; // Prevent attacks during transformation
        
        if (this.debug) {
            console.log("Starting transformation to hazed form");
        }
        
        // Reset transform animation
        this.normalAnimations.transform.elapsedTime = 0;

        // Create a flash effect
        const originalAlpha = this.gameEngine.ctx.globalAlpha;
        const flash = () => {
            this.gameEngine.ctx.globalAlpha = 0.3;
            setTimeout(() => {
                this.gameEngine.ctx.globalAlpha = originalAlpha;
            }, 200); // Increased flash duration
        };

        // Add multiple flashes during transformation
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                flash();
                // Play additional sound effect for each flash
                ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
            }, i * 500); // Space out flashes every 500ms
        }

        // Schedule the actual transformation
        setTimeout(() => {
            this.currentPhase = 2;
            this.isHazed = true;
            this.speed *= 1.5;
            this.attackInterval *= 0.7;
            this.damage *= 1.5;
            this.isTransforming = false;
            this.attackCooldown = false;
            flash();
            
            if (this.debug) {
                console.log("Transformation complete, now in hazed form");
            }
            
            // Transition back to IDLE state
            this.setState(this.states.IDLE);
            
            // Spawn initial clones after transformation
            setTimeout(() => {
                this.setState(this.states.SUMMON);
            }, 1000);
            
        }, 1800); // Increased from 900 to 1800ms for longer transformation
    }

    performAttack() {
        if (this.attackCooldown) return;

        this.currentAttack = "attack";
        this.attackCooldown = true;
        this.attackTimer = 0;

        // Add damage delay for animation timing
        setTimeout(() => {
            if (this.isCollidingWithEntity(this.scene.player)) {
                const damage = this.isHazed ? 40 : 30; // More damage in hazed form
                this.scene.player.takeDamage(damage);
            }
        }, 500);

        setTimeout(() => {
            this.attackCooldown = false;
            this.currentAttack = null;
        }, 1000);
    }
    
    takeDamage(amount) {
        super.takeDamage(amount);
        
        // Check if dead
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
            this.setState(this.states.DEATH);
            return;
        }
        
        // Check for phase transition
        if (this.health <= 500 && this.currentPhase === 1 && !this.isTransforming) {
            this.setState(this.states.TRANSFORM);
            return;
        }
        
        // If taking damage while idle, transition to chase
        if (this.currentState === this.states.IDLE && !this.isTransforming && !this.isDead) {
            this.setState(this.states.CHASE);
        }
    }

    draw(ctx) {
        if (!this.isActive) return;

        // Draw health bar
        const healthBarWidth = 300;
        const healthBarHeight = 70;
        const healthPercentage = this.health / 1000;
        const xPosition = 950;
        const yPosition = 30;

        const img = new Image();
        img.src = './assets/sprites/healthbar.png';

        ctx.fillStyle = "red";
        ctx.fillRect(xPosition + 60, yPosition + 25, 236 * healthPercentage, 25);
        ctx.drawImage(img, xPosition, yPosition, healthBarWidth, healthBarHeight);

        // Draw character
        const offsetX = 165;
        const offsetY = 210;
        const screenX = this.x - this.gameEngine.camera.x;

        ctx.save();
        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.translate(-screenX * 2 - (512 * 0.8) + (offsetX * 2), 0);
        }

        const currentAnimations = this.isHazed ? this.hazedAnimations : this.normalAnimations;

        // Draw based on current state
        switch (this.currentState) {
            case this.states.IDLE:
                currentAnimations.idle.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                break;
                
            case this.states.CHASE:
                currentAnimations.run.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                break;
                
            case this.states.ATTACK:
                currentAnimations.attack.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                break;
                
            case this.states.SUMMON:
                currentAnimations.summon.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                // Add particle effects during summoning
                if (Math.random() < 0.5) {
                    ctx.fillStyle = this.isHazed ? "rgba(128, 0, 128, 0.5)" : "rgba(0, 0, 0, 0.5)";
                    for (let i = 0; i < 8; i++) {
                        const particleX = screenX + Math.random() * 120 - 60;
                        const particleY = this.y + Math.random() * 120 - 60;
                        ctx.beginPath();
                        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;
                
            case this.states.TRANSFORM:
                this.normalAnimations.transform.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                // Add particle effects during transformation
                if (Math.random() < 0.3) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                    for (let i = 0; i < 5; i++) {
                        const particleX = screenX + Math.random() * 100 - 50;
                        const particleY = this.y + Math.random() * 100 - 50;
                        ctx.beginPath();
                        ctx.arc(particleX, particleY, 5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;
                
            case this.states.DEATH:
                currentAnimations.death.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                break;
        }

        ctx.restore();

        if (PARAMS.DEBUG) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            ctx.fillRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
            
            // Draw state text above the boss
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.fillText(`State: ${this.currentState}`, screenX - 30, this.y - 60);
            ctx.fillText(`Hazed: ${this.isHazed}`, screenX - 30, this.y - 45);
        }
    }

    toggleDebug() {
        this.debug = !this.debug;
        console.log(`ShadowKing debug mode: ${this.debug ? 'ON' : 'OFF'}`);
    }
    
    forceTransform() {
        console.log("Forcing ShadowKing transformation!");
        if (!this.isHazed && !this.isTransforming) {
            this.setState(this.states.TRANSFORM);
        }
    }
    
    forceSpawnClone() {
        console.log("Forcing ShadowKing to spawn a clone!");
        if (this.isHazed && this.clones.length < this.maxClones) {
            this.setState(this.states.SUMMON);
        }
    }
}

// ShadowKing Clone class
class ShadowKingClone extends Enemy {
    constructor(gameEngine, scene, x, y, isHazed) {
        super(gameEngine, scene, x, y);
        
        // Override the default sprite sheet based on parent's form
        this.normalSheet = "./assets/sprites/shadowking/shadowking_normal.png";
        this.hazedSheet = "./assets/sprites/shadowking/shadowking_transformed.png";
        
        this.health = 1; // Clones have only 1 HP
        this.speed = 3; // Slightly faster than the boss
        this.attackTimer = 0;
        this.attackInterval = 3;
        this.attackRange = 50;
        this.isBoss = false;
        this.isActive = true;
        this.isHazed = isHazed; // Match the parent's form
        this.damage = isHazed ? 20 : 15; // Less damage than the real boss
        
        // Visual differences to distinguish from the real boss
        this.alpha = 0.7; // Slightly transparent
        
        // Basic animations for both normal and hazed forms (same as parent)
        this.normalAnimations = {
            idle: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 48,
                0,
                512,
                512,
                1,
                1,
                0.8,
                true
            ),
            run: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 58,
                0,
                512,
                512,
                8,
                0.1,
                0.8,
                true
            ),
            attack: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 6,
                0,
                512,
                512,
                4,
                0.1,
                0.8,
                false
            ),
            death: new Animator(
                ASSET_MANAGER.getAsset(this.normalSheet),
                512 * 30,
                0,
                512,
                512,
                10,
                0.2,
                0.8,
                false
            )
        };

        // Same animations but using hazed spritesheet
        this.hazedAnimations = {
            idle: new Animator(
                ASSET_MANAGER.getAsset(this.hazedSheet),
                512 * 48,
                0,
                512,
                512,
                1,
                1,
                0.8,
                true
            ),
            run: new Animator(
                ASSET_MANAGER.getAsset(this.hazedSheet),
                512 * 58,
                0,
                512,
                512,
                8,
                0.1,
                0.8,
                true
            ),
            attack: new Animator(
                ASSET_MANAGER.getAsset(this.hazedSheet),
                512 * 6,
                0,
                512,
                512,
                4,
                0.1,
                0.8,
                false
            ),
            death: new Animator(
                ASSET_MANAGER.getAsset(this.hazedSheet),
                512 * 30,
                0,
                512,
                512,
                10,
                0.2,
                0.8,
                false
            )
        };
        
        // Spawn effect
        this.spawnTime = 0;
        this.spawnDuration = 0.5; // Half a second spawn animation
        
        // Set up bounding box
        this.boundingbox = new BoundingBox(this.x, this.y, 80, 80);
    }
    
    update() {
        // Update spawn animation
        if (this.spawnTime < this.spawnDuration) {
            this.spawnTime += this.gameEngine.clockTick;
            return; // Don't do anything else during spawn animation
        }
        
        // Update bounding box
        this.boundingbox.x = this.x - this.gameEngine.camera.x;
        this.boundingbox.y = this.y;
        
        super.update();
        
        if (this.isDead) {
            const currentAnimations = this.isHazed ? this.hazedAnimations : this.normalAnimations;
            if (currentAnimations.death.isDone()) {
                this.removeFromWorld = true;
                return;
            }
            return; // Don't do anything else if dead
        }
        
        // Simple AI: Chase and attack player
        const player = this.scene.player;
        const distanceToPlayerX = Math.abs(this.x - player.x);
        const distanceToPlayerY = Math.abs(this.y - player.y);
        const distanceToPlayer = Math.sqrt(distanceToPlayerX ** 2 + distanceToPlayerY ** 2);
        
        // Movement logic
        if (distanceToPlayer > this.attackRange) {
            if (player.x > this.x) {
                this.x += this.speed;
                this.facingLeft = false;
            } else {
                this.x -= this.speed;
                this.facingLeft = true;
            }
            if (player.y > this.y) this.y += this.speed;
            else if (player.y < this.y) this.y -= this.speed;
            
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
        
        // Attack logic
        this.attackTimer += this.gameEngine.clockTick;
        if (this.attackTimer >= this.attackInterval && !this.attackCooldown && distanceToPlayer <= this.attackRange) {
            this.performAttack();
            this.attackTimer = 0;
        }
        
        const currentAnimations = this.isHazed ? this.hazedAnimations : this.normalAnimations;
        if (this.currentAttack && currentAnimations.attack.isDone()) {
            this.currentAttack = null;
            this.attackCooldown = false;
            currentAnimations.attack.elapsedTime = 0;
        }
    }
    
    takeDamage(amount) {
        super.takeDamage(amount);
        
        // Since clones have 1 HP, they die from any damage
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
            this.isMoving = false;
            this.currentAttack = null;
            
            // Reset death animation
            const currentAnimations = this.isHazed ? this.hazedAnimations : this.normalAnimations;
            currentAnimations.death.elapsedTime = 0;
            
            // Play death sound
            ASSET_MANAGER.playAsset("./assets/sound/enemy_death.mp3");
        }
    }
    
    performAttack() {
        if (this.attackCooldown) return;
        
        this.currentAttack = "attack";
        this.attackCooldown = true;
        
        // Add damage delay for animation timing
        setTimeout(() => {
            if (this.isCollidingWithEntity(this.scene.player)) {
                this.scene.player.takeDamage(this.damage);
            }
        }, 500);
        
        setTimeout(() => {
            this.attackCooldown = false;
        }, 1000);
    }
    
    draw(ctx) {
        if (this.spawnTime < this.spawnDuration) {
            // Draw spawn animation
            const spawnProgress = this.spawnTime / this.spawnDuration;
            const screenX = this.x - this.gameEngine.camera.x;
            
            ctx.save();
            ctx.globalAlpha = spawnProgress * this.alpha;
            
            // Draw a circle that grows
            ctx.fillStyle = this.isHazed ? "rgba(128, 0, 128, 0.5)" : "rgba(0, 0, 0, 0.5)";
            ctx.beginPath();
            ctx.arc(screenX, this.y, 50 * spawnProgress, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            return;
        }
        
        // Draw character with transparency
        const offsetX = 165;
        const offsetY = 210;
        const screenX = this.x - this.gameEngine.camera.x;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.translate(-screenX * 2 - (512 * 0.8) + (offsetX * 2), 0);
        }
        
        const currentAnimations = this.isHazed ? this.hazedAnimations : this.normalAnimations;
        
        if (this.isDead) {
            currentAnimations.death.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else if (this.currentAttack) {
            currentAnimations.attack.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else if (this.isMoving) {
            currentAnimations.run.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        } else {
            currentAnimations.idle.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
        }
        
        ctx.restore();
        
        // Draw a small health bar (1 HP)
        const healthBarWidth = 50;
        const healthBarHeight = 5;
        const xPosition = screenX - healthBarWidth / 2;
        const yPosition = this.y - 40;
        
        ctx.fillStyle = "red";
        ctx.fillRect(xPosition, yPosition, healthBarWidth, healthBarHeight);
        
        if (PARAMS.DEBUG) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            ctx.fillRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
            
            // Draw "CLONE" text above the clone
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.fillText("CLONE", screenX - 20, this.y - 50);
        }
    }
}
