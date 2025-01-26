import { PlayingScene } from "./playingScene.js"; 
class SceneManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.gameEngine.camera = this;
        this.x = 0;
        this.scene = new MenuScene(this.gameEngine);
        this.gameEngine.addEntity(this.scene);
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
        console.log(this.gameEngine.entities);
        if (this.gameEngine.keys["Enter"]) {
            this.clearEntities();
            this.scene = new PlayingScene(this.gameEngine, this);
            this.gameEngine.addEntity(this.scene);
        }
    };

    draw(ctx) {

    };
};

