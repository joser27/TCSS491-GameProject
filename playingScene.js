class PlayingScene {
    constructor(gameEngine, sceneManager, gameState) {
        console.log("Constructing PlayingScene");
        this.sceneManager = sceneManager;
        this.sceneManager.scene = this;
        this.camera = sceneManager;
        this.gameEngine = gameEngine;
        this.debugPlayer = true;
        this.gameEngine.ctx.imageSmoothingEnabled = true;
        this.gameState = gameState;
        this.enemies = [];
        this.initEntities()
        this.upgradeMenu = new UpgradeMenu(this.gameState, this.gameEngine);
        this.gameEngine.addEntity(this.upgradeMenu);
        this.isPlaying = false;
    }

    initEntities() {
        console.log("Initializing entities in PlayingScene");
        this.player = new Player(this.gameEngine, this, 4*PARAMS.CELL_SIZE, 8*PARAMS.CELL_SIZE);
        this.player.zIndex = 2;
        this.gameEngine.addEntity(this.player);

        this.levelManager = new LevelManager(this.gameEngine, this.sceneManager, this.player, this.camera, this);
        this.levelManager.zIndex = 1;
        this.gameEngine.addEntity(this.levelManager);
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
        this.gameEngine.addEntity(enemy);
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    update() {
        if (this.player.deathCompleted) {
            this.sceneManager.transitionToScene(GameOverScene);
        }


        if(this.levelManager.currentLevel == 1){
            this.bossmusic = "./assets/music/stage1boss.mp3";            
        } else if(this.levelManager.currentLevel == 2){
            this.bossmusic = "./assets/music/stage2boss.mp3";            
        } else if(this.levelManager.currentLevel == 3){            
            this.bossmusic = "./assets/music/stage3boss.mp3";            
        } else if(this.levelManager.currentLevel == 4){            
            this.bossmusic = "./assets/music/stage4boss.mp3";   
        }

        if(this.levelManager.isCurrentZoneBossFight() && !this.isPlaying){
            this.isPlaying = true;
            ASSET_MANAGER.pauseBackgroundMusic();
            ASSET_MANAGER.playAsset(this.bossmusic);  
        } 
       
        

    }

    draw(ctx) {
        // Draw current coins
        ctx.font = "32px Arial";
        ctx.fillStyle = "gold";
        ctx.textAlign = "left";

        const x = 330
        const y = 78.5
        const size = 45

        const img = new Image();
        img.src = './assets/sprites/coin.png';
        ctx.drawImage(img,x, y -33.5, size, size);
        
        ctx.fillText(`: ${this.gameState.playerStats.coins}`, x + 50, y);
    }
}