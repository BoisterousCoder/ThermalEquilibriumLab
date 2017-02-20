//constants
const fps = 30;

//settings
var backgroundColor = '#000000';
var particleColor = '#00ff00';
var particleRadius = 0.5;
var particleMass = 8;
var numberOfParticles = 200;
var initTemp = 75;
var canvasRatio = 2.1;
var frictionScale = 10; //keep bellow 15
//var arrowKeyForce = 10;
var isFriction = false;

//global vars
var ctx;
var mouse;

$(function () {
	var particlesLeft = [];
	var particlesRight = [];
	var canvas = document.getElementById('mainCanvas');
	var c = canvas.getContext('2d');
	ctx = c;

	printInputs();
	refreshSize();
	initClickHandler();

	//premake particle obj
	for (let i = 0; i < numberOfParticles; i++) {
		let initForce = new Point(0, 0);
		initForce.r = initTemp;
		initForce.deg = i * (360 / numberOfParticles);
		let initPoint = getPointOnCircle(((2 * numberOfParticles - 1) * particleRadius - 1) / (2 * Math.PI), i * (1 / numberOfParticles))
		initPoint.x += 50;
		initPoint.y += 50;

		makeParticle(initPoint, particleRadius, particleMass, initForce, particlesLeft);
		
		initPoint.x += 110;
		makeParticle(initPoint, particleRadius, particleMass, initForce, particlesRight);
	}

	//initArrowKeys();

	//start loop
	setInterval(makeMainLoop(particlesLeft, particlesRight, 110), 1000 / fps);
});
window.onresize = refreshSize;

function makeParticle(initPoint, radius, mass, initForce, list) {
	var particle = new Point(initPoint.x, initPoint.y);
	particle.vel = new Point(0, 0);
	particle.mass = mass;
	particle.radius = radius;
	particle.applyForce = function (force) {
		accelleration = force.scale(1 / particle.mass);
		particle.vel.x += accelleration.x;
		particle.vel.y += accelleration.y;
	}
	particle.applyForce(initForce);
	particle.clickHandler = new Clickable(particle, radius);
	particle.clickHandler.onClick = function (startPoint) {
		particle.clickHandler.onRelease = function (endPoint) {
			var force = new Point(0, 0);
			force.x = particle.x - endPoint.x;
			force.y = particle.y - endPoint.y;
			particle.applyForce(force);
		}
	}
	list.push(particle);
}

function printInputs() {
	settingContainers = $('.setting');
	settingContainers.each(function (i, settingContainer) {
		var settingContainer = $(settingContainer);
		var type = settingContainer.attr('type');
		var varName = settingContainer.attr('var');

		var settingInput = $('<input/>');
		settingInput.attr('type', type);
		if (type == 'range') {
			var max = settingContainer.attr('max');
			var min = settingContainer.attr('min');
			settingInput.attr('max', max);
			settingInput.attr('min', min);
		}

		settingInput.change(function () {
			var self = $(this);
			var cont = self.parent();
			var varName = cont.attr('var');
			var value;
			if (self.attr('type') == 'checkbox') {
				value = self.prop('checked');
			} else {
				value = self.val();
			}
			if (self.attr('type') == 'range') {
				value = Number(value);
			}
			window[varName] = value;
		});


		settingContainer.append(varName + ': ');
		settingContainer.append(settingInput);
		var initValue = window[varName];
		if (settingInput.attr('type') == 'checkbox') {
			settingInput.attr('checked', initValue);
		} else {
			settingInput.val(initValue);
		}

	});
}
/*function initArrowKeys(){
    var arrowUp = new Key('ArrowUp');
    arrowUp.onPress = function(){
        var force = new Point(0, -arrowKeyForce);
        projectiles[0].applyForce(force);
        makeProjectedParticle(force)
    }
    
    var arrowDown = new Key('ArrowDown');
    arrowDown.onPress = function(){
        var force = new Point(0, arrowKeyForce);
        projectiles[0].applyForce(force);
        makeProjectedParticle(force)
    }
    
    var arrowLeft = new Key('ArrowLeft');
    arrowLeft.onPress = function(){
        var force = new Point(-arrowKeyForce, 0);
        projectiles[0].applyForce(force);
        makeProjectedParticle(force)
    }
    
    var arrowRight = new Key('ArrowRight');
    arrowRight.onPress = function(){
        var force = new Point(arrowKeyForce, 0);
        projectiles[0].applyForce(force);
        makeProjectedParticle(force)
    }
    
    function makeProjectedParticle(force){
        var initPoint = new Point(projectiles[0].x, projectiles[0].y);
        var initForce = new Point(-force.x, -force.y);
        var radius = Math.abs(initForce.r);
        var mass = radius;
        makeParticle(initPoint, radius, mass, initForce);
    }
}*/
function refreshSize() {
	if (window.innerWidth < window.innerHeight) {
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerWidth / canvasRatio;
		$('#settings').css('margin-top', ctx.canvas.height);
		$('#settings').css('margin-left', 0);
	} else {
		ctx.canvas.width = window.innerHeight;
		ctx.canvas.height = window.innerHeight / canvasRatio;
		$('#settings').css('margin-left', ctx.canvas.width);
		$('#settings').css('margin-top', 0);
	}

}

function getPointOnCircle(radius, time) {
	var point = new Point(1, 1);
	point.r = radius;
	point.rad = 2 * Math.PI * time
	return point;
}