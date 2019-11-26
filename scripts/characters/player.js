/*******************************************
**************  PLAYER CLASS  **************
*******************************************/

class Player extends Entity {
    constructor(scene, start, size) {
        super(scene, start, size);

        const spritesheet = document.createElement('img');
        spritesheet.setAttribute('src', 'images/spritesheets/Adventurer-1.5/adventurer-spritesheet.png');

        // Nimation: path, pos, frameHeight, frameWidth, totalFrames, animationSeq, speed, dir, offset
        this.runRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 6, 0, 0.05, true, new Vector2(26, 7));
        this.runLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 6, 1, 0.05, true, new Vector2(26, 7));
        this.idleRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 2, 0.3, true, new Vector2(26, 7));
        this.idleLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 3, 0.3, true, new Vector2(26, 7));
        this.jumpLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 4, 0.25, false, new Vector2(26, 7));
        this.jumpRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 5, 0.25, false, new Vector2(26, 7));
        this.fallLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 2, 6, 0.25, true, new Vector2(26, 7));
        this.fallRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 2, 7, 0.25, true, new Vector2(26, 7));

        this.sprite = this.idleSprite;

        this.isInputLocked = false;

        // this.circle = new Circle(new Vector2(300, 500), 10, '#990000', 'rgba(130, 0, 0, 0.5)');

        // Weapons
        this.globs = [];
        this.isGlobLocked = false;
        this.isAOELocked = false;
    }

    LockInput(isLocked) {
        this.isInputLocked = isLocked;
    }

    IsInputLocked() {
        return this.isInputLocked;
    }

    GetGlobs() {
        return this.globs;
    }

    GetInput() {

        // Horizontal Movement (Either keyboard WASD/Arrows |OR| Game Pad D-Pad |OR| Game Pad Sticks)
        if (
            Input.Keys.GetKey(Input.Keys.A) ||
            Input.Keys.GetKey(Input.Keys.LEFT) ||
            Input.GamePad.LEFT.pressed ||
            Input.GamePad.AXES.HORIZONTAL < 0
        ) {
            this.movement =
                Input.GamePad.AXES.HORIZONTAL < 0
                    ? Input.GamePad.AXES.HORIZONTAL
                    : -1.0;
            this.dir = -1;
        } else if (
            Input.Keys.GetKey(Input.Keys.D) ||
            Input.Keys.GetKey(Input.Keys.RIGHT) ||
            Input.GamePad.RIGHT.pressed ||
            Input.GamePad.AXES.HORIZONTAL > 0
        ) {
            this.movement =
                Input.GamePad.AXES.HORIZONTAL > 0
                    ? Input.GamePad.AXES.HORIZONTAL
                    : 1.0;
            this.dir = 1;
        }

        this.isJumping = Input.Keys.GetKey(Input.Keys.SPACE) || Input.GamePad.A.pressed;

        // Animations
        if (this.isJumping) {
            this.sprite = (this.dir === 1) ? this.jumpRightSprite : this.jumpLeftSprite;
        } else if (!this.isOnGround) {
            this.sprite = (this.dir === 1) ? this.fallRightSprite : this.fallLeftSprite;
        } else if (this.movement !== 0) {
            this.sprite = (this.dir === 1) ? this.runRightSprite : this.runLeftSprite;
        } else {
            this.sprite = (this.dir === 1) ? this.idleRightSprite : this.idleLeftSprite;
        }

        // Abilities
        if (Input.Keys.GetKey(Input.Keys.ENTER) || Input.GamePad.X.pressed) {
            if (!this.isGlobLocked) {
                const globPosX = (this.dir === 1) ? this.pos.x + this.size.x : this.pos.x;
                this.globs.push(new HoneyGlob(new Vector2(globPosX, this.pos.y + (this.size.y / 2)), this.dir));
                this.isGlobLocked = true;
            }
        } else if (Input.Keys.GetKey(Input.Keys.SHIFT) || Input.GamePad.Y.pressed) {
            if (!this.isAOELocked) {
                this.isAOELocked = true;
            }
        } else {
            // Unlock all ability keys
            this.isGlobLocked = false;
            this.isAOELocked = false;
        }

    }

    Update() {

        if (!this.isInputLocked) {
            this.GetInput();
        }

        // Globs
        for (let g = 0; g < this.globs.length; g++) {
            const glob = this.globs[g];

            if (!glob.GetHasHit()) {
                glob.Update();
            } else {
                this.globs.splice(g, 1);
            }
        }

        // this.circle.UpdateRadius(this.circle.radius * 1.004);

        // Call parent function
        super.Update();
    }

    Draw() {
        // Call parent function
        super.Draw();

        for (const glob of this.globs) {
            glob.Draw();
        }
    }

}