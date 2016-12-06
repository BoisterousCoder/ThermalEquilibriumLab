class Line{
    constructor(point1, point2){
        this.point1 = point1;
        this.point2 = point2;
    }
    stroke(c){
        var oldWidth = c.lineWidth;
        c.lineWidth *= c.canvas.width/100
        c.beginPath()
        var point1X = c.canvas.width*(this.point1.x/100);
        var point1Y = c.canvas.width*(this.point1.y/100);
        var point2X = c.canvas.width*(this.point2.x/100);
        var point2Y = c.canvas.width*(this.point2.y/100);
        c.moveTo(point1X, point1Y);
        c.lineTo(point2X, point2Y);
        c.stroke();
        c.closePath();
        c.lineWidth = oldWidth;
    }
}