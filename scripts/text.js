/***********************
*****  TEXT CLASS  *****
***********************/

class TextC {

    constructor(string, position, fontFamily, fontWeight, fontSize, color, alignment) {
        this.string = string;
        this.position = position;
        this.fontFamily = fontFamily;
        this.fontWeight = fontWeight;
        this.fontSize = fontSize;
        this.color = color;
        this.alignment = alignment;
        this.textWidth = 0;
    }

    GetString() {
        return this.string;
    }

    GetTextWidth() {
        return this.textWidth;
    }

    GetCenteredTextPosition(targetCenter) {
        return new Vector2(
            targetCenter.x - this.textWidth / 2,
            targetCenter.y - (this.fontSize / 2)
        );
    }

    SetPosition(position) {
        this.position = position;
    }

    SetString(string) {
        this.string = string;
    }

    SetColor(color) {
        this.color = color;
    }
    
    SetFontFamily(family) {
        this.fontFamily = family;
    }

    SetFontWeigt(weight) {
        this.fontWeight = weight;
    }

    SetFontSize(size) {
        this.fontSize = size;
    }

    SetAlignment(alignment) {
        this.alignment = alignment;
    }

    Draw() {
        CONTEXT.save();
        CONTEXT.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
        CONTEXT.fillStyle = this.color;
        CONTEXT.textBaseline = 'middle';
        CONTEXT.textAlign = this.alignment;

        this.textWidth = CONTEXT.measureText(this.string).width;

        CONTEXT.fillText(this.string, this.position.x, this.position.y);
        CONTEXT.restore();
    }

}