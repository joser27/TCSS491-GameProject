class Sword extends Weapon {
    constructor(scene) {
        super("Sword", 40, 120, 0.5, scene);
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
