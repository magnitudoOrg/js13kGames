class Bullet extends Particle {

	constructor (x, y, size, color, dir, creator) {
		super(x, y, size, color, dir);
		
		this.lifespan = 50;
		this.creator = creator;
		this.speed = creator.speed;
		this.overflow = false;
		this.update();
	}
} // Bullet
