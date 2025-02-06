class MenuScene {
    constructor(gameEngine, sceneManager) {
        this.sceneManager = sceneManager;
        this.gameEngine = gameEngine;
        this.zIndex = 99;
        this.selectedOption = 0;  // Track which option is selected
        this.options = ['Play', 'How to Play', 'Credits'];
        this.howToPlayScene = null;
        this.creditsScene = null;
        
        // Add cooldown tracking
        this.canSelect = false;  // Start as false to prevent immediate selection
        this.cooldownTime = 500; // milliseconds
        
        // Add initial delay when menu is created
        setTimeout(() => this.canSelect = true, 500);
    }

    update() {
        // Handle menu navigation
        if (this.gameEngine.keys["ArrowDown"] && !this.lastDownPress) {
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
        }
        if (this.gameEngine.keys["ArrowUp"] && !this.lastUpPress) {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
        }
        
        // Store last key state to prevent multiple presses
        this.lastDownPress = this.gameEngine.keys["ArrowDown"];
        this.lastUpPress = this.gameEngine.keys["ArrowUp"];

        // Handle option selection with cooldown
        if (this.gameEngine.keys["Enter"] && this.canSelect) {
            this.canSelect = false;
            setTimeout(() => this.canSelect = true, this.cooldownTime);

            switch(this.selectedOption) {
                case 0: // Play
                    this.sceneManager.clearEntities();
                    this.sceneManager.scene = new PlayingScene(this.gameEngine, this.sceneManager);
                    this.gameEngine.addEntity(this.sceneManager.scene);
                    break;
                case 1: // How to Play
                    console.log("How to Play");
                    this.sceneManager.clearEntities();
                    this.howToPlayScene = new HowToPlayScene(this.gameEngine, this.sceneManager);
                    this.gameEngine.addEntity(this.howToPlayScene);
                    break;
                case 2: // Credits
                    console.log("Credits");
                    this.sceneManager.clearEntities();
                    this.creditsScene = new CreditsScene(this.gameEngine, this.sceneManager);
                    this.gameEngine.addEntity(this.creditsScene);
                    break;
            }
        }
    }

    draw(ctx) {
        // Set background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw title
        ctx.font = "64px eager___";
        ctx.fillStyle = "#FFD700"; // Gold color
        ctx.textAlign = "center";
        ctx.fillText("STICKMAN - THE SAVIOR", ctx.canvas.width / 2, 100);

        // Draw menu options
        ctx.font = "32px eager___";
        const startY = 250;
        const spacing = 60;

        this.options.forEach((option, index) => {
            if (index === this.selectedOption) {
                ctx.fillStyle = "#FF4500"; // Orange-red for selected option
                // Draw selection arrow
                ctx.fillText(">", ctx.canvas.width / 2 - 100, startY + spacing * index);
            } else {
                ctx.fillStyle = "white";
            }
            ctx.fillText(option, ctx.canvas.width / 2, startY + spacing * index);
        });

        // Draw instructions at bottom
        ctx.font = "20px eager___";
        ctx.fillStyle = "#808080"; // Gray color
        ctx.fillText("Use Arrow Keys to Navigate, Enter to Select", ctx.canvas.width / 2, ctx.canvas.height - 50);
    }
}

class HowToPlayScene {
    constructor(gameEngine, sceneManager) {
        this.sceneManager = sceneManager;
        this.gameEngine = gameEngine;
        this.gameEngine.ctx.imageSmoothingEnabled = false;
        // Add input delay when entering scene
        this.canReturn = false;
        setTimeout(() => this.canReturn = true, 500); // 500ms delay
        
        this.arrowKeysDetails = {
            width: 34,
            height: 16,
        }
        this.arrowLeft = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/ARROWLEFT.png"), 
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.arrowRight = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/ARROWRIGHT.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.arrowUp = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/ARROWUP.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.arrowDown = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/ARROWDOWN.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.w = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/W.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.a = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/A.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.s = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/S.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.d = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/D.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.i = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/I.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.j = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/J.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.k = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/K.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
        this.l = new Animator(ASSET_MANAGER.getAsset("./assets/sprites/L.png"),
            0, 0, this.arrowKeysDetails.width/2, this.arrowKeysDetails.height, 2, 0.3, 3, true);
    }

    update() {
        if (this.gameEngine.keys["Enter"] && this.canReturn) {
            this.sceneManager.clearEntities();
            this.sceneManager.scene = new MenuScene(this.gameEngine, this.sceneManager);
            this.gameEngine.addEntity(this.sceneManager.scene);
        }
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.font = "64px eager___";
        ctx.fillStyle = "#FFD700";
        ctx.textAlign = "center";
        ctx.fillText("How to Play", ctx.canvas.width / 2, 100);

        // Draw control instructions
        ctx.font = "24px eager___";
        ctx.fillStyle = "white";
        
        const centerX = ctx.canvas.width / 2;
        const startY = 180;
        const keySpacing = 40; // Space between keys
        
        // WASD Section (left side)
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Movement Controls", centerX, startY);
        
        // W key (top)
        this.w.drawFrame(this.gameEngine.clockTick, ctx, centerX - 150, startY + keySpacing-20);
        // A S D keys (bottom row)
        this.a.drawFrame(this.gameEngine.clockTick, ctx, centerX - 210, startY + keySpacing * 2);
        this.s.drawFrame(this.gameEngine.clockTick, ctx, centerX - 150, startY + keySpacing * 2);
        this.d.drawFrame(this.gameEngine.clockTick, ctx, centerX - 90, startY + keySpacing * 2);

        // Arrow Keys Section (right side)
        // Up arrow (top)
        this.arrowUp.drawFrame(this.gameEngine.clockTick, ctx, centerX + 150, startY + keySpacing-20);
        // Left, Down, Right arrows (bottom row)
        this.arrowLeft.drawFrame(this.gameEngine.clockTick, ctx, centerX + 90, startY + keySpacing * 2);
        this.arrowDown.drawFrame(this.gameEngine.clockTick, ctx, centerX + 150, startY + keySpacing * 2);
        this.arrowRight.drawFrame(this.gameEngine.clockTick, ctx, centerX + 210, startY + keySpacing * 2);

        // Movement description
        ctx.fillStyle = "white";
        ctx.fillText("Move in any direction", centerX, startY + keySpacing * 4);

        // Combat Controls Section
        const combatY = startY + keySpacing * 5;
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Combat Controls", centerX, combatY);

        // I J K L keys in position
        this.i.drawFrame(this.gameEngine.clockTick, ctx, centerX - 100, combatY + keySpacing);
        this.j.drawFrame(this.gameEngine.clockTick, ctx, centerX - 30, combatY + keySpacing);
        this.k.drawFrame(this.gameEngine.clockTick, ctx, centerX + 40, combatY + keySpacing);
        this.l.drawFrame(this.gameEngine.clockTick, ctx, centerX + 110, combatY + keySpacing);

        // Combat control descriptions
        ctx.fillStyle = "white";
        const descY = combatY + keySpacing * 3;
        ctx.fillText("Shop", centerX - 80, descY);
        ctx.fillText("Chop", centerX - 8, descY);
        ctx.fillText("Kick", centerX + 60, descY);
        ctx.fillText("Punch", centerX + 140, descY);

        // Return instruction
        ctx.font = "20px eager___";
        ctx.fillStyle = "#808080";
        ctx.fillText("Press Enter to return to Menu", ctx.canvas.width / 2, ctx.canvas.height - 50);
    }
}

class CreditsScene {
    constructor(gameEngine, sceneManager) {
        this.sceneManager = sceneManager;
        this.gameEngine = gameEngine;
        
        // Add input delay when entering scene
        this.canReturn = false;
        setTimeout(() => this.canReturn = true, 500); // 500ms delay
    }

    update() {
        if (this.gameEngine.keys["Enter"] && this.canReturn) {
            this.sceneManager.clearEntities();
            this.sceneManager.scene = new MenuScene(this.gameEngine, this.sceneManager);
            this.gameEngine.addEntity(this.sceneManager.scene);
        }
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Title
        ctx.font = "64px eager___";
        ctx.fillStyle = "#FFD700"; // Gold color
        ctx.textAlign = "center";
        ctx.fillText("Credits", ctx.canvas.width / 2, 100);

        // Team members
        ctx.font = "32px eager___";
        ctx.fillStyle = "white";
        const centerX = ctx.canvas.width / 2;
        const startY = 200;
        const spacing = 50;

        // Development Team
        ctx.fillStyle = "#FFD700";
        ctx.fillText("TCSS491 - Blue 4 Team", centerX, startY);
        
        ctx.fillStyle = "white";
        ctx.fillText("Charankamal Brar", centerX, startY + spacing);
        ctx.fillText("Shu-Ren Shen", centerX, startY + spacing * 2);
        ctx.fillText("Jose Rodriguez", centerX, startY + spacing * 3);

        // Assets
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Assets", centerX, startY + spacing * 5);
        
        ctx.fillStyle = "white";
        ctx.font = "24px eager___";
        ctx.fillText("Spritesheets by rgsdev", centerX, startY + spacing * 6);
        ctx.fillText("rgsdev.itch.io", centerX, startY + spacing * 6.5);
        
        ctx.fillText("Keyboard sprites by BeamedEighth", centerX, startY + spacing * 7.5);
        ctx.fillText("beamedeighth.itch.io", centerX, startY + spacing * 8);

        // Return instruction
        ctx.font = "20px eager___";
        ctx.fillStyle = "#808080";
        ctx.fillText("Press Enter to return to Menu", ctx.canvas.width / 2, ctx.canvas.height - 50);
    }
}