class PlayingScene {
    constructor(gameEngine, sceneManager) {
        this.sceneManager = sceneManager;
        this.camera = sceneManager;
        this.gameEngine = gameEngine;
        this.debugPlayer = true;
        this.gameEngine.camera.x = 0;
        this.initEntities()
        
    }

    initEntities() {
        this.player = new Player(this.gameEngine, this);
        this.gameEngine.addEntity(this.player);



        this.enemy = new Enemy(this.gameEngine, this);
        this.gameEngine.addEntity(this.enemy);

        this.levelManager = new LevelManager(this.gameEngine,this.player,this.camera);
        this.gameEngine.addEntity(this.levelManager);
    }

    update() {
        if (this.player.deathCompleted) {
            this.sceneManager.clearEntities();
            this.sceneManager.scene = new GameOverScene(this.gameEngine, this.sceneManager);
            this.gameEngine.addEntity(this.sceneManager.scene);
        }
    }

    draw(ctx) {

    }
}
