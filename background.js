class Background {
    constructor(gameEngine, levelManager,player) {
        this.gameEngine = gameEngine;
        this.levelManager = levelManager;
        this.zIndex = 0;
        this.isFixedZ = true;
        
        // Level 1 assets
        this.level1 = {
            ground: ASSET_MANAGER.getAsset("./assets/sprites/evenBiggerGround.png"),
            background: ASSET_MANAGER.getAsset("./assets/sprites/background1.png"),
            building1: ASSET_MANAGER.getAsset("./assets/sprites/building1.png"),
            building2: ASSET_MANAGER.getAsset("./assets/sprites/building2.png"),
            building3: ASSET_MANAGER.getAsset("./assets/sprites/building3.png")
        };

        // Level 2 assets
        this.level2 = {
            ground: ASSET_MANAGER.getAsset("./assets/sprites/testStreet.png"),
            background: ASSET_MANAGER.getAsset("./assets/sprites/background1.png"),
            building1: ASSET_MANAGER.getAsset("./assets/sprites/testbuilding1.png"),
            building2: ASSET_MANAGER.getAsset("./assets/sprites/testbuilding2.png"),
            building3: ASSET_MANAGER.getAsset("./assets/sprites/testbuilding3.png"),

        };

        
        this.player = player;
        this.x = 0;

        // Define complete level configurations
        this.levelConfigs = {
            1: {
                assets: this.level1,
                details: {
                    background: { width: this.level1.background.width/2, height: this.level1.background.height/2 },
                    ground: { width: this.level1.ground.width, height: this.level1.ground.height },
                    buildings: {
                        building1: { width: this.level1.building1.width/2, height: this.level1.building1.height/2 },
                        building2: { width: this.level1.building2.width/2, height: this.level1.building2.height/2 },
                        building3: { width: this.level1.building3.width/2, height: this.level1.building3.height/2 }
                    }
                },
                buildingPositions: [
                    { x: -100, y: 100, type: 'building1' },
                    { x: 360, y: 100, type: 'building2' },
                    { x: 900, y: 100, type: 'building3' },
                ]
            },
            2: {
                assets: this.level2,
                details: {
                    background: { width: this.level2.background.width, height: this.level2.background.height },
                    ground: { width: this.level2.ground.width, height: this.level2.ground.height },
                    buildings: {
                        building1: { width: this.level2.building1.width, height: this.level2.building1.height },
                        building2: { width: this.level2.building2.width, height: this.level2.building2.height },
                        building3: { width: this.level2.building3.width, height: this.level2.building3.height },
                        building1: { width: this.level2.building1.width, height: this.level2.building1.height }
                    }
                },
                buildingPositions: [
                    { x: -200, y: -110, type: 'building1' },
                    { x: 250, y: -110, type: 'building2' },
                    { x: 800, y: -110, type: 'building3' },
                    { x: 1450, y: -110, type: 'building1' }
                ]
            }
        };
    }

    update() {
        
    }   

    draw(ctx) {
        const cameraX = this.gameEngine.camera.x;
        const currentLevel = this.levelManager.sceneManager.gameState.currentLevel;
        const config = this.levelConfigs[currentLevel];

        if (!config) return; // Skip if level config not found

        // Draw background and ground
        for (let i = 0; i < 5; i++) {
            // Draw background
            ctx.drawImage(config.assets.background,
                this.x + i * (config.details.background.width - 5) - cameraX/2,
                0,
                config.details.background.width,
                config.details.background.height
            );
            
            // Draw ground
            ctx.drawImage(config.assets.ground,
                this.x + i * (config.details.ground.width - 5) - cameraX,
                220,
                config.details.ground.width,
                config.details.ground.height
            );
        }

        // Draw buildings
        if (config.buildingPositions) {
            const buildingIndices = Array.from(config.buildingPositions.keys()).reverse();
            
            buildingIndices.forEach(index => {
                const pos = config.buildingPositions[index];
                const buildingAsset = config.assets[pos.type];
                const buildingDimensions = config.details.buildings[pos.type];
                
                if (buildingAsset && buildingDimensions) {
                    ctx.drawImage(buildingAsset,
                        this.x + pos.x - cameraX,
                        pos.y,
                        buildingDimensions.width,
                        buildingDimensions.height
                    );
                }
            });
        }
    }
}