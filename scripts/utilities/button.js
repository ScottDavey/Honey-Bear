/*******************************************
**************  BUTTON CLASS  **************
*******************************************/
class Button {

    constructor(imgPath, pos, size) {
        this.img = new Image(imgPath, new Vector2(pos.x, pos.y), new Vector2(size.x, size.y));
        this.pos = this.img.GetPos();
        this.size = this.img.GetSize();
        this.isActionLocked = false;
        this.isPushed = false;

        this.bounds = new Rectangle(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    IsPushed() {
        return this.isPushed;
    }

    isPointerOver(pos) {
        // Check to see if pointer is hovering/clicking the play button
        return (pos.x >= this.bounds.left && pos.x <= (this.bounds.left + this.bounds.width) && pos.y >= this.bounds.top && pos.y <= (this.bounds.top + this.bounds.height));
    }

    // Based on a given pointer (mouse, touch control), check to see if we can perform an action on the button
    CheckPointerAction(pointerPos) {

        if (!this.isActionLocked) {
            this.isActionLocked = true;
            if (this.isPointerOver(pointerPos)) {
                this.isPushed = true;
            }
        }

    }

    Update() {

        this.isPushed = false;
        this.isActionLocked = false;

        // Get the coordinates of the various pointers (mouse, touch)
        const mousePos = Input.Mouse.OnMouseMove.GetPosition();
        const touchPositions = Input.Touch.GetPositions();

        // Handle Inputs
        if (Input.Touch.IsTouching()) {
            // Loop through touches
            for (const touchPos of touchPositions) {
                this.CheckPointerAction(touchPos);
            }
        } else if (Input.Mouse.GetButton(Input.Mouse.LEFT)) {
            this.CheckPointerAction(mousePos);
        }

        /*else {
            this.isActionLocked = false;
            this.isPushed = false;
        }*/

    }

    Draw() {
        this.img.Draw();
    }

}