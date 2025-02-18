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