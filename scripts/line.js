/***********************
*****  LINE CLASS  *****
***********************/
class Line {
    constructor(startPos, endPos, color = '#00FF88', collision, normal, sound, slope, b) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.color = color;
        this.collision = collision;
        this.normal = normal;
        this.sound = sound;
        this.slope = slope;
        this.b = b;
    }

    Draw() {
        CONTEXT.save();
        CONTEXT.lineWidth = 1;
        CONTEXT.strokeStyle = this.color;
        CONTEXT.beginPath();
        CONTEXT.moveTo(this.startPos.x, this.startPos.y);
        CONTEXT.lineTo(this.endPos.x, this.endPos.y);
        CONTEXT.stroke();
        CONTEXT.closePath();
        CONTEXT.restore();
    };

}