//import { Character} from "./character.js";
class Player extends Character {
    constructor(gameEngine, scene) {
        super(gameEngine, "./assets/sprites/white_fight_spritesheet.png", scene); // Pass player sprite sheet
        this.x = 75;
        this.y = 400;
    }

    update() {
        super.update();
        if (this.deathCompleted) {
            console.log("Game Over");
            
        }
        if (this.gameEngine.keys.z) {
            this.takeDamage(this.health); // Instantly kill player for testing
        }
        if (this.gameEngine.keys.z) {
            this.takeDamage(this.health); // Instantly kill player for testing
        }

        if (!this.currentAttack) {
            const movingRight = this.gameEngine.keys.d || this.gameEngine.keys["ArrowRight"];
            const movingLeft = this.gameEngine.keys.a || this.gameEngine.keys["ArrowLeft"];
            const movingUp = this.gameEngine.keys.w || this.gameEngine.keys["ArrowUp"];
            const movingDown = this.gameEngine.keys.s || this.gameEngine.keys["ArrowDown"];

            this.isMoving = movingRight || movingLeft || movingUp || movingDown;

            if (movingRight) {
                this.facingLeft = false;
                this.x += this.speed;
            }
            if (movingLeft) {
                this.facingLeft = true;
                this.x -= this.speed;
            }
            if (movingUp) this.y -= this.speed;
            if (movingDown) this.y += this.speed;
        }

        if (this.gameEngine.keys.c) this.performAttack("chop");
        if (this.gameEngine.keys.k) this.performAttack("kick");
        if (this.gameEngine.keys.p) this.performAttack("punch");
    }

}
