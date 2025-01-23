class PlayingScene {
    constructor(gameEngine, camera) {
        this.gameEngine = gameEngine;
        this.camera = camera;

        this.debugPlayer = true;

        this.initEntities()
    }

    initEntities() {
        this.player = new Player(this.gameEngine);
        this.gameEngine.addEntity(this.player);



        this.enemy = new Enemy(this.gameEngine,this, 27*PARAMS.CELL_SIZE, 7*PARAMS.CELL_SIZE)
        this.gameEngine.addEntity(this.enemy);

        this.levelManager = new LevelManager(this.gameEngine,this.player,this.camera);
        this.gameEngine.addEntity(this.levelManager);
    }

    update() {

    }

    draw(ctx) {

    }
}
