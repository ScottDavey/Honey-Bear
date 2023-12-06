/*******************************************
**************  PLAYER CLASS  **************
*******************************************/

class Player extends Character {
    constructor(position, size) {
        super(position, size, true);

        this.isInvincible = false;
        this.invincibilityStart = 0;

        // Nimation: img, pos, frameHeight, frameWidth, totalFrames, animationSeq, speed, isLooping, offset
        const spritesheet = 'images/spritesheets/Adventurer-1.5/adventurer-spritesheet.png';
        const honeyBearSpriteSheet = 'images/spritesheets/HoneyBear.png';
        this.defaultRunAnimationSpeed = 0.08;
        this.runRightSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 6, 0, this.defaultRunAnimationSpeed, true, new Vector2(0, 0));
        this.runLeftSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 6, 1, this.defaultRunAnimationSpeed, true, new Vector2(0, 0));
        this.idleRightSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 4, 2, 0.25, true, new Vector2(0, 0));
        this.idleLeftSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 4, 3, 0.25, true, new Vector2(0, 0));
        this.jumpRightSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 2, 4, 0.2, false, new Vector2(0, 0));
        this.jumpLeftSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 2, 5, 0.2, false, new Vector2(0, 0));
        this.fallRightSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 1, 6, 0.08, false, new Vector2(0, 0));
        this.fallLeftSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 1, 7, 0.08, false, new Vector2(0, 0));
        this.idleThrowRightSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 6, 8, 0.02, false, new Vector2(0, 0));
        this.idleThrowLeftSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 6, 9, 0.02, false, new Vector2(0, 0));
        this.runThrowRightSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 6, 10, this.defaultRunAnimationSpeed, false, new Vector2(0, 0));
        this.runThrowLeftSprite = new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 70, 45, 6, 11, this.defaultRunAnimationSpeed, false, new Vector2(0, 0));
        
        this.hurtLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 3, 8, 0.25, false, new Vector2(26, 13));
        this.hurtRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 3, 9, 0.25, false, new Vector2(26, 13));

        this.sprite = this.idleSprite;

        this.isInputLocked = false;
        this.throwStartTime = 0;
        this.globMaxTime = 0.12;
        this.isGlobLocked = false;
        this.globs = [];
    }

    Initialize(position, size) {
        this.SetPosition(position);
        this.SetSize(size);
    }

    // GETTERS AND SETTERS

    SetSprite(sprite) {
        super.SetSprite(sprite);
    }

    SetPosition(position) {
        super.SetPosition(position);
    }

    SetSize(size) {
        super.SetSize(size);
    }

    SetMaxMoveSpeed(speed) {
        super.SetMaxMoveSpeed(speed);
    }

    SetDirection(dir) {
        super.SetDirection(dir);
    }

    SetKnockBackDir(dir) {
        super.SetKnockBackDir(dir);
    }

    SetIsDead() {
        super.SetIsDead();
    }

    SetRandomPosition(randomPos) {
        this.SetPosition(randomPos);
    }

    SetInputLock(isInputLocked) {
        this.isInputLocked = isInputLocked;
    }

    GetPosition() {
        super.GetPosition();
    }

    GetSize() {
        super.GetSize();
    }

    GetDirection() {
        super.GetDirection();
    }

    GetVelocity() {
        super.GetVelocity();
    }

    GetIsDead() {
        super.GetIsDead();
    }

    GetSprite() {
        super.GetSprite();
    }

    GetHoneyGlobs() {
        return this.globs;
    }

    GetInput() {
        const currentGameTime = GameTime.getCurrentGameTime();

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
            this.SetDirection(-1);
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
            this.SetDirection(1);
        }
        
        this.isJumping = Input.Keys.GetKey(Input.Keys.SPACE) || Input.GamePad.A.pressed;

        // Abilities
        if (Input.Keys.GetKey(Input.Keys.ENTER) || Input.GamePad.X.pressed) {
            if (!this.isGlobLocked) {
                this.throwStartTime = currentGameTime;
                this.isThrowing = true;
                this.isGlobLocked = true;
                const globPosX = (this.dir === 1) ? this.position.x + this.size.x - 10 : this.position.x;
                this.globs.push(new HoneyGlob(new Vector2(globPosX, this.position.y + (this.size.y / 2)), this.dir));
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

    GetInputLock() {
        return this.isInputLocked;
    }

    // BEHAVIOURS

    DoDamage(damage) {
        // This is where we'd figure out what weapon is being used
        // and apply any damage multipliers
        super.DoDamage(damage);
    }

    // UPDATE and DRAW

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();
        let isRunning = false;

        if (!this.isInputLocked) {
            this.GetInput();
        } else {
            this.movement = 0;
            this.velocity = new Vector2(0, 0);
        }

        if (this.isThrowing) {
            const throwElapsedTime = currentGameTime - this.throwStartTime;

            // Handle Glob Throw Animation
            if (throwElapsedTime >= this.globMaxTime) {
                this.isThrowing = false;
                this.throwStartTime = 0;
                this.idleThrowLeftSprite.Reset();
                this.idleThrowRightSprite.Reset();
                this.runThrowLeftSprite.Reset();
                this.runThrowRightSprite.Reset();
            } else if (throwElapsedTime >= 0.05 && !this.isGlobLocked) {
                // Dp mptj
            }
        }

        // Animations
        if (this.isKnockingBack) {
            this.SetSprite((this.dir === 1) ? this.hurtRightSprite : this.hurtLeftSprite);
        } else if (this.velocity.y < 0) {
            if (this.isThrowing) {
                this.SetSprite((this.dir === 1) ? this.idleThrowRightSprite : this.idleThrowLeftSprite);
            } else {
                this.SetSprite((this.dir === 1) ? this.jumpRightSprite : this.jumpLeftSprite);
            }
        } else if (!this.isOnGround) {
            if (this.isThrowing) {
                this.SetSprite((this.dir === 1) ? this.idleThrowRightSprite : this.idleThrowLeftSprite);
            } else {
                this.SetSprite((this.dir === 1) ? this.fallRightSprite : this.fallLeftSprite);
            }
        } else if (this.velocity.x !== 0) {
            if (this.isThrowing) {
                this.SetSprite((this.dir === 1) ? this.runThrowRightSprite : this.runThrowLeftSprite);
            } else {
                this.SetSprite((this.dir === 1) ? this.runRightSprite : this.runLeftSprite);
            }
            isRunning = true;
        } else {
            if (this.isThrowing) {
                this.SetSprite((this.dir === 1) ? this.idleThrowRightSprite : this.idleThrowLeftSprite);
            } else {
                this.SetSprite((this.dir === 1) ? this.idleRightSprite : this.idleLeftSprite);
            }
        }

        // GLOBS
        for (const glob of this.globs) {
            glob.Update();
        }
        
        super.Update();

        // If we're running, set the run animation speed by the velocity
        if (isRunning) {
            const velocityX = Math.abs(this.velocity.x);
            let animationSpeed;
            if (velocityX < 50) {
                animationSpeed = 0.5;
            } else if (velocityX < 150) {
                animationSpeed = 0.1;
            } else if (velocityX < 250) {
                animationSpeed = 0.08;
            } else {
                animationSpeed = this.defaultRunAnimationSpeed;
            }

            this.sprite.SetSpeed(animationSpeed);
        }
    }

    Draw() {

        for (const glob of this.globs) {
            glob.Draw();
        }

        super.Draw();
    }
}