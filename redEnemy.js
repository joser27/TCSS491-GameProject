class RedEnemy extends Character {
    constructor(gameEngine, scene, x, y){
        super(gameEngine, "N/A", scene,"./assets/sprites/red_pistol_spritesheet.png", "N/A");
        this.x = x;
        this.y = y;
        this.attackTimer = 0;
        this.attackInterval = 2 + Math.random()* 3;

    }

    update() {

    }

    draw() {
        if (!this.isActive) return; // Skip drawing if not active
        
        super.draw(ctx);

        if(this.health < 0){
            this.health = 0;
        }

        // Draw a small health bar above the enemy's head
        const healthBarWidth = 75; // Width of the health bar
        const healthBarHeight = 10; // Height of the health bar
        const healthPercentage = this.health / 100; // Percentage of health remaining
        const xPosition = this.x - healthBarWidth / 2 - this.gameEngine.camera.x; // Center health bar above the enemy
        const yPosition = this.y - 50; // Position the health bar above the sprite

        // Draw the red background (full health bar)
        ctx.fillStyle = "red";
        ctx.fillRect(xPosition, yPosition, healthBarWidth, healthBarHeight);

        // Draw the green foreground (current health)
        ctx.fillStyle = "green";
        ctx.fillRect(xPosition, yPosition, healthBarWidth * healthPercentage, healthBarHeight);

        // Add a black border around the health bar
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(xPosition, yPosition, healthBarWidth, healthBarHeight);
    }
}