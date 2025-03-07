class Sorcerer extends Enemy {
    constructor(gameEngine, scene, x, y) {
        super(gameEngine, scene, x, y);
        this.damage = 20;
        this.health = 200; // Boss has more health
        
        this.spriteSheet = "./assets/sprites/sorcerer.png";
        
        this.runAnimation = new Animator(
            ASSET_MANAGER.getAsset(this.spriteSheet),
            512 * 58, // 59th sprite
            0,
            512,
            512,
            8,
            0.1,
            .8,
            true
        );

        this.idleAnimation = new Animator(
            ASSET_MANAGER.getAsset(this.spriteSheet),
            512 * 48, // 49th sprite
            0,
            512,
            512,
            1,
            1,
            0.8,
            true
        );

        this.deathAnimation = new Animator(
            ASSET_MANAGER.getAsset(this.spriteSheet),
            512 * 30, // 31st sprite
            0,
            512,
            512,
            10,
            0.2,
            0.8,
            false
        );

        this.damageAnimation = new Animator(
            ASSET_MANAGER.getAsset(this.spriteSheet),
            512 * 41,
            0,
            512,
            512,
            4,
            0.1,
            0.8,
            false
        );

        // Attack Animations
        this.attackAnimations = {
            chop: new Animator(
                ASSET_MANAGER.getAsset(this.spriteSheet),
                512 * 6, // 7th sprite
                0,
                512,
                512,
                4,
                0.1,
                0.8,
                false
            ),
            kick: new Animator(
                ASSET_MANAGER.getAsset(this.spriteSheet),
                512 * 10, // 11th sprite
                0,
                512,
                512,
                5,
                0.1,
                0.8,
                false
            ),
            punch: new Animator(
                ASSET_MANAGER.getAsset(this.spriteSheet),
                512 * 17, // 18th sprite
                0,
                512,
                512,
                6,
                0.1,
                0.8,
                false
            )
        };
        
        // Jump animation for teleport
        this.jumpAnimation = new Animator(
            ASSET_MANAGER.getAsset(this.spriteSheet),
            512 * 53, 
            0,
            512,
            512,
            5,
            0.2,
            0.8,
            false
        );
        
        // Sorcerer specific properties
        this.isBoss = true;
        this.isActive = false;
        this.attackRange = 300;
        this.teleportDistance = 300;
        this.teleportCooldown = false;
        this.teleportTimer = 0;
        this.teleportInterval = 5;
        
        // Beam attack properties
        this.beamCooldown = false;
        this.beamTimer = 0;
        this.beamInterval = 3;
        this.isCasting = false;
        this.castTime = 1; 
        this.castTimer = 0;
        this.beams = [];
        
        // State machine properties
        this.states = {
            IDLE: 'idle',
            CHASE: 'chase',
            CAST_BEAM: 'cast_beam',
            CAST_BLACK_HOLE: 'cast_black_hole',
            TELEPORT: 'teleport',
            DEATH: 'death'
        };
        this.currentState = this.states.IDLE;
        

        this.hasAppeared = false;
        this.isVisible = true;
        
        this.lastPlayerDistance = null;
        
        // Black hole attack properties
        this.blackHoleCooldown = false;
        this.blackHoleTimer = 0;
        this.blackHoleInterval = 8;
        this.blackHoles = [];
    }
    
    update() {
        if (!this.isActive) return;
        
        // Handle first appearance with teleport effect
        if (!this.hasAppeared) {
            this.hasAppeared = true;
            this.setState(this.states.TELEPORT);
            
            // Make the sorcerer initially invisible until teleport completes
            this.isVisible = false;
            
            // Play teleport sound immediately for dramatic effect
            ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
            
            
            // Create initial teleport particles
            setTimeout(() => {
                this.isVisible = true;
            }, 500);
        }
        
        // Update bounding box
        this.boundingbox.x = this.x - this.gameEngine.camera.x;
        this.boundingbox.y = this.y;
        
        
        
        // If dead, just update death animation
        if (this.isDead) {
            if (this.currentState !== this.states.DEATH) {
                this.setState(this.states.DEATH);
            }
           
            return;
        }
        
        // Update state machine
        this.updateStateMachine();
        
        // Update beams
        this.updateBeams();
        
        // Update black holes
        this.updateBlackHoles();
        
        // Update timers
        this.teleportTimer += this.gameEngine.clockTick;
        this.beamTimer += this.gameEngine.clockTick;
        this.blackHoleTimer += this.gameEngine.clockTick;
        
        if (this.isCasting) {
            this.castTimer += this.gameEngine.clockTick;
            if (this.castTimer >= this.castTime) {
                this.fireBeam();
                this.isCasting = false;
                this.castTimer = 0;
            }
        }
        
        if (PARAMS.DEBUG) {
            console.log(`Current State: ${this.currentState}, IsCasting: ${this.isCasting}`);
        }
    }
    
    updateStateMachine() {
        const player = this.scene.player;
        const distanceToPlayerX = Math.abs(this.x - player.x);
        const distanceToPlayer = Math.sqrt(distanceToPlayerX ** 2 + Math.abs(this.y - player.y) ** 2);
        
        // Track if player is approaching
        const isPlayerApproaching = this.lastPlayerDistance && distanceToPlayer < this.lastPlayerDistance;
        this.lastPlayerDistance = distanceToPlayer;
        
        // State transitions
        switch (this.currentState) {
            case this.states.IDLE:
                // Transition to CAST_BEAM if beam is ready and player is in good range
                if (!this.beamCooldown && this.beamTimer >= this.beamInterval && distanceToPlayer > 200) {
                    this.setState(this.states.CAST_BEAM);
                }
                // Transition to CAST_BLACK_HOLE if black hole is ready
                else if (!this.blackHoleCooldown && this.blackHoleTimer >= this.blackHoleInterval && distanceToPlayer > 300) {
                    this.setState(this.states.CAST_BLACK_HOLE);
                }
                // Only teleport when player is actually approaching and getting close
                else if ((distanceToPlayer <= 450 && isPlayerApproaching) && !this.teleportCooldown && !this.isCasting) {
                    this.setState(this.states.TELEPORT);
                }
                // Occasional random teleport only when player is relatively close
                else if (distanceToPlayer <= 300 && this.teleportTimer >= this.teleportInterval && Math.random() < 0.3 
                        && !this.teleportCooldown && !this.isCasting) {
                    this.setState(this.states.TELEPORT);
                }
                break;
                
            case this.states.CAST_BEAM:
                // Transition back to IDLE when casting is done
                if (!this.isCasting && this.attackAnimations.chop.isDone()) {
                    this.attackAnimations.chop.elapsedTime = 0;
                    this.setState(this.states.IDLE);
                }
                // Emergency teleport if player gets too close during casting - but only if approaching
                else if (distanceToPlayer <= 400 && isPlayerApproaching && !this.teleportCooldown && !this.isCasting) {
                    this.setState(this.states.TELEPORT);
                }
                break;
                
            case this.states.CAST_BLACK_HOLE:
                // Transition back to IDLE when casting is done
                if (!this.isCasting && this.attackAnimations.punch.isDone()) {
                    this.attackAnimations.punch.elapsedTime = 0;
                    this.setState(this.states.IDLE);
                }
                // Emergency teleport if player gets too close during casting - but only if approaching
                else if (distanceToPlayer <= 400 && isPlayerApproaching && !this.teleportCooldown && !this.isCasting) {
                    this.setState(this.states.TELEPORT);
                }
                break;
                
            case this.states.TELEPORT:
                // Transition back to IDLE when teleport is done
                if (this.jumpAnimation.isDone()) {
                    this.jumpAnimation.elapsedTime = 0;
                    this.setState(this.states.IDLE);
                }
                break;
                
            case this.states.DEATH:
                // Remove from world when death animation is done
                if (this.deathAnimation.isDone()) {
                    this.removeFromWorld = true;
                    // Remove all beams when boss dies
                    this.beams.forEach(beam => {
                        beam.removeFromWorld = true;
                    });
                }
                break;
        }
        
        // State behaviors
        switch (this.currentState) {
            case this.states.IDLE:
                this.isMoving = false;
                break;
                
            case this.states.CAST_BEAM:
                if (!this.isCasting) {
                    this.startCasting();
                }
                break;
                
            case this.states.CAST_BLACK_HOLE:
                if (!this.isCasting) {
                    this.startCastingBlackHole();
                }
                break;
                
            case this.states.TELEPORT:
                if (!this.teleportCooldown) {
                    this.performTeleport();
                }
                break;
                
            case this.states.DEATH:
                this.isMoving = false;
                break;
        }
    }
    
    setState(newState) {
        // Don't change state if dead
        if (this.isDead && newState !== this.states.DEATH) {
            return;
        }
        
        // Reset animation states when changing states
        if (this.currentState !== newState) {
            if (this.debug) {
                console.log(`State change: ${this.currentState} -> ${newState}`);
            }
            
            this.currentState = newState;
            
            // Reset specific animations when entering states
            switch (newState) {
                case this.states.CAST_BEAM:
                    this.attackAnimations.chop.elapsedTime = 0;
                    break;
                case this.states.CAST_BLACK_HOLE:
                    this.attackAnimations.punch.elapsedTime = 0;
                    break;
                case this.states.TELEPORT:
                    this.jumpAnimation.elapsedTime = 0;
                    break;
                case this.states.DEATH:
                    this.deathAnimation.elapsedTime = 0;
                    break;
            }
        }
    }
    
    startCasting() {
        this.isCasting = true;
        this.castTimer = 0;
        this.isMoving = false;
        
        // Reset the chop animation when starting to cast
        this.attackAnimations.chop.elapsedTime = 0;
        
        // Play casting sound
        ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
       
    }
    
    startCastingBlackHole() {
        this.isCasting = true;
        this.castTimer = 0;
        this.isMoving = false;
        
        // Reset the punch animation when starting to cast
        this.attackAnimations.punch.elapsedTime = 0;
        
        // Play casting sound
        ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
        
        
        // Schedule the actual black hole creation
        setTimeout(() => {
            this.createBlackHole();
            this.isCasting = false;
        }, this.castTime * 1000);
    }
    
    fireBeam() {
        const player = this.scene.player;
        
        // Get combat zone boundaries
        let minX = 0;
        let maxX = 10000;
        let minY = 0;
        let maxY = PARAMS.canvasHeight;
        
        // Check if we're in a combat zone in the level manager
        if (this.scene.levelManager && this.scene.levelManager.currentCombatZone) {
            const zone = this.scene.levelManager.currentCombatZone;
            minX = zone.startX;
            maxX = zone.endX;
        }
        
        // Create a beam entity that spans the entire height at player's X position
        const beam = new SorcererBeam(
            this.gameEngine,
            this.scene,
            this.x,
            this.y - 30, 
            player.x,
            player.y,
            minY,
            maxY
        );
        
        // Add the beam to the game and track it
        this.gameEngine.addEntity(beam);
        this.beams.push(beam);
        
        // Reset beam timer and set cooldown
        this.beamTimer = 0;
        this.beamCooldown = true;
        
        // Play beam sound
        ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
        
        
        // Remove cooldown after delay
        setTimeout(() => {
            this.beamCooldown = false;
        }, 2000);
    }
    
    performTeleport() {
        this.teleportCooldown = true;
        this.teleportTimer = 0;
        
        // Reset jump animation elapsed time to ensure it plays from the beginning
        this.jumpAnimation.elapsedTime = 0;
        
        // Play teleport sound
        ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
        
        
        // Schedule the actual teleport
        setTimeout(() => {
            const player = this.scene.player;
            
            // Find the combat zone boundaries if we're in one
            let minX = 0;
            let maxX = 10000;
            
            // Check if we're in a combat zone in the level manager
            if (this.scene.levelManager && this.scene.levelManager.currentCombatZone) {
                const zone = this.scene.levelManager.currentCombatZone;
                minX = zone.startX + 100; // Stay 100px away from left boundary
                maxX = zone.endX - 100;   // Stay 100px away from right boundary
            }
            
            // Define vertical boundaries for teleportation - restricted to specific range
            const minY = 5 * PARAMS.CELL_SIZE;  // 5 cells from top
            const maxY = 9 * PARAMS.CELL_SIZE; // 9 cells from top
            
            // Determine teleportation strategy based on random choice
            const teleportStrategy = Math.random();
            let newX, newY;
            
            // Minimum distance to keep from player (increased for more distance)
            const minDistanceFromPlayer = 350;  
            
            if (teleportStrategy < 0.3) {
                // Strategy 1 (30% chance): Teleport to a completely random position within the combat zone
                // But ensure we're far enough from the player
                let validPosition = false;
                let attempts = 0;
                
                while (!validPosition && attempts < 10) {
                    newX = minX + Math.random() * (maxX - minX);
                    newY = minY + Math.random() * (maxY - minY);
                    
                    // Check if this position is far enough from player
                    const distToPlayer = Math.sqrt(
                        Math.pow(newX - player.x, 2) + 
                        Math.pow(newY - player.y, 2)
                    );
                    
                    if (distToPlayer >= minDistanceFromPlayer) {
                        validPosition = true;
                    }
                    attempts++;
                }
                
                // If we couldn't find a valid position after attempts, just use the last one
                if (!validPosition) {
                    // Force minimum distance in x direction
                    if (Math.abs(newX - player.x) < minDistanceFromPlayer) {
                        newX = player.x + (Math.random() < 0.5 ? -1 : 1) * minDistanceFromPlayer;
                    }
                }
            } 
            else if (teleportStrategy < 0.6) {
                // Strategy 2 (30% chance): Teleport to opposite side of player
                const distanceToLeftBoundary = player.x - minX;
                const distanceToRightBoundary = maxX - player.x;
                
                if (distanceToLeftBoundary > distanceToRightBoundary) {
                    // More space on the left, teleport there
                    // Ensure we're at least minDistanceFromPlayer away
                    newX = Math.max(minX, player.x - (minDistanceFromPlayer + Math.random() * 150));
                } else {
                    // More space on the right, teleport there
                    // Ensure we're at least minDistanceFromPlayer away
                    newX = Math.min(maxX, player.x + (minDistanceFromPlayer + Math.random() * 150));
                }
                
                // Random Y position within allowed range
                newY = minY + Math.random() * (maxY - minY);
            }
            else if (teleportStrategy < 0.8) {
                // Strategy 3 (20% chance): Teleport to a position far from player
                const farDistance = minDistanceFromPlayer + 100 + Math.random() * 200;
                
                // Randomly choose left or right of player
                if (Math.random() < 0.5) {
                    newX = Math.max(minX, player.x - farDistance);
                } else {
                    newX = Math.min(maxX, player.x + farDistance);
                }
                
                // Random Y position within allowed range
                newY = minY + Math.random() * (maxY - minY);
            }
            else {
                // Strategy 4 (20% chance): Teleport to far edge of combat zone
                if (Math.random() < 0.5) {
                    // Left edge with some randomness
                    newX = minX + 100 + Math.random() * 150;
                } else {
                    // Right edge with some randomness
                    newX = maxX - 100 - Math.random() * 150;
                }
                
                // Random Y position within allowed range
                newY = minY + Math.random() * (maxY - minY);
            }
            
            // Final boundary checks to ensure we're within the combat zone
            newX = Math.max(minX, Math.min(newX, maxX));
            newY = Math.max(minY, Math.min(newY, maxY));
            
            // Apply the teleport
            this.x = newX;
            this.y = newY;
            
            // Update facing direction based on player position
            this.facingLeft = player.x < this.x;
            
            // Update bounding box to match new position
            this.boundingbox.y = this.y;
            
            // Add some randomness to the teleport cooldown
            const cooldownVariation = 0.7 + Math.random() * 0.6; // 70% to 130% of base cooldown
            setTimeout(() => {
                this.teleportCooldown = false;
            }, this.teleportInterval * 300 * cooldownVariation);
            
        }, 500); // Teleport after animation starts
    }
    
    createBlackHole() {
        const player = this.scene.player;
        
        // Create a black hole entity near the sorcerer that will follow the player
        const blackHole = new SorcererBlackHole(
            this.gameEngine,
            this.scene,
            this.x,
            this.y - 30 // Adjust to appear from sorcerer's hands
        );
        
        // Add the black hole to the game and track it
        this.gameEngine.addEntity(blackHole);
        this.blackHoles.push(blackHole);
        
        // Reset black hole timer and set cooldown
        this.blackHoleTimer = 0;
        this.blackHoleCooldown = true;
        
        // Play black hole sound
        ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
        
        
        // Remove cooldown after delay
        setTimeout(() => {
            this.blackHoleCooldown = false;
        }, 5000);
    }
    
    updateBeams() {
        // Remove destroyed beams from the tracking array
        this.beams = this.beams.filter(beam => !beam.removeFromWorld);
    }
    
    updateBlackHoles() {
        // Remove destroyed black holes from the tracking array
        this.blackHoles = this.blackHoles.filter(blackHole => !blackHole.removeFromWorld);
    }
    
    takeDamage(amount) {
        super.takeDamage(amount);
        
        // Check if dead
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
            this.setState(this.states.DEATH);
            return;
        }
        
        // Always teleport when taking damage unless on cooldown or casting
        if (!this.teleportCooldown && !this.isCasting) {
            this.setState(this.states.TELEPORT);
        }
    }
    
    draw(ctx) {
        if (!this.isActive || !this.isVisible) return;
        
        // Draw health bar for boss
        const healthBarWidth = 300;
        const healthBarHeight = 70;
        const healthPercentage = this.health / 200;
        const xPosition = 950;
        const yPosition = 30;
        
        const img = new Image();
        img.src = './assets/sprites/healthbar.png';
        
        ctx.fillStyle = "blue";
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
        
        // Draw based on current state
        switch (this.currentState) {
            case this.states.IDLE:
                this.idleAnimation.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                break;
                
            case this.states.CAST_BEAM:
                // Use chop animation for casting
                this.attackAnimations.chop.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                
                // Add particle effects during casting
                if (this.isCasting && Math.random() < 0.5) {
                    ctx.fillStyle = "rgba(255, 255, 0, 0.5)"; // Yellow particles for light beam
                    for (let i = 0; i < 8; i++) {
                        const particleX = screenX + Math.random() * 120 - 60;
                        const particleY = this.y - 50 + Math.random() * 60 - 30;
                        ctx.beginPath();
                        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;
                
            case this.states.CAST_BLACK_HOLE:
                // Use punch animation for black hole casting
                this.attackAnimations.punch.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                
                // Add particle effects during casting
                if (this.isCasting && Math.random() < 0.5) {
                    ctx.fillStyle = "rgba(128, 0, 128, 0.5)"; // Purple particles for black hole
                    for (let i = 0; i < 8; i++) {
                        const particleX = screenX + Math.random() * 120 - 60;
                        const particleY = this.y - 50 + Math.random() * 60 - 30;
                        ctx.beginPath();
                        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;
                
            case this.states.TELEPORT:
                // Use jump animation for teleporting
                this.jumpAnimation.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
                
                // Add particle effects during teleport
                if (Math.random() < 0.3) {
                    ctx.fillStyle = "rgba(0, 255, 255, 0.5)"; // Cyan particles for teleport
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
                this.deathAnimation.drawFrame(this.gameEngine.clockTick, ctx, screenX - offsetX, this.y - offsetY);
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
            ctx.fillText(`Casting: ${this.isCasting}`, screenX - 30, this.y - 45);
        }
    }
    
    toggleDebug() {
        this.debug = !this.debug;
        console.log(`Sorcerer debug mode: ${this.debug ? 'ON' : 'OFF'}`);
    }
}

// Sorcerer Beam class
class SorcererBeam {
    constructor(gameEngine, scene, startX, startY, targetX, targetY, minBoundaryY, maxBoundaryY) {
        this.gameEngine = gameEngine;
        this.scene = scene;
        this.x = targetX;
        this.y = startY;
        this.targetX = targetX;
        
        // Store combat zone boundaries
        this.minBoundaryY = minBoundaryY;
        this.maxBoundaryY = maxBoundaryY;
        
        // Calculate beam dimensions to span the entire combat zone height
        this.width = 60; // Beam width
        this.height = this.maxBoundaryY - this.minBoundaryY; // Full height of combat zone
        
        // Create a bounding box for collision
        this.updateBoundingBox();
        
        this.damage = 30;
        this.lifespan = 2; 
        this.timer = 0;
        this.active = false; 
        this.warningTime = 1; 
        
        // Visual properties
        this.warningColor = "rgba(255, 255, 0, 0.3)"; 
        this.activeColor = "rgba(255, 255, 255, 0.8)"; 
        this.pulseRate = 5; 
    }
    
    updateBoundingBox() {
        // Create a bounding box that spans the entire beam height
        this.boundingbox = new BoundingBox(
            this.x - this.width/2 - this.gameEngine.camera.x,
            this.minBoundaryY,
            this.width,
            this.height
        );
    }
    
    update() {
        this.timer += this.gameEngine.clockTick;
        
        // Update bounding box position (follows camera)
        this.updateBoundingBox();
        
        // Activate beam after warning period
        if (!this.active && this.timer >= this.warningTime) {
            this.active = true;
            // Play beam activation sound
            ASSET_MANAGER.playAsset("./assets/sound/transformation.mp3");
           
        }
        
        // Check for collision with player if beam is active
        if (this.active) {
            const player = this.scene.player;
            if (this.isCollidingWithEntity(player)) {
                player.takeDamage(this.damage);
            }
        }
        
        // Remove beam after lifespan
        if (this.timer >= this.lifespan) {
            this.removeFromWorld = true;
        }
    }
    
    draw(ctx) {
        // Calculate screen position
        const screenX = this.x - this.gameEngine.camera.x;
        
        ctx.save();
        
        if (!this.active) {
            // Draw warning indicator
            const pulseIntensity = 0.3 + 0.2 * Math.sin(this.timer * this.pulseRate * Math.PI);
            ctx.fillStyle = `rgba(255, 255, 0, ${pulseIntensity})`;
            ctx.fillRect(screenX - this.width/2, this.minBoundaryY, this.width, this.height);
            
            // Add warning particles along the beam path
            ctx.fillStyle = `rgba(255, 255, 0, ${pulseIntensity * 1.5})`;
            for (let i = 0; i < this.height / 30; i++) {
                const particleX = screenX - this.width/2 + Math.random() * this.width;
                const particleY = this.minBoundaryY + Math.random() * this.height;
                const particleSize = 2 + Math.random() * 4;
                
                ctx.beginPath();
                ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Draw active beam
            // Beam core
            ctx.fillStyle = this.activeColor;
            ctx.fillRect(screenX - this.width/2, this.minBoundaryY, this.width, this.height);
            
            // Beam glow effect
            const gradient = ctx.createLinearGradient(
                screenX - this.width, this.minBoundaryY,
                screenX + this.width, this.minBoundaryY
            );
            gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.3)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            
            ctx.fillStyle = gradient;
            ctx.fillRect(screenX - this.width, this.minBoundaryY, this.width*2, this.height);
            
            // Add particle effects along the beam
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            for (let i = 0; i < this.height / 20; i++) {
                const particleX = screenX - this.width/2 + Math.random() * this.width;
                const particleY = this.minBoundaryY + Math.random() * this.height;
                const particleSize = 2 + Math.random() * 3;
                
                ctx.beginPath();
                ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
        
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
        }
    }
    
    isCollidingWithEntity(entity) {
        return (
            this.boundingbox.x < entity.boundingbox.x + entity.boundingbox.width &&
            this.boundingbox.x + this.boundingbox.width > entity.boundingbox.x &&
            this.boundingbox.y < entity.boundingbox.y + entity.boundingbox.height &&
            this.boundingbox.y + this.boundingbox.height > entity.boundingbox.y
        );
    }
}

// Black Hole class for the Sorcerer's black hole spell
class SorcererBlackHole {
    constructor(gameEngine, scene, startX, startY) {
        this.gameEngine = gameEngine;
        this.scene = scene;
        this.x = startX;
        this.y = startY;
        
        // Black hole properties
        this.radius = 30;
        this.damage = 15; // Damage per second
        this.speed = 50; // Pixels per second
        this.lifespan = 10; // Seconds the black hole lasts
        this.timer = 0;
        this.damageInterval = 0.5; // Apply damage every half second
        this.damageTimer = 0;
        
        // Create a bounding box for collision
        this.boundingbox = new BoundingBox(
            this.x - this.radius - this.gameEngine.camera.x,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
        
        // Visual properties
        this.rotation = 0;
        this.rotationSpeed = 2; // Radians per second
        this.pulseRate = 3; // Rate of pulse effect
        this.particleCount = 20; // Number of particles in the effect
    }
    
    update() {
        this.timer += this.gameEngine.clockTick;
        this.damageTimer += this.gameEngine.clockTick;
        this.rotation += this.rotationSpeed * this.gameEngine.clockTick;
        
        // Follow player slowly
        const player = this.scene.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) { // Only move if not very close to player
            const moveX = (dx / distance) * this.speed * this.gameEngine.clockTick;
            const moveY = (dy / distance) * this.speed * this.gameEngine.clockTick;
            
            this.x += moveX;
            this.y += moveY;
        }
        
        // Update bounding box position
        this.boundingbox.x = this.x - this.radius - this.gameEngine.camera.x;
        this.boundingbox.y = this.y - this.radius;
        
        // Check for collision with player
        if (this.isCollidingWithEntity(player) && this.damageTimer >= this.damageInterval) {
            player.takeDamage(this.damage);
            this.damageTimer = 0;
        }
        
        // Remove black hole after lifespan
        if (this.timer >= this.lifespan) {
            this.removeFromWorld = true;
        }
    }
    
    draw(ctx) {
        // Calculate screen position
        const screenX = this.x - this.gameEngine.camera.x;
        
        ctx.save();
        
        // Create a radial gradient for the black hole
        const gradient = ctx.createRadialGradient(
            screenX, this.y, 0,
            screenX, this.y, this.radius
        );
        
        // Pulse effect
        const pulseIntensity = 0.7 + 0.3 * Math.sin(this.timer * this.pulseRate);
        
        gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
        gradient.addColorStop(0.6, `rgba(128, 0, 128, ${pulseIntensity})`); // Purple glow
        gradient.addColorStop(1, "rgba(128, 0, 128, 0)");
        
        // Draw the main black hole
        ctx.beginPath();
        ctx.arc(screenX, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw swirling particles
        for (let i = 0; i < this.particleCount; i++) {
            const angle = (i / this.particleCount) * Math.PI * 2 + this.rotation;
            const distance = (this.radius * 0.3) + (this.radius * 0.7) * (i % 3) / 3;
            
            const particleX = screenX + Math.cos(angle) * distance;
            const particleY = this.y + Math.sin(angle) * distance;
            const particleSize = 2 + Math.random() * 2;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fill();
        }
        
        ctx.restore();
        
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
        }
    }
    
    isCollidingWithEntity(entity) {
        return (
            this.boundingbox.x < entity.boundingbox.x + entity.boundingbox.width &&
            this.boundingbox.x + this.boundingbox.width > entity.boundingbox.x &&
            this.boundingbox.y < entity.boundingbox.y + entity.boundingbox.height &&
            this.boundingbox.y + this.boundingbox.height > entity.boundingbox.y
        );
    }
}

