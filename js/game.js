var sizeX = 400, sizeY = 600;
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
cvs.style.margin = "auto auto";
lasers = [];
meteors = [];
enemies = [];
hearts = [];


function rand(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}





class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
    if (!(vector instanceof Vector)) {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  times(factor) {
    return new Vector(this.x * factor, this.y * factor);
  }
}

class Actor {
	constructor(imageSrc = "", pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {

		if (!(pos instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
			throw new Error('Здесь нужен объект типа Vector');
		}
		this.isMove = true;
		this.pos = pos;
		this.size = size;
		this.speed = speed;
		this.image = new Image();
		this.image.src = imageSrc;
	}

	act() {}

	get left() {
		return this.pos.x;
	}
	get top() {
		return this.pos.y;
	}
	get right() {
		return this.pos.x + this.size.x;
	}
	get bottom() {
		return this.pos.y + this.size.y;
	}
	get type() {
		return 'actor';
	}

	isIntersect(actor) {
	if (actor === this) {
		return false;
	}
	if ((this.left >= actor.right) || (this.right <= actor.left) || (this.top >= actor.bottom) || (this.bottom <= actor.top)) {
		return false;
	}
		return true;
	}

	draw() {
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.size.x, this.size.y);
	}

}


class Laser extends Actor {
	constructor(pos = new Vector(0, 0), isUser = false) {
		if (isUser)
	    	super("img/laser.png", pos, new Vector(5, 100), new Vector(0, -10));
	    else{
	    	super("img/laser.png", pos, new Vector(5, 100), new Vector(0, 10));
	    }
	    this.isUser = isUser;
	}

	forward() {
		this.pos.y += this.speed.y;
	}
}


class User extends Actor{
	constructor(imageSrc = "", pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(20, 20)) {
	    super(imageSrc, pos, size, speed);
	    this.HP = 3;
	    this.scores = 0;
	}

	atack() {
		return new Laser(new Vector(this.pos.x + 25, this.pos.y), true);
	}

	move(speed = new Vector(0, 0)) {
		if (this.left + speed.x > 0 && this.right + speed.x < sizeX && this.bottom < sizeY && this.top > sizeY - (sizeY / 2))
			this.pos.plus(speed);
	}

}


class Meteor extends Actor{
	constructor() {
	    super("img/met.png", new Vector(rand(0, sizeX), 0), new Vector(rand(30, 100), rand(30, 100)), new Vector(0, rand(3, 8)));
	}

	forward(){
		this.pos.y += this.speed.y;
	}
}

class Enemy extends Actor{
	constructor() {
	    super("img/SpaceBird.png", new Vector(rand(0, sizeX), 0), new Vector(rand(30, 100), rand(30, 100)), new Vector(0, rand(1, 4)));
	}

	atack() {
		if (rand(0, 50) == 5){
			return lasers.push(new Laser(new Vector(this.pos.x, this.pos.y)));
		}
	}

	forward() {
		if (this.pos.y < sizeY / 2)
			this.pos.y += this.speed.y;
	}
}

class Heart extends Actor {
	constructor(pos) {
		super("img/heart.png", pos, new Vector(30, 30), new Vector(0, 0))
	}
}

hearts.push(new Heart(new Vector(sizeX - 160, sizeY - 20)));
hearts.push(new Heart(new Vector(sizeX - 120, sizeY - 20)));
hearts.push(new Heart(new Vector(sizeX - 80, sizeY - 20)));




function runAnimation(frameFunc) { 
	var lastTime = null; 
	function frame(time) { 
		var stop = false; 
		if (lastTime != null) { 
			var timeStep = Math.min(time - lastTime, 100) / 1000; 
			stop = frameFunc(timeStep) === false; 
		} 
		lastTime = time; 
		if (!stop) { 
			requestAnimationFrame(frame); 
		} 
	} 
	requestAnimationFrame(frame); 
}

var bg = new Image();
cvs.style.width = sizeX + 'px';
cvs.style.height = sizeY + 'px';

bg.src = "img/bg.png";
var SPEED = 20;
var user = new User("img/SB.png", new Vector(sizeX / 2, sizeY - sizeY / 5), new Vector(50, 55)); 


var isLeft = false, isRight = false; isUp = false, isDown = false;



function moveDown(event) {
	if (event.code == 'ArrowLeft') {
		isLeft = true;
	}
	else if (event.code == 'ArrowRight') {
		isRight = true;
	}
	else if (event.code == 'ArrowUp') {
		isUp = true;
	}
	else if (event.code == 'ArrowDown') {
		isDown = true;
	}
	else if (event.code == 'KeyA') {
		isLeft = true;
	}
	else if (event.code == 'KeyD') {
		isRight = true;
	}
	else if (event.code == 'KeyW') {
		isUp = true;
	}
	else if (event.code == 'KeyS') {
		isDown = true;
	}
	if (event.code == 'Space') {
		lasers.push(user.atack());
	}
}

function moveUp(event) {
	if (event.code == 'ArrowLeft') {
		isLeft = false;
	}
	else if (event.code == 'ArrowRight') {
		isRight = false;
	}
	else if (event.code == 'ArrowUp') {
		isUp = false;
	}
	else if (event.code == 'ArrowDown') {
		isDown = false;
	}
	else if (event.code == 'KeyA') {
		isLeft = false;
	}
	else if (event.code == 'KeyD') {
		isRight = false;
	}
	else if (event.code == 'KeyW') {
		isUp = false;
	}
	else if (event.code == 'KeyS') {
		isDown = false;
	}
}
var scores = document.getElementsByClassName('scores')[0];


function draw()
{
	if (rand(0, 100) == 0){
		enemies.push(new Enemy());
	}
	if (rand(0, 100) == 0){
		meteors.push(new Meteor());
	}
	ctx.drawImage(bg,0,0,sizeX,sizeY);
	user.draw();
	for(laser of lasers){
		for (meteor of meteors){
			if (laser.isIntersect(meteor) && laser.isUser){
				meteors.splice(meteors.indexOf(meteor), 1);
				lasers.splice(lasers.indexOf(laser), 1);
				user.scores += 1;
			}
		}

		for (enemy of enemies){
			if (laser.isIntersect(enemy) && laser.isUser){
				enemies.splice(enemies.indexOf(enemy), 1);
				lasers.splice(lasers.indexOf(laser), 1);
				user.scores += 2;
			}
		}

		if (laser.isIntersect(user) && !laser.isUser){
			user.HP--;
			hearts.splice(0, 1);
			lasers.splice(lasers.indexOf(laser), 1);
		}
		laser.forward();
		laser.draw();
	}

	for (meteor of meteors){
		meteor.draw();
		meteor.forward();
		if (meteor.pos.y > sizeY){
	        meteors.splice(meteors.indexOf(meteor), 1);
		}
		if (meteor.isIntersect(user)){
			user.HP--;
			hearts.splice(0, 1);
			meteors.splice(meteors.indexOf(meteor), 1);
			user.scores += 2;
		}
	}

	for (enemy of enemies){
		enemy.forward();
		enemy.draw();
		enemy.atack();
		if (enemy.pos.y > sizeY){
	        enemies.splice(enemies.indexOf(enemy), 1);
		}
		if (enemy.isIntersect(user)){
			user.HP--;
			hearts.splice(0, 1);
			enemies.splice(enemies.indexOf(enemy), 1);
			user.scores += 2;
		}
	}
	for (heart of hearts){
		heart.draw();
	}

	if (user.HP <= 0){
		return true;
	}
	scores.innerHTML = "Очки: " + user.scores;
	return false;
}
document.addEventListener('keydown', moveDown);
document.addEventListener('keyup', moveUp);

// const canvas = document.getElementById('c1');
// const c = canvas.getContext('2d');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// window.addEventListener('wheel', (event) => {
//   if (event.deltaY < 0) speed *= 1.1;
//   else speed *= 0.9;
//   if (speed < 0.01) speed = 0.01;
//   else if (speed > 0.1) speed = 0.1;
// });
// class Star {
//   constructor() {
//     this.x = Math.random()*canvas.width-canvas.width/2;
//     this.y = Math.random()*canvas.height-canvas.height/2;
//     this.px, this.py;
//     this.z = Math.random()*4;
//   }
//   update() {
//     this.px = this.x;
//     this.py = this.y;
//     this.z += speed;
//     this.x += this.x*(speed*0.2)*this.z;
//     this.y += this.y*(speed*0.2)*this.z;
//     if (this.x > canvas.width/2+50 || this.x < -canvas.width/2-50 ||
//         this.y > canvas.height/2+50 || this.y < -canvas.height/2-50) {
//       this.x = Math.random()*canvas.width-canvas.width/2;
//       this.y = Math.random()*canvas.height-canvas.height/2;
//       this.px = this.x;
//       this.py = this.y;
//       this.z = 0;
//     }
//   }
//   show() {
//     c.lineWidth = this.z;
//     c.beginPath();
//     c.moveTo(this.x, this.y);
//     c.lineTo(this.px, this.py);
//     c.stroke();
//   }
// }
// let speed = 0.05;
// let stars = [];
// for (let i = 0; i < 800; i++) stars.push(new Star());
// c.fillStyle = 'rgba(0, 0, 0, 0.4)';
// c.strokeStyle = 'rgb(255, 255, 255)';
// c.translate(canvas.width/2, canvas.height/2);




function run() { 
	return new Promise(done => { 
		runAnimation(step => { 
				if (isRight & user.pos.x < sizeX - user.size.x){
					user.pos.x += user.speed.x;
				}
				if (isLeft & user.pos.x > 0){
					user.pos.x -= user.speed.x;
				}
				if (isUp & (user.pos.y > sizeY - (sizeY / 2))){
					user.pos.y -= user.speed.y;
				}
				if (isDown & user.pos.y < sizeY - user.size.y){
					user.pos.y += user.speed.y;
				}

			
			// c.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
			//   for (let s of stars) {
			//     s.update();
			//     s.show();
			//   }

			if (draw()) { 
				alert("Вы проебали, набранные очки: " + user.scores);
				ctx.drawImage(bg,0,0,sizeX,sizeY);
				// window.open('./stelorq/index.html')
				return false; 
			} 
		}); 
	}); 
}


run();