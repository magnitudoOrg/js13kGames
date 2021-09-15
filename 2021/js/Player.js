class Player extends SpaceObj {

	constructor (x, y, size, color) {
		super(x, y, size, color, 0);
						
		this.acc = 0;
		this.speed = 0;
		this.damage = 10;
		this.friendType = F_FRIEND;
		this.update();		
	}
	
	render() {
	
		let p = this, tx, ty;
		
		if (this.dead())
			return;
		
		if (p.hitRenderCnt > 0) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, pi2, false);
			ctx.lineWidth = rand(0, 2);
			ctx.strokeStyle = 'rgba(' + (255 - 3 * this.health) + ',10,' + 3 * this.health + ',' + rand(0.1, 0.5) + ')';
			ctx.stroke();	
			p.hitRenderCnt--;
		}

		let s = p.size / Math.sqrt(2);
		
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(pi);
		ctx.beginPath();
		ctx.moveTo(-s, -s);
		ctx.lineTo(0, s);
		ctx.lineTo(+s, -s);
		ctx.lineTo(0, -s/2);
		ctx.lineTo(-s, -s);
		ctx.strokeStyle = '#fff';
		ctx.stroke();	
		ctx.restore();
		
		s = 0.2 * p.size / Math.sqrt(2);
		
		ctx.save();
		ctx.translate(p.x, p.y - 2);
		ctx.rotate(pi2 - p.dir);
		ctx.beginPath();
		ctx.moveTo(-s, -s);
		ctx.lineTo(0, s);
		ctx.lineTo(0, 4*s);
		ctx.lineTo(0, s);
		ctx.lineTo(+s, -s);
		//ctx.lineTo(0, -s/2);
		ctx.lineTo(-s, -s);
		ctx.strokeStyle = '#fff';
		ctx.stroke();	
		ctx.restore();
		
	}
} // Player