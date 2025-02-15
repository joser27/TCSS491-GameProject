class LevelManager {
    constructor(gameEngine, sceneManager, player, camera) {
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;
        this.camera = camera;
        this.player = player;
        
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
                        startX: 10*PARAMS.CELL_SIZE,
                        endX: 30*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BasicYellowEnemy', x: 23*PARAMS.CELL_SIZE, y: 7*PARAMS.CELL_SIZE },
                        ]
                    },
                    {
                        startX: 35* PARAMS.CELL_SIZE,
                        endX: 60* PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BossEnemy', x: 45 * PARAMS.CELL_SIZE, y: 7 * PARAMS.CELL_SIZE }
                        ]
                    }
                    // {
                    //     startX: 35*PARAMS.CELL_SIZE,
                    //     endX: 55*PARAMS.CELL_SIZE,
                    //     enemies: [
                    //         { type: 'BasicYellowEnemy', x: 50*PARAMS.CELL_SIZE, y: 7*PARAMS.CELL_SIZE },
                    //     ]
                    // }
                    // Add more zones for level 1. Boss zone at the end
                ]
            },
            2: {
                zones: [
                    {
                        startX: 15*PARAMS.CELL_SIZE,
                        endX: 35*PARAMS.CELL_SIZE,
                        enemies: [
                            { type: 'BasicYellowEnemy', x: 10*PARAMS.CELL_SIZE, y: 6*PARAMS.CELL_SIZE },
                            { type: 'BasicYellowEnemy', x: 26*PARAMS.CELL_SIZE, y: 7*PARAMS.CELL_SIZE },
                            { type: 'BasicYellowEnemy', x: 24*PARAMS.CELL_SIZE, y: 8*PARAMS.CELL_SIZE }
                        ]
                    }
                    // Add more zones for level 2
                ]
            }
            // Add more levels
        };

        

        this.zIndex = 5;
        this.initializeLevel(this.currentLevel);

    }

    initializeLevel(levelNumber) {
        this.combatZones = [];
        this.currentCombatZone = null;

        const levelConfig = this.levelConfigs[levelNumber];
        if (!levelConfig) return;

        levelConfig.zones.forEach(zoneConfig => {
            const enemies = this.createEnemies(zoneConfig.enemies);
            this.addCombatZone(zoneConfig.startX, zoneConfig.endX, enemies);
        });
    }

    createEnemies(enemyConfigs) {
        const enemyTypes = {
            'BasicYellowEnemy': (x, y) => new Enemy(this.gameEngine, this.sceneManager.scene, x, y),
            'BossEnemy': (x, y) => new BossEnemy(this.gameEngine,this.sceneManager.scene, x, y),
            'RangedEnemy': (x, y) => new RangedEnemy(this.gameEngine, x, y)//TODO: add
        };


        return enemyConfigs.map(config => {
            const createEnemy = enemyTypes[config.type] || ((x, y) => new BasicEnemy(this.gameEngine, x, y));
            return createEnemy(config.x, config.y);
        });
    }

    loadLevel(levelNumber) {
        this.combatZones = [];
        this.currentCombatZone = null;
        this.currentLevel = levelNumber;
        this.initializeLevel(levelNumber);
    }

    addCombatZone(startX, endX, enemies) {
        this.combatZones.push({
            startX,
            endX,
            enemies: enemies,
            isActive: false,
            isCompleted: false
        });
    }

    update() {
        const playerX = this.player.x;
        

        for (let zone of this.combatZones) {
            if (zone.isCompleted || playerX < zone.startX || playerX > zone.endX) continue;

            if (!zone.isActive) {
                this.activateZone(zone);
            }

            // Lock player within zone boundaries
            this.player.x = Math.max(zone.startX, Math.min(this.player.x, zone.endX));

            this.updateCamera();

            if (this.isZoneCleared(zone)) {
                this.completeZone(zone);
            }
            return; // Exit after processing relevant zone
        }

        // If not in a combat zone, update camera normally
        this.updateCamera();
    }

    activateZone(zone) {
        zone.isActive = true;
        this.currentCombatZone = zone;
        this.cameraLeftBound = zone.startX;
        this.cameraRightBound = zone.endX - PARAMS.canvasWidth;
        zone.enemies.forEach(enemy => this.gameEngine.addEntity(enemy));
    }

    isZoneCleared(zone) {
        return zone.enemies.every(enemy => enemy.isDead);
    }

    completeZone(zone) {
        zone.isCompleted = true;
        this.currentCombatZone = null;
        this.cameraLeftBound = 0;
        this.cameraRightBound = null;

        // Check if this was the last zone in the level
        const allZonesCompleted = this.combatZones.every(zone => zone.isCompleted);
        
        if (allZonesCompleted) {
            // Disable player movement
            this.player.isLevelComplete = true;
            
            // Create and add the overlay
            const statsOverlay = new LevelCompleteOverlay(this.gameEngine, this,{
                coins: this.sceneManager.gameState.playerStats.coins,
                health: this.player.health,
                onComplete: () => {
                    this.sceneManager.nextLevel();
                    this.player.isLevelComplete = false;
                }
            });
            
            
            statsOverlay.zIndex = 1000;
            this.gameEngine.addEntity(statsOverlay);
        }
    }

    updateCamera() {
        // Target camera position (centered on player)
        let targetX = this.player.x - PARAMS.canvasWidth / 2;

        // Apply bounds if in combat zone
        if (this.currentCombatZone) {
            targetX = Math.max(this.cameraLeftBound, Math.min(targetX, this.cameraRightBound));
        } else {
            // When not in combat zone, only move camera forward
            if (targetX > this.camera.x) {
                targetX = Math.max(0, targetX);
            } else {
                targetX = this.camera.x; // Keep camera stationary when moving left
            }
        }

        // Smooth camera movement
        const cameraSpeed = 0.1;
        this.camera.x += (targetX - this.camera.x) * cameraSpeed;
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
        // Debug visualization of combat zones
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 4;
        
        this.combatZones.forEach(zone => {
            const startScreenX = zone.startX - this.camera.x;
            const width = zone.endX - zone.startX;
            
            ctx.beginPath();
            ctx.rect(startScreenX, 0, width, PARAMS.canvasHeight);
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