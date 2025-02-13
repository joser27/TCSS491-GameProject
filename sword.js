class Sword extends Weapon {
    constructor(scene) {
        super("Sword", 30, 120, 0.8, scene);
        //this.swordSwingSound = "./assets/sound/sword_swing.mp3";
    }

    attack(player) {
        if (this.cooldownTimer <= 0) {
            console.log(`${player.constructor.name} swings the sword!`);
            //ASSET_MANAGER.playAsset(this.swordSwingSound);
            this.cooldownTimer = this.cooldown;

            // Perform melee attack check
            player.attackEnemy(this.damage);
        }
    }
}
