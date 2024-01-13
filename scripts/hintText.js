/**********************************************
**************  HINT TEXT CLASS  **************
**********************************************/

class HintText {

    constructor(icon, caption, position, offset) {
        this.icon = icon;
        this.keyBinding = this.icon[INPUT.GetInputType()];
        this.caption = caption;
        this.position = position;
        this.offset = offset;
        this.positionOffset = new Vector2(this.position.x + this.offset.x, this.position.y + this.offset.y);
        this.sprite = new Sprite(this.keyBinding.path, new Vector2(this.positionOffset.x, this.positionOffset.y), new Vector2(20, 20));
        this.texture = new Texture(
            new Vector2(this.positionOffset.x, this.positionOffset.y),
            new Vector2(20, 20),
            '#00000000',
            1,
            '#000000'
        );
        this.captionText = new Text(
            this.caption,
            new Vector2(
                this.sprite.GetPosition().x + (this.sprite.GetSize().x / 2),
                this.sprite.GetPosition().y + this.sprite.GetSize().y + 10
            ),
            'Jura, "Century Gothic", sans-serif',
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

        this.sprite.Update(new Vector2(this.positionOffset.x, this.positionOffset.y));

        this.texture.Update(new Vector2(this.positionOffset.x, this.positionOffset.y));

        this.captionText.SetPosition(new Vector2(
            this.texture.GetPosition().x + (this.texture.GetSize().x / 2),
            this.texture.GetPosition().y + this.texture.GetSize().y + 10
        ));
    }

    Draw() {
        DEBUG.Update('ICON', `Key Binding: ${this.keyBinding.name}`);

        this.keyBinding = this.icon[INPUT.GetInputType()];
        this.sprite.SetImage(this.keyBinding.path);

        this.sprite.Draw();
        this.captionText.Draw();
    }

}