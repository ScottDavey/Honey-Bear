/*****************************
*****  STATUS BAR CLASS  *****
*****************************/

class StatusBar {

    constructor(position, size, maxValue, color, borderSize = 1) {
        this.position = position;
        this.borderSize = borderSize;
        this.size = size;
        this.maxValue = maxValue;
        this.currentValue = this.maxValue;
        this.color = color;
        this.backgroundTexture = new Texture(
            this.position,
            this.size,
            '#00000077',
            this.borderSize,
            '#5831a0'
        );
        this.statusTexture = new Texture(
            new Vector2(this.position.x + this.borderSize, this.position.y + this.borderSize),
            new Vector2(this.size.x - (this.borderSize * 2), this.size.y - (this.borderSize * 2)),
            this.color,
            0,
            '#00000000'
        );
        const statusText = `${this.currentValue} / ${this.maxValue}`;
        const centeredText = CenterText(statusText, 7, this.size);
        this.statusText = new Text(
            statusText,
            centeredText.x,
            centeredText.y + this.position.y + 1,
            'bold 10pt Jura, Verdana, sans-serif',
            '#5831a0'
        );
    }

    // GETTERS AND SETTERS

    SetPosition(position) {
        this.position = position;
        this.backgroundTexture.Update(new Vector2(this.position.x - this.borderSize, this.position.y - this.borderSize));
        this.statusTexture.Update(new Vector2(this.position.x, this.position.y));
    }

    SetSize(size) {
        this.size = size;
        this.backgroundTexture.SetSize(new Vector2(this.size.x + (this.borderSize * 2), this.size.y + (this.borderSize * 2)));
        this.statusTexture.SetSize(new Vector2(this.size.x, this.size.y));
        // this.SetCurrentValue(this.currentValue);
    }

    SetColor(color) {
        this.color = color;
        this.statusTexture.SetColor(color);
    }

    // SetCurrentValue(val) {
    //     this.currentValue = (+val <= 0) ? 0 : val;
    //     const currentBGTextureSize = this.backgroundTexture.GetSize();
    //     const statusBarSizeX = +this.currentValue === 0 ? 0 : currentBGTextureSize.x * (this.currentValue / this.maxValue);
    //     this.statusTexture.SetSize(new Vector2(statusBarSizeX, currentBGTextureSize.y));
    // }

    SetMaxValue(val) {
        this.maxValue = val;
    }

    GetPosition() {
        return this.position;
    }

    GetSize() {
        return this.size;
    }

    GetCurrentValue() {
        return this.currentValue;
    }

    GetMaxValue() {
        return this.maxValue;
    }

    GetColor() {
        return this.color;
    }

    // Update(entityPosition) {
    //     this.SetPosition(
    //         new Vector2(entityPosition.x, entityPosition.y - this.yOffset)
    //     );
    // }

    Update(val) {
        const maxSizeX = this.size.x - (this.borderSize * 2);
        this.currentValue = (+val <= 0) ? 0 : val;
        this.statusTexture.SetSize(
            new Vector2(
                (+this.currentValue === 0 ? 0 : maxSizeX * (this.currentValue / this.maxValue)),
                this.statusTexture.GetSize().y
            )
        );
        const newStatusText = `${this.currentValue} / ${this.maxValue}`;
        const newStatusTextCentered = CenterText(newStatusText, 7, this.size);
        this.statusText.UpdateString(newStatusText);
        this.statusText.UpdatePos(new Vector2(newStatusTextCentered.x, newStatusTextCentered.y + this.position.y + 1));
    }

    Draw() {
        this.backgroundTexture.Draw();
        this.statusTexture.Draw();
        this.statusText.Draw();
    }
    
}