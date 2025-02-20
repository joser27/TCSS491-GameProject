class Pistol extends Weapon {
    constructor(scene) {
        super("Pistol", 45, 300, 0.5, scene);
        this.bullets = [];
        this.magazineSize = 10;
        this.ammo = this.magazineSize;
        this.reloading = false;
        this.reloadTime = 2;
    }

    attack(player) {
        if(this.reloading) {
            console.log("Reloading...");
            return;
        }
        if (this.ammo > 0 && this.cooldownTimer <= 0) {
            console.log(`${player.constructor.name} fires the pistol!`);
            this.cooldownTimer = this.cooldown;
            this.ammo--;

            // Add a bullet to the scene
            let bullet = new Bullet(player, this.scene);

            this.scene.gameEngine.addEntity(bullet);
            this.bullets.push(bullet);
        }

        if(this.ammo <= 0 && !this.reloading) {
            this.reload();
        }
    }

    reload() {
        if(this.reloading) return;

        console.log("Reloading...");
        this.reloading = true;

        setTimeout(() => {
            this.ammo = this.magazineSize;
            this.reloading = false;
            console.log("Reload Complete!")
        }, 1000);
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
