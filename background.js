class Background {
    constructor(gameEngine, levelManager,player) {
        this.gameEngine = gameEngine;
        this.levelManager = levelManager;
        this.zIndex = 0;
        this.isFixedZ = true;
        
        // Level 1 assets

        this.level1 = {
            ground: ASSET_MANAGER.getAsset("./assets/sprites/streetGroundAseprite.png"),
            background: ASSET_MANAGER.getAsset("./assets/sprites/background1.png"),
            building1: ASSET_MANAGER.getAsset("./assets/sprites/street_building1.png"),
            building2: ASSET_MANAGER.getAsset("./assets/sprites/street_building2.png"),
            building3: ASSET_MANAGER.getAsset("./assets/sprites/street_building3.png"),
            gas_station: ASSET_MANAGER.getAsset("./assets/sprites/street_gasStation.png"),
            streetBackground: ASSET_MANAGER.getAsset("./assets/sprites/streetBackgroundAseprite.png"),
            fence1: ASSET_MANAGER.getAsset("./assets/sprites/fenceAseprite.png"),
            grassWall: ASSET_MANAGER.getAsset("./assets/sprites/grassBrickWallAseprite.png"),
            brickWall: ASSET_MANAGER.getAsset("./assets/sprites/brickWallAseprite.png"),
            grass: ASSET_MANAGER.getAsset("./assets/sprites/grassAseprite.png"),
            street_intersection: ASSET_MANAGER.getAsset("./assets/sprites/street_intersection.png"),
            street_intersection2: ASSET_MANAGER.getAsset("./assets/sprites/street_intersection2.png"),
            street_intersection3: ASSET_MANAGER.getAsset("./assets/sprites/street_intersection3.png"),
            street_car: ASSET_MANAGER.getAsset("./assets/sprites/street_car.png"),
        };

        this.level2 = {
            ground: ASSET_MANAGER.getAsset("./assets/sprites/mallfloorAseprite.png"),
            background: ASSET_MANAGER.getAsset("./assets/sprites/background1.png"),
            building1: ASSET_MANAGER.getAsset("./assets/sprites/mallwallAseprite1.png"),
            building2: ASSET_MANAGER.getAsset("./assets/sprites/mallwallAseprite2.png"),
            building3: ASSET_MANAGER.getAsset("./assets/sprites/backgroundMallAseprite.png"),
        }
        
        this.player = player;
        this.x = 0;

        // Define complete level configurations
        this.levelConfigs = {
            1: {
                assets: this.level1,
                details: {
                    background: { width: this.level1.background.width, height: this.level1.background.height },
                    ground: { width: this.level1.ground.width, height: this.level1.ground.height },
                    buildings: {
                        building1: { width: this.level1.building1.width, height: this.level1.building1.height },
                        building2: { width: this.level1.building2.width, height: this.level1.building2.height },
                        building3: { width: this.level1.building3.width, height: this.level1.building3.height },
                        gas_station: { width: this.level1.gas_station.width, height: this.level1.gas_station.height },
                    },
                    streets: {
                        streetBackground: { width: this.level1.streetBackground.width, height: this.level1.streetBackground.height },
                        street_intersection: { width: this.level1.street_intersection.width, height: this.level1.street_intersection.height },
                        street_intersection2: { width: this.level1.street_intersection2.width, height: this.level1.street_intersection2.height },
                        street_intersection3: { width: this.level1.street_intersection3.width, height: this.level1.street_intersection3.height },
                    },
                    fences: {
                        fence1: { width: this.level1.fence1.width, height: this.level1.fence1.height },
                    },
                    walls: {
                        brickWall: { width: this.level1.brickWall.width, height: this.level1.brickWall.height },
                        grassWall: { width: this.level1.grassWall.width, height: this.level1.grassWall.height },
                    },
                    misc: {
                        grass: { width: this.level1.grass.width, height: this.level1.grass.height },
                        street_car: { width: this.level1.street_car.width, height: this.level1.street_car.height },
                    }
                },
                sceneElements: [
                 
                    // Walls
                    { x: 60*PARAMS.CELL_SIZE, y: -110, type: 'grassWall' },
                    { x: 70*PARAMS.CELL_SIZE-40, y: -110, type: 'brickWall' },

                    // Fences
                    { x: 43*PARAMS.CELL_SIZE, y: -110, type: 'fence1' },
                    
                    // Buildings
                    { x: -1*PARAMS.CELL_SIZE, y: -110, type: 'building1' },
                    { x: 6*PARAMS.CELL_SIZE, y: -110, type: 'building2' },
                    { x: 34*PARAMS.CELL_SIZE-75, y: -110, type: 'building3' },
                    //{ x: 15*PARAMS.CELL_SIZE, y: -110, type: 'building3' },
                    { x: 81*PARAMS.CELL_SIZE, y: -110, type: 'building2' },
                    { x: 91*PARAMS.CELL_SIZE, y: -110, type: 'building3' },
                    { x: 105*PARAMS.CELL_SIZE, y: -210, type: 'gas_station' },
                    // // Fences
                    // { x: 44*PARAMS.CELL_SIZE, y: -110, type: 'fence1' },
                    
                    // Misc
                    { x: 42*PARAMS.CELL_SIZE+15, y: -110, type: 'grass' },
                    { x: 50*PARAMS.CELL_SIZE+15, y: -110, type: 'grass' },
                    { x: 118*PARAMS.CELL_SIZE, y: -110, type: 'street_car' },
                    { x: 118*PARAMS.CELL_SIZE, y: +200, type: 'street_car' },


                     // Streets
                     { x: 0, y: 120, type: 'ground' },
                     { x: this.level1.ground.width, y: 120, type: 'ground' },
                     { x: this.level1.ground.width*2, y: 120, type: 'street_intersection' },
                     { x: this.level1.street_intersection2.width*2, y: -198, type: 'street_intersection2' },
                     { x: this.level1.street_intersection3.width*1, y: -198, type: 'street_intersection3' },
                     { x: this.level1.ground.width*3, y: 120, type: 'ground' },
                     { x: this.level1.ground.width*4, y: 120, type: 'ground' },
                     { x: this.level1.ground.width*5, y: 120, type: 'ground' },
                     { x: this.level1.ground.width*6, y: 120, type: 'ground' },
                     { x: this.level1.ground.width*7, y: 120, type: 'ground' },
                     { x: this.level1.ground.width*8, y: 120, type: 'ground' },
                     { x: this.level1.ground.width*9, y: 120, type: 'ground' },
                     { x: this.level1.ground.width*10, y: 120, type: 'ground' },
                     { x: this.level1.ground.width*11, y: 120, type: 'ground' },


                     //{ x: 0*PARAMS.CELL_SIZE, y: -500, type: 'street_intersection' },

                                         //streetBackground
                    { x: 0, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*2, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*3, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*4, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*5, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*6, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*7, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*8, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*9, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*10, y: -190, type: 'streetBackground' },
                    { x: this.level1.streetBackground.width*11, y: -190, type: 'streetBackground' },
                ]
            },
            2
            : {
                assets: this.level2,
                details: {
                    background: { width: this.level2.background.width/2, height: this.level2.background.height/2 },
                    ground: { width: this.level2.ground.width, height: this.level2.ground.height },
                    buildings: {
                        building1: { width: this.level2.building1.width, height: this.level2.building1.height },
                        building2: { width: this.level2.building2.width, height: this.level2.building2.height },
                        building3: { width: this.level2.building3.width, height: this.level2.building3.height },
                    }
                },
                sceneElements: [
                    // Background and Ground
                    { x: 0, y: 0, type: 'background' },
                    { x: 0, y: 0, type: 'ground' },
                    
                    // Buildings
                    { x: 0, y: 170, type: 'building1' },
                    { x: this.level2.building1.width, y: 170, type: 'building2' },
                    { x: this.level2.building1.width*2, y: 170, type: 'building2' },
                    { x: this.level2.building1.width*3, y: 170, type: 'building1' },
                    { x: this.level2.building1.width*4, y: 170, type: 'building1' },

                    { x: 0, y: -430, type: 'building3' },
                    { x: this.level2.building1.width, y: -430, type: 'building3' },
                    { x: this.level2.building1.width*2, y: -430, type: 'building3' },
                    { x: this.level2.building1.width*3, y: -430, type: 'building3' },
                    { x: this.level2.building1.width*4, y: -430, type: 'building3' },
                ]
            },
        };
    }

    update() {
        
    }   

    draw(ctx) {
        const cameraX = Math.round(this.gameEngine.camera.x);
        const currentLevel = this.levelManager.sceneManager.gameState.currentLevel;
        const config = this.levelConfigs[currentLevel];

        if (!config) return;

        if (config.sceneElements) {
            const elementIndices = Array.from(config.sceneElements.keys()).reverse();
            
            elementIndices.forEach(index => {
                const pos = config.sceneElements[index];
                const asset = config.assets[pos.type];
                // Check all categories for dimensions
                const dimensions = 
                    config.details.buildings?.[pos.type] ||
                    config.details.streets?.[pos.type] ||
                    config.details.fences?.[pos.type] ||
                    config.details.walls?.[pos.type] ||
                    config.details.misc?.[pos.type] ||
                    config.details[pos.type]; // fallback for background/ground
                
                if (asset && dimensions) {
                    ctx.drawImage(asset,
                        Math.round(this.x + pos.x - cameraX),
                        pos.y,
                        dimensions.width,
                        dimensions.height
                    );
                }
            });
        }
    }
}