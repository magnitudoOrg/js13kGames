class Particle extends SpaceObj {

	constructor (x, y, size, color, dir, lifespan = 30) {
		super(x, y, size, color, dir);
		
		
		this.acc = 0.3;
		this.topSpeed = 70 / this.size; 
		this.speed = 0;
		this.lifespan = lifespan;
		this.overflow = false;
		this.update();
	}	
	
	render() {
		
		let p = this;
		ctx.fillStyle = p.color;
		ctx.fillRect(p.x, p.y, p.size, p.size);
	}
	
} // Particle