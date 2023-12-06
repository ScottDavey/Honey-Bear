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
    }


    SetImage(path) {
        this.path = path;
        this.img.setAttribute('src', path);
    };

    FlipImage(dir) {
        if (dir < 0) {
            this.img.style.transform = 'scaleX(-1)';
        } else {
            this.img.style.transform = 'scaleX(1)';
        }
    }

    Update(pos) {
        this.pos = pos;
    };

    Draw() {
        CONTEXT.drawImage(this.img, this.pos.x, this.pos.y);
    };

    DrawSpriteSheet(clip, frame, position) {
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
    }

}