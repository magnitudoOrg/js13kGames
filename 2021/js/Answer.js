class Answer extends SpaceObj {

	constructor (x, y, size, color, dir, answerIdx) {
		super(x, y, size, color, dir);
		
		this.answerIdx = answerIdx;
		this.correctAnswer = false;
		
		this.acc = 0.3;
		this.speed = 0;
		this.health = 20;
		this.topSpeed = 10 / this.size;
		this.update();
	}
	
	render() {
	
		let p, tx, ty;
		
		p = this;
		ctx.fillStyle = p.color;

		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size, pi2, false);		
		ctx.lineWidth = 2;
		ctx.strokeStyle = p.color;

		ctx.stroke();	
		ctx.fillText(this.answerIdx, p.x - 5, p.y + 9);
	}
	
} // Answer