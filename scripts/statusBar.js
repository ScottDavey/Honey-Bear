/*****************************
*****  STATUS BAR CLASS  *****
*****************************/

class StatusBar {

    constructor(position, size, maxValue, color, borderSize = 1, borderColor = '#5831a0', hasText = false, textColor = '#5831a0') {
        this.position = position;
        this.borderSize = borderSize;
        this.borderColor = borderColor;
        this.size = size;
        this.maxValue = maxValue;
        this.currentValue = this.maxValue;
        this.color = color;
        this.hasText = hasText;
        this.textColor = textColor;
        this.backgroundTexture = new Texture(
            this.position,
            this.size,
            '#00000077',
            this.borderSize,
            this.borderColor
        );
        this.statusTexture = new Texture(
            new Vector2(this.position.x + this.borderSize, this.position.y + this.borderSize),
            new Vector2(this.size.x - (this.borderSize * 2), this.size.y - (this.borderSize * 2)),
            this.color,
            0,
            '#00000000'
        );
        const statusText = `${FormatNumber(this.currentValue)} / ${FormatNumber(this.maxValue)}`;
        this.statusText = new Text(
            statusText,
            new Vector2(this.position.x + (this.size.x / 2), this.position.y + (this.size.y / 2)),
            'Jura, "Century Gothic", sans-serif',
            'bold',
            12,
            this.textColor,
            'center'
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

    Update(val) {
        const maxSizeX = this.size.x - (this.borderSize * 2);
        this.currentValue = (+val <= 0) ? 0 : val;
        this.statusTexture.SetSize(
            new Vector2(
                (+this.currentValue === 0 ? 0 : maxSizeX * (this.currentValue / this.maxValue)),
                this.statusTexture.GetSize().y
            )
        );

        if (this.hasText) {
            const newStatusText = `${FormatNumber(this.currentValue)} / ${FormatNumber(this.maxValue)}`;
            this.statusText.SetString(newStatusText);
        }
    }

    Draw() {
        this.backgroundTexture.Draw();
        this.statusTexture.Draw();
        
        if (this.hasText) {
            this.statusText.Draw();
        }
    }
    
}