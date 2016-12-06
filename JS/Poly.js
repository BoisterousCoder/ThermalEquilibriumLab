class Poly{
    constructor(points, loc){
        this.points = points;
        this.loc = loc
    }
    fill(c){
        c.beginPath()
        var lastPoint = this.points[this.points.length-1]
        var locX = c.canvas.width*(this.loc.x/100);
        var locY = c.canvas.width*(this.loc.y/100);
        var lastPointX = c.canvas.width*(lastPoint.x/100);
        var lastPointY = c.canvas.width*(lastPoint.x/100);
        
        c.moveTo(lastPointX + locX, lastPointY + locX)
        for(var point of this.points){
            var pointX = c.canvas.width*(point.x/100);
            var pointY = c.canvas.width*(point.y/100);
            c.lineTo(pointX + locX, pointY + locY)
        }
        c.fill()
        c.closePath()
    }
    stroke(c){
        c.beginPath()
        var oldWidth = c.lineWidth;
        c.lineWidth *= c.canvas.width/100
        var lastPoint = this.points[this.points.length-1]
        c.moveTo(lastPoint.x + this.loc.x, lastPoint.y + this.loc.y)
        for(var point of this.points){
            c.lineTo(point.x + this.loc.x, point.y + this.loc.y)
        }
        c.stroke()
        c.closePath()
        c.lineWidth = oldWidth;
    }
}