class LevelManager {
    constructor(gameEngine, player, camera) {
        this.gameEngine = gameEngine;
        this.camera = camera;
        this.debugPlayer = true;
        this.player = player;
        this.GRID_COLS = Math.floor(PARAMS.canvasWidth / PARAMS.CELL_SIZE);
        this.GRID_ROWS = Math.floor(PARAMS.canvasHeight / PARAMS.CELL_SIZE);
    }

    update() {
        // Update level elements
    }

    draw(ctx) {
        this.drawGrid(ctx);
    }

    drawGrid(ctx) {
        const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;
        // Calculate perspective values
        const angleInRadians = (PARAMS.GRID_PERSPECTIVE_ANGLE * Math.PI) / 180;
        const xOffset = (PARAMS.canvasHeight/2) * Math.tan(angleInRadians);
        
        if (this.debugPlayer) {
            // Get player's current cell
            let playerCellX = Math.floor(this.player.x / PARAMS.CELL_SIZE);
            const playerCellY = Math.floor(this.player.y / PARAMS.CELL_SIZE);
            
            // Adjust playerCellX based on perspective if in bottom half
            if (this.player.y >= PARAMS.canvasHeight/2) {
                const progress = (this.player.y - PARAMS.canvasHeight/2) / (PARAMS.canvasHeight/2);
                const angleInRadians = (PARAMS.GRID_PERSPECTIVE_ANGLE * Math.PI) / 180;
                const xOffset = (PARAMS.canvasHeight/2) * Math.tan(angleInRadians);
                const adjustedX = this.player.x + (xOffset * progress);
                playerCellX = Math.floor(adjustedX / PARAMS.CELL_SIZE);
            }
            ctx.fillStyle = rgba(0, 255, 0, 0.3); // semi-transparent green
            let cellX = playerCellX * PARAMS.CELL_SIZE - this.camera.x;
            const cellY = playerCellY * PARAMS.CELL_SIZE;
            
            // Draw the cell with proper perspective
            if (cellY >= PARAMS.canvasHeight/2) {
                // For cells in bottom half, calculate perspective
                const progress = (cellY - PARAMS.canvasHeight/2) / (PARAMS.canvasHeight/2);
                const currentXOffset = xOffset * progress;
                const nextRowOffset = xOffset * ((cellY + PARAMS.CELL_SIZE - PARAMS.canvasHeight/2) / (PARAMS.canvasHeight/2));
                
                // Adjust cellX by the perspective offset
                cellX -= currentXOffset;
                
                // Draw trapezoid shape
                ctx.beginPath();
                ctx.moveTo(cellX, cellY);
                ctx.lineTo(cellX + PARAMS.CELL_SIZE, cellY);
                ctx.lineTo(cellX + PARAMS.CELL_SIZE - (nextRowOffset - currentXOffset), cellY + PARAMS.CELL_SIZE);
                ctx.lineTo(cellX - (nextRowOffset - currentXOffset), cellY + PARAMS.CELL_SIZE);
                ctx.closePath();
                ctx.fill();
            } else {
                // For cells in top half, draw regular rectangle
                ctx.fillRect(cellX, cellY, PARAMS.CELL_SIZE, PARAMS.CELL_SIZE);
            }
        }

        ctx.strokeStyle = rgba(100, 100, 100, 1);
        ctx.lineWidth = 2;
        
        const startX = -this.camera.x;
        
        const extraCols = Math.ceil(xOffset / PARAMS.CELL_SIZE) + 2;
        const startCol = Math.floor(this.camera.x / PARAMS.CELL_SIZE) - extraCols;
        const endCol = startCol + this.GRID_COLS + (extraCols * 2);
        
        // Draw vertical lines
        for (let col = startCol; col <= endCol; col++) {
            const x = col * PARAMS.CELL_SIZE - this.camera.x;
            ctx.beginPath();
            ctx.moveTo(x, 0); // Start straight from top
            ctx.lineTo(x, PARAMS.canvasHeight/2); // Draw straight to middle
            // Then draw slanted line from middle to bottom
            ctx.lineTo(x - xOffset, PARAMS.canvasHeight);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let row = 0; row < this.GRID_ROWS; row++) {
            const y = row * PARAMS.CELL_SIZE;
            ctx.beginPath();
            
            // If in top half, draw straight lines
            if (y < PARAMS.canvasHeight/2) {
                ctx.moveTo(0, y);
                ctx.lineTo(PARAMS.canvasWidth, y);
            } else {
                // For bottom half, adjust line endpoints based on perspective
                const progress = (y - PARAMS.canvasHeight) / (PARAMS.canvasHeight);
                const currentXOffset = xOffset * progress;
                ctx.moveTo(currentXOffset, y);
                ctx.lineTo(PARAMS.canvasWidth - currentXOffset, y);
            }
            ctx.stroke();
        }

        if (PARAMS.DEBUG) {
            // Draw coordinates
            ctx.fillStyle = rgba(0, 0, 0, 1);
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Calculate visible columns including the perspective area
            const coordStartCol = Math.floor(this.camera.x / PARAMS.CELL_SIZE) - extraCols;
            const coordEndCol = coordStartCol + this.GRID_COLS + (extraCols * 2);
            
            for (let row = 0; row < this.GRID_ROWS; row++) {
                for (let col = coordStartCol; col < coordEndCol; col++) {
                    const y = row * PARAMS.CELL_SIZE;
                    let x = col * PARAMS.CELL_SIZE - this.camera.x + PARAMS.CELL_SIZE / 2;
                    
                    if (y >= PARAMS.canvasHeight/2) {
                        const progress = (y - PARAMS.canvasHeight/2) / (PARAMS.canvasHeight/2);
                        const currentXOffset = xOffset * progress;
                        x -= currentXOffset;
                    }
                    
                    // draw coordinates if they're within the visible area
                    if (x >= 0 && x <= PARAMS.canvasWidth) {
                        ctx.fillText(`${col},${row}`, x, y + PARAMS.CELL_SIZE / 2);
                    }
                }
            }
        }
    }
}
