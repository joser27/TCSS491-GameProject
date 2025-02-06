class PlayingScene {
    constructor(gameEngine, sceneManager) {
        this.sceneManager = sceneManager;
        this.camera = sceneManager;
        this.gameEngine = gameEngine;
        this.debugPlayer = true;
        this.gameEngine.camera.x = 0;
        this.gameEngine.ctx.imageSmoothingEnabled = true;
        this.initEntities()
    }

    initEntities() {
        this.player = new Player(this.gameEngine, this);
        this.player.zIndex = 2;
        this.gameEngine.addEntity(this.player);



        this.enemy = new Enemy(this.gameEngine, this);
        this.enemy.zIndex = 2;
        this.gameEngine.addEntity(this.enemy);

        this.levelManager = new LevelManager(this.gameEngine,this.player,this.camera);
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