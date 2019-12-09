/**************************************************
*****  INTRODUCTION: The Game's Introduction  *****
**************************************************/

class Introduction {

    constructor() {
        this.transitionIn = new Transition('0, 0, 0', 3, 'in');
        this.transitionOut = undefined; // Will be initialized later, once transitionIn is complete
        this.introText = 'A Game by Kennedy Amanda Davey';
        this.centeredText = CenterText(this.introText, 36, new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT));
    }

    GetDone() {
        return this.done;
    };

    Update() {
        const currentTime = GameTime.getCurrentGameTime();

        // If the In transition is not complete, continue
        if (!this.transitionIn.IsComplete()) this.transitionIn.update(currentTime);
        // If the In transition is complete, update the Out
        if (this.transitionIn.IsComplete()) {
            if (!this.transitionOut) this.transitionOut = new Transition('0, 0, 0', 3, 'out');
            this.transitionOut.update(currentTime);
            this.done = this.transitionOut.IsComplete();
        }

        // Exit intro early if ESCAPE key is pressed
        if (Input.Keys.GetKey(Input.Keys.ESCAPE) || Input.Touch.IsTouching()) this.done = true;
    };

    Draw() {
        DrawText(this.introText, this.centeredText.x, this.centeredText.y, 'normal 45px "Poiret One", sans-serif', '#FFFFFF');

        if (!this.transitionIn.IsComplete()) this.transitionIn.draw();
        if (this.transitionIn.IsComplete() && this.transitionOut) this.transitionOut.draw();
    };

}