class UpgradeMenu {
    constructor(gameState, gameEngine) {
        this.gameState = gameState;
        this.gameEngine = gameEngine;
        this.isOpen = false;
        this.upgrades = [
            {
                id: 'unlockGun',
                name: 'Unlock Gun',
                cost: 30,
                description: 'Unlocks the ability to use a gun',
            },
            {
                id: 'unlockSword',
                name: 'Unlock Sword',
                cost: 20,
                description: 'Unlocks the ability to use a sword',
            },
            {
                id: 'unlockJump',
                name: 'Unlock Jump',
                cost: 1000,
                description: 'Unlocks the ability to jump',
            }
        ];
        this.selectedIndex = 0;
        
        this.keyPressed = {
            ArrowUp: false,
            ArrowDown: false,
            Enter: false
        };
        this.isFixedZ = true;
        this.zIndex = 500;

        // notification properties
        this.notification = null;
        this.notificationTimer = 0;
        this.notificationDuration = 2000;

        // Sound paths
        this.sounds = {
            purchase: "./assets/sound/cash-register-purchase.mp3",
            noFunds: "./assets/sound/no-funds.mp3"
        };
    }

    update() {
        // Handle menu toggle
        if (this.gameEngine.keys['b']) {
            this.toggle();
            this.gameEngine.keys['b'] = false;
        }

        // Only process input if menu is open
        if (this.isOpen) {
            this.handleInput(this.gameEngine);
        }

        // Update notification timer
        if (this.notification && this.notificationTimer > 0) {
            this.notificationTimer -= this.gameEngine.clockTick * 1000;
            if (this.notificationTimer <= 0) {
                this.notification = null;
            }
        }
    }
    

    draw(ctx) {
        if (!this.isOpen) return;

        // Get canvas dimensions
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        // Menu dimensions
        const menuWidth = 600;
        const menuHeight = 400;

        // Calculate center position
        const menuX = (canvasWidth - menuWidth) / 2;
        const menuY = (canvasHeight - menuHeight) / 2;

        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

        // Title
        ctx.font = '48px eager___';
        ctx.fillStyle = "#FFD700"; // Gold color to match menu scene
        ctx.textAlign = 'center';
        ctx.fillText('UPGRADE MENU', canvasWidth / 2, menuY + 50);

        // Draw upgrades
        ctx.font = '24px eager___';
        this.upgrades.forEach((upgrade, index) => {
            const y = menuY + 100 + (index * 50);
            const isSelected = index === this.selectedIndex;
            const isOwned = this.gameState.playerStats.upgrades[upgrade.id];
            
            // Highlight selected item
            if (isSelected) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(menuX + 20, y - 20, menuWidth - 40, 30);
            }

            ctx.fillStyle = isOwned ? 'gray' : 'white';
            ctx.textAlign = 'left';
            ctx.fillText(upgrade.name, menuX + 30, y);
            
            ctx.textAlign = 'right';
            ctx.fillText(isOwned ? 'Owned' : `${upgrade.cost} coins`, menuX + menuWidth - 30, y);
        });

        // Draw description
        ctx.font = '20px eager___';
        ctx.fillStyle = "#FFD700"; // Gold color for description
        ctx.textAlign = 'center';
        ctx.fillText(this.upgrades[this.selectedIndex].description, canvasWidth / 2, menuY + menuHeight - 40);

        // Draw notification if exists
        if (this.notification) {
            ctx.font = '24px eager___';
            ctx.fillStyle = this.notification.color;
            ctx.textAlign = 'center';
            ctx.fillText(this.notification.message, canvasWidth / 2, menuY + menuHeight + 30);
        }
    }

    handleInput(input) {
        if (!this.isOpen) return;

        // Handle Up Arrow
        if (input.keys['ArrowUp'] && !this.keyPressed.ArrowUp) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            this.keyPressed.ArrowUp = true;
        }
        if (!input.keys['ArrowUp']) {
            this.keyPressed.ArrowUp = false;
        }

        // Handle Down Arrow
        if (input.keys['ArrowDown'] && !this.keyPressed.ArrowDown) {
            this.selectedIndex = Math.min(this.upgrades.length - 1, this.selectedIndex + 1);
            this.keyPressed.ArrowDown = true;
        }
        if (!input.keys['ArrowDown']) {
            this.keyPressed.ArrowDown = false;
        }

        // Handle Enter
        if (input.keys['Enter'] && !this.keyPressed.Enter) {
            this.purchaseUpgrade();
            this.keyPressed.Enter = true;
        }
        if (!input.keys['Enter']) {
            this.keyPressed.Enter = false;
        }
    }

    purchaseUpgrade() {
        const selectedUpgrade = this.upgrades[this.selectedIndex];
        
        // Check if already owned
        if (this.gameState.playerStats.upgrades[selectedUpgrade.id]) {
            this.showNotification("Already owned!", "red");
            ASSET_MANAGER.playAsset(this.sounds.noFunds);
            return;
        }

        // Check if enough coins
        if (this.gameState.playerStats.coins >= selectedUpgrade.cost) {
            this.gameState.playerStats.coins -= selectedUpgrade.cost;
            this.gameState.playerStats.upgrades[selectedUpgrade.id] = true;
            this.showNotification("Purchase successful!", "green");
            ASSET_MANAGER.playAsset(this.sounds.purchase);
        } else {
            this.showNotification("Not enough coins!", "red");
            ASSET_MANAGER.playAsset(this.sounds.noFunds);
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.selectedIndex = 0;
    }

    showNotification(message, color) {
        this.notification = {
            message: message,
            color: color
        };
        this.notificationTimer = this.notificationDuration;
    }
}
