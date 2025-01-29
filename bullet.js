class Bullet {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y - 30; // Offset to match pistol height
        this.speed = 8 * direction; // Move left or right
        this.width = 10;
        this.height = 5;
        this.offScreen = false;
    }

    update(clockTick) {
        this.x += this.speed;
        if (this.x < 0 || this.x > 800) this.offScreen = true; // Assuming screen width is 800
    }

    draw(ctx) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
