var isFirstLoop = true;

function mainLoop(){
    backgroundLoop();
    c = ctx;
    
    projectiles.forEach(function(ball, i){
        /*var shade = LightenDarkenColor(ballColor, 50);
        var offset = new Point(0.125 * ball.radius, 0.125 * ball.radius);
        var gradiant = ball.makeGradiant(ballColor, shade, 0.25*ball.radius, offset);
        
        c.fillStyle = gradiant;*/
        c.fillStyle = ballColor;
        reflectBall(ball);
        if(i != 0){
            ballCollisions(i);
        }
        if(isFriction){
            airResistance(ball);
        }
        ball.fill(c, ball.radius);
        ball.x += ball.vel.x/ball.mass;
        ball.y += ball.vel.y/ball.mass;

        c.strokeStyle = 'black';
        c.lineWidth = 0.2;
        if(ball.clickHandler.isActive){
            var forceLine = new Line(ball, mouse);
            forceLine.stroke(c);
        }
    });
    
}

function ballCollisions(checkIndex){
    ball = projectiles[checkIndex];
    projectiles.forEach(function(ballToCheck, i){
        if(i != checkIndex && i != 0){
            var distance = ballToCheck.distance(ball);
            if(distance.r < ballToCheck.radius + ball.radius){
                let wallAngle = distance.deg + 90;
                ball.vel.deg = 2*wallAngle - ball.vel.deg;
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

function airResistance(ball){
    var surfaceArea = Math.PI*Math.pow(ball.radius*(frictionScale/100), 2);
    var dragForce = new Point(0,0);
    dragForce.r = surfaceArea * ball.vel.r;
    dragForce.deg = ball.vel.deg + 180;
    ball.vel.x += dragForce.x/ball.mass;
    ball.vel.y += dragForce.y/ball.mass;
}

function reflectBall(ball){
    //right side
    if(ball.x + ball.radius >= 100){
        let wallAngle = 90;
        ball.vel.deg = 2*wallAngle - ball.vel.deg;
    }
    
    //left side
    if(ball.x - ball.radius <= 0){
        let wallAngle = -90;
        ball.vel.deg = 2*wallAngle - ball.vel.deg;
    }
    
    //top
    if(ball.y + ball.radius >= 100){
        let wallAngle = 0;
        ball.vel.deg = 2*wallAngle - ball.vel.deg;
    }
    
    //bottomn
    if(ball.y - ball.radius <= 0){
        let wallAngle = 180;
        ball.vel.deg = 2*wallAngle - ball.vel.deg;
    }
}