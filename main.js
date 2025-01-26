const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./assets/sprites/white_fight_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/yellow_fight_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/evenBiggerGround.png");
ASSET_MANAGER.queueDownload("./assets/sprites/background1.png");
ASSET_MANAGER.queueDownload("./assets/sprites/background2.png");
ASSET_MANAGER.queueDownload("./assets/sprites/background3.png");
ASSET_MANAGER.queueDownload("./assets/sprites/building1.png");
ASSET_MANAGER.queueDownload("./assets/sprites/building2.png");
ASSET_MANAGER.queueDownload("./assets/sprites/building3.png");
ASSET_MANAGER.queueDownload("./assets/sprites/bullet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/grass_foreground.png");
ASSET_MANAGER.queueDownload("./assets/sprites/house1.png");
ASSET_MANAGER.queueDownload("./assets/sprites/house2.png");
ASSET_MANAGER.queueDownload("./assets/sprites/house4.png");
ASSET_MANAGER.queueDownload("./assets/sprites/ladder.png");
ASSET_MANAGER.queueDownload("./assets/sprites/rocks.png");
ASSET_MANAGER.queueDownload("./assets/sprites/tree1.png");
ASSET_MANAGER.queueDownload("./assets/sprites/tree2.png");


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = true;

	gameEngine.init(ctx);

    new SceneManager(gameEngine);

	gameEngine.start();
});
