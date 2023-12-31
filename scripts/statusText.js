/************************************************
**************  STATUS TEXT CLASS  **************
************************************************/

class StatusText {

    constructor(type, value, isCrit, position, isPlayer) {
        this.type = type;
        this.value = value;
        this.isCrit = isCrit;
        this.positionX = random(position.x - 20, position.x + 20);
        this.position = new Vector2(this.positionX, position.y);
        this.isPlayer = isPlayer;
        this.duration = 2;
        this.changeRate = 1 / (this.duration * 60);

        if (this.type === 'DAMAGE') {
            this.fontSize = this.isCrit ? 17 : 10;
            this.fontFamily = this.isCrit ? '"Gasoek One"' : 'Anton';
            this.font = `normal ${this.fontSize}pt ${this.fontFamily}, Verdana`;
            this.fontColor = this.isPlayer ? '128, 0, 0' : (this.isCrit ? '247, 181, 28' : '255, 255, 255');
            this.valueFormatted = this.value.toLocaleString();
        } else {
            this.fontSize = 10;
            this.fontFamily = '"Gasoek One"';
            this.font = `normal ${this.fontSize}pt ${this.fontFamily}, Verdana`;
            this.fontColor = '98, 194, 56';
            this.valueFormatted = `+${this.value.toLocaleString()}`;
        }
        this.startTime = GameTime.getCurrentGameTime();
        this.opacity = 1.0;
        this.text = new TextC(
            this.valueFormatted,
            new Vector2(this.position.x, this.position.y),
            this.fontFamily,
            'normal',
            this.fontSize,
            this.fontColor,
            'left'
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
        this.text.SetPosition(new Vector2(this.position.x, this.position.y));

        // Update text alpha
        this.opacity -= (this.changeRate * elapsed);
        this.text.SetColor(`rgba(${this.fontColor}, ${this.opacity})`);

        if (elapsed >= this.duration) {
            this.isComplete = true;
        }
    }

    Draw() {
        this.text.Draw();
    }

}