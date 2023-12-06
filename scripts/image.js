/************************
*****  IMAGE CLASS  *****
************************/
class Image {

    constructor(path, pos, size) {
        this.pos = pos;
        this.size = size;
        this.img = document.createElement('img');
        this.img.setAttribute('src', path);
    }

    GetPos() {
        return this.pos;
    }

    GetSize() {
        return this.size;
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