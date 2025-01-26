import { Character} from "./character.js";
class Enemy extends Character {
    constructor(gameEngine) {
        super(gameEngine, "./assets/sprites/yellow_fight_spritesheet.png"); // Pass enemy sprite sheet
        this.x = 500;
        this.y = 400;
    }

    update() {
        super.update();
        // Add enemy-specific AI or movement logic here
    }
}
