/************************
*****  DEBUG CLASS  *****
************************/

class Debug {

    constructor() {
        this.position = new Vector2(CANVAS_WIDTH - 320, 20);
        this.size = new Vector2(300, 200);
        this.debugLines = [];
        this.fontSize = 12;
        this.nextLinePosition = new Vector2(this.position.x + 20, this.position.y + 50);
        this.fontFamily = 'Consolas, sans-serif';
        this.fontWeight = 'normal';
        this.align = 'left';
        this.showDebug = false;

        this.title = new TextC(
            'DEBUG',
            new Vector2(this.position.x + 20, this.position.y + 20),
            this.fontFamily,
            this.fontWeight,
            24,
            '#FFFFFF88',
            'left'
        );
        this.backgroundTexture = new Texture(this.position, this.size, '#00000088', 1, '#000000');
    }

    SetShowDebug() {
        this.showDebug = !this.showDebug;
    }

    Update(name, value) {
        if (this.showDebug) {

            let doesLineExist = false;

            for (const line of this.debugLines) {
                if (line.name === name) {
                    doesLineExist = true;
                    line.text.SetString(value);
                    break;
                }
            }

            if (!doesLineExist) {
                this.debugLines.push(
                    {
                        name,
                        text: new TextC(
                            value,
                            this.nextLinePosition,
                            this.fontFamily,
                            this.fontWeight,
                            this.fontSize,
                            '#FFFFFF88',
                            this.align
                        )
                    }
                );

                this.nextLinePosition = new Vector2(
                    this.nextLinePosition.x,
                    this.nextLinePosition.y + this.fontSize + 5
                );
            }

        }
    }

    Draw() {
        if (this.showDebug) {
            this.backgroundTexture.Draw();
            this.title.Draw();

            for (const line of this.debugLines) {
                line.text.Draw();
            }
        }
    }

}