class Background {
    constructor(game) {
      this.game = game;
      
      this.image = new Image();
      this.image.src = "img/background.png"; // Set the source of the background image
      this.speed = 2; // Speed of the background movement
      this.x = 0; // X position of the background
      this.y = 0;
      this.game.width = window.innerWidth;
      this.game.height = window.innerHeight;
      // Resize the game and redraw elements on window resize
      window.addEventListener("resize", () => this.resizegame());
  
      // Start the game loop after the background image is loaded
  
    }
  
    
  
    resizegame() {
        this.game.width = window.innerWidth;
        this.game.height = window.innerHeight;
        this.draw(); // Redraw the background to adapt to the new size
    }
    // Update background position for seamless looping
    update() {
      this.x -= this.speed;
      if (this.x <= -this.game.width) {
        this.x = 0;
      }
    }
  
    // Draw the background
    draw() {
      
      this.game.ctx.drawImage(this.image, this.x, 0, this.game.width, this.game.height);
      this.game.ctx.drawImage(this.image, this.x + this.game.width, 0, this.game.width, this.game.height);
    }
  
  
  }
  