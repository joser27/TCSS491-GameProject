class SceneManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.gameEngine.camera = this;
        this.x = 0;
        this.gameState = new GameState();
        this.scenes = {
            MenuScene: new MenuScene(this.gameEngine, this),
            PlayingScene: null,
            ShopScene: null,
            GameOverScene: null,
        }
        this.scene = this.scenes.MenuScene;

        this.zindex = 100;
        this.scene = new MenuScene(this.gameEngine, this);
        this.gameEngine.addEntity(this.scene);
        this.initializeButtons();
    };

    initializeButtons() {
        const debugCheckbox = document.getElementById("debugButton");
        const fullscreenButton = document.getElementById("fullscreenButton");
        const canvas = document.getElementById("gameWorld");

        debugCheckbox.addEventListener("change", () => {
            PARAMS.DEBUG = debugCheckbox.checked;
        });

        fullscreenButton.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                canvas.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    };

    clearEntities() {
        this.gameEngine.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };


    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

    update() {
        if(this.x <= 0){
            this.x = 0
        }
        
    };

    draw(ctx) {

    };

    transitionToScene(SceneType) {
        this.clearEntities();
        
        if (SceneType === PlayingScene) {
            this.scene = new PlayingScene(this.gameEngine, this, this.gameState);
        } else if (SceneType === ShopScene) {
            this.scene = new ShopScene(this.gameEngine, this, this.gameState);
        } else if (SceneType === GameOverScene) {
            this.scene = new GameOverScene(this.gameEngine, this, this.gameState);
        }
        

        this.gameEngine.addEntity(this.scene);
    }

    nextLevel() {
        this.gameState.currentLevel++;
        this.transitionToScene(ShopScene);
    }
};

