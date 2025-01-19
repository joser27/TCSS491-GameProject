const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./white_fight_spritesheet.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	gameEngine.init(ctx);

    gameEngine.addEntity(new SceneManager(gameEngine));
	gameEngine.addEntity(new Enemy(gameEngine,14*PARAMS.CELL_SIZE, 8*PARAMS.CELL_SIZE));
	gameEngine.start();
});
