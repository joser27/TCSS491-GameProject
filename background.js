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
            street_car2: ASSET_MANAGER.getAsset("./assets/sprites/street_car2.png"),
            street_car3: ASSET_MANAGER.getAsset("./assets/sprites/street_car3.png"),
            trashcan: ASSET_MANAGER.getAsset("./assets/sprites/trashcan.png"),
            mailbox: ASSET_MANAGER.getAsset("./assets/sprites/city_mailbox.png"),
            bus_sign: ASSET_MANAGER.getAsset("./assets/sprites/bus_sign.png"),
        };

        this.level2 = {
            ground: ASSET_MANAGER.getAsset("./assets/sprites/mallfloorAseprite.png"),
            background: ASSET_MANAGER.getAsset("./assets/sprites/background1.png"),
            building1: ASSET_MANAGER.getAsset("./assets/sprites/mallwallAseprite1.png"),
            building2: ASSET_MANAGER.getAsset("./assets/sprites/mallwallAseprite2.png"),
            building3: ASSET_MANAGER.getAsset("./assets/sprites/backgroundMallAseprite.png"),
        }

        this.level3 = {
            ground: ASSET_MANAGER.getAsset("./assets/sprites/sewer_ground.png"),
            background: ASSET_MANAGER.getAsset("./assets/sprites/sewer_wall.png"),
        }

        this.level4 = {
            ground: ASSET_MANAGER.getAsset("./assets/sprites/outside_ground.png"),
            background: ASSET_MANAGER.getAsset("./assets/sprites/outside_background.png"),
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
                        street_car: { width: this.level1.street_car.width*1.5, height: this.level1.street_car.height*1.5 },
                        street_car2: { width: this.level1.street_car2.width*1.5, height: this.level1.street_car2.height*1.5 },
                        street_car3: { width: this.level1.street_car3.width*1.5, height: this.level1.street_car3.height*1.5 },
                        trashcan: { width: this.level1.trashcan.width, height: this.level1.trashcan.height },
                        mailbox: { width: this.level1.mailbox.width, height: this.level1.mailbox.height },
                        bus_sign: { width: this.level1.bus_sign.width, height: this.level1.bus_sign.height },
                    }

                },
                sceneElements: [
                    
                    { x: 1*PARAMS.CELL_SIZE, y: 0, type: 'trashcan' },
                    { x: 3*PARAMS.CELL_SIZE, y: 0, type: 'mailbox' },
                    { x: 13*PARAMS.CELL_SIZE, y: 0, type: 'bus_sign' },

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
                    { x: 114*PARAMS.CELL_SIZE, y: -110, type: 'street_car' },
                    { x: 116*PARAMS.CELL_SIZE, y: +200, type: 'street_car' },



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
            2: {
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
                    //{ x: 0, y: 0, type: 'background' },

                    // Buildings
                    { x: 0, y: 120, type: 'building1' },
                    { x: this.level2.building1.width, y: 120, type: 'building2' },
                    { x: this.level2.building1.width*2, y: 120, type: 'building2' },
                    { x: this.level2.building1.width*3, y: 120, type: 'building1' },
                    { x: this.level2.building1.width*4, y: 120, type: 'building1' },
                    { x: this.level2.building1.width*5, y: 120, type: 'building1' },
                    { x: this.level2.building1.width*6, y: 120, type: 'building2' },
                    { x: this.level2.building1.width*7, y: 120, type: 'building2' },
                    { x: this.level2.building1.width*8, y: 120, type: 'building2' },
                    { x: this.level2.building1.width*9, y: 120, type: 'building2' },
                    { x: this.level2.building1.width*10, y: 120, type: 'building2' },
                    { x: this.level2.building1.width*11, y: 120, type: 'building2' },

                    { x: 0, y: -480, type: 'building3' },
                    { x: this.level2.building1.width, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*2, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*3, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*4, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*5, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*6, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*7, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*8, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*9, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*10, y: -480, type: 'building3' },
                    { x: this.level2.building1.width*11, y: -480, type: 'building3' },
                    

                    // Ground
                    { x: 0, y: 120, type: 'ground' },
                    { x: this.level2.ground.width, y: 120, type: 'ground' },
                    { x: this.level2.ground.width*2, y: 120, type: 'ground' },
                    { x: this.level2.ground.width*3, y: 120, type: 'ground' },
                    { x: this.level2.ground.width*4, y: 120, type: 'ground' },
                    { x: this.level2.ground.width*5, y: 120, type: 'ground' },
                    { x: this.level2.ground.width*6, y: 120, type: 'ground' },
                    { x: this.level2.ground.width*7, y: 120, type: 'ground' },
                    { x: this.level2.ground.width*8, y: 120, type: 'ground' },
                    { x: this.level2.ground.width*9, y: 120, type: 'ground' },
                    { x: this.level2.ground.width*10, y: 120, type: 'ground' },
                    
                    
                    
                ]
            },
            3: {
                assets: this.level3,
                details: {
                    background: { width: this.level3.background.width*1.5, height: this.level3.background.height*1.5 },
                    ground: { width: this.level3.ground.width*1.5, height: this.level3.ground.height*1.5 },
                },
                sceneElements: [
                    { x: 0, y: 0, type: 'background' },
                    { x: this.level3.background.width, y: 0, type: 'background' },
                    { x: this.level3.background.width*2, y: 0, type: 'background' },
                    { x: this.level3.background.width*3, y: 0, type: 'background' },
                    { x: this.level3.background.width*4, y: 0, type: 'background' },
                    { x: this.level3.background.width*5, y: 0, type: 'background' },
                    { x: this.level3.background.width*6, y: 0, type: 'background' },
                    { x: this.level3.background.width*7, y: 0, type: 'background' },
                    { x: this.level3.background.width*8, y: 0, type: 'background' },
                    { x: this.level3.background.width*9, y: 0, type: 'background' },
                    { x: this.level3.background.width*10, y: 0, type: 'background' },

                    { x: 0, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*1.5, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*3, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*4.5, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*6, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*7.5, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*9, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*10.5, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*12, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*13.5, y: -5, type: 'ground' },
                    { x: this.level3.ground.width*15, y: -5, type: 'ground' },
                ]
            },
            4: {
                assets: this.level4,
                details: {
                    background: { width: this.level4.background.width, height: this.level4.background.height },
                    ground: { width: this.level4.ground.width, height: this.level4.ground.height },
                },
                sceneElements: [
                    { x: 0, y: 120, type: 'ground' },
                    { x: this.level4.ground.width, y: 120, type: 'ground' },
                    { x: this.level4.ground.width*2, y: 120, type: 'ground' },
                    { x: this.level4.ground.width*3, y: 120, type: 'ground' },
                    { x: this.level4.ground.width*4, y: 120, type: 'ground' },
                    { x: this.level4.ground.width*5, y: 120, type: 'ground' },
                    { x: this.level4.ground.width*6, y: 120, type: 'ground' },
                    { x: this.level4.ground.width*7, y: 120, type: 'ground' },


                    { x: 0, y: 125, type: 'background' },
                    { x: this.level4.background.width, y: 125, type: 'background' },
                    { x: this.level4.background.width*2, y: 125, type: 'background' },
                    { x: this.level4.background.width*3, y: 125, type: 'background' },
                    { x: this.level4.background.width*4, y: 125, type: 'background' },
                    { x: this.level4.background.width*5, y: 125, type: 'background' },
                    { x: this.level4.background.width*6, y: 125, type: 'background' },
                    { x: this.level4.background.width*7, y: 125, type: 'background' },
                    
                ]
            }
        };
    }

    update() {
        
    }   

    draw(ctx) {
        // Save the current context state
        ctx.save();
        
        ctx.imageSmoothingEnabled = false;
        
        const cameraX = Math.round(this.gameEngine.camera.x);
        const currentLevel = this.levelManager.sceneManager.gameState.currentLevel;
        const config = this.levelConfigs[currentLevel];
        
        if (!config) return;
        
        // Get canvas width for culling
        const canvasWidth = ctx.canvas.width;
        
        if (config.sceneElements) {
            const elementIndices = Array.from(config.sceneElements.keys()).reverse();
            
            // Only process elements that are visible on screen
            const visibleElements = elementIndices.filter(index => {
                const pos = config.sceneElements[index];
                const dimensions = 
                    config.details.buildings?.[pos.type] ||
                    config.details.streets?.[pos.type] ||
                    config.details.fences?.[pos.type] ||
                    config.details.walls?.[pos.type] ||
                    config.details.misc?.[pos.type] ||
                    config.details[pos.type];
                    
                if (!dimensions) return false;
                
                // Check if element is within visible area
                const elementX = this.x + pos.x - cameraX;
                return elementX + dimensions.width >= 0 && elementX <= canvasWidth;
            });
            
            visibleElements.forEach(index => {
                const pos = config.sceneElements[index];
                const asset = config.assets[pos.type];
                const dimensions = 
                    config.details.buildings?.[pos.type] ||
                    config.details.streets?.[pos.type] ||
                    config.details.fences?.[pos.type] ||
                    config.details.walls?.[pos.type] ||
                    config.details.misc?.[pos.type] ||
                    config.details[pos.type];
                
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
        
        // Restore the original context state
        ctx.restore();
    }
}