var isFirstLoop = true;

function mainLoop(){
    backgroundLoop();
    c = ctx;
    
    projectiles.forEach(function(particle, i){
        /*var shade = LightenDarkenColor(particleColor, 50);
        var offset = new Point(0.125 * particle.radius, 0.125 * particle.radius);
        var gradiant = particle.makeGradiant(particleColor, shade, 0.25*particle.radius, offset);
        
        c.fillStyle = gradiant;*/
        c.fillStyle = particleColor;
        reflectParticle(particle);
        if(i != 0){
            particleCollisions(i);
        }
        if(isFriction){
            airResistance(particle);
        }
        particle.fill(c, particle.radius);
        particle.x += particle.vel.x/particle.mass;
        particle.y += particle.vel.y/particle.mass;

        c.strokeStyle = 'black';
        c.lineWidth = 0.2;
        if(particle.clickHandler.isActive){
            var forceLine = new Line(particle, mouse);
            forceLine.stroke(c);
        }
    });
    
}

function particleCollisions(checkIndex){
    particle = projectiles[checkIndex];
    projectiles.forEach(function(particleToCheck, i){
        if(i != checkIndex && i != 0){
            var distance = particleToCheck.distance(particle);
            if(distance.r < particleToCheck.radius + particle.radius){
                let wallAngle = distance.deg + 90;
                particle.vel.deg = 2*wallAngle - particle.vel.deg;
            }
        }
    });
}

function backgroundLoop(){
    c = ctx;
    c.beginPath()
    c.fillStyle = backgroundColor;
    c.rect(0, 0, c.canvas.width, c.canvas.height)
    c.fill()
    c.closePath()
}

function airResistance(particle){
    var surfaceArea = Math.PI*Math.pow(particle.radius*(frictionScale/100), 2);
    var dragForce = new Point(0,0);
    dragForce.r = surfaceArea * particle.vel.r;
    dragForce.deg = particle.vel.deg + 180;
    particle.vel.x += dragForce.x/particle.mass;
    particle.vel.y += dragForce.y/particle.mass;
}

function reflectParticle(particle){
    //right side
    if(particle.x + particle.radius >= 100){
        let wallAngle = 90;
        particle.vel.deg = 2*wallAngle - particle.vel.deg;
    }
    
    //left side
    if(particle.x - particle.radius <= 0){
        let wallAngle = -90;
        particle.vel.deg = 2*wallAngle - particle.vel.deg;
    }
    
    //top
    if(particle.y + particle.radius >= 100){
        let wallAngle = 0;
        particle.vel.deg = 2*wallAngle - particle.vel.deg;
    }
    
    //bottomn
    if(particle.y - particle.radius <= 0){
        let wallAngle = 180;
        particle.vel.deg = 2*wallAngle - particle.vel.deg;
    }
}