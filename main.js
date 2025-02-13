const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/sprites/white_sword_spritesheet.png")
ASSET_MANAGER.queueDownload("./assets/sprites/white_fight_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/yellow_fight_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/white_pistol_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/bullet.png");
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
ASSET_MANAGER.queueDownload("./assets/sprites/shopImage.png");
ASSET_MANAGER.queueDownload("./assets/sprites/testStreet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/testbuilding1.png");
ASSET_MANAGER.queueDownload("./assets/sprites/testbuilding2.png");
ASSET_MANAGER.queueDownload("./assets/sprites/testbuilding3.png");




// Keyboard sprites
ASSET_MANAGER.queueDownload("./assets/sprites/ARROWDOWN.png");
ASSET_MANAGER.queueDownload("./assets/sprites/ARROWUP.png");
ASSET_MANAGER.queueDownload("./assets/sprites/ARROWLEFT.png");
ASSET_MANAGER.queueDownload("./assets/sprites/ARROWRIGHT.png");
ASSET_MANAGER.queueDownload("./assets/sprites/W.png");

ASSET_MANAGER.queueDownload("./assets/sprites/A.png");
ASSET_MANAGER.queueDownload("./assets/sprites/S.png");
ASSET_MANAGER.queueDownload("./assets/sprites/D.png");
ASSET_MANAGER.queueDownload("./assets/sprites/I.png");
ASSET_MANAGER.queueDownload("./assets/sprites/J.png");
ASSET_MANAGER.queueDownload("./assets/sprites/K.png");
ASSET_MANAGER.queueDownload("./assets/sprites/L.png");

// Fonts
ASSET_MANAGER.queueDownload("./assets/fonts/eager___.ttf");

// music 
ASSET_MANAGER.queueDownload("./assets/music/music1.mp3");
ASSET_MANAGER.queueDownload("./assets/music/gameover.mp3");

//sound effect
ASSET_MANAGER.queueDownload("./assets/sound/kick.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/chop.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/punch.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/death.mp3");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = true;

	gameEngine.init(ctx);

    new SceneManager(gameEngine);

	gameEngine.start();
});
