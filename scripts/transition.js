/*************************************************************
*****  TRANSITION: The way to transition between scenes  *****
*************************************************************/

class Transition {

    constructor(color = '0, 0, 0', duration = 5, direction = 'in', sound = null) {
        this.color = color;;
        this.duration = duration;
        this.direction = direction;
        this.sound = sound;

        this.fadeOpacity = (this.direction === 'in') ? 1 : 0;
        this.fadeRate = 1 / (this.duration * 60);
        this.fadeTexture = new Texture(new Vector2(0, 0), new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT), `rgba(${this.color}, ${this.fadeOpacity})`, 1, `rgba(${this.color}, ${this.fadeOpacity})`);
        this.startTime = GameTime.getCurrentGameTime();
        this.isComplete = false;
    }

    update(currentGameTime) {

        const elapsedTime = (currentGameTime - this.startTime);

        this.fadeOpacity = (this.direction === 'in') ? this.fadeOpacity - this.fadeRate : this.fadeOpacity + this.fadeRate;
        // this.fadeOpacity = (this.fadeOpacity < 0) ? 0 : this.fadeOpacity;

        this.fadeTexture.SetColor(`rgba(${this.color}, ${this.fadeOpacity})`);

        if (elapsedTime >= this.duration) {
            this.isComplete = true;
        }

    }

    IsComplete() {
        return this.isComplete;
    }

    draw() {
        this.fadeTexture.Draw();
    }

}