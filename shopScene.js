class ShopScene {
    constructor(gameEngine, sceneManager, gameState) {
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;
        this.gameState = gameState;
        this.removeFromWorld = false;
        this.name = "Devil's Deal"

        this.shopBackground = ASSET_MANAGER.getAsset("./assets/sprites/shopImage.png");
        
        // shop items with Exit option added at the end
        this.shopItems = [
            {
                name: "Berserker Mode",
                icon: "🩸",
                description: "When HP is below 50%, attacks deal +20% more damage.",
                price: 1,
                tooltip: "For aggressive players who take risks."
            },
            {
                name: "Titan Guard",
                icon: "🛡️",
                description: "Taking damage briefly makes you invincible for 1 second.",
                price: 1,
                tooltip: "For defensive players who struggle against combos."
            },
            {
                name: "Sharpened Steel",
                icon: "⚔️",
                description: "Sword deals +15% more damage.",
                price: 1,
                tooltip: "For sword-focused players."
            },
            {
                name: "Gunslinger",
                icon: "🔫",
                description: "Gun reloads twice as fast.",
                price: 1,
                tooltip: "For gun-focused players."
            },
            {
                name: "Shadow Step",
                icon: "👣",
                description: "Dodge roll distance is longer and faster.",
                price: 1,
                tooltip: "For defensive players who like speed."
            },
            {
                name: "Exit Shop",
                icon: "🚪",
                description: "Return to game",
                price: 0,
                tooltip: "Press Enter to exit shop"
            }
        ];
        
        this.selectedIndex = 0;
        this.keyPressed = false;
        
        // cooldown timer for entering the shop
        this.entryCooldown = 1;
        this.currentCooldown = this.entryCooldown;
    }

    update() {
        // Handle cooldown timer
        if (this.currentCooldown > 0) {
            this.currentCooldown -= this.gameEngine.clockTick;
            return; // Skip input handling during cooldown
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
                // Check if Exit option is selected
                if (this.selectedIndex === this.shopItems.length - 1) {
                    // Exit shop and return to game
                    this.sceneManager.transitionToScene(PlayingScene);
                } else {
                    // Handle purchase logic
                    const selectedItem = this.shopItems[this.selectedIndex];
                    const playerStats = this.gameState.playerStats;
                    
                    // Check if player has enough coins and hasn't already bought the upgrade
                    if (playerStats.coins >= selectedItem.price && 
                        !playerStats.upgrades[this.getUpgradeKey(selectedItem.name)]) {
                        
                        // Deduct coins and apply upgrade
                        playerStats.coins -= selectedItem.price;
                        playerStats.upgrades[this.getUpgradeKey(selectedItem.name)] = true;
                        console.log(`Purchased ${selectedItem.name}`);
                    }
                }
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

    // Helper method to convert item names to upgrade keys
    getUpgradeKey(itemName) {
        const keyMap = {
            "Berserker Mode": "berserkerMode",
            "Titan Guard": "titanGuard",
            "Sharpened Steel": "sharpenedSteel",
            "Gunslinger": "gunslinger",
            "Shadow Step": "shadowStep"
        };
        return keyMap[itemName];
    }

    draw(ctx) {
        ctx.drawImage(this.shopBackground, 0, 0);
        
        // Draw current coins
        ctx.font = "32px Arial";
        ctx.fillStyle = "gold";
        ctx.textAlign = "left";
        ctx.fillText(`Coins: ${this.gameState.playerStats.coins}`, 50, 50);
        
        // Draw items
        const startX = 200;
        const spacing = 150;
        const y = 400;

        this.shopItems.forEach((item, index) => {
            const x = startX + (spacing * index);
            
            // Draw item
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            
            // Determine item color based on selection, affordability, and purchase status
            if (index === this.selectedIndex) {
                if (this.gameState.playerStats.upgrades[this.getUpgradeKey(item.name)]) {
                    ctx.fillStyle = "#808080"; // Gray for already purchased
                } else if (this.gameState.playerStats.coins >= item.price) {
                    ctx.fillStyle = "#FFD700"; // Gold if can afford
                } else {
                    ctx.fillStyle = "#FF0000"; // Red if cannot afford
                }
                ctx.fillText(">" + item.icon + "<", x, y);
            } else {
                if (this.gameState.playerStats.upgrades[this.getUpgradeKey(item.name)]) {
                    ctx.fillStyle = "#808080"; // Gray for already purchased
                } else {
                    ctx.fillStyle = "white";
                }
                ctx.fillText(item.icon, x, y);
            }
            
            // Draw price or "OWNED" text
            ctx.font = "16px Arial";
            if (this.gameState.playerStats.upgrades[this.getUpgradeKey(item.name)]) {
                ctx.fillText("OWNED", x, y + 30);
            } else {
                ctx.fillText(`${item.price} Coins`, x, y + 30);
            }
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




