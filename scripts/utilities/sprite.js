/*************************
*****  SPRITE CLASS  *****
*************************/
class Sprite {

    constructor(path, pos, size) {
        this.pos = pos;
        this.size = size;
        this.img = document.createElement('img');
        this.img.setAttribute('src', path);
    }


    SetImage(path) {
        this.img.setAttribute('src', path);
    };

    Update(pos) {
        this.pos = pos;
    };

    Draw() {
        CONTEXT.drawImage(this.img, this.pos.x, this.pos.y);
    };

}