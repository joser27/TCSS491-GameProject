class Weapon {
    constructor(name, damage, range, cooldown, scene) {
        Object.assign(this, { name, damage, range, cooldown, scene });
        this.cooldownTimer = 0;
    }

    attack(player) {
        if (this.cooldownTimer <= 0) {
            console.log(`${player.constructor.name} attacks with ${this.name}!`);
            this.cooldownTimer = this.cooldown;
        }
    }

    update(clockTick) {
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= clockTick;
        }
    }
}
