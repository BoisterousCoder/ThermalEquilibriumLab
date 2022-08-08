/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
//user settings
const fps = 30;//This is the maximum frames per second, lag can make the simulaton slower if there is lag.
const roundingAccuaracy = 100;//This is the rounding on the temperatures shown above the tank
const simSpeed = 5;//This scales initial velocities of the particals to make the simulatation appear to run slower
const equilibriumFudging = 0.01;//This is the amount of error after rounding the program will accept as an equilibrium
const canvasSize = 0.65;//Overall size of the canvas

//left side
var initTempLeft = 20;
var numberOfParticlesLeft = 100;
var particleMassLeft = 5;

//right side
var initTempRight = 10;
var numberOfParticlesRight = 200;
var particleMassRight = 5;

/*

DO NOT GO PASS THIS POINT IF YOU DONT KNOW WHAT YOU ARE DOING

*/

//settings
var backgroundColor = '#BFBFBF';
var particleColor = '#453FC0';
var barrierColor = '#ff0000';
var particleRadius = 0.5;
var canvasRatio = 2.01;
var isFriction = false;
var allowCrossOver = false;

//global vars
var ctx;
var gameLoop;
var mouse;
var stopwatchTime = 0;
var isStopwatchRunning;
var roundedTempLeft;
var roundedTempRight;

$(function(){
    var canvas = document.getElementById('mainCanvas');
    var c = canvas.getContext('2d');
    ctx = c;
    printInputs();
    init(c);
    refreshSize();
});

function resetLoop(){
    //allowCrossOver = false;
    if(allowCrossOver){
        $('[type=checkbox]').click();
    }
    stopwatchTime = 0;
    $('#time').html(0);
    clearInterval(gameLoop);
    init(ctx);
}

function init(c) {
    var particlesLeft = [];
    var particlesRight = [];

    //premake particle obj
    for (let i = 0; i < numberOfParticlesLeft; i++) {
        let initVel = new Point(0, 0);
        initVel.r = initTempLeft/simSpeed;
        initVel.deg = i * (360 / numberOfParticlesLeft);
        let initPoint = getPointOnCircle(((2 * numberOfParticlesLeft - 1) * particleRadius - 1) / (2 * Math.PI), i * (1 / numberOfParticlesLeft))
        initPoint.x += 50;
        initPoint.y += 50;

        makeParticle(initPoint, particleRadius, particleMassLeft, initVel, particlesLeft);
    }
    
    for (let i = 0; i < numberOfParticlesRight; i++) {
        let initVel = new Point(0, 0);
        initVel.r = initTempRight/simSpeed;
        initVel.deg = i * (360 / numberOfParticlesRight);
        let initPoint = getPointOnCircle(((2 * numberOfParticlesRight - 1) * particleRadius - 1) / (2 * Math.PI), i * (1 / numberOfParticlesRight))
        initPoint.x += 151;
        initPoint.y += 50;

        makeParticle(initPoint, particleRadius, particleMassRight, initVel, particlesRight);
    }

    //start loop
    gameLoop = setInterval(makeMainLoop(particlesLeft, particlesRight, 100), 1000 / fps);
}
window.onresize = refreshSize;

function toggleBarrier(){
    let $button = $('#barrierButton');
    $button.toggleClass('on');
    allowCrossOver = $button.hasClass('on');
    setBarrierButtonText();
}

function setBarrierButtonText(){
    if(allowCrossOver){
        $('#barrierButton').text("Add Barrier");
    }else{
        $('#barrierButton').text("Remove Barrier");
    }
}

function makeParticle(initPoint, radius, mass, initVel, list) {
    var particle = new Point(initPoint.x, initPoint.y);
    particle.vel = initVel;
    particle.mass = mass;
    particle.radius = radius;
    list.push(particle);
}

function printInputs() {
    setBarrierButtonText();
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
        
        let alias = settingContainer.attr('alias');
        settingContainer.append(alias + ': ');
        settingContainer.append(settingInput);
        var initValue = window[varName];
        if (settingInput.attr('type') == 'range') {
            settingContainer.append('<p>'+initValue+'</p>');
        }
        if (settingInput.attr('type') == 'checkbox') {
            settingInput.attr('checked', initValue);
        } else {
            settingInput.val(initValue);
        }
        if(settingInput.attr('type')=='range'){
            settingContainer.append($('<button class="adder">+</buttom>'));
            settingContainer.append($('<button class="subtractor">-</buttom>'));
        }
    });
    $('[type="range"]').change(function(e){
        let target = $(this);
        target.parent().children('p').html(target.val())
    });
    $('.adder').click(function(e){
        let target = $(this);
        let varName = target.parent().attr('var');
        let value = window[varName];
        value++;
        window[varName] = value;
        target.parent().children('input').val(value);
        target.parent().children('p').html(value);
    });
    $('.subtractor').click(function(e){
        let target = $(this);
        let varName = target.parent().attr('var');
        let value = window[varName];
        value--;
        window[varName] = value;
        target.parent().children('input').val(value);
        target.parent().children('p').html(value);
    });
}

function setStopwatch(){
    if(!allowCrossOver){
        isStopwatchRunning = true;
    }else{
        isStopwatchRunning = false;
    }
}

function refreshSize() {
    ctx.canvas.width = window.innerWidth*canvasSize;
    ctx.canvas.height = window.innerWidth*canvasSize / canvasRatio;
    $('#canvasContainer').css('width', ctx.canvas.width);
    $('#canvasContainer label').css('width', ctx.canvas.width/2.1);
    $('#canvasContainer label').css('display', 'inline-block');
    $('#canvasContainer label').css('text-align', 'center');
}

function getPointOnCircle(radius, time) {
    var point = new Point(1, 1);
    point.r = radius;
    point.rad = 2 * Math.PI * time
    return point;
}