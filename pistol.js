class Pistol extends Weapon {
    constructor() {
        super("Pistol", 45, 300, 0.5); // Name, Damage, Range, Cooldown
        this.bullets = [];
        this.spriteSheet = ASSET_MANAGER.getAsset("./assets/sprites/white_pistol_spritesheet.png");
        this.shootAnimation = new Animator(
            this.spriteSheet,
            512 * 26, // 21st sprite (adjust as needed)
            0,
            512,
            512,
            3,  // Number of frames
            0.1,
            0.8,
            false
        );
    }

    attack(player) {
        if (this.cooldownTimer <= 0) {
            console.log(`${player.constructor.name} fires the pistol!`);
            this.cooldownTimer = this.cooldown;

            // Create a bullet at the player's position
            this.bullets.push(new Bullet(player.x, player.y, player.facingLeft ? -1 : 1));
        }
    }

    update(clockTick) {
        super.update(clockTick);

        // Update bullet positions
        this.bullets.forEach(bullet => bullet.update(clockTick));

        // Remove bullets that go off-screen
        this.bullets = this.bullets.filter(bullet => !bullet.offScreen);
    }

    draw(ctx) {
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }
}
