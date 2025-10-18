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

        this.textures = [];
    }

    SetStartPos(start) {
        this.startPos = new Vector2(start.x, start.y);
    }
    
    SetEndPos(end) {
        this.endPos = new Vector2(end.x, end.y);
    }

    SetColor(color) {
        this.color = color;
    }

    SetTextures(textures) {
        this.texture = textures;
    }

    GetPos() {
        return { start: this.startPos, end: this.endPos };
    }

    Draw() {

        for (const tex of this.textures) {
            tex.Draw();
        }

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