var clickables = [];
var keys = [];

function initClickHandler(){
    var canvas = ctx.canvas;
    mouse = new Point(0, 0);
    
    $('canvas').mousemove(function(event){
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.scale(100/canvas.width);
    });
    $('canvas').mousedown(function(event) {
        var x = event.clientX;
        var y = event.clientY;
        var clickPoint = new Point(x, y).scale(100/canvas.width);
        for(var clickable of clickables){
            if(clickable.isContaining(clickPoint)){
                clickable.isActive = true;
                clickable.onClick(clickPoint);
                break;
            }
        }
    });
    $('canvas').mouseup(function(event) {
        var x = event.clientX;
        var y = event.clientY;
        var clickPoint = new Point(x, y).scale(100/canvas.width);
        for(var clickable of clickables){
            if(clickable.isActive){
                clickable.isActive = false;
                clickable.onRelease(clickPoint);
                break;
            }
        }
    });
    $('canvas').mouseout(function(event){
        var x = event.clientX;
        var y = event.clientY;
        var clickPoint = new Point(x, y).scale(100/canvas.width);
        for(var clickable of clickables){
            if(clickable.isActive){
                clickable.isActive = false;
                clickable.onRelease(clickPoint);
                break;
            }
        }
    });
    $('body').keypress(function(event){
        keys.forEach(function(key){
            if(key.name == event.key){
                key.onPress();
            }else if(key.id == event.charCode){
                key.onPress();
            }
        })
    });
}
class Key{
    constructor(keyId){
        if(typeof keyId == "string"){
            this.name = keyId;
        }else{
            this.id = keyId;
        }
        keys.push(this);
    }
    onPress(func){
        if(func instanceof Function){
            this.onPress = func;
        }
    }
}
class Clickable{
    constructor(canvasElement, radius){
        this.isActive = false;
        this.element = canvasElement;
        this.radius = radius;
        clickables.push(this);
    }
    isContaining(clickPoint){
        var isClicked;
        console.log(clickPoint);
        if(this.radius){
            var distanceFromClick = (new Point(this.element.x - clickPoint.x, this.element.y - clickPoint.y)).r;
            if(distanceFromClick < this.radius){
                isClicked= true;
            }else{
                isClicked=false;
            }
        }else{
            isClicked=false;
        }
        
        return isClicked;
    }
    onClick(func){
        if(func instanceof Function){
            this.onClick = func;
        }
    }
    onRelease(func){
        if(func instanceof Function){
            this.onClick = func;
        }
    }
}