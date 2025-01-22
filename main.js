const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./assets/sprites/white_fight_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/groundBig.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	gameEngine.init(ctx);

    new SceneManager(gameEngine);

	gameEngine.start();
});
