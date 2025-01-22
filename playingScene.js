class PlayingScene {
    constructor(gameEngine, camera) {
        this.gameEngine = gameEngine;
        this.camera = camera;

        this.debugPlayer = true;
        this.player = new Player(this.gameEngine);
        this.gameEngine.addEntity(this.player);
        
        this.levelManager = new LevelManager(this.gameEngine,this.player,this.camera);
        this.gameEngine.addEntity(this.levelManager);
    }

    update() {

    }

    draw(ctx) {

    }

}
