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

	particlesLeft.forEach(function (particle, i) {
		leftTemps.push(particle.vel.r);
		c.fillStyle = particleColor;
		reflectParticle(particle, 0, i, particlesLeft, particlesRight);
		particleCollisions(i, particlesLeft);
		particle.fill(c, particle.radius);
		particle.x += particle.vel.x / particle.mass;
		particle.y += particle.vel.y / particle.mass;

		c.strokeStyle = 'black';
		c.lineWidth = 0.2;
		if (particle.clickHandler.isActive) {
			var forceLine = new Line(particle, mouse);
			forceLine.stroke(c);
		}
	});

	$('#tempLeft').html(Math.round(average(leftTemps)* particleMass));

	particlesRight.forEach(function (particle, i) {
		rightTemps.push(particle.vel.r);
		c.fillStyle = particleColor;
		reflectParticle(particle, translation, i, particlesLeft, particlesRight);
		particleCollisions(i, particlesRight);
		particle.fill(c, particle.radius);
		particle.x += particle.vel.x / particle.mass;
		particle.y += particle.vel.y / particle.mass;

		c.strokeStyle = 'black';
		c.lineWidth = 0.2;
		if (particle.clickHandler.isActive) {
			var forceLine = new Line(particle, mouse);
			forceLine.stroke(c);
		}
	});

	$('#tempRight').html(Math.round(average(rightTemps) * particleMass));
	
	if(!allowCrossOver){
		c.beginPath()
		c.fillStyle = barrierColor;
		c.rect(c.canvas.width/2.1, 0, (0.1*c.canvas.width)/2.1, c.canvas.height)
		c.fill()
		c.closePath()
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
	particles.forEach(function (particleToCheck, i) {
		if (i != checkIndex && i != 0) {
			var distance = particleToCheck.distance(particle);
			if (distance.r < particleToCheck.radius + particle.radius) {
				let wallAngle = distance.deg + 90;
				particle.vel.deg = 2 * wallAngle - particle.vel.deg;
				let newSpeed = (particleToCheck.vel.r + particle.vel.r) / 2
				particleToCheck.vel.r = newSpeed;
				particle = newSpeed;
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
			particle.x += 11;
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
			particle.x -= 11;
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