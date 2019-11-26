/*******************************************
 **************  PLAYER CLASS  **************
 *******************************************/

class Player {
    constructor(scene, start, size) {
        this.scene = scene;
        this.pos = start;
        this.size = new Vector2(size.x, size.y);
        this.dir = 1;
        this.velocity = new Vector2(0, 0);

        this.movement = 0;
        this.friction = 0.8;
        this.moveAcceleration = 4000.0;
        this.maxMoveSpeed = 300.0;
        this.gravity = 3000.0;
        this.maxFallSpeed = 1000.0;

        this.jumpBurst = -1200.0;
        this.isOnGround = false;
        this.isJumping = false;
        this.wasJumping = false;
        this.maxJumpTime = 0.1;
        this.jumpTime = 0;

        // Shooting
        // this.isShootLocked = false;
        // this.shoots = [];

        // Life
        // this.life = 100;
        // this.lifeMax = 100;
        // this.lifeBar = new Texture(new Vector2(this.pos.x, this.pos.y - 15), new Vector2(30, 5), '#00FF00', 1, '#007700');
        // this.isInvincible = false;
        // this.hitStart = 0;
        // this.isDead = false;

        // Sprite
        this.player = new Texture(
            this.pos,
            this.size,
            "rgb(255, 255, 255)",
            1,
            "rgb(255, 255, 255)"
        );
    }

    UnloadContent() {
        this.scene = undefined;
        this.pos = undefined;
        this.size = undefined;
        this.dir = undefined;
        this.velocity = undefined;
        this.movement = undefined;
        this.friction = undefined;
        this.moveAcceleration = undefined;
        this.maxMoveSpeed = undefined;
        this.gravity = undefined;
        this.maxFallSpeed = undefined;
        this.jumpBurst = undefined;
        this.isOnGround = undefined;
        this.isJumping = undefined;
        this.wasJumping = undefined;
        this.maxJumpTime = undefined;
        this.jumpTime = undefined;
        this.player = undefined;
    }

    UpdateScene(scene) {
        this.scene = scene;
    }

    SetPos(pos) {
        this.pos = pos;
    }

    /*GetShoots () {
        return this.shoots;
    };
    ShotLanded (i) {
        this.shoots.splice(i, 1);
    };
    */

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

        this.isJumping =
            Input.Keys.GetKey(Input.Keys.SPACE) || Input.GamePad.A.pressed;

        // Shoot (only shoot once per button press)
        /*
        if (Input.Keys.GetKey(Input.Keys.CONTROL) || Input.GamePad.X.pressed) {
            if (!this.isShootLocked) {
                this.Shoot();
                this.isShootLocked = true;
            }
        } else {
            this.isShootLocked = false;
        }
        */
    }

    /*
    Shoot = function () {
        var x, y, pos;
        x = (this.dir === 1) ? this.pos.x + this.size.x : this.pos.x;
        y = this.pos.y + (this.size.y / 2);
        pos = new Vector2(x, y);
        this.shoots.push(new SoulFire(this.dir, pos));
    };
    HasShotCollided = function (shot) {
        var pos, size, bounds, slope, b, yc, l, line, hasCollided, xDiff;
        // innocent until proven guilty
        hasCollided = false;
        // Get some info about this shot
        pos = shot.GetPos();
        size = shot.GetSize();
        // Set this shot's bounding box
        bounds = new Rectangle(pos.x, pos.y, size.x, size.y);
        // Loop through all lines to see if it's collided
        for (l = 0; l < this.scene.lines.length; l++) {
            line = this.scene.lines[l];
            if ((line.collision == 'FLOOR' || line.collision == 'CEILING') && bounds.center.x >= line.startPos.x && bounds.center.x <= line.endPos.x) {
                slope = (line.endPos.y - line.startPos.y) / (line.endPos.x - line.startPos.x);
                b = line.startPos.y - (slope * line.startPos.x);
                yc = (slope * bounds.center.x) + b;
                if (Math.abs(yc - bounds.center.y) <= bounds.halfSize.y) {
                    hasCollided = true;
                }
            } else if (line.collision == 'WALL' && bounds.center.y > line.startPos.y && bounds.center.y < line.endPos.y) {
                xDiff = Math.abs(bounds.center.x - line.startPos.x);
                if (xDiff <= bounds.halfSize.x) {
                    hasCollided = true;
                }
            }
        }
        return hasCollided;
    };
    IsHit () {
        var newLife;
        newLife = this.life - 25;
        if (newLife > 0) {
            this.life = newLife;
            this.lifeBar.SetSize(new Vector2((this.life / this.lifeMax) * 30, 5));
            this.player.SetColor('rgba(255, 255, 255, 0.2)');
            this.isInvincible = true;
            this.hitStart = GameTime.GetCurrentGameTime();
        } else {
            this.isDead = true;
        }
    };
    IsDead () {
        return this.isDead;
    };
    */

    HandleCollision() {
        let y;
        const bounds = new Rectangle(
            this.pos.x,
            this.pos.y,
            this.size.x,
            this.size.y
        );
        this.isOnGround = false;

        // Lines
        for (let i = 0; i < this.scene.lines.length; i++) {
            const line = this.scene.lines[i];

            if (
                (line.collision == "FLOOR" || line.collision == "CEILING") &&
                bounds.center.x >= line.startPos.x &&
                bounds.center.x <= line.endPos.x
            ) {
                const slope =
                    (line.endPos.y - line.startPos.y) /
                    (line.endPos.x - line.startPos.x);
                const b = line.startPos.y - slope * line.startPos.x;
                y = slope * bounds.center.x + b;

                if (Math.abs(y - bounds.center.y) <= bounds.halfSize.y) {
                    y = Math.floor(y);
                    // If the line normal is > 0, add 5 to y. This fixes an odd bug where certain ceiling slopes cause the player to stick to it
                    this.pos.y = line.normal < 0 ? y - bounds.height : y + 5;
                    this.velocity.y = 0;
                    if (line.collision === "FLOOR") {
                        this.isOnGround = true;
                    }
                }
            } else if (
                line.collision == "WALL" &&
                bounds.center.y > line.startPos.y &&
                bounds.center.y < line.endPos.y
            ) {
                const xDiff = Math.abs(bounds.center.x - line.startPos.x);

                if (xDiff <= bounds.halfSize.x) {
                    this.pos.x =
                        line.normal < 0
                            ? line.startPos.x - bounds.width
                            : line.startPos.x;
                    this.velocity.x = 0;
                }
            }
        }
    }

    Jump(velY) {
        const elapsed = GameTime.getElapsed();

        if (this.isJumping) {
            if (this.isOnGround && this.jumpTime < this.maxJumpTime) {
                velY = this.jumpBurst;
            }

            this.jumpTime += elapsed;
        } else {
            this.jumpTime = 0;
        }

        this.wasJumping = this.isJumping;

        return velY;
    }

    ApplyPhysics() {
        const elapsed = GameTime.getElapsed();

        // Horizontal Movement
        this.velocity.x += this.movement * this.moveAcceleration * elapsed;
        this.velocity.x *= this.friction;
        this.velocity.x = Clamp(
            this.velocity.x,
            -this.maxMoveSpeed,
            this.maxMoveSpeed
        );
        this.pos.x += this.velocity.x * elapsed;
        this.pos.x = Math.round(this.pos.x);

        // Vertical Movement
        this.velocity.y = Clamp(
            this.velocity.y + this.gravity * elapsed,
            -this.maxFallSpeed,
            this.maxFallSpeed
        );
        this.velocity.y = this.Jump(this.velocity.y);
        this.pos.y += this.velocity.y * elapsed;
        this.pos.y = Math.round(this.pos.y);

        this.HandleCollision();
    }

    Update() {
        // const currentGameTime = GameTime.getCurrentGameTime();

        this.GetInput();
        this.ApplyPhysics();

        // If player was hit, make him invincible for 2 seconds
        /*
        if (this.isInvincible && (currentGameTime - this.hitStart) >= 2) {
            this.isInvincible = false;
            this.player.SetColor('rgba(255, 255, 255, 1)');
        }
        // Update Life Bar
        this.lifeBar.Update(new Vector2(this.pos.x, this.pos.y - 15));
        // Shoots
        for (let s = 0; s < this.shoots.length; s++) {
            shot = this.shoots[s];
            pos = shot.GetPos();
            if (shot.pos.x > 3000 || shot.pos.x < 0 || this.HasShotCollided(shot)) {
                this.shoots.splice(s, 1);	// remove
            } else {
                shot.Update();
            }
        }
        */

        // If player falls through a hole (or collision fails), drop them in from the top of screen
        if (this.pos.y > this.scene.WORLD_HEIGHT) {
            this.pos.y = -100;
        }

        this.movement = 0;
        this.isJumping = false;
    }

    Draw() {
        this.player.Draw();
        // this.lifeBar.Draw();

        // Shoots
        /*
        for (let s = 0; s < this.shoots.length; s++) {
            this.shoots[s].Draw();
        }
        */
    }
}
