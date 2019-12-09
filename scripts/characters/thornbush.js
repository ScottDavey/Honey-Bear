/******************************************
**************  THURN BUSH CLASS  **************
******************************************/
class ThornBush extends Stationary {

    constructor(pos, size) {
        super(pos, size, false);
        this.damage = 1;

        const spritesheet = document.createElement('img');
        spritesheet.setAttribute('src', 'images/bush.png');

        // Nimation: img, pos, frameHeight, frameWidth, totalFrames, animationSeq, speed, isLooping, offset
        this.sprite = new Nimation(spritesheet, new Vector2(pos.x, pos.y), 74, 100, 1, 0, 0.5, true, new Vector2(0, 0));
    }

    GetDamage() {
        return this.damage;
    }

    Update() {
        super.Update();
    }

    Draw() {
        super.Draw();
    }

}