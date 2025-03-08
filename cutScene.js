class CutScene {
    constructor(gameEngine, sceneManager, gameState) {
        console.log("Constructing CutScene");
        this.sceneManager = sceneManager;
        this.gameEngine = gameEngine;
        this.screen1 = 0; // Tracks current scene
        this.night = true;

        // Dialogue for each screen
        this.texts = [
            "David, despite financial problems lived a simple and happy life with his daughter Mia.",
            "One night, while David was away, the Shadow King’s minions destroyed their home.",
            "They kidnapped Mia, leaving only a note: 'You will find her in the Obsidian Tower.'",
            "David must fight to save his daughter! Would you help?"
        ];

        this.currentText = "";  // Text displayed letter-by-letter
        this.charIndex = 0;  // Tracks how many characters have been printed
        this.typingSpeed = 50;  // Speed of typewriter effect
        this.lastTypingTime = Date.now();  // Tracks last character render time
    }

    update() {
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
                    this.lastTypingTime = Date.now();
                    this.currentText = ""; 
                } else {
                    this.sceneManager.transitionToScene(PlayingScene); // Move to gameplay
                }
            }
        }
        this.lastEnterPress = this.gameEngine.keys["Enter"];
    }

    draw(ctx) {
        const bg = new Image();
        const house = new Image();
        const y = new Image();
        const r = new Image();
        const b = new Image();
        const note = new Image();
        const daughter = new Image();
        const player = new Image();
        const boss2 = new Image();
        const boss3 = new Image();
        bg.src = './assets/sprites/far-grounds.png';
        house.src = './assets/sprites/building3.png';

        if (this.screen1 === 0) {
            this.drawDayScene(ctx, bg, house,daughter, player);
        } else if (this.screen1 === 1) {
            this.drawNightScene(ctx, bg, house, y, r, b,boss2,boss3);
        } else if (this.screen1 === 2) {
            this.drawNoteScene(ctx, bg, house, note);
        } else if (this.screen1 === 3) {
            this.drawFinalScene(ctx, bg, house,player);
        }
    }

    drawDayScene(ctx, bg, house, daughter, player) {
        daughter.src = './assets/sprites/pink_pic.png';
        player.src = './assets/sprites/white_pic.png';
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
        ctx.drawImage(bg, 0, 0, 1280, 500);
        ctx.drawImage(house, 800, 200, 125, 100);
        ctx.drawImage(daughter, 825, 300, 20,35);
        ctx.drawImage(player, 750, 250, 55,88);
        this.drawTextbar(ctx);
        this.drawDaySky(ctx);

        this.displayText(ctx, this.texts[0]);

        if (this.charIndex >= this.texts[0].length) {
            ctx.font = "15px Arial";
            ctx.fillText("Press Enter ", 1200, 700);
        }
    }

    drawNightScene(ctx, bg, house, y, r, b,boss2,boss3) {
        ctx.fillStyle = "#0a0a23";
        ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
        ctx.drawImage(bg, 0, 0, 1280, 500);
        ctx.drawImage(house, 800, 200, 125, 100);
        this.drawTextbar(ctx);
        this.drawNightSky(ctx);

        this.displayText(ctx, this.texts[1]);

        y.src = './assets/sprites/yellow_fight_pic.png';
        ctx.drawImage(y, 500, 300, 52, 82);
        r.src = './assets/sprites/red_pistol_pic.png';
        ctx.drawImage(r, 600, 300, 90, 85);
        b.src = './assets/sprites/blue_sword_pic.png';
        ctx.drawImage(b, 700, 300, 79, 82);
        boss2.src = './assets/sprites/boss2.png';
        ctx.drawImage(boss2, 400, 300, 90, 85);
        boss3.src = './assets/sprites/boss3.png';
        ctx.drawImage(boss3, 300, 300, 79, 82);

        if (this.charIndex >= this.texts[1].length) {
            ctx.font = "15px Arial";
            ctx.fillText("Press Enter ", 1200, 700);
        }
    }

    drawNoteScene(ctx, bg, house, note) {
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
        ctx.drawImage(bg, 0, 0, 1280, 500);
        ctx.drawImage(house, 800, 200, 125, 100);
        this.drawTextbar(ctx);
        this.drawDaySky(ctx);

        note.src = './assets/sprites/notepaper.png';
        ctx.drawImage(note, PARAMS.canvasWidth / 2 - 250, 100, 500, 300);
        this.displayText(ctx, this.texts[2]);

        if (this.charIndex >= this.texts[2].length) {
            ctx.font = "15px Arial";
            ctx.fillText("Press Enter ", 1200, 700);
        }
    }

    drawFinalScene(ctx, bg, house) {
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
        ctx.drawImage(bg, 0, 0, 1280, 500);
        ctx.drawImage(house, 800, 200, 125, 100);
        this.drawTextbar(ctx);
        this.drawDaySky(ctx);

        ctx.fillStyle = "red";
        ctx.font = "45px Arial";

        this.displayText(ctx, this.texts[3], "red");

        if (this.charIndex >= this.texts[3].length) {
            ctx.font = "15px Arial";
            ctx.strokeStyle = "black";
            ctx.fillText("Press Enter ", 1200, 700);
        }
    }

    displayText(ctx, text, color = "black") {
        // Ensure typing effect runs at correct speed

        if (this.charIndex === 0 && this.screen1 === 0) {
            this.lastTypingTime = Date.now();  // Ensure first screen starts typing immediately
        }
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

    drawNightSky(ctx) {
        const moonRadius = 50;
        const moonX = PARAMS.canvasWidth * 0.9;
        const moonY = PARAMS.canvasHeight * 0.1;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
    }

    drawDaySky(ctx) {
        const sunRadius = 50;
        const sunX = PARAMS.canvasWidth * 0.9;
        const sunY = PARAMS.canvasHeight * 0.1;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }
}
