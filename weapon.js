class Weapon {
    constructor(name, damage, range, cooldown) {
        Object.assign(this, { name, damage, range, cooldown });
        this.cooldownTimer = 0;
    }

    attack(player) {
        if (this.cooldownTimer <= 0) {
            console.log(`${player.constructor.name} attacks with ${this.name}!`);
            // Logic for attack effect (e.g., bullets, melee hits)
            this.cooldownTimer = this.cooldown;
        }
    }

    update(clockTick) {
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= clockTick;
        }
    }
}


const sword = new Weapon("Sword", 25, 50, 0.5);
//player.equipWeapon(sword);
