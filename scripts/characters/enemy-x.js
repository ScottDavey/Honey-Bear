/*******************************************
**************  PLAYER CLASS  **************
*******************************************/
class Enemy {

    constructor(scene, start) {
        this.scene = scene;
        this.pos = new Vector2(start.x, start.y);
        this.size = new Vector2(30, 75);
        this.velocity = new Vector2(0, 0);
        this.dir = 1;
        // Horizontal Movement
        this.acceleration = 4000.0;
        this.speed = 150.0;
        // Vertical Movement
        this.gravity = 3000.0;
        this.maxFallSpeed = 1000.0;
        // Jumping
        this.isJumping = false;
        this.wasJumping = false;
        this.isOnGround = false;
        this.jumpTime = 0;
        this.maxJumpTime = 0.10;
        this.jumpBurst = -1200.0;

        this.hitWall = false;
        this.life = 100;
        this.lifeMax = 100;
        this.lifeBar = new Texture(new Vector2(this.pos.x, this.pos.y - 15), new Vector2(30, 5), '#00FF00', 1, '#007700');
        this.enemy = new Texture(this.pos, this.size, '#2979e6', 1, '#123a71');
        this.isDead = false;
    }

    HandleCollision() {
        let y;

        const bounds = new Rectangle(this.pos.x, this.pos.y, this.size.x, this.size.y);
        this.isOnGround = false;
        this.hitWall = false;

        // Lines
        for (let i = 0; i < this.scene.lines.length; i++) {

            const line = this.scene.lines[i];

            if ((line.collision == 'FLOOR' || line.collision == 'CEILING') && bounds.center.x >= line.startPos.x && bounds.center.x <= line.endPos.x) {

                const slope = (line.endPos.y - line.startPos.y) / (line.endPos.x - line.startPos.x);
                const b = line.startPos.y - (slope * line.startPos.x);

                y = (slope * bounds.center.x) + b;

                if (Math.abs(y - bounds.center.y) <= bounds.halfSize.y) {
                    y = Math.floor(y);
                    this.pos.y = (line.normal < 0) ? y - bounds.height : y;
                    this.velocity.y = 0;
                    if (line.collision === 'FLOOR') {
                        this.isOnGround = true;
                    }
                }

            } else if (line.collision == 'WALL' && bounds.center.y > line.startPos.y && bounds.center.y < line.endPos.y) {

                const xDiff = Math.abs(bounds.center.x - line.startPos.x);

                if (xDiff <= bounds.halfSize.x) {

                    this.pos.x = (line.normal < 0) ? line.startPos.x - bounds.width : line.startPos.x;
                    this.velocity.x = 0;

                    this.hitWall = true;

                }


            }

        }
    };

    IsDead() {
        return this.isDead;
    };

    Shot(dmg) {
        const newLife = this.life - dmg;

        if (newLife > 0) {
            this.life = newLife;
            this.lifeBar.SetSize(new Vector2((this.life / this.lifeMax) * 30, 5));
        } else {
            this.isDead = true;
        }

    };

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
    };

    Update() {
        const elapsed = GameTime.getElapsed();

        // Jump, randomly
        //if (random(0, 20) === 5) this.isJumping = true;

        // Horizontal movement
        this.velocity.x += this.dir * this.acceleration * elapsed;
        this.velocity.x = Clamp(this.velocity.x, -this.speed, this.speed);
        this.pos.x += Math.round(this.velocity.x * elapsed);

        // Vertical Movement
        this.velocity.y = Clamp(this.velocity.y + this.gravity * elapsed, -this.maxFallSpeed, this.maxFallSpeed);
        this.velocity.y = this.Jump(this.velocity.y);
        this.pos.y += this.velocity.y * elapsed;
        this.pos.y = Math.round(this.pos.y);

        // Update Life Bar
        this.lifeBar.Update(new Vector2(this.pos.x, this.pos.y - 15));

        this.HandleCollision();

        if (this.hitWall) this.dir = (this.dir === 1) ? -1 : 1;

        // If enemy falls through a hole (or collision fails), drop them in from the top of screen
        if (this.pos.y > this.scene.WORLD_HEIGHT) {
            this.pos.y = -100;
        }

        // If enemy somehow ends up outside of world bounds, reset its position
        if (this.pos.x < 0 || this.pos.x > this.scene.WORLD_WIDTH) {
            this.pos.x = 1280;
            this.pos.y = -100;
            console.log('FIXED');
        }

        // Reset
        this.isJumping = false;
    };

    Draw() {
        this.enemy.Draw();
        this.lifeBar.Draw();
    };

}