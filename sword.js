class Sword extends Weapon {
    constructor(scene) {
        super("Sword", 40, 80, 0.5, scene);
    }

    attack(user) {
        if (this.cooldownTimer > 0) return; // Prevents spamming while in cooldown

        console.log(`${user.constructor.name} swings the sword!`);
        this.cooldownTimer = this.cooldown; // Set cooldown timer

        const target = user instanceof Player ? 
            this.scene.enemies.filter(enemy => enemy.isActive && !enemy.isDead) : 
            this.scene.player;

        if (!target) return;

        if (Array.isArray(target)) {
            // Player attacking enemies
            for (const enemy of target) {
                if (user.isEntityInAttackRange(enemy)) {
                    this.dealDamage(user, enemy);
                    //break;
                }
            }
        } else {
            // BlueEnemy attacking Player
            if (user.isEntityInAttackRange(target)) {
                this.dealDamage(user, target);
            }
        }
    }

    dealDamage(attacker, target) {
        setTimeout(() => {
            if (attacker.isEntityInAttackRange(target)) {
                target.takeDamage(this.damage);
                console.log(`${target.constructor.name} takes ${this.damage} damage!`);
            }
        }, 250); // Delay for animation sync
    }

    update(clockTick) {
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= clockTick; // Decrease cooldown over time
        }
    }
}
