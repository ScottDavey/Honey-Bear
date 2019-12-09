/*******************************************
**************  BUTTON CLASS  **************
*******************************************/
class Button {

    constructor(text, pos, font = { family: 'Verdana', size: 12 }, color, hoverColor, BGColor, hoverBGColor) {
        this.text = text;
        this.pos = new Vector2(pos.x, pos.y);
        this.fontFamily = font.family;
        this.fontSize = font.size;
        this.originalFontColor = color;
        this.fontColor = this.originalFontColor;
        this.hoverColor = hoverColor;
        this.size = new Vector2(this.text.length * (this.fontSize * 0.65), (this.fontSize));
        this.BGColor = BGColor;
        this.hoverBGColor = hoverBGColor;
        this.isLeftClickLocked = false;
        this.isPushed = false;

        this.bounds = new Rectangle(this.pos.x, (this.pos.y - this.size.y), this.size.x, this.size.y);
    }

    GetIsPushed() {
        return this.isPushed;
    }

    SetFontColor(color) {
        this.fontColor = color;
    }

    isMouseOver(mousePos) {
        const mouseMoveX = mousePos.x;
        const mouseMoveY = mousePos.y;

        // Check to see if mouse is hovering the play button
        return (mouseMoveX >= this.bounds.left && mouseMoveX <= (this.bounds.left + this.bounds.width) && mouseMoveY >= this.bounds.top && mouseMoveY <= (this.bounds.top + this.bounds.height));

    }

    Update(mousePos) {

        if (this.isMouseOver(mousePos)) {
            this.fontColor = this.hoverColor;
            if (!this.isLeftClickLocked && (Input.Mouse.GetButton(Input.Mouse.LEFT) || Input.Touch.IsTouching())) {
                this.isLeftClickLocked = true;
                this.isPushed = true;
            } else {
                this.isLeftClickLocked = false;
            }
        } else {
            this.fontColor = this.originalFontColor;
        }

    }

    Draw() {
        DrawText(this.text, this.pos.x, this.pos.y, `normal ${this.fontSize}px ${this.fontFamily}, sans-serif`, this.fontColor);
    }

}