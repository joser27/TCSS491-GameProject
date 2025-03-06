const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/sprites/white_sword_spritesheet.png")
ASSET_MANAGER.queueDownload("./assets/sprites/white_fight_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/yellow_fight_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/white_pistol_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/blue_sword_spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/red_pistol_spritesheet.png");
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
ASSET_MANAGER.queueDownload("./assets/sprites/street_intersection.png");
ASSET_MANAGER.queueDownload("./assets/sprites/street_intersection2.png");
ASSET_MANAGER.queueDownload("./assets/sprites/street_intersection3.png");
ASSET_MANAGER.queueDownload("./assets/sprites/streetGroundAseprite.png");
ASSET_MANAGER.queueDownload("./assets/sprites/street_building1.png");
ASSET_MANAGER.queueDownload("./assets/sprites/street_gasStation.png");
ASSET_MANAGER.queueDownload("./assets/sprites/street_building2.png");
ASSET_MANAGER.queueDownload("./assets/sprites/street_building3.png");
ASSET_MANAGER.queueDownload("./assets/sprites/fenceAseprite.png");
ASSET_MANAGER.queueDownload("./assets/sprites/brickWallAseprite.png");
ASSET_MANAGER.queueDownload("./assets/sprites/grassBrickWallAseprite.png");
ASSET_MANAGER.queueDownload("./assets/sprites/grassAseprite.png");
ASSET_MANAGER.queueDownload("./assets/sprites/street_car.png");
ASSET_MANAGER.queueDownload("./assets/sprites/street_car2.png");
ASSET_MANAGER.queueDownload("./assets/sprites/street_car3.png");
ASSET_MANAGER.queueDownload("./assets/sprites/trashcan.png");
ASSET_MANAGER.queueDownload("./assets/sprites/city_mailbox.png");
ASSET_MANAGER.queueDownload("./assets/sprites/bus_sign.png");
ASSET_MANAGER.queueDownload("./assets/sprites/pink_pic.png");
ASSET_MANAGER.queueDownload("./assets/sprites/white_pic.png");

ASSET_MANAGER.queueDownload("./assets/sprites/mallwallAseprite1.png");
ASSET_MANAGER.queueDownload("./assets/sprites/mallwallAseprite2.png");
ASSET_MANAGER.queueDownload("./assets/sprites/mallfloorAseprite.png");
ASSET_MANAGER.queueDownload("./assets/sprites/backgroundMallAseprite.png");
ASSET_MANAGER.queueDownload("./assets/sprites/streetBackgroundAseprite.png");
ASSET_MANAGER.queueDownload("./assets/sprites/testStreet.png");
ASSET_MANAGER.queueDownload("./assets/sprites/testbuilding1.png");
ASSET_MANAGER.queueDownload("./assets/sprites/testbuilding2.png");
ASSET_MANAGER.queueDownload("./assets/sprites/testbuilding3.png");
ASSET_MANAGER.queueDownload("./assets/sprites/sewer_wall.png");
ASSET_MANAGER.queueDownload("./assets/sprites/sewer_ground.png");

ASSET_MANAGER.queueDownload("./assets/sprites/outside_ground.png");
ASSET_MANAGER.queueDownload("./assets/sprites/outside_background.png");

ASSET_MANAGER.queueDownload("./assets/sprites/boss_sprite/boss_point.png");
ASSET_MANAGER.queueDownload("./assets/sprites/boss_sprite/boss_sprint.png");
ASSET_MANAGER.queueDownload("./assets/sprites/boss_sprite/boss_death.png");
ASSET_MANAGER.queueDownload("./assets/sprites/boss_sprite/boss_headbutt.png");

ASSET_MANAGER.queueDownload("./assets/sprites/shadowking/shadowking_transformed.png");
ASSET_MANAGER.queueDownload("./assets/sprites/shadowking/shadowking_normal.png");

ASSET_MANAGER.queueDownload("./assets/sprites/sorcerer.png");
ASSET_MANAGER.queueDownload("./assets/sprites/berserker.png");

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
ASSET_MANAGER.queueDownload("./assets/sprites/healthbar.png");
ASSET_MANAGER.queueDownload("./assets/sprites/coin.png");
ASSET_MANAGER.queueDownload("./assets/sprites/Title_UI.png");
ASSET_MANAGER.queueDownload("./assets/sprites/Box_Orange.png");
ASSET_MANAGER.queueDownload("./assets/sprites/UI.png");

// Fonts
ASSET_MANAGER.queueDownload("./assets/fonts/eager___.ttf");
ASSET_MANAGER.queueDownload("./assets/fonts/Minecraft.ttf");
ASSET_MANAGER.queueDownload("./assets/fonts/handwritten.otf");

// music 
ASSET_MANAGER.queueDownload("./assets/music/music1.mp3");
ASSET_MANAGER.queueDownload("./assets/music/gameover.mp3");
ASSET_MANAGER.queueDownload("./assets/music/shop_music.mp3");

//sound effect
ASSET_MANAGER.queueDownload("./assets/sound/kick.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/chop.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/punch.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/death.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/shoot.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/oof1.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/oof2.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/jump.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/sword.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/cash-register-purchase.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/no-funds.mp3");
ASSET_MANAGER.queueDownload("./assets/sound/transformation.mp3");


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = true;

	gameEngine.init(ctx);

    new SceneManager(gameEngine);

	gameEngine.start();
});
