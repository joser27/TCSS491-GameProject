class Pistol extends Weapon {
    constructor(scene) {
        super("Pistol", 45, 300, 0.5, scene);
        this.bullets = [];

        console.log("Checking asset manager:", ASSET_MANAGER.assets);
        console.log("Trying to load:", ASSET_MANAGER.getAsset("./assets/sprites/white_pistol_spritesheet.png"));

        this.spriteSheet = ASSET_MANAGER.getAsset("./assets/sprites/white_pistol_spritesheet.png");

        this.shootAnimation = new Animator(
            this.spriteSheet,
            512 * 26, 
            0,
            512,
            512,
            1,
            0.1,
            0.8,
            false
        );
    }

    attack(player) {
        if (this.cooldownTimer <= 0) {
            console.log(`${player.constructor.name} fires the pistol!`);
            this.cooldownTimer = this.cooldown;

            // Add a bullet to the scene
            let bullet = new Bullet(player.x, player.y, player.facingLeft ? -1 : 1, this.scene);

            console.log("Bullet Created:", bullet);
            
            this.scene.gameEngine.addEntity(bullet);
            this.bullets.push(bullet);
        }
    }

    update(clockTick) {
        super.update(clockTick);
        this.bullets.forEach(bullet => bullet.update(clockTick));
        this.bullets = this.bullets.filter(bullet => !bullet.offScreen);
    }

    draw(ctx) {
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }
}
