/**********************************************
**************  HINT TEXT CLASS  **************
**********************************************/

class HintText {

    constructor(button, caption, position, offset) {
        this.button = button;
        this.caption = caption;
        this.position = position;
        this.offset = offset;
        this.positionOffset = new Vector2(this.position.x + this.offset.x, this.position.y + this.offset.y);
        this.texture = new Texture(
            new Vector2(this.positionOffset.x, this.positionOffset.y),
            new Vector2(20, 20),
            '#00000088',
            1,
            '#000000'
        );
        this.buttonText = new TextC(
            this.button,
            new Vector2(
                this.texture.GetPosition().x + (this.texture.GetSize().x / 2),
                this.texture.GetPosition().y + (this.texture.GetSize().y / 2)
            ),
            'Gasoek One, Verdana',
            'normal',
            16,
            '#F8B61D',
            'center'
        );
        this.captionText = new TextC(
            this.caption,
            new Vector2(
                this.texture.GetPosition().x + (this.texture.GetSize().x / 2),
                this.texture.GetPosition().y + this.texture.GetSize().y + 10
            ),
            'Jura, Verdana',
            'normal',
            12,
            '#FFFFFF',
            'center'
        );
    }

    SetBorder(color) {
        this.texture.SetBorder(color);
    }

    Update(position) {
        this.position = position;
        this.positionOffset = new Vector2(this.position.x + this.offset.x, this.position.y + this.offset.y);

        this.texture.Update(new Vector2(this.positionOffset.x, this.positionOffset.y));

        this.buttonText.SetPosition(new Vector2(
            this.texture.GetPosition().x + (this.texture.GetSize().x / 2),
            this.texture.GetPosition().y + (this.texture.GetSize().y / 2)
        ));

        this.captionText.SetPosition(new Vector2(
            this.texture.GetPosition().x + (this.texture.GetSize().x / 2),
            this.texture.GetPosition().y + this.texture.GetSize().y + 10
        ));
    }

    Draw() {
        this.texture.Draw();
        this.buttonText.Draw();
        this.captionText.Draw();
    }

}