/************************************************
**************  DAMAGE TEXT CLASS  **************
************************************************/

class DamageText {

    constructor(value, isCrit, position, isPlayer) {
        this.value = value;
        this.valueFormatted = this.value.toLocaleString();
        this.isCrit = isCrit;
        this.position = new Vector2(position.x, position.y - 20);
        this.isPlayer = isPlayer;
        this.duration = 2;
        this.changeRate = 1 / (this.duration * 60);
        this.fontSize = this.isCrit ? 17 : 10;
        this.font = `normal ${this.fontSize}pt Ubuntu, Verdana`;
        this.fontColor = this.isPlayer ? '128, 0, 0' : (this.isCrit ? '97, 87, 13' : '255, 255, 255');
        this.startTime = GameTime.getCurrentGameTime();
        this.opacity = 1.0;
        this.text = new Text(
            `${this.valueFormatted}`,
            this.position.x,
            this.position.y,
            this.font,
            `rgba(${this.fontColor}, ${this.opacity})`
        );
        this.isComplete = false;
    }

    IsComplete() {
        return this.isComplete;
    }

    Update(currentGameTime) {
        const elapsed = currentGameTime - this.startTime;

        // Update pos.y
        this.position.y += (this.changeRate + 1.2 * -elapsed);
        this.text.UpdatePos(new Vector2(this.position.x, this.position.y));

        // Update text alpha
        this.opacity -= (this.changeRate * elapsed);
        this.text.UpdateColor(`rgba(${this.fontColor}, ${this.opacity})`);

        if (elapsed >= this.duration) {
            this.isComplete = true;
        }
    }

    Draw() {
        this.text.Draw();
    }

}