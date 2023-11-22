/******************************************
**************  THURN BUSH CLASS  **************
******************************************/
class ThornBush extends Stationary {

    constructor(pos, size) {
        super(pos, size, false);
        this.damage = 500;

        const spritesheet = document.createElement('img');
        spritesheet.setAttribute('src', 'images/entities/bush.png');

        // Nimation: img, pos, frameHeight, frameWidth, totalFrames, animationSeq, speed, isLooping, offset
        this.sprite = new Nimation(spritesheet, new Vector2(pos.x, pos.y), 74, 100, 1, 0, 0.5, true, new Vector2(20, 10));
    }

    GetDamage() {
        return { amount: this.damage, isCrit: false };
    }

    Update() {
        super.Update();
    }

    Draw() {
        super.Draw();
    }

}