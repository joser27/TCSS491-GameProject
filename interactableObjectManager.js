class InteractableObjectManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.objects = [];
        this.loadObjects();
    }
    
    loadObjects() {
        // Load all interactable objects
        const mailBox = new InteractableObject(
            4, 8,                  // x, y
            80, 50,               // width, height
            30, 100,              // offsetX, offsetY
            this.gameEngine.camera,
            ASSET_MANAGER.getAsset("./assets/sprites/city_mailbox.png")
        );
        this.addObject(mailBox);

        const trashCan = new InteractableObject(
            5, 5,
            60, 80,
            85, 90,           
            this.gameEngine.camera,
            ASSET_MANAGER.getAsset("./assets/sprites/trashcan.png")
        );
        this.addObject(trashCan);

        const busSign = new InteractableObject(
            3, 7,
            20, 20,
            45, 200,
            this.gameEngine.camera,
            ASSET_MANAGER.getAsset("./assets/sprites/bus_sign.png")
        );
        this.addObject(busSign);

        const car = new InteractableObject(
            8, 8,
            550, 160,
            50, 10,
            this.gameEngine.camera,
            ASSET_MANAGER.getAsset("./assets/sprites/street_car.png"),
            1.5
        );
        this.addObject(car);
        
    }
    
    addObject(object) {
        this.objects.push(object);
        this.gameEngine.addEntity(object);
    }

    removeObject(object) {
        this.objects = this.objects.filter(o => o !== object);
    }

    interact_with_object(object) {
        // Interaction logic here
    }

    list_objects() {
        return this.objects;
    }

    update() {
        // Update logic here if needed
    }

    draw(ctx) {
        // Draw logic here if needed
    }
}
