/*******************************************
**************  BUTTON CLASS  **************
*******************************************/
class Button {

    constructor(imgPath, pos, size) {
        this.img = new Image(imgPath, new Vector2(pos.x, pos.y), new Vector2(size.x, size.y));
        this.pos = this.img.GetPos();
        this.size = this.img.GetSize();
        this.isLeftClickLocked = false;
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

    Update() {

        // Get the coordinates of the various pointers (mouse, touch)
        const mousePos = Input.Mouse.OnMouseMove.GetPosition();
        const touchPos = Input.Touch.GetPosition();

        // Else if we're using touch controls and we've touched a button
        if (this.isPointerOver(touchPos)) {
            if (!this.isLeftClickLocked && Input.Touch.IsTouching()) {
                this.isLeftClickLocked = true;
                this.isPushed = true;
            } else {
                this.isLeftClickLocked = false;
                this.isPushed = false;
            }
        }

        // If mouse is over we'll do a couple things: if there's a hover effect, do it; check to see if the mouse is clicked
        // if (this.isPointerOver(mousePos)) {
        //     if (!this.isLeftClickLocked && Input.Mouse.GetButton(Input.Mouse.LEFT)) {
        //         this.isLeftClickLocked = true;
        //         this.isPushed = true;
        //     } else {
        //         this.isLeftClickLocked = false;
        //         this.isPushed = false;
        //     }
        // }

    }

    Draw() {
        this.img.Draw();
    }






    /*
        IsPushed() {
            return this.isPushed;
        }
    
        Update(mousePos = Input.Mouse.OnMouseMove.GetPosition()) {
    
            const touchPos = Input.Touch.GetPosition();
    
            if (this.isPointerOver(mousePos)) console.log('MOUSE OVER');
            if (this.isPointerOver(touchPos)) console.log('TOUCH OVER');
    
            if (this.isPointerOver(mousePos) || this.isPointerOver(touchPos)) {
                if (!this.isLeftClickLocked && (Input.Mouse.GetButton(Input.Mouse.LEFT) || Input.Touch.IsTouching())) {
                    console.log('TOUCHED');
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
            this.img.Draw();
        }
    */

}