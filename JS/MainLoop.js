/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var isFirstLoop = true;

function makeMainLoop() {
	let args = Array.from(arguments);
	return function () {
		mainLoop(...args);
	};
}

function mainLoop(particlesLeft, particlesRight, translation) {
	let leftTemps = [];
	let rightTemps = [];
	backgroundLoop();
	c = ctx;

	particlesLeft.map(function (particle, i) {
		leftTemps.push(particle.vel.r);
		particle.x += particle.vel.x / particle.mass;
		particle.y += particle.vel.y / particle.mass;
		c.fillStyle = particleColor;
		reflectParticle(particle, 0, i, particlesLeft, particlesRight);
		particleCollisions(i, particlesLeft);
		particle.fill(c, particle.radius);

		c.strokeStyle = 'black';
		c.lineWidth = 0.2;
	});
	
	roundedTempLeft = Math.round(average(leftTemps)* particleMass * roundingAccuaracy)/roundingAccuaracy;
	$('#tempLeft').html(roundedTempLeft);

	particlesRight.map(function (particle, i) {
		rightTemps.push(particle.vel.r);
		particle.x += particle.vel.x / particle.mass;
		particle.y += particle.vel.y / particle.mass;
		c.fillStyle = particleColor;
		reflectParticle(particle, translation, i, particlesLeft, particlesRight);
		particleCollisions(i, particlesRight);
		particle.fill(c, particle.radius);

		c.strokeStyle = 'black';
		c.lineWidth = 0.2;
	});
	
	roundedTempRight = Math.round(average(rightTemps) * particleMass * roundingAccuaracy)/roundingAccuaracy;
	$('#tempRight').html(roundedTempRight);
	
	if(!allowCrossOver){
		c.beginPath()
		c.fillStyle = barrierColor;
		c.rect(c.canvas.width/canvasRatio, 0, ((2-canvasRatio)*c.canvas.width)/canvasRatio, c.canvas.height)
		c.fill()
		c.closePath()
	}
	
	if(isStopwatchRunning){
		stopwatchTime += 1;
		$('#time').html(Math.round(stopwatchTime/fps));
		if(Math.abs(roundedTempLeft-roundedTempRight) <= 0.01){
			$('[type=checkbox]').click();
			alert('You have reached a thermal temperature of '+ roundedTempLeft + " in " + Math.round(stopwatchTime/fps) + " seconds");
			stopwatchTime = 0;
			$('#time').html(0);
		}
	}
}

function average(array) {
	var sum = array.reduce(function (acc, val) {
		return acc + val;
	});
	var avg = sum / array.length;
	return avg;
}

function particleCollisions(checkIndex, particles) {
	particle = particles[checkIndex];
	particles.map(function (particleToCheck, i) {
		if (i < checkIndex) {
			var distance = particleToCheck.distance(particle);
			if (distance.r <= particleToCheck.radius + particle.radius) {
				let wallAngle = distance.deg + 90;
				particle.vel.deg = 2 * wallAngle - particle.vel.deg;
				let newSpeed = (particleToCheck.vel.r + particle.vel.r) / 2
				particleToCheck.vel.deg = 2 * wallAngle + particleToCheck.vel.deg;
				particleToCheck.vel.r = newSpeed;
				particle.vel.r = newSpeed;
			}
		}
	});
}

function backgroundLoop() {
	c = ctx;
	c.beginPath()
	c.fillStyle = backgroundColor;
	c.rect(0, 0, c.canvas.width, c.canvas.height)
	c.fill()
	c.closePath()
}

function reflectParticle(particle, translation, i, particlesLeft, particlesRight) {
	//right side
	if (particle.x + particle.radius >= 100 + translation) {
		if (translation == 0 && allowCrossOver) {
			particle.x += 1;
			particlesRight.push(particle);
			particlesLeft.splice(i, 1);
		} else {
			while (particle.x + particle.radius >= 100 + translation) {
				particle.x -= 1;
			}
			let wallAngle = 90;
			particle.vel.deg = 2 * wallAngle - particle.vel.deg;
		}
	}

	//left side
	if (particle.x - particle.radius <= 0 + translation) {
		if (translation != 0 && allowCrossOver) {
			particle.x -= 1;
			particlesLeft.push(particle);
			particlesRight.splice(i, 1);
		} else {
			while (particle.x + particle.radius <= 0 + translation) {
				particle.x += 1;
			}
			let wallAngle = -90;
			particle.vel.deg = 2 * wallAngle - particle.vel.deg;
		}
	}

	//top
	if (particle.y + particle.radius >= 100) {
		while (particle.y + particle.radius >= 100) {
			particle.y -= 1;
		}
		let wallAngle = 0;
		particle.vel.deg = 2 * wallAngle - particle.vel.deg;
	}

	//bottomn
	if (particle.y - particle.radius <= 0) {
		while (particle.y + particle.radius <= 0) {
			particle.y += 1;
		}
		let wallAngle = 180;
		particle.vel.deg = 2 * wallAngle - particle.vel.deg;
	}
}