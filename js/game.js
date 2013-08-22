var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth-50;
canvas.height = 600;
var speed = 200;
var stopped = false;
var started = false;
var plane_scale = 0.3;
var rocket_scale = 0.2;
window[ addEventListener ? 'addEventListener' : 'attachEvent' ]( addEventListener ? 'load' : 'onload', function(){
document.body.appendChild(canvas);
} );

var stop_game = function(){
	if(!stopped){
		stopped = true;
		var name = prompt("Pralaimėjai.. Įvesk vardą");
		if(name) request('save.php', 'name='+name+'&score='+plane.score.toFixed());
		var again = confirm("Žaisti iš naujo?");
		if (again){
			history.pushState({}, 'title', '#play');
			window.location.reload();
		}
	}
};

function GameObject(url)
{
	var ready = false;
	var g = this;
	this.url = url;
	this.img = new Image();
	this.img.src = url;
	this.img.onload = function(){ ready = true; };
	this.isReady = function(){ return ready; };
	this.scale = 1;
	this.collides = function(o){  // ne visiškai tikslus collision detection, tikslesnis reikalauja daug resursų, arba sudėtingų algoritmų	
		return g.x <= (o.x + o.img.width*o.scale)
		&& o.x <= (g.x + g.img.width*g.scale)
		&& g.y <= (o.y + o.img.height*o.scale)
		&& o.y <= (g.y + g.img.height*g.scale);
	};
	this.collidesAny = function(arr){
			for(var i in arr){
				if(g.collides(arr[i])) return true;
			}
			return false;
	};
	this.x = 0;
	this.y = 0;
	this.speed = speed;//globalus greitis
}

function Plane(){
	var p = new GameObject('img/plane.png');
	p.speed = 256;
	p.score = 0;
	p.angle = 0;
	p.update = function(modifier){ 
		p.score += speed*modifier;
		p.y+=50*modifier;
		if (p.y > canvas.height && !stopped) stop_game();
	};
	p.scale = plane_scale;
	return p;
}



var rockets = {
	list:[],
	vspeed: 300, //kilimo greitis
	num: 5, //raketu kiekis pradžioje
	min_num: 5,
	max_num: 20,
	add: function(){
		var r = new GameObject('img/rocket.png');
		r.update = function(modifier){
			r.x -= speed*modifier;
			r.y -= rockets.vspeed*modifier;
			//if (r.y+r.img.height < 0){ rockets.list.splice(rockets.list.indexOf(r), 1);}
			if(plane.collides(r)) stop_game();
		};
		r.getRandPos = function(){
			r.x = Math.floor((Math.random()*canvas.width)+canvas.width*3);
			r.y = Math.floor((Math.random()*canvas.height)+canvas.height*2);
			console.log([r.x,r.y]);
		};
		r.getRandPos();
		while(r.collidesAny(r.list) || r.collides(plane)) r.getRandPos();
		r.scale = rocket_scale;
		rockets.list[rockets.list.length] = r;
	},
	update: function(modifier){
		if (rockets.num < rockets.max_num) rockets.num = rockets.min_num + plane.score/10000;
		for(var i in rockets.list){
			rockets.list[i].update(modifier);
			if (rockets.list[i].y+rockets.list[i].img.height < 0 || rockets.list[i].x+rockets.list[i].img.width < 0){ console.log(rockets.list.splice(i, 1));}
		}
		if (rockets.num > rockets.list.length) { //pridedam raketa
			rockets.add();
		};
	},
	draw: function(){
		for(var i in rockets.list){
		var r = rockets.list[i];
			if(r.isReady()) ctx.drawImage(r.img, r.x, r.y, r.img.width*rocket_scale, r.img.height*rocket_scale);
		}
	},
	
};

var bg = new GameObject('img/background.jpg');
bg.update = function(modifier){
bg.x-=speed*modifier;
if (Math.abs(bg.x) > bg.img.width) {
    bg.x = 0;
}
};


var plane = Plane();


var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	e.preventDefault();
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
	e.preventDefault();
}, false);


var reset = function () {
	plane.x = 60;
	plane.y = canvas.height / 2-100;
};


var update = function (modifier) {
	if (38 in keysDown) { // aukštyn
		if (plane.y>1) plane.y -= plane.speed * modifier;
	}
	if (40 in keysDown) { // žemyn
		plane.y += plane.speed * modifier;
	}
	if (37 in keysDown) { // kairėn
		plane.x -= plane.speed * modifier;
	}
	if (39 in keysDown) { // Dešinėn
		plane.x += plane.speed * modifier;
	}

	bg.update(modifier);
	plane.update(modifier);
	rockets.update(modifier);
	
	if (speed<1000) speed += plane.score/1000;

};


var render = function () {
	if (bg.isReady()) {
		ctx.drawImage(bg.img, bg.x, bg.y);
		ctx.drawImage(bg.img, bg.img.width-Math.abs(bg.x), bg.y);
	}

	if (!started) {
		if(location.href.split('#')[1] != 'play') alert("Paspausk OK ir žaidimas prasidės!");
		history.pushState({}, 'title', '#');
		started = 1;
	}
	if (plane.isReady()) {
		ctx.drawImage(plane.img, plane.x, plane.y, plane.img.width*plane_scale, plane.img.height*plane_scale);
	}
	rockets.draw();

	// Taškai
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Nuskrista: " + plane.score.toFixed() +" mm", 32, 32);
};


var main = function () {
	var now = Date.now();
	if(started) var delta = now - then; else delta = 0;

	if(!stopped && started) update(delta / 1000);
	if(!stopped) render();

	then = now;
};


reset();
var then = Date.now();
setInterval(main, 1); 