class Ship extends SpaceObj {

	constructor (x, y, size, color, dir, friendType, lifespan = 10e7, health = 50) {
		super(x, y, size, color, dir);
		
		this.friendType = friendType;
		this.acc = .1;
		this.speed = 1;
		this.health = health;
		this.damage = 5;
		this.lifespan = lifespan;
		this.tailFormY = rand(-1.0 * size / Math.sqrt(2), 0);
	
		this.update();
	}
	
	hitBy (obj) {
		this.health -= obj.damage;
		if (this.friendType == F_NEUTRAL && obj.creator) {
			if (obj.creator.friendType == F_FRIEND && rand() < 0.2) {
				this.friendType = F_ENEMY;
				this.color = 'red';
			} else if (obj.creator.friendType == F_ENEMY) {
				this.friendType = F_FRIEND;
				this.color = 'lime';
			}
		}
		this.hitRenderCnt = 10;
	}
	
	render() {
	
		let p, tx, ty;
		
		p = this;

		if (p.hitRenderCnt > 0) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, pi2, false);
			ctx.lineWidth = rand(0, 2);
			ctx.strokeStyle = 'rgba(' + (255 - 3 * this.health) + ',10,' + 3 * this.health + ',' + rand(0.1, 0.4) + ')';
			ctx.stroke();	
			p.hitRenderCnt--;
		}	

		let s = p.size / Math.sqrt(2);		
		
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(pi2 - p.dir);

		
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(-s, -s);
		ctx.lineTo(0, s);
		ctx.lineTo(+s, -s);
		ctx.lineTo(0, this.tailFormY);
		ctx.lineTo(-s, -s);
		ctx.strokeStyle = p.color;
		ctx.stroke();
		ctx.restore();

	}
} // Ship
