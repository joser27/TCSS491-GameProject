class Outro {
    constructor(gameEngine, sceneManager) {
        console.log("Constructing outro");
        this.sceneManager = sceneManager;
        this.gameEngine = gameEngine;
        this.screen1 = 0; // Tracks current scene
        this.offsetX = 0;
        this.scene2 = false;
        
        ASSET_MANAGER.pauseBackgroundMusic();
        // ASSET_MANAGER.playAsset("./assets/music/music1.mp3");
        // Dialogue for each screen
        this.texts = [
            "After David defeated all the Shadow King’s minions and Shadow King ",
            "Mia, his daughter, is there, trembling, her eyes filled with fear and tear.",
            "'I’ve got you, sweetheart. You’re safe now.' David said and untie her",
            "He took over all the Shadow King's treasure and live inside Obsidian Tower with his daughter",
            "Happy Ending!"
        ];

        this.currentText = "";  // Text displayed letter-by-letter
        this.charIndex = 0;  // Tracks how many characters have been printed
        this.typingSpeed = 50;  // Speed of typewriter effect
        this.lastTypingTime = 0;  // Tracks last character render time

        this.runAnimation = new Animator(
            ASSET_MANAGER.getAsset("./assets/sprites/white_fight_spritesheet.png"),
            512 * 58, // 59th sprite
            0,
            512,
            512,
            8,
            0.1,
            .8,
            true
        );
    }

    update() {
        if(this.offsetX <= 450 && this.scene2) {
            this.offsetX+= 1;
        }

        // Prevents invalid screen index
        if (this.screen1 >= this.texts.length) return;

        if (this.gameEngine.keys["Enter"] && !this.lastEnterPress) {
            if (this.charIndex < this.texts[this.screen1].length) {
                // Instantly display full text if Enter is pressed before it finishes
                this.charIndex = this.texts[this.screen1].length;
            } else {
                // Move to next scene
                if (this.screen1 < this.texts.length - 1) {
                    this.screen1++;
                    this.charIndex = 0;
                } else {
                    this.sceneManager.transitionToScene(MenuScene); // Move to Menu
                }
            }
        }
        this.lastEnterPress = this.gameEngine.keys["Enter"];
    }

    draw(ctx) {
        ctx.clearRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
        ctx.textAlign = 'center';
        const castle = new Image();
        const outro1  = new Image();
        const boss  = new Image();
        const daughter = new Image();
        const player = new Image();
        const hug = new Image();
        
        if (this.screen1 === 0) {
            this.drawscene1(ctx,outro1,boss);
        } else if (this.screen1 === 1) {
            this.drawscene2(ctx,outro1,boss,daughter,player,this.offsetX);
        } else if (this.screen1 === 2) {
            this.drawscene3(ctx,outro1,boss,hug);
        } else if (this.screen1 === 3) {
            this.drawcastle(ctx,castle);
        } else if (this.screen1 === 4) {
            this.drawHappyEnding(ctx,castle);
        } 
    }

    drawscene1(ctx,outro1,boss) {
        outro1.src = './assets/sprites/outro1.png';
        ctx.drawImage(outro1, 0, 0, 1280, 500);
        boss.src = './assets/sprites/finalboss_killed.png';
        ctx.drawImage(boss, 100,350,138,90);
        this.drawTextbar(ctx);
        this.displayText(ctx, this.texts[0]);

        if (this.charIndex >= this.texts[0].length) {
            ctx.font = "15px Arial";
            ctx.fillText("Press Enter ", 1200, 700);
        }
    }

    drawscene2(ctx,outro1,boss,daughter,player,offsetX) {
        this.scene2 = true;
        outro1.src = './assets/sprites/outro1.png';
        boss.src = './assets/sprites/finalboss_killed.png';
        daughter.src = './assets/sprites/pink_robbed.png';
        player.src = './assets/sprites/white_pic.png';
        
        ctx.drawImage(outro1, 0, 0, 1280, 500);
        ctx.drawImage(boss, 100,350,138,90);
        ctx.drawImage(daughter, 925, 350, 50,71);
        if(offsetX < 450) { //moving
            this.runAnimation.drawFrame(this.gameEngine.clockTick, ctx, 200 + offsetX,125);
        } else {
            ctx.drawImage(player, 800,275, 100,150);
        }
        this.drawTextbar(ctx);
        this.displayText(ctx, this.texts[1]);
        if (this.charIndex >= this.texts[1].length) {
            ctx.font = "15px Arial";
            ctx.fillText("Press Enter ", 1200, 700);
        }
    }

    drawscene3(ctx,outro1,boss,hug) {
        hug.src = './assets/sprites/hug.png';
        outro1.src = './assets/sprites/outro1.png';
        boss.src = './assets/sprites/finalboss_killed.png';
        
        ctx.drawImage(outro1, 0, 0, 1280, 500);
        ctx.drawImage(boss, 100,350,138,90);

        ctx.drawImage(hug, 925, 300, 95,141);
        
        this.drawTextbar(ctx);
        this.displayText(ctx, this.texts[2]);
        if (this.charIndex >= this.texts[2].length) {
            ctx.font = "15px Arial";
            ctx.fillText("Press Enter ", 1200, 700);
        }
    }

    drawcastle(ctx,castle) {
        castle.src = './assets/sprites/castle1.png';
        ctx.drawImage(castle, 0, 0, 1280, 500);
        this.drawTextbar(ctx);
        this.displayText(ctx, this.texts[3]);

        if (this.charIndex >= this.texts[3].length) {
            ctx.font = "15px Arial";
            ctx.fillText("Press Enter ", 1200, 700);
        }
    }

    drawHappyEnding(ctx,castle) {
        castle.src = './assets/sprites/castle1.png';
        ctx.drawImage(castle, 0, 0, 1280, 500);
        this.drawTextbar(ctx);
        this.displayText(ctx, this.texts[4]);

        if (this.charIndex >= this.texts[4].length) {
            ctx.font = "15px Arial";
            ctx.fillText("Press Enter ", 1200, 700);
        }
    }


    
   
    displayText(ctx, text) {
        // Ensure typing effect runs at correct speed
        if (Date.now() - this.lastTypingTime > this.typingSpeed && this.charIndex < text.length) {
            this.charIndex++;
            this.lastTypingTime = Date.now();
        }

        ctx.fillStyle = "black";
        ctx.font = "25px Arial";
        ctx.fillText(text.substring(0, this.charIndex), PARAMS.canvasWidth / 2, 585);
    }

    drawTextbar(ctx) {
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 450, 1280, 270);
        ctx.fillStyle = "white";
        ctx.fillRect(10, 460, 1260, 250);
    }


}
