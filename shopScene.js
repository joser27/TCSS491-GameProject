class ShopScene {
    constructor(gameEngine, sceneManager, gameState) {
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;
        this.gameState = gameState;
        this.removeFromWorld = false;
        this.name = "Devil's Deal"

        this.shopBackground = ASSET_MANAGER.getAsset("./assets/sprites/shopImage.png");
        
        // Add discount percentages
        this.discounts = {
            unlockGun: 20,    // 20% off
            unlockSword: 30,  // 30% off
            unlockJump: 25    // 25% off
        };

        // shop items with Exit option added at the end
        this.shopItems = [
            {
                id: 'unlockGun',
                name: 'Unlock Gun',
                icon: '🔫',
                description: 'Unlocks the ability to use a gun',
                originalPrice: 100,
                price: this.calculateDiscountedPrice('unlockGun', 30),
                tooltip: "Press G to equip gun once purchased"
            },
            {
                id: 'unlockSword',
                name: 'Unlock Sword',
                icon: '⚔️',
                description: 'Unlocks the ability to use a sword',
                originalPrice: 150,
                price: this.calculateDiscountedPrice('unlockSword', 20),
                tooltip: "Press Q to equip sword once purchased"
            },
            {
                id: 'unlockJump',
                name: 'Unlock Jump',
                icon: '⬆️',
                description: 'Unlocks the ability to jump',
                originalPrice: 200,
                price: this.calculateDiscountedPrice('unlockJump', 1000),
                tooltip: "Press SPACE to jump once purchased"
            },
            {
                name: 'Exit Shop',
                icon: '🚪',
                description: 'Return to game',
                price: 0,
                tooltip: "Press Enter to exit shop"
            }
        ];
        
        this.selectedIndex = 0;
        this.keyPressed = false;
        
        // cooldown timer for entering the shop
        this.entryCooldown = 1;
        this.currentCooldown = this.entryCooldown;

        // Sound paths
        this.sounds = {
            purchase: "./assets/sound/cash-register-purchase.mp3",
            noFunds: "./assets/sound/no-funds.mp3"
        };
    }

    calculateDiscountedPrice(itemId, originalPrice) {
        if (this.discounts[itemId]) {
            return Math.floor(originalPrice * (1 - this.discounts[itemId] / 100));
        }
        return originalPrice;
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
                    if (selectedItem.id) { // Only process items with an ID (not the exit option)
                        if (playerStats.coins >= selectedItem.price && 
                            !playerStats.upgrades[selectedItem.id]) {
                            
                            // Deduct coins and apply upgrade
                            playerStats.coins -= selectedItem.price;
                            playerStats.upgrades[selectedItem.id] = true;
                            ASSET_MANAGER.playAsset(this.sounds.purchase);
                            console.log(`Purchased ${selectedItem.name}`);
                        } else if (playerStats.upgrades[selectedItem.id]) {
                            console.log("Already owned!");
                            ASSET_MANAGER.playAsset(this.sounds.noFunds);
                        } else {
                            console.log("Not enough coins!");
                            ASSET_MANAGER.playAsset(this.sounds.noFunds);
                        }
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

    draw(ctx) {
        ctx.drawImage(this.shopBackground, 0, 0);
        
        // Draw current coins
        ctx.font = "32px eager___";
        ctx.fillStyle = "gold";
        ctx.textAlign = "left";
        ctx.fillText(`Coins: ${this.gameState.playerStats.coins}`, 50, 50);
        ctx.textAlign = "left"; // Reset alignment
        
        // Draw items
        const startX = 200;
        const spacing = 150;
        const y = 400;

        this.shopItems.forEach((item, index) => {
            const x = startX + (spacing * index);
            
            // Draw item icon
            ctx.font = "30px eager___";
            ctx.textAlign = "center";
            ctx.fillStyle = index === this.selectedIndex ? "#FFD700" : "white";
            
            if (item.id && this.gameState.playerStats.upgrades[item.id]) {
                ctx.fillStyle = "#808080"; // Gray for owned items
            }
            
            ctx.fillText(index === this.selectedIndex ? ">" + item.icon + "<" : item.icon, x, y);
            
            // Draw price or owned status
            ctx.font = "16px eager___";
            if (item.id && !this.gameState.playerStats.upgrades[item.id]) {
                if (item.originalPrice !== item.price) {
                    ctx.fillStyle = "#4CAF50"; // Green for discount
                    ctx.fillText(`${this.discounts[item.id]}% OFF!`, x, y + 30);
                    ctx.fillStyle = "#FFD700"; // Gold for price
                    ctx.fillText(`${item.price} Coins`, x, y + 50);
                } else {
                    ctx.fillText(`${item.price} Coins`, x, y + 30);
                }
            } else if (item.id) {
                ctx.fillText("OWNED", x, y + 30);
            }
        });
        
        // Draw description of selected item
        const selectedItem = this.shopItems[this.selectedIndex];
        ctx.fillStyle = "white";
        ctx.font = "20px eager___";
        ctx.textAlign = "center";
        ctx.fillText(selectedItem.name, 400, 580);
        ctx.font = "16px eager___";
        ctx.fillText(selectedItem.description, 400, 610);
        ctx.fillText(selectedItem.tooltip, 400, 640);

        // Reset all context properties
        ctx.textAlign = "left";
        ctx.fillStyle = "white";
        ctx.font = "16px eager___";
    }
}




