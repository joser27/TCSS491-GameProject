class LevelManager {
    constructor(gameEngine, sceneManager, player, camera, playingScene) {
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;
        this.camera = camera;
        this.player = player;
        this.playingScene = playingScene;
        
        // Grid and screen setup
        this.GRID_COLS = Math.floor(PARAMS.canvasWidth / PARAMS.CELL_SIZE);
        this.GRID_ROWS = Math.floor(PARAMS.canvasHeight / PARAMS.CELL_SIZE);
        this.screenWidth = PARAMS.canvasWidth;
        
        // Initialize background
        this.background = new Background(this.gameEngine, this, this.player);
        this.gameEngine.addEntity(this.background);
        
        // Combat zone tracking
        this.combatZones = [];
        this.currentCombatZone = null;
        this.cameraLeftBound = 0;
        this.cameraRightBound = null;

        // Music 
        ASSET_MANAGER.pauseBackgroundMusic();
        ASSET_MANAGER.playAsset("./assets/music/music1.mp3");

        // Initialize current level
        this.currentLevel = this.sceneManager.gameState.currentLevel;
        this.levelConfigs = {
            1: {
                zones: [
                    {
                        triggerX: 24*PARAMS.CELL_SIZE,
                        startX: 14*PARAMS.CELL_SIZE,
                        endX: 34*PARAMS.CELL_SIZE,
                        enemies: [
                            { 
                                type: 'Sorcerer', 
                                x: 34*PARAMS.CELL_SIZE, 
                                y: 7*PARAMS.CELL_SIZE,
                                spawnDelay: 0 // Ensure immediate spawn
                            }
                        ]
                    },
                    {
                        triggerX: 42*PARAMS.CELL_SIZE,
                        startX: 40*PARAMS.CELL_SIZE,
                        endX: 60*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BlueEnemy', x: 40*PARAMS.CELL_SIZE, y: 5*PARAMS.CELL_SIZE },
                            { type: 'RedEnemy', x: 52*PARAMS.CELL_SIZE, y: 10*PARAMS.CELL_SIZE },
                            { type: 'BasicYellowEnemy', x: 60*PARAMS.CELL_SIZE, y: 6*PARAMS.CELL_SIZE },

                        ]
                    },
                    {
                        triggerX: 74*PARAMS.CELL_SIZE,
                        startX: 68*PARAMS.CELL_SIZE,
                        endX: 88*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BasicYellowEnemy', x: 73*PARAMS.CELL_SIZE, y: 4*PARAMS.CELL_SIZE },
                            { type: 'BasicYellowEnemy', x: 77*PARAMS.CELL_SIZE, y: 4*PARAMS.CELL_SIZE },
                            { type: 'BlueEnemy', x: 92*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE },
                            
                        ]
                    },
                    {
                        triggerX: 101*PARAMS.CELL_SIZE,
                        startX: 100*PARAMS.CELL_SIZE,
                        endX: 120*PARAMS.CELL_SIZE,
                        waves: [
                            {
                                enemies: [
                                    { type: 'BossEnemy', x: 108*PARAMS.CELL_SIZE, y: 4*PARAMS.CELL_SIZE, spawnDelay: 0 },
                                    { type: 'BasicYellowEnemy', x: 99*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE, spawnDelay: 5 },
                                    { type: 'BasicYellowEnemy', x: 121*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE, spawnDelay: 8 },
                                ]
                            }
                        ]
                    }
                ]
            },
            2: {
                zones: [
                    {
                        triggerX: 24*PARAMS.CELL_SIZE,
                        startX: 14*PARAMS.CELL_SIZE,
                        endX: 34*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BasicYellowEnemy', x: 34*PARAMS.CELL_SIZE, y: 7*PARAMS.CELL_SIZE },
                            { type: 'RedEnemy', x: 33*PARAMS.CELL_SIZE, y: 9*PARAMS.CELL_SIZE },
                        ]
                    },
                    {
                        triggerX: 42*PARAMS.CELL_SIZE,
                        startX: 40*PARAMS.CELL_SIZE,
                        endX: 60*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BlueEnemy', x: 40*PARAMS.CELL_SIZE, y: 5*PARAMS.CELL_SIZE },
                            { type: 'BlueEnemy', x: 52*PARAMS.CELL_SIZE, y: 10*PARAMS.CELL_SIZE },
                            { type: 'RedEnemy', x: 60*PARAMS.CELL_SIZE, y: 6*PARAMS.CELL_SIZE },
                        ]
                    },
                    {
                        triggerX: 74*PARAMS.CELL_SIZE,
                        startX: 68*PARAMS.CELL_SIZE,
                        endX: 88*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'RedEnemy', x: 73*PARAMS.CELL_SIZE, y: 4*PARAMS.CELL_SIZE },
                            { type: 'BlueEnemy', x: 77*PARAMS.CELL_SIZE, y: 4*PARAMS.CELL_SIZE },
                            { type: 'BasicYellowEnemy', x: 92*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE },
                        ]
                    },
                    {
                        triggerX: 101*PARAMS.CELL_SIZE,
                        startX: 100*PARAMS.CELL_SIZE,
                        endX: 120*PARAMS.CELL_SIZE,
                        waves: [
                            {
                                enemies: [
                                    { type: 'BossEnemy', x: 108*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE, spawnDelay: 0 },
                                    { type: 'RedEnemy', x: 99*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE, spawnDelay: 5 },
                                    { type: 'BlueEnemy', x: 121*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE, spawnDelay: 8 },
                                ]
                            }
                        ]
                    }
                ]
            },
            3: {
                zones: [
                    {
                        triggerX: 24*PARAMS.CELL_SIZE,
                        startX: 14*PARAMS.CELL_SIZE,
                        endX: 34*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BlueEnemy', x: 34*PARAMS.CELL_SIZE, y: 7*PARAMS.CELL_SIZE },
                            { type: 'BlueEnemy', x: 33*PARAMS.CELL_SIZE, y: 9*PARAMS.CELL_SIZE },
                            { type: 'RedEnemy', x: 32*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE },
                        ]
                    },
                    {
                        triggerX: 42*PARAMS.CELL_SIZE,
                        startX: 40*PARAMS.CELL_SIZE,
                        endX: 60*PARAMS.CELL_SIZE,
                        waves: [
                            {
                                enemies: [
                                    { type: 'RedEnemy', x: 40*PARAMS.CELL_SIZE, y: 6*PARAMS.CELL_SIZE, spawnDelay: 0 },
                                    { type: 'BlueEnemy', x: 52*PARAMS.CELL_SIZE, y: 10*PARAMS.CELL_SIZE, spawnDelay: 2 },
                                    { type: 'BasicYellowEnemy', x: 60*PARAMS.CELL_SIZE, y: 6*PARAMS.CELL_SIZE, spawnDelay: 4 },
                                ]
                            }
                        ]
                    },
                    {
                        triggerX: 74*PARAMS.CELL_SIZE,
                        startX: 68*PARAMS.CELL_SIZE,
                        endX: 88*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BossEnemy', x: 73*PARAMS.CELL_SIZE, y: 7*PARAMS.CELL_SIZE },
                            { type: 'RedEnemy', x: 77*PARAMS.CELL_SIZE, y: 7*PARAMS.CELL_SIZE },
                            { type: 'BlueEnemy', x: 92*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE },
                        ]
                    }
                ]
            },
            4: {
                zones: [
                    {
                        triggerX: 24*PARAMS.CELL_SIZE,
                        startX: 14*PARAMS.CELL_SIZE,
                        endX: 34*PARAMS.CELL_SIZE,
                        waves: [
                            {
                                enemies: [
                                    { type: 'RedEnemy', x: 34*PARAMS.CELL_SIZE, y: 7*PARAMS.CELL_SIZE, spawnDelay: 0 },
                                    { type: 'BlueEnemy', x: 33*PARAMS.CELL_SIZE, y: 9*PARAMS.CELL_SIZE, spawnDelay: 2 },
                                    { type: 'BasicYellowEnemy', x: 32*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE, spawnDelay: 4 },
                                ]
                            }
                        ]
                    },
                    {
                        triggerX: 42*PARAMS.CELL_SIZE,
                        startX: 40*PARAMS.CELL_SIZE,
                        endX: 60*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BlueEnemy', x: 40*PARAMS.CELL_SIZE, y: 5*PARAMS.CELL_SIZE },
                            { type: 'RedEnemy', x: 52*PARAMS.CELL_SIZE, y: 10*PARAMS.CELL_SIZE },
                            { type: 'BossEnemy', x: 60*PARAMS.CELL_SIZE, y: 6*PARAMS.CELL_SIZE },
                        ]
                    }
                ]
            }
        };

        

        this.zIndex = 5;
        this.initializeLevel(this.currentLevel);
        this.lastCombatCameraX = null;
        this.goIndicator = null; // Track the GoIndicator instance
    }

    initializeLevel(levelNumber) {
        console.log(`Initializing level ${levelNumber}`);
        this.combatZones = [];
        this.currentCombatZone = null;

        const levelConfig = this.levelConfigs[levelNumber];
        if (!levelConfig) return;

        levelConfig.zones.forEach(zoneConfig => {
            if (zoneConfig.waves) {
                // Handle wave-based enemy configuration
                const waves = zoneConfig.waves.map(wave => ({
                    enemies: this.createEnemies(wave.enemies)
                }));
                
                // No need to add enemies to game engine here anymore
                waves.forEach(wave => {
                    wave.enemies.forEach(enemyData => {
                        enemyData.enemy.isActive = false;
                    });
                });

                this.addCombatZone(zoneConfig.triggerX, zoneConfig.startX, zoneConfig.endX, waves);
            } else if (zoneConfig.enemies) {
                // Handle direct enemy configuration
                const enemies = this.createEnemies(zoneConfig.enemies);
                const waves = [{
                    enemies: enemies
                }];
                
                // No need to add enemies to game engine here anymore
                enemies.forEach(enemyData => {
                    enemyData.enemy.isActive = false;
                });

                this.addCombatZone(zoneConfig.triggerX, zoneConfig.startX, zoneConfig.endX, waves);
            }
        });
    }

    createEnemies(enemyConfigs) {
        const enemyTypes = {
            'BasicYellowEnemy': (x, y) => new Enemy(this.gameEngine, this.sceneManager.scene, x, y),
            'BossEnemy': (x, y) => new BossEnemy(this.gameEngine, this.sceneManager.scene, x, y),
            'BlueEnemy': (x, y) => new BlueEnemy(this.gameEngine, this.sceneManager.scene, x, y),
            'RedEnemy': (x, y) => new RedEnemy(this.gameEngine, this.sceneManager.scene, x, y),
            'RangedEnemy': (x, y) => new RangedEnemy(this.gameEngine, x, y),
            'ShadowKing': (x, y) => {
                const shadowKing = new ShadowKing(this.gameEngine, this.sceneManager.scene, x, y);
                // Initialize the ShadowKing with debug mode off
                shadowKing.debug = false;
                return shadowKing;
            },
            'Sorcerer': (x, y) => new Sorcerer(this.gameEngine, this.sceneManager.scene, x, y)
        };

        return enemyConfigs.map(config => {
            const enemy = enemyTypes[config.type]?.(config.x, config.y) || 
                         new Enemy(this.gameEngine, this.sceneManager.scene, config.x, config.y);
            
            enemy.isActive = false;
            // Don't add to GameEngine here anymore, PlayingScene will handle that
            return {
                enemy: enemy,
                spawnDelay: config.spawnDelay || 0
            };
        });
    }

    loadLevel(levelNumber) {
        this.combatZones = [];
        this.currentCombatZone = null;
        this.currentLevel = levelNumber;
        this.initializeLevel(levelNumber);
    }

    addCombatZone(triggerX, startX, endX, waves) {
        this.combatZones.push({
            triggerX,
            startX,
            endX,
            waves: waves.map(wave => ({
                enemies: wave.enemies,
                isActive: false,
                isCompleted: false
            })),
            currentWave: 0,
            isActive: false,
            isCompleted: false
        });
    }

    update() {
        const playerX = this.player.x;
        
        if (this.goIndicator && this.goIndicator.removeFromWorld) {
            this.goIndicator = null;
        }
        
        for (let zone of this.combatZones) {
            if (zone.isCompleted) continue;
            
            if (!zone.isActive && playerX >= zone.triggerX) {
                this.activateZone(zone);
            }
            
            if (zone.isActive) {
                // Lock player within zone boundaries
                const minX = Math.max(zone.startX, this.camera.x);
                this.player.x = Math.max(minX, Math.min(this.player.x, zone.endX));

                this.updateCamera();

                // Update current wave's delayed spawns
                const currentWave = zone.waves[zone.currentWave];
                if (currentWave && currentWave.isActive) {
                    currentWave.elapsedTime += this.gameEngine.clockTick;
                    
                    currentWave.enemies.forEach(enemyData => {
                        if (!enemyData.enemy.isActive && !enemyData.enemy.isDead && 
                            enemyData.spawnDelay <= currentWave.elapsedTime) {
                            enemyData.enemy.isActive = true;
                            this.playingScene.addEnemy(enemyData.enemy);  // Only add through PlayingScene
                        }
                    });
                }

                // Check if wave is cleared
                if (this.isWaveCleared(currentWave)) {
                    zone.currentWave++;
                    if (zone.currentWave < zone.waves.length) {
                        this.activateWave(zone, zone.currentWave);
                    }
                }

                if (this.isZoneCleared(zone)) {
                    this.completeZone(zone);
                }
                return;
            }
        }

        this.updateCamera();
    }

    activateZone(zone) {
        zone.isActive = true;
        this.currentCombatZone = zone;
        
        // Activate only the first wave
        this.activateWave(zone, 0);
    }

    activateWave(zone, waveIndex) {
        if (waveIndex >= zone.waves.length) return;
        
        const wave = zone.waves[waveIndex];
        wave.isActive = true;
        wave.elapsedTime = 0;
        
        // Add enemies to GameEngine through PlayingScene when activating them
        wave.enemies.forEach(enemyData => {
            if (enemyData.spawnDelay === 0) {
                enemyData.enemy.isActive = true;
                
                // Special handling for ShadowKing to ensure it's properly initialized
                if (enemyData.enemy instanceof ShadowKing) {
                    console.log("Activating ShadowKing boss!");
                    // Set initial state to IDLE or CHASE based on player distance
                    const player = this.playingScene.player;
                    const distanceToPlayer = Math.sqrt(
                        Math.pow(enemyData.enemy.x - player.x, 2) + 
                        Math.pow(enemyData.enemy.y - player.y, 2)
                    );
                    
                    if (distanceToPlayer > enemyData.enemy.attackRange) {
                        enemyData.enemy.setState(enemyData.enemy.states.CHASE);
                    } else {
                        enemyData.enemy.setState(enemyData.enemy.states.IDLE);
                    }
                }
                
                this.playingScene.addEnemy(enemyData.enemy);
            }
        });
    }

    isWaveCleared(wave) {
        return wave.enemies.every(enemyData => enemyData.enemy.isDead);
    }

    isZoneCleared(zone) {
        return zone.waves.every(wave => {
            // A wave must be active to be considered for clearing
            return wave.isActive && this.isWaveCleared(wave);
        });
    }

    completeZone(zone) {
        zone.isCompleted = true;
        this.currentCombatZone = null;
        this.lastCombatCameraX = this.camera.x;

        const allZonesCompleted = this.combatZones.every(zone => zone.isCompleted);
        
        if (allZonesCompleted) {
            // Disable player movement
            this.player.isLevelComplete = true;
            
            // Create and add the overlay
            const statsOverlay = new LevelCompleteOverlay(this.gameEngine, this, {
                coins: this.sceneManager.gameState.playerStats.coins,
                health: this.player.health,
                onComplete: () => {
                    this.sceneManager.nextLevel();
                    this.player.isLevelComplete = false;
                }
            });
            
            statsOverlay.zIndex = 50;
            this.gameEngine.addEntity(statsOverlay);
        } else {
            // Add the GoIndicator only if there isn't one already
            if (!this.goIndicator) {
                const arrowX = zone.endX - this.camera.x - 100; // Offset from zone end
                const arrowY = PARAMS.canvasHeight / 2;
                this.goIndicator = new GoIndicator(arrowX, arrowY, this.player, zone.endX, this.gameEngine.timer);
                this.gameEngine.addEntity(this.goIndicator);
            }
        }
    }

    updateCamera() {
        // centered on player
        let targetX = Math.round(this.player.x - PARAMS.canvasWidth / 2);
        targetX = Math.max(0, targetX); // Prevent going before start of level
        
        // If in combat zone, prevent camera from moving backwards and going past zone end
        if (this.currentCombatZone) {
            const maxX = this.currentCombatZone.endX - PARAMS.canvasWidth;
            targetX = Math.max(this.camera.x, Math.min(targetX, maxX));
        } 
        // If we have a last combat camera position, don't let camera move back past it
        else if (this.lastCombatCameraX !== null) {
            if (targetX > this.lastCombatCameraX) {
                this.lastCombatCameraX = null;  // Clear the stored position once we move past it
            } else {
                targetX = this.lastCombatCameraX;
            }
        }
        
        this.camera.x = targetX;
    }

    draw(ctx) {
        if (PARAMS.DEBUG) {
            this.drawGrid(ctx);
            this.drawCombatZones(ctx);
        }

        // Draw level complete stats if available
        if (this.levelCompleteStats) {
            // Create semi-transparent background
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Draw stats
            ctx.fillStyle = "white";
            ctx.font = "48px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Level Complete!", ctx.canvas.width / 2, 150);

            ctx.font = "36px Arial";
            ctx.fillText(`Grade: ${this.levelCompleteStats.grade}`, ctx.canvas.width / 2, 250);
            ctx.font = "24px Arial";
            ctx.fillText(`Coins Earned: ${this.levelCompleteStats.coinsEarned}`, ctx.canvas.width / 2, 300);
            ctx.fillText(`Health Remaining: ${this.levelCompleteStats.health}%`, ctx.canvas.width / 2, 350);
            
            // Show countdown
            const timeLeft = Math.ceil((10000 - (Date.now() - this.levelCompleteStats.startTime)) / 1000);
            ctx.fillText(`Next Level in: ${timeLeft}`, ctx.canvas.width / 2, 450);
        }

    }

    drawGrid(ctx) {
        const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;
        
        // Get player's current cell
        const playerCellX = Math.floor(this.player.x / PARAMS.CELL_SIZE);
        const playerCellY = Math.floor(this.player.y / PARAMS.CELL_SIZE);
        
        // Draw the highlighted cell
        ctx.fillStyle = rgba(0, 255, 0, 0.3); // semi-transparent green
        const cellX = playerCellX * PARAMS.CELL_SIZE - this.camera.x;
        const cellY = playerCellY * PARAMS.CELL_SIZE;
        ctx.fillRect(cellX, cellY, PARAMS.CELL_SIZE, PARAMS.CELL_SIZE);
        
        // Grid drawing setup
        ctx.strokeStyle = rgba(100, 100, 100, 1);
        ctx.lineWidth = 2;
        
        // Calculate visible columns
        const startCol = Math.floor(this.camera.x / PARAMS.CELL_SIZE);
        const endCol = startCol + this.GRID_COLS + 1;
        
        // Draw vertical lines
        for (let col = startCol; col <= endCol; col++) {
            const x = col * PARAMS.CELL_SIZE - this.camera.x;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, PARAMS.canvasHeight);
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let row = 0; row < this.GRID_ROWS; row++) {
            const y = row * PARAMS.CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(PARAMS.canvasWidth, y);
            ctx.stroke();
        }
        
        // Draw coordinates
        ctx.fillStyle = rgba(0, 0, 0, 1);
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let row = 0; row < this.GRID_ROWS; row++) {
            for (let col = startCol; col < endCol; col++) {
                const x = col * PARAMS.CELL_SIZE - this.camera.x + PARAMS.CELL_SIZE / 2;
                const y = row * PARAMS.CELL_SIZE + PARAMS.CELL_SIZE / 2;
                
                if (x >= 0 && x <= PARAMS.canvasWidth) {
                    ctx.fillText(`${col},${row}`, x, y);
                }
            }
        }
    }

    drawCombatZones(ctx) {
        this.combatZones.forEach(zone => {
            // Draw combat area boundaries in red
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 4;
            
            // Draw start line
            const startScreenX = zone.startX - this.camera.x;
            ctx.beginPath();
            ctx.moveTo(startScreenX, 0);
            ctx.lineTo(startScreenX, PARAMS.canvasHeight);
            ctx.stroke();
            
            // Draw end line
            const endScreenX = zone.endX - this.camera.x;
            ctx.beginPath();
            ctx.moveTo(endScreenX, 0);
            ctx.lineTo(endScreenX, PARAMS.canvasHeight);
            ctx.stroke();
            
            // Draw trigger line in green
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            const triggerScreenX = zone.triggerX - this.camera.x;
            ctx.beginPath();
            ctx.moveTo(triggerScreenX, 0);
            ctx.lineTo(triggerScreenX, PARAMS.canvasHeight);
            ctx.stroke();
            
            // Draw zone status
            ctx.fillStyle = zone.isCompleted ? 'green' : 'red';
            ctx.font = '20px Arial';
            ctx.fillText(
                zone.isCompleted ? 'CLEARED' : 'COMBAT ZONE',
                startScreenX + 10,
                30
            );
        });
    }
}