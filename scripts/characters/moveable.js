/*******************************************
**************  MOVEABLE CLASS  **************
*******************************************/

class Moveable extends Entity {
    constructor(pos, size, scene) {
        super(pos, size);

        this.scene = scene;

        // Horizontal movement
        this.dir = 1;
        this.isHittingWall = false;
        this.velocity = new Vector2(0, 0);
        this.movement = 0;
        this.friction = 0.8;
        this.moveAcceleration = 4000.0;
        this.maxMoveSpeed = 300.0;
        // Vertical movement
        this.gravity = 3000.0;
        this.maxFallSpeed = 1000.0;
        this.jumpBurst = -900.0;
        this.isOnGround = false;
        this.isJumping = false;
        this.wasJumping = false;
        this.maxJumpTime = 0.1;
        this.jumpTime = 0;
    }

    HandleCollision() {
        let y, bounds;

        bounds = new Rectangle(this.pos.x, this.pos.y, this.size.x, this.size.y);
        this.isOnGround = false;
        this.isHittingWall = false;

        // Lines
        for (let i = 0; i < this.scene.lines.length; i++) {
            const line = this.scene.lines[i];
            const slope = line.slope;
            const b = line.b;

            if (
                (line.collision == "FLOOR" || line.collision == "CEILING") &&
                bounds.center.x >= line.startPos.x &&
                bounds.center.x <= line.endPos.x
            ) {
                /*
                const slope =
                    (line.endPos.y - line.startPos.y) /
                    (line.endPos.x - line.startPos.x);
                const b = line.startPos.y - slope * line.startPos.x;
                */
                y = slope * bounds.center.x + b;

                if (Math.abs(y - (bounds.center.y + 10)) <= bounds.halfSize.y) {
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
                    this.isHittingWall = true;
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
        this.velocity.x = (this.velocity.x < 5 && this.velocity.x > -5) ? 0 : this.velocity.x;
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
        this.ApplyPhysics();

        // Reset some movement vars
        this.movement = 0;
        this.isJumping = false;

        super.Update();
    }

    Draw() {
        super.Draw();
    }

}