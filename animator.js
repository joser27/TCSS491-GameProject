class Animator {
	constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, scale = 1, loop = true) {
		Object.assign(this, { spritesheet, xStart, yStart, width, height, frameCount, frameDuration, scale, loop });

		this.elapsedTime = 0;
		this.totalTime = frameCount * frameDuration;
	};

	drawFrame(tick, ctx, x, y) {
		this.elapsedTime += tick;

		if (!this.spritesheet) {
			console.error("Spritesheet is missing in Animator");
			return; // Skip drawing to avoid crashing
		}
		
		if (this.elapsedTime > this.totalTime) {
			if (this.loop) {
				this.elapsedTime %= this.totalTime;
			} else {
				this.elapsedTime = this.totalTime;
			}
		}
		const frame = this.currentFrame();

		ctx.drawImage(this.spritesheet,
			this.xStart + this.width * frame, this.yStart,
			this.width, this.height,
			x, y,
			this.width * this.scale, this.height * this.scale);
	};

	currentFrame(){
		return Math.floor(this.elapsedTime / this.frameDuration);
	};

	isDone() {
		return (this.elapsedTime >= this.totalTime);
	};
}