class InteractableObject {
    constructor(x, y, width, height, offsetX, offsetY, camera, image, scale = 1) {
        this.width = width;
        this.height = height;
        this.x = x * PARAMS.CELL_SIZE;
        this.y = y * PARAMS.CELL_SIZE;
        this.image = image;
        this.scale = scale;
        this.camera = camera;
        
        // Adjust image position
        this.x = this.x - offsetX;
        this.y = this.y - offsetY;
        
        // Create bounding box at the intended ground position
        this.boundingBox = new BoundingBox(
            this.x + offsetX,  // Move bounding box to intended ground position
            this.y + offsetY,  // Move bounding box to intended ground position
            this.width, 
            this.height
        );
        
        this.health = 100;
        // Set zIndex based on the bottom of the bounding box, NOT the image position
        this.zIndex = (this.boundingBox.y + this.boundingBox.height) * 0.1;
        this.isFixedZ = false;
    }

    onHit(player) {
        if (this.isInteractable) {
            console.log("Object was hit!");
        }
    }

    update() {
        // Update zIndex based on the bottom of the bounding box, NOT the image position
        this.zIndex = (this.boundingBox.y + this.boundingBox.height) * 0.1;
    }

    draw(ctx) {
        ctx.imageSmoothingEnabled = false;
        
        ctx.drawImage(
            this.image, 
            this.x - this.camera.x, 
            this.y, 
            this.image.width * this.scale, 
            this.image.height * this.scale
        );

        if (PARAMS.DEBUG) {
            // Draw collision bounding box in red
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(
                this.boundingBox.x - this.camera.x, 
                this.boundingBox.y, 
                this.boundingBox.width, 
                this.boundingBox.height
            );
        }
    }
}
