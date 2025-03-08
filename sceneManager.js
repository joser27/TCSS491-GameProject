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
            HowToPlayScene: null,
            CreditsScene: null,
            CutScene: null,
            Outro: null,
        }
        this.scene = this.scenes.MenuScene;
        this.zindex = 100;
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
        this.updateAudio();
    };


    draw(ctx) {

    };

    resetCamera() {
        this.x = 0;
    }

    transitionToScene(SceneType) {
        this.clearEntities();
        
        if (SceneType === PlayingScene) {
            this.scenes.PlayingScene = new PlayingScene(this.gameEngine, this, this.gameState);
            this.scene = this.scenes.PlayingScene;
        } else if (SceneType === ShopScene) {
            this.scenes.ShopScene = new ShopScene(this.gameEngine, this, this.gameState);
            this.scene = this.scenes.ShopScene;
        } else if (SceneType === GameOverScene) {
            this.scenes.GameOverScene = new GameOverScene(this.gameEngine, this, this.gameState);
            this.scene = this.scenes.GameOverScene;
        } else if (SceneType === HowToPlayScene) {
            this.scenes.HowToPlayScene = new HowToPlayScene(this.gameEngine, this);
            this.scene = this.scenes.HowToPlayScene;
        } else if (SceneType === CreditsScene) {
            this.scenes.CreditsScene = new CreditsScene(this.gameEngine, this);
            this.scene = this.scenes.CreditsScene;
        } else if (SceneType === MenuScene) {
            this.scenes.MenuScene = new MenuScene(this.gameEngine, this);
            this.scene = this.scenes.MenuScene;
        } else if (SceneType === CutScene){
            this.scenes.CutScene = new CutScene(this.gameEngine, this, this.gameState);
            this.scene = this.scenes.CutScene;
        } else if (SceneType === Outro){
            this.scenes.Outro = new Outro(this.gameEngine, this);
            this.scene = this.scenes.Outro;
        } 


        this.gameEngine.addEntity(this.scene);
    }

    nextLevel() {
        this.resetCamera();
        this.gameState.currentLevel++;
        this.transitionToScene(ShopScene);
    }
};

