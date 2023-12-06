/*****************************
*****  STATUS BAR CLASS  *****
*****************************/

class StatusBar {

    constructor(position, size, maxValue, color, yOffset) {
        this.position = position;
        this.size = size;
        this.maxValue = maxValue;
        this.currentValue = this.maxValue;
        this.color = color;
        this.yOffset = yOffset;
        this.backgroundBorderSize = 1;
        this.backgroundTexture = new Texture(
            new Vector2(this.position.x, this.position.y),
            this.size,
            '#555555',
            this.backgroundBorderSize,
            '#222222'
        );
        this.statusTexture = new Texture(
            this.position,
            this.size,
            this.color,
            0,
            '#00000000'
        );
    }

    // GETTERS AND SETTERS

    SetPosition(position) {
        this.position = position;
        this.backgroundTexture.Update(new Vector2(this.position.x - this.backgroundBorderSize, this.position.y - this.backgroundBorderSize));
        this.statusTexture.Update(new Vector2(this.position.x, this.position.y));
    }

    SetSize(size) {
        this.size = size;
        this.backgroundTexture.SetSize(new Vector2(this.size.x + (this.backgroundBorderSize * 2), this.size.y + (this.backgroundBorderSize * 2)));
        this.statusTexture.SetSize(new Vector2(this.size.x, this.size.y));
        this.SetCurrentValue(this.currentValue);
    }

    SetColor(color) {
        this.color = color;
        this.statusTexture.SetColor(color);
    }

    SetCurrentValue(val) {
        this.currentValue = (+val <= 0) ? 0 : val;
        const currentStatusTextureSize = this.statusTexture.GetSize();
        const healthBarSizeX = +this.currentValue === 0 ? 0 : currentStatusTextureSize.x * (this.currentValue / this.maxValue);
        this.statusTexture.SetSize(new Vector2(healthBarSizeX, currentStatusTextureSize.y));
    }

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

    Update(entityPosition) {
        this.SetPosition(
            new Vector2(entityPosition.x, entityPosition.y - this.yOffset)
        );
    }

    Draw() {
        this.backgroundTexture.Draw();
        this.statusTexture.Draw();
    }
    
}