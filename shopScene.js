class ShopScene {
    constructor(gameEngine, scene) {
        this.gameEngine = gameEngine;
        this.scene = scene;
        this.removeFromWorld = false;
        this.name = "Devil's Deal"
        this.shopBackground = ASSET_MANAGER.getAsset("./assets/sprites/shopImage.png");
        
        // shop items
        this.shopItems = [
            {
                name: "Berserker Mode",
                icon: "🩸",
                description: "When HP is below 50%, attacks deal +20% more damage.",
                price: 100,
                tooltip: "For aggressive players who take risks."
            },
            {
                name: "Titan Guard",
                icon: "🛡️",
                description: "Taking damage briefly makes you invincible for 1 second.",
                price: 125,
                tooltip: "For defensive players who struggle against combos."
            },
            {
                name: "Sharpened Steel",
                icon: "⚔️",
                description: "Sword deals +15% more damage.",
                price: 75,
                tooltip: "For sword-focused players."
            },
            {
                name: "Gunslinger",
                icon: "🔫",
                description: "Gun reloads twice as fast.",
                price: 75,
                tooltip: "For gun-focused players."
            },
            {
                name: "Shadow Step",
                icon: "👣",
                description: "Dodge roll distance is longer and faster.",
                price: 75,
                tooltip: "For defensive players who like speed."
            }
        ];
        
        this.selectedIndex = 0;
        this.keyPressed = false;
    }

    update() {
        // Exit shop
        if (this.gameEngine.keys["o"]) {
            this.removeFromWorld = true;
        }

        // Handle item selection
        if (!this.keyPressed) {
            if (this.gameEngine.keys["ArrowRight"]) {
                this.selectedIndex = (this.selectedIndex + 1) % this.shopItems.length;
                this.keyPressed = true;
            } else if (this.gameEngine.keys["ArrowLeft"]) {
                this.selectedIndex = (this.selectedIndex - 1 + this.shopItems.length) % this.shopItems.length;
                this.keyPressed = true;
            } else if (this.gameEngine.keys["Enter"]) {
                // Purchase logic would go here
                console.log("Attempting to purchase: " + this.shopItems[this.selectedIndex].name);
                this.keyPressed = true;
            }
        }

        // Reset key pressed state
        if (!this.gameEngine.keys["ArrowRight"] && 
            !this.gameEngine.keys["ArrowLeft"] && 
            !this.gameEngine.keys["Enter"]) {
            this.keyPressed = false;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.shopBackground, 0, 0);
        
        // Draw items
        const startX = 200;
        const spacing = 150;
        const y = 400;

        this.shopItems.forEach((item, index) => {
            const x = startX + (spacing * index);
            
            // Draw item
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            
            // Highlight selected item
            if (index === this.selectedIndex) {
                ctx.fillStyle = "#FFD700"; // Gold color for selected item
                ctx.fillText(">" + item.icon + "<", x, y);
            } else {
                ctx.fillStyle = "white";
                ctx.fillText(item.icon, x, y);
            }
            
            // Draw price
            ctx.font = "16px Arial";
            ctx.fillText(`${item.price} Coins`, x, y + 30);
        });
        
        // Draw description of selected item
        const selectedItem = this.shopItems[this.selectedIndex];
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(selectedItem.name, 400, 580);
        ctx.font = "16px Arial";
        ctx.fillText(selectedItem.description, 400, 610);
        ctx.fillText(selectedItem.tooltip, 400, 640);
    }
}




