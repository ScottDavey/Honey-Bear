/*************************
*****  SPRITE CLASS  *****
*************************/
class Sprite {

    constructor(path, pos, size) {
        this.path = path;
        this.pos = pos;
        this.size = size;
        this.img = document.createElement('img');
        this.img.setAttribute('src', path);
        this.opacity = 1;
    }

    GetPosition() {
        return this.pos;
    }

    GetSize() {
        return this.size;
    }

    SetImage(path) {
        this.path = path;
        this.img.setAttribute('src', path);
    };

    SetImageOpacity(opacity) {
        this.opacity = opacity;
    }

    Update(pos) {
        this.pos = new Vector2(pos.x, pos.y);
    };

    Draw() {
        CONTEXT.drawImage(this.img, this.pos.x, this.pos.y);
    };

    DrawSpriteSheet(clip, frame, position) {
        CONTEXT.globalAlpha = this.opacity;

        CONTEXT.drawImage(
            this.img,
            clip.left,
            clip.top,
            frame.width,
            clip.bottom,
            position.x,
            position.y,
            frame.width,
            frame.height
        );

        // Reset so it doesn't affect any other images in the canvas.
        CONTEXT.globalAlpha = 1;
    }

}