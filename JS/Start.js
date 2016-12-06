//constants
const fps = 30;

//settings
var backgroundColor = '#0000ff';
var ballColor = '#ff0000';
var ballRadius = 5;
var ballMass = 8;
var frictionScale = 10;//keep bellow 15
var arrowKeyForce = 10;
var isFriction = true;
var pizzaSlider = 4;

//global vars
var ctx;
var mouse;
var projectiles = [];

$(function(){
    var canvas = document.getElementById('mainCanvas');
    var c = canvas.getContext('2d');
    ctx = c;
    
    printInputs();
    refreshSize();
    initClickHandler();
    
    //premake ball obj
    var initPoint = new Point(50, 50);
    var initForce = new Point(0, 0);
    makeBall(initPoint, ballRadius, ballMass, initForce)
    
    initArrowKeys();
    
    //start loop
    setInterval(mainLoop, 1000/fps);
});
window.onresize = refreshSize;
function makeBall(initPoint, radius, mass, initForce){
    var ball = new Point(initPoint.x, initPoint.y);
    ball.vel = new Point(0, 0);
    ball.mass =  mass;
    ball.radius = radius;
    ball.applyForce = function(force){
        accelleration = force.scale(1/ball.mass);
        ball.vel.x += accelleration.x;
        ball.vel.y += accelleration.y;
    }
    ball.applyForce(initForce);
    ball.clickHandler = new Clickable(ball, radius);
    ball.clickHandler.onClick = function(startPoint){
        ball.clickHandler.onRelease = function(endPoint){
            var force = new Point(0, 0);
            force.x = ball.x-endPoint.x;
            force.y = ball.y-endPoint.y;
            ball.applyForce(force);
        }
    }
    projectiles.push(ball);
}
function printInputs(){
    settingContainers = $('.setting');
    settingContainers.each(function(i, settingContainer){
        var settingContainer = $(settingContainer);
        var type = settingContainer.attr('type');
        var varName = settingContainer.attr('var');
        
        var settingInput = $('<input/>');
        settingInput.attr('type', type);
        if(type == 'range'){
            var max = settingContainer.attr('max');
            var min = settingContainer.attr('min');
            settingInput.attr('max', max);
            settingInput.attr('min', min);
        }
        
        settingInput.change(function(){
            var self = $(this);
            var cont = self.parent();
            var varName = cont.attr('var');
            var value;
            if(self.attr('type') == 'checkbox'){
                value = self.prop('checked');
            }else{
                value = self.val();
            }
            if(self.attr('type') == 'range'){
                value = Number(value);
            }
            window[varName] = value;
        });
        
        
        settingContainer.append(varName+': ');
        settingContainer.append(settingInput);
        var initValue = window[varName];
        if(settingInput.attr('type') == 'checkbox'){
            settingInput.attr('checked', initValue);
        }else{
            settingInput.val(initValue);
        }
        
    });
}
function initArrowKeys(){
    var arrowUp = new Key('ArrowUp');
    arrowUp.onPress = function(){
        var force = new Point(0, -arrowKeyForce);
        projectiles[0].applyForce(force);
        makeProjectedBall(force)
    }
    
    var arrowDown = new Key('ArrowDown');
    arrowDown.onPress = function(){
        var force = new Point(0, arrowKeyForce);
        projectiles[0].applyForce(force);
        makeProjectedBall(force)
    }
    
    var arrowLeft = new Key('ArrowLeft');
    arrowLeft.onPress = function(){
        var force = new Point(-arrowKeyForce, 0);
        projectiles[0].applyForce(force);
        makeProjectedBall(force)
    }
    
    var arrowRight = new Key('ArrowRight');
    arrowRight.onPress = function(){
        var force = new Point(arrowKeyForce, 0);
        projectiles[0].applyForce(force);
        makeProjectedBall(force)
    }
    
    function makeProjectedBall(force){
        var initPoint = new Point(projectiles[0].x, projectiles[0].y);
        var initForce = new Point(-force.x, -force.y);
        var radius = Math.abs(initForce.r);
        var mass = radius;
        makeBall(initPoint, radius, mass, initForce);
    }
}
function refreshSize(){
    if(window.innerWidth < window.innerHeight){
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerWidth;
        $('#settings').css('margin-top', ctx.canvas.height);
        $('#settings').css('margin-left', 0);
    }else{
        ctx.canvas.width = window.innerHeight;
        ctx.canvas.height = window.innerHeight;
        $('#settings').css('margin-left', ctx.canvas.width);
        $('#settings').css('margin-top', 0);
    }
    
}

function getPointOnCircle(radius, time){
    var point = new Point(1, 1);
    point.r = radius;
    point.rad = 2 * Math.PI * time
    return point;
}
