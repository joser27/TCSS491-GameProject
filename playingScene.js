class PlayingScene {
    constructor(gameEngine, sceneManager) {
        console.log("Constructing PlayingScene");
        this.sceneManager = sceneManager;
        this.sceneManager.scene = this;
        this.camera = sceneManager;
        this.gameEngine = gameEngine;
        this.debugPlayer = true;
        this.gameEngine.ctx.imageSmoothingEnabled = true;
        this.initEntities()

        this.interactableObjectManager = new InteractableObjectManager(gameEngine);
        this.gameEngine.addEntity(this.interactableObjectManager);

        // const trashCan = new InteractableObject(
        //     5,
        //     5,
        //     60,
        //     80,
        //     85,
        //     90,           
        //     this.camera,
        //     ASSET_MANAGER.getAsset("./assets/sprites/trashcan.png")
        // );
        // this.interactableObjectManager.addObject(trashCan);

        
        const mailBox = new InteractableObject(4, 8, 80, 50, 30, 100, this.camera, ASSET_MANAGER.getAsset("./assets/sprites/city_mailbox.png"));
        this.interactableObjectManager.addObject(mailBox);

        // const busSign = new InteractableObject(3, 7, 20, 20, 45, 200, this.camera, ASSET_MANAGER.getAsset("./assets/sprites/bus_sign.png"));
        // this.interactableObjectManager.addObject(busSign);

        // const car = new InteractableObject(8, 8, 550, 160, 50, 10, this.camera, ASSET_MANAGER.getAsset("./assets/sprites/street_car.png"),1.5);
        // this.interactableObjectManager.addObject(car);

        // const car2 = new InteractableObject(10, 10, 100, 100, 50, 50, this.camera, ASSET_MANAGER.getAsset("./assets/sprites/street_car2.png"));
        // this.interactableObjectManager.addObject(car2);

        // const car3 = new InteractableObject(10, 10, 100, 100, 50, 50, this.camera, ASSET_MANAGER.getAsset("./assets/sprites/street_car3.png"));
        // this.interactableObjectManager.addObject(car3);
    }

    initEntities() {
        console.log("Initializing entities in PlayingScene");
        this.player = new Player(this.gameEngine, this, 4*PARAMS.CELL_SIZE, 8*PARAMS.CELL_SIZE);
        this.player.zIndex = 2;
        this.gameEngine.addEntity(this.player);

        this.levelManager = new LevelManager(this.gameEngine, this.sceneManager, this.player, this.camera);
        this.levelManager.zIndex = 1;
        this.gameEngine.addEntity(this.levelManager);
    }

    update() {
        if (this.player.deathCompleted) {
            this.sceneManager.transitionToScene(GameOverScene);
        }
    }

    draw(ctx) {

    }
}