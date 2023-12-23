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
        this.buttonText = new TextC(
            this.text,
            new Vector2(this.pos.x, this.pos.y),
            this.fontFamily,
            'normal',
            this.fontSize,
            this.fontColor,
            'left'
        );

        this.collision = new Collision();

        this.bounds = new Rectangle(this.pos.x, this.pos.y - (this.fontSize / 2), this.size.x, this.size.y);
    }

    IsPushed() {
        return this.isPushed;
    }

    SetFontColor(color) {
        this.fontColor = color;
        this.buttonText.SetColor(this.fontColor);
    }

    isPointerOver(pos) {
        const pointerRect = new Rectangle((pos.x - 2), (pos.y - 2), 4, 4);
        return this.collision.CheckBoxCollision(pointerRect, this.bounds);
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
            this.SetFontColor(this.hoverColor);
        } else {
            this.SetFontColor(this.originalFontColor);
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
        this.buttonText.Draw();
    }

}