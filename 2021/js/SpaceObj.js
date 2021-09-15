class SpaceObj {

	constructor (x, y, size, color, dir) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
		
		this.dir = dir;
		this.targetDir = this.dir;
		this.acc = .1;
		this.speed = 0;
		this.damage = 0;
		this.health = 100;	
		this.lifespan = 10e7;

		this.topSpeed = (20 / this.size) * rand(1, 1.5);
		this.overflow = true;
		this.creator = null;
		this.friendType = F_NEUTRAL;
		this.hitRenderCnt = 0;
		
		this.update();
	}
	
	update (bounceX, bounceY) {
	
		if (this.dead()) {
			this.color = '#fff';
			this.speed = 0;
			this.acc = 0;
			return;
		}
		
		this.speed += this.acc;
		if (this.speed > this.topSpeed) {
			this.speed = this.topSpeed;
		}
		
		let dirDiff = this.targetDir - this.dir;
		if (dirDiff > pi) dirDiff = pi2 - dirDiff;
		else if (dirDiff < -pi) dirDiff = pi2 + dirDiff;
		this.dir += 0.1 * dirDiff;
		
		// keep dir normalized in -pi2..pi2 TODO: review
		if (this.dir > pi2) this.dir -= pi2;
		else if (this.dir < -pi2) this.dir += pi2;
		
		
		this.speedX = Math.sin(this.dir) * this.speed;
		this.speedY = Math.cos(this.dir) * this.speed;		
		this.x += this.speedX;
		this.y += this.speedY;
		
		if (this.overflow) {
			this.x = this.x < 0 ? canvas.width : this.x >= canvas.width ? 0 : this.x;
			this.y = this.y < 0 ? canvas.height : this.y >= canvas.height ? 0 : this.y;
		}	
		
		this.lifespan--;		
	}
	
	hits (obj) {
		return this.creator != obj && this.distance(obj.x, obj.y)  < this.size + obj.size; 
	}
	
	hitBy (obj) {
		this.health -= obj.damage;
		this.hitRenderCnt = 10;
	}
	
	distance (x, y) {
		if (x instanceof SpaceObj) {		
			y = x.y;
			x = x.x;
		}
		//return Math.hypot(this.x - x, this.y - y);
		return Math.sqrt((this.x - x) * (this.x - x)  + (this.y - y) * (this.y - y));
	}
	
	getDir (obj) {
		return Math.atan2(this.y - obj.y, -this.x + obj.x) + pi/2;
	}
	
	dead () {
		return this.health <= 0 || this.lifespan <= 0;
	}
	
	render() {
	
		let p, tx, ty;
		
		p = this;
		ctx.fillStyle = p.color;

		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size, pi2, false);
		ctx.lineWidth = 1;
		ctx.strokeStyle = p.color;
		ctx.stroke();	
			
		tx = p.size * Math.sin(p.targetDir) -0;
		ty = p.size * Math.cos(p.targetDir) -0;
		ctx.fillStyle = 'red';
		ctx.fillRect(p.x + tx, p.y + ty, 1, 1);

		tx = p.size * Math.sin(p.dir)-2;
		ty = p.size * Math.cos(p.dir)-2;
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		ctx.lineTo(p.x + tx, p.y + ty);
		ctx.strokeStyle = '#444';
		ctx.stroke();
	}
		
} // SpaceObj
