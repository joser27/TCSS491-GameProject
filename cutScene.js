class CutScene {
    constructor(gameEngine, sceneManager, gameState) {
        console.log("Constructing CutScene");
        this.sceneManager = sceneManager;

        this.gameEngine = gameEngine;
        this.screen1 = 0;
        this.night = true
        this.runAnimation = new Animator(
            ASSET_MANAGER.getAsset('./assets/sprites/white_fight_spritesheet.png'),
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
        if (this.gameEngine.keys["Enter"] && !this.lastEnterPress) {
            this.screen1 += 1;
            console.log(this.screen1)
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
        bg.src = './assets/sprites/far-grounds.png';
        house.src = './assets/sprites/building3.png';
        if(this.screen1 == 1){
            ctx.fillStyle = "#87CEEB";
            ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
            
    
            const size = 100
             
            
            ctx.drawImage(bg,0 ,0,1280,500);
    
              
            ctx.drawImage(house,800,200, size + 25, size);
    
            this.drawTextbar(ctx)
            this.drawDaySky(ctx)
            ctx.fillStyle = "black"
            ctx.font = "25px Arial";
            ctx.lineWidth = 1;
            

            ctx.fillText("David, A lonely Stickman, lived a simple life with his daughter Mia. They are poor but happy", PARAMS.canvasWidth / 2, 585);
           

            ctx.font = "15px Arial";
            ctx.lineWidth = 1;
            ctx.fillText("Press Enter ",1200, 700)
        } else if(this.screen1 == 2) {
            ctx.fillStyle = "#0a0a23";
            ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
            
            this.drawNightSky(ctx)
            
    
            const size = 100
             
            
            ctx.drawImage(bg,0 ,0,1280,500);
    
              
            ctx.drawImage(house,800,200, size + 25, size);
            this.drawTextbar(ctx)
            ctx.fillStyle = "black";
            ctx.font = "25px Arial";
            ctx.lineWidth = 1;
            ctx.fillText("But one night when David went out for work, The Shadow King’s minions tore through their home", PARAMS.canvasWidth / 2, 585);
            

            y.src = './assets/sprites/yellow_fight_pic.png';
            ctx.drawImage(y,500 ,300 ,52,82);
            r.src = './assets/sprites/red_pistol_pic.png';
            ctx.drawImage(r,600 ,300 ,90,85);
            b.src = './assets/sprites/blue_sword_pic.png';
            ctx.drawImage(b,700 ,300 ,79,82);

            

            ctx.font = "15px Arial";
            ctx.lineWidth = 1;
            ctx.fillText("Press Enter ",1200, 700)

        } else if(this.screen1 == 3) {
            ctx.fillStyle = "#87CEEB";
            ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
            
    
            const size = 100
             
            
            ctx.drawImage(bg,0 ,0,1280,500);            
            ctx.drawImage(house,800,200, size + 25, size);

            
    
            this.drawTextbar(ctx)
            this.drawDaySky(ctx)
            ctx.fillStyle = "black"
            ctx.font = "25px Arial";
            ctx.lineWidth = 1;
        
            

            note.src = './assets/sprites/notepaper.png'
            ctx.drawImage(note, PARAMS.canvasWidth / 2 - 250,100, 500,300);
            ctx.font = "25px handwritten";
            ctx.fillText("U will Find her in the Obsidian Tower", PARAMS.canvasWidth / 2, 250);

            ctx.fillText("They kidnapping Mia and leaving only a note: “U will Find her in the Obsidian Tower.“", PARAMS.canvasWidth / 2, 585);

            ctx.font = "15px Arial";
            ctx.lineWidth = 1;
            ctx.fillText("Press Enter ",1200, 700)

        }else if(this.screen1 == 4){
            ctx.fillStyle = "#87CEEB";
            ctx.fillRect(0, 0, PARAMS.canvasWidth, PARAMS.canvasHeight);
            
    
            const size = 100
             
            
            ctx.drawImage(bg,0 ,0,1280,500);
    
              
            ctx.drawImage(house,800,200, size + 25, size);
    
            this.drawTextbar(ctx)
            this.drawDaySky(ctx)
            ctx.font = "45px Arial";
            ctx.lineWidth = 1;
            ctx.fillStyle = "Red";
            
            
            
            ctx.fillText("Help David to save his daughter!!!!", PARAMS.canvasWidth / 2, 585);

            ctx.font = "15px Arial";
            ctx.strokeStyle = "Black"
            ctx.lineWidth = 1;
            ctx.fillText("Press Enter ",1200, 700)
        }else if(this.screen1 == 5) {
            this.sceneManager.transitionToScene(PlayingScene);
        } else{
            
        }
        


    }

    
    drawTextbar(ctx) {
        ctx.fillStyle = "gray";
        this.drawRoundedRect(ctx, 0, 450, 1280, 270, 15);
        ctx.fillStyle = "white";
        this.drawRoundedRect(ctx, 10, 460, 1260, 250, 15);
    }

    // 繪製圓角矩形
    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        ctx.fill();
    }
    
    drawNightSky(ctx) {
        // Draw stars
        // if(this.night){
        //     for (let i = 0; i < 200; i++) {
        //         const x = Math.random() * PARAMS.canvasWidth;
        //         const y = Math.random() * PARAMS.canvasHeight;
        //         const radius = Math.random() * 2;
        //         ctx.beginPath();
        //         ctx.arc(x, y, radius, 0, Math.PI * 2);
        //         ctx.fillStyle = '#ffffff';
        //         ctx.fill();
        //     }
            
        // }
        
        ctx.beginPath();
        ctx.arc(50, 500, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Draw the moon
        const moonRadius = 50;
        const moonX = PARAMS.canvasWidth * 0.9;
        const moonY = PARAMS.canvasHeight * 0.1;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
  
        // Add some craters to the moon
        drawCrater(moonX - 20, moonY - 10, 10);
        drawCrater(moonX + 20, moonY + 15, 8);
        drawCrater(moonX + 10, moonY - 20, 5);
        function drawCrater(x, y, radius) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#d0d0d0';
            ctx.fill();
        }
    }


    drawDaySky(ctx) {

        const sunRadius = 50;
        const sunX = PARAMS.canvasWidth * 0.9;
        const sunY = PARAMS.canvasHeight * 0.1;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        drawSunRays(sunX, sunY, sunRadius);
        // // Draw the sun
        // const sunRadius = 60;
        // const sunX = PARAMS.canvasWidth * 0.2;
        // const sunY = PARAMS.canvasHeigh * 0.2;
        // ctx.beginPath();
        // ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        // ctx.fillStyle = '#FFD700'; // Gold color for the sun
        // ctx.fill();
  
        // // Draw sun rays
        // drawSunRays(sunX, sunY, sunRadius);
  
        // Draw clouds
        drawCloud(100,100, 100, 50);
        drawCloud(550,150, 120, 60);
        drawCloud(750,105, 150, 70);
        function drawSunRays(x, y, radius) {
            const numRays = 12;
            const rayLength = radius * 1.5;
            for (let i = 0; i < numRays; i++) {
                const angle = (i / numRays) * Math.PI * 2;
                const startX = x + Math.cos(angle) * radius;
                const startY = y + Math.sin(angle) * radius;
                const endX = x + Math.cos(angle) * rayLength;
                const endY = y + Math.sin(angle) * rayLength;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        }

        function drawCloud(x, y, width, height) {
            const numCircles = 5;
            const circleRadius = height / 2;
            for (let i = 0; i < numCircles; i++) {
                ctx.beginPath();
                ctx.arc(x + i * (circleRadius * 1.2), y, circleRadius, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF'; // White color for clouds
                ctx.fill();
            }
        }
    }
    
}