class PlayingScene {
    constructor(gameEngine, camera) {
        this.gameEngine = gameEngine;
        this.camera = camera;

        this.debugPlayer = true;
        this.player = new Player(this.gameEngine);
        this.gameEngine.addEntity(this.player);
        
        this.levelManager = new LevelManager(this.gameEngine,this.player,this.camera);
        this.gameEngine.addEntity(this.levelManager);

        this.GRID_COLS = Math.floor(PARAMS.canvasWidth / PARAMS.CELL_SIZE);
        this.GRID_ROWS = Math.floor(PARAMS.canvasHeight / PARAMS.CELL_SIZE);
    }

    update() {

    }

    draw(ctx) {

    }

}
