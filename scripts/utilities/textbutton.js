/************************************************
**************  TEXT BUTTON CLASS  **************
************************************************/
class TextButton {

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

    IsPushed() {
        return this.isPushed;
    }

    SetFontColor(color) {
        this.fontColor = color;
    }

    isPointerOver(pos) {
        // Check to see if pointer is hovering/clicking the play button
        return (pos.x >= this.bounds.left && pos.x <= (this.bounds.left + this.bounds.width) && pos.y >= this.bounds.top && pos.y <= (this.bounds.top + this.bounds.height));
    }

    // Based on a given pointer (mouse, touch control), check to see if we can perform an action on the button
    CheckPointerAction(pointerPos, isPointerEngaged) {

        if (!this.isLeftClickLocked) {
            this.isLeftClickLocked = true;
            if (this.isPointerOver(pointerPos)) {
                this.isPushed = true;
            }
        }

    }

    Update() {

        // Get the coordinates of the various pointers (mouse, touch)
        const mousePos = Input.Mouse.OnMouseMove.GetPosition();
        const touchPos = Input.Touch.GetPositions()[0]; // We only care about the first touch

        // Apply hover state (if mouse)
        if (this.isPointerOver(mousePos)) {
            this.fontColor = this.hoverColor;
        } else {
            this.fontColor = this.originalFontColor;
        }

        // Handle Inputs
        if (Input.Touch.IsTouching()) {
            this.CheckPointerAction(touchPos, true);
        } else if (Input.Mouse.GetButton(Input.Mouse.LEFT)) {
            this.CheckPointerAction(mousePos, true);
        } else {
            this.isLeftClickLocked = false;
            this.isPushed = false;
        }

    }

    Draw() {
        DrawText(this.text, this.pos.x, this.pos.y, `normal ${this.fontSize}px ${this.fontFamily}, sans-serif`, this.fontColor);
    }

}