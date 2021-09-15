class Game {

	constructor() {
		//this.canvas = canvas;
		//this.ctx = canvas.getContext('2d');
		//this.width = canvas.width; 
		//this.height = canvas.height; 
		
		this.ships = [];
		this.answers = [];
		this.bullets = [];
		this.particles = [];
		this.stars = [];
		this.stars2 = [];
		
		this.fCnt = 0;
		this.points = 100;
		
		this.mouseDown = false;
		this.mouseX = 0;
		this.mouseY = 0;
		this.qIdx = 0;
		this.gameEnd = false;
		this.tacticalJumps = 13;
		
		this.init();
		this.initEvents();		
	}
	
	init() {
		
		const w = canvas.width;
		const h = canvas.height;
		
		ctx.font = '22px Arial';
		
		this.player = new Player(w / 2, h - 90, 20, '#fff');
	
		for (let i = 0; i < 1500; i++) {
			this.stars.push( {x: rand(0, w), y: rand(0, h), size: .05 + rand() * rand(), color: 'rgba(255,255,255,1.0)' } ); 
		}
		
		for (let i = 0; i < 500; i++) {
			let size =  rand() * rand() + .1;
			this.stars2.push( {x: rand(0, w), y: rand(0, h), size: size, color: 'rgba(180,190,255,1.0)', vy: rand(0, 0.25 * size), vx: rand(0, 0.02) } ); 
		}
		
		//for (let i = 0; i < 2; i++) {
		//	this.ships.push(new Ship(100, 100, 20, '#ffcc00', rand(0, pi2), F_NEUTRAL));
		//}
		
		window.setTimeout(() => this.loadNextQuestion(), 1000);
					
	}
	
	initEvents() {
	
		let self = this;
		
		// TODO use addEventlistener()
		
		canvas.onpointerdown = function (event) {
			event.preventDefault();
			self.mouseDown = true;	
		}
		canvas.onpointerup = function (event) {
			event.preventDefault();
			self.mouseDown = false;
		}
		canvas.onpointermove = function (event) {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			//console.log('move', x, y);
			
			self.mouseX = x;
			self.mouseY = y;
			
			let p = self.player;
			let dir = p.getDir({x:x, y:y});
			//console.log(p.dir, dir, dir - p.dir);
			p.targetDir = dir;
			
			//if (y > rect.height - 60) {p.speed = 0.7;
			//} else {p.speed = 0;}
			
			p.update();
		}
		document.onkeydown = function (event) {
			//console.log(event.key);
			switch (event.key) {
				case ' ':
					if (self.tacticalJumps > 0) {
						self.player.x = self.mouseX;
						self.player.y = self.mouseY;
						self.tacticalJumps--;
					}
					
					//self.player.acc = 1;
					//self.player.speed = 1;
					break;
			}
		}
	}
	
	findEnemy(ref) {
		let minDist = 10e5;
		let candidate = null;
		
		for (let ship of this.ships) {
			if (ship.friendType == F_ENEMY && ship.distance(ref) < minDist) {
				candidate = ship;
			}	
		}
		return candidate;
	}
			
	update() {
	
		let pl = this.player;
		
		pl.update();
		
		if (!pl.dead() && this.mouseDown && this.fCnt % 6 == 0) {
			let dir = pl.getDir( {x: this.mouseX, y: this.mouseY} );
			let bullet = new Bullet(pl.x, pl.y, rand(1, 3), '#ccc', dir, pl);
			bullet.damage = pl.damage;
			this.bullets.push(bullet);
			zzfx(...[,,382,.04,.08,.07,,1.38,-4.9,,,,,,,,,.98,.02,.05]); // Shoot 218
		}	

		for (let j = this.ships.length - 1; j >= 0; j--) {
			let p = this.ships[j];
			p.update();
			if (rand() < 0.5)
				this.particles.push(new Particle(p.x, p.y, rand(0.5, 1.5), 'rgba(255,200,150,0.2)', p.targetDir + pi + rand(-.2, .2)));
				
			if (p.dead()) {
				if (p.friendType == F_ENEMY)
					this.points += 10;
				this.ships.splice(j, 1);
				if (p.lifespan > 0)
					zzfx(...[1.04,,919,,.23,.88,1,2.73,.5,,,,,.4,20,.5,,.95,.01,.01]); // Explosion 119
			} 		
			else  {
				if (this.fCnt % 60 == 0 && rand() < 0.3 && p.friendType == F_ENEMY) {
					let dist = p.distance(this.player);
					if (true) { // dist < 600
						p.targetDir = p.getDir( {x: this.player.x + rand(0, 5), y: this.player.y + rand(0, 5)} );	
					
						if (dist < 350)
							window.setTimeout(() => {
								let bullet = new Bullet(p.x, p.y, rand(1, 3), '#faa', p.targetDir, p);
								bullet.damage = p.damage;
								this.bullets.push(bullet);
								zzfx(...[2.02,,391,.03,.01,0,1,.4,-2.4,,,,,,2.3,,.14,.8,.04]); // Shoot 549*
							}, 400);
					}
					
				}	
				if (this.fCnt % 9 == 0 && rand() < 0.5 && p.friendType == F_FRIEND) {
					let enemy = this.findEnemy(p);
					if (enemy == null) 
						continue;
					let dist = p.distance(enemy);	
					if (dist < 300) {
						p.targetDir = p.getDir( {x: enemy.x + rand(0, 2), y: enemy.y + rand(0, 2)} );	
					
						if (dist < 200)
							window.setTimeout(() => {
								let bullet = new Bullet(p.x, p.y, rand(1, 3), '#faa', p.targetDir, p);
								bullet.damage = p.damage;
								this.bullets.push(bullet);
								zzfx(...[2.02,,391,.03,.01,0,1,.4,-2.4,,,,,,2.3,,.14,.8,.04]); // Shoot 549*
							}, 9);
					}
					
				}
			}
		} // for
		
		
		for (let j = this.particles.length - 1; j >= 0; j--) {
			let p = this.particles[j];
			p.update();
			if (p.dead()) {
				this.particles.splice(j, 1);
			} 		
		}
		
		for (let j = this.answers.length - 1; j >= 0; j--) {
			let answer = this.answers[j];
			answer.update();
			if (answer.dead()) { // answer.lifespan == 0 ||		
				if (answer.correctAnswer) {
					this.points += 100;
					this.answers = [];
					document.getElementById('qContainer').style.opacity = 0;
					window.setTimeout(() => this.loadNextQuestion(), 900);
					
					if (rand() < 0.33)
						this.ships.push(new Ship(answer.x, answer.y, 12, 'lime', rand(0, pi2), F_FRIEND, 30 * 60));
					else if (rand() < 0.5)
						this.ships.push(new Ship(answer.x, answer.y, 12, 'yellow', rand(0, pi2), F_NEUTRAL, 60 * 60));
					else
						this.player.health += Math.round(rand(5,20));
						
					zzfx(...[1.24,,72,.04,.4,.28,1,1.08,,-0.1,155,.06,.03,,,,.16,.95,.08]); // Powerup 612
					//zzfx(...[,,1387,,,.24,1,1.72,,,768,.02,,,,,,.76,.08,.04]); // Pickup 158
					break;
				} else {	
					let health = 50 + 4 * this.qIdx;
					this.points -= 50;
					
					let enemyCnt = (this.qIdx > 10 && rand() < 0.5) ? this.qIdx > 20 ? 3 : 2 : 1;
					for (let en = 0; en < enemyCnt; en++)
						this.ships.push(new Ship(answer.x, answer.y, 12, 'red', rand(0, pi2), F_ENEMY, 10e7, health));
					
					this.answers.splice(j, 1);
					//zzfx(...[1.37,,965,,.35,.67,4,1.2,1,.8,,,.14,.2,,.5,,.51,.01]); // Explosion 138
					zzfx(...[1.01,,461,,,.39,4,2.66,,8.2,,,,.9,,.3,,.65,.08]); // Hit 349
				}			
			} 		
		}
		
		for (let j = this.bullets.length - 1; j >= 0; j--) {
			let bullet = this.bullets[j];
			bullet.update();
			if (bullet.lifespan == 0) {
				this.bullets.splice(j, 1);
			} else {
				// bullet hit tests
				if (bullet.hits(pl)) {
						bullet.lifespan = 0;
						pl.hitBy(bullet);
						this.points -= 1;
						
						for (let i = 0; i < 6; i++) {
							let part = new Particle(pl.x, pl.y, rand(0.5, 1), pl.color, i * pi / 3 + rand());
							this.particles.push(part);
						}				
									
					}
					
				for (let obj of this.ships) {
					if (bullet.hits(obj)) {
						bullet.lifespan = 0;
						
						for (let i = 0; i < 6; i++) {
							let part = new Particle(obj.x, obj.y, rand(0.5, 1), obj.color, i * pi / 3 + rand());
							this.particles.push(part);
						}
						obj.hitBy(bullet);			
					}
				}
				
				for (let answer of this.answers) {
					if (bullet.hits(answer)) {
						bullet.lifespan = 0;
						
						for (let i = 0; i < 12; i++) {
							let part = new Particle(answer.x, answer.y, rand(0.5, 2), answer.color, i * pi / 6 + rand());
							this.particles.push(part);
						}
						answer.hitBy(bullet);		
					}
				}
			}
					
		} // for.. bullets
		
		for (let i = 0; i < 1 && !pl.dead(); i++) {
			let part = new Particle(this.player.x, this.player.y + this.player.size/2, rand(.7, 3), 'rgba(255,240,150,0.3)', rand(-.2,.2));
			this.particles.push(part);
		}
	}
	
	render() {
	
		const w = canvas.width;
		const h = canvas.height;
		
		if (this.gameEnd)
			return;	
		if (this.player.dead()) {
			document.getElementById('gameEnd').style.display = 'block';
			zzfx(...[2.07,,39,.02,.26,.38,2,2.83,,,,,.12,.7,,.2,.01,.74,.08,.27]); // Explosion 361
			this.gameEnd = true;
			return;
		}
		if (this.win) {
			document.getElementById('gameEndText').innerHTML = 'WOW - you answered all ' + Q.length + ' questions!';
			document.getElementById('gameEnd').style.display = 'block';	
			zzfx(...[2.1,,46,.04,.16,.66,1,.37,-3.6,1.5,96,.07,.02,,25,.1,.19,.67,.03,.17]); // Powerup 363		
			this.gameEnd = true;
			return;
		}
		
		ctx.fillStyle = 'rgba(0,0,20,0.3)';
		ctx.fillRect(0, 0, w, h); // clearRect() w/o simple motion blur effect
		
			
		if (this.fCnt % 2 == 0)
			for (let s of this.stars) {
				ctx.fillStyle = s.color;
				if (s.size > 0.8 || rand() < 0.9)
					ctx.fillRect(s.x, s.y, s.size, s.size);
			}
			
		for (let s of this.stars2) {
			ctx.fillStyle = s.color;
			s.y += s.vy;
			s.x += s.vx;
			s.y = s.y % h;
			s.x = s.x % w;
			ctx.fillRect(s.x, s.y, s.size, s.size);
		}
		
		ctx.fillStyle = 'rgba(180,190,255,0.2)';
		ctx.fillText('Space Jumps  ' + Math.round(this.tacticalJumps),  canvas.width / 2 - 80, canvas.height - 30);	
		ctx.fillText('Health  ' + Math.round(this.player.health),  30, canvas.height - 30);	
		ctx.fillText('Points  ' + Math.round(this.points),  canvas.width - 150, canvas.height - 30);		
		this.player.render();
		
		for (let j in this.ships) {
			this.ships[j].render();
		}
		for (let part of this.particles) {
			part.render();
		}
		for (let bullet of this.bullets) {
			bullet.render();
		}
		for (let answer of this.answers) {
			answer.render();
		}
		
		this.fCnt++;
	}
	
	loadNextQuestion() {
		document.getElementById('qContainer').style.opacity = 0.9;
		
		if (this.qIdx > Q.length - 1) {
			this.win = true;
			return;
		}
		let arr = Q[this.qIdx++];
		let p = shuffleArray( [1,2,3,4] );
		let correctAnswerIdx = p[0];
		
		document.getElementById('q').innerHTML = '' + this.qIdx + ' &nbsp; ' +  arr[2] + '?';
		document.getElementById('a' + p[0]).innerHTML = p[0] + ') &nbsp; ' + arr[3];
		document.getElementById('a' + p[1]).innerHTML = p[1] + ') &nbsp; ' + arr[4];
		document.getElementById('a' + p[2]).innerHTML = p[2] + ') &nbsp; ' + arr[5];
		document.getElementById('a' + p[3]).innerHTML = p[3] + ') &nbsp; ' + arr[6];		
		
		window.setTimeout(() => {
			for (let i = 1; i < 5; i++) {
				let answer = new Answer( i* 150, 160, 35 - rand(0, 9), 'rgba(230,230,255,0.5)', rand(-.5, .5), i);
				if (i == correctAnswerIdx)
					answer.correctAnswer = true;
				this.answers.push(answer);
			}
		
		}, 3300);
		
	}
	
	loop() {
	
		this.update();
		this.render();
		window.requestAnimationFrame( () => this.loop() ); // this.loop.bind(this)
		//window.setTimeout(loop, 1000/60);
	}	
} // Game
