class Outfit {
    constructor(gameState, gameEngine) {
        this.gameState = gameState;
        this.gameEngine = gameEngine;
        this.items = {
            copHat: null,
        };
        this.cosmetics = {
            copHat: {
                spriteSheet: "./assets/sprites/cop_hat.png",
                offsetX: {
                    right: {
                        idle: 0,
                        moving: 10
                    },
                    left: {
                        idle: 0,
                        moving: 10
                    }
                },
                offsetY: {
                    idle: -70,
                    moving: -70
                },
                scale: 0.3,
                bobSpeed: 5,
                bobHeight: 1
            }
        };
    }

    draw(ctx, x, y, facingLeft, isMoving) {
        ctx.save();

        const screenX = x - this.gameEngine.camera.x;
        const bobAmount = isMoving ? Math.sin(this.gameEngine.timer.gameTime * this.cosmetics.copHat.bobSpeed) 
                                   * this.cosmetics.copHat.bobHeight : 0;

        if (facingLeft) {
            ctx.scale(-1, 1);
            ctx.translate(-screenX * 2 - (512 * 0.8) + (165 * 2), 0);
        }

        // Draw each equipped item
        for (const [slot, itemId] of Object.entries(this.items)) {
            if (itemId && this.cosmetics[itemId]) {
                const item = this.cosmetics[itemId];
                const sprite = ASSET_MANAGER.getAsset(item.spriteSheet);
                
                if (sprite) {
                    const moveState = isMoving ? 'moving' : 'idle';
                    const direction = facingLeft ? 'left' : 'right';
                    
                    // Apply offsets based on movement state plus bobbing
                    let offsetX = item.offsetX[direction][moveState];
                    let offsetY = item.offsetY[moveState] + bobAmount;  // Add bobbing to the Y offset
                    
                    ctx.drawImage(
                        sprite,
                        screenX + offsetX,
                        y + offsetY,
                        sprite.naturalWidth * item.scale,
                        sprite.naturalHeight * item.scale
                    );
                }
            }
        }
        ctx.restore();
    }

    equip(slot, itemId) {
        if (this.cosmetics[itemId]) {
            this.items[slot] = itemId;
        }
    }

    unequip(slot) {
        delete this.items[slot];
    }
}

