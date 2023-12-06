/**********************************************
**************  CHARACTER CLASS  **************
**********************************************/

class Character {
    constructor(position, size, isPlayer = false) {
        this.position = position;
        this.size = size;
        this.isPlayer = isPlayer;
        this.sprite = undefined;

        // VITALITY
        this.health = 300000;
        this.maxHealth = 300000;
        this.healthBar = new StatusBar(
            new Vector2(this.position.x, this.position.y),
            new Vector2(this.size.x, 3),
            this.maxHealth,
            '#f8b61d',
            15
        );
        this.isDead = false;
        this.damageText = [];

        // HORIZONTAL MOVEMENT
        this.dir = 1;
        this.isHittingWall = false;
        this.velocity = new Vector2(0, 0);
        this.movement = 0;
        this.friction = 0.85;
        this.moveAcceleration = 4000;
        this.maxMoveSpeed = 300;
        
        // VERTICAL MOVEMENT
        this.gravity = 3000;
        this.maxFallSpeed = 1000;
        this.jumpBurst = -900;
        this.isOnGround = false;
        this.isJumping = false;
        this.maxJumpTime = 0.1;
        this.jumpTime = 0;
        
        // KNOCK BACK
        this.isKnockingBack = false;
        this.knockBackDir = -1;
        this.knockBackTime = 0;
        this.maxKnockBackTime = 0.05;
        this.knockBackBurst = 500;
        this.knockBackBurstAdj = { x: this.knockBackBurst * this.dir, y: -550 };

    }

    // GETTERS AND SETTERS

    SetSprite(sprite) {
        this.sprite = sprite;
    }

    SetPosition(position) {
        this.position = position;
    }

    SetSize(size) {
        this.size = size;
        this.healthBar.SetSize(new Vector2(size.x, 3));
    }

    SetMaxMoveSpeed(speed) {
        this.maxMoveSpeed = speed;
    }

    SetDirection(dir) {
        this.dir = dir;
    }

    SetKnockBackDir(dir) {
        this.knockBackDir = dir;
        this.knockBackBurstAdj.x = this.knockBackBurst * this.knockBackDir;
        this.isKnockingBack = true;
    }

    SetIsDead() {
        this.isDead = true;
    }

    GetPosition() {
        return this.position;
    }

    GetSize() {
        return this.size;
    }

    GetDirection() {
        return this.dir;
    }

    GetVelocity() {
        return this.velocity;
    }

    GetIsDead() {
        return this.isDead;
    }

    GetSprite() {
        return this.sprite;
    }

    // BEHAVIOURS

    DoDamage(initialDamage) {
        this.health -= initialDamage.amount;        
        this.health = (this.health < 0) ? 0 : this.health;        
        this.healthBar.SetCurrentValue(this.health);

        this.damageText.push(
            new DamageText(
                initialDamage.amount,
                initialDamage.isCrit,
                this.position,
                this.isPlayer
            )
        );

        if (this.health <= 0) {
            this.SetIsDead();
        }
    }

    ApplyPhysics() {
        const elapsed = GameTime.getElapsed();

        // Horizontal Movement
        this.velocity.x += this.movement * this.moveAcceleration;
        this.velocity.x *= this.friction;
        this.velocity.x = Clamp(
            this.velocity.x,
            -this.maxMoveSpeed,
            this.maxMoveSpeed
        );
        // Check if being knocked back
        this.velocity.x = (this.velocity.x < 5 && this.velocity.x > -5) ? 0 : this.velocity.x;

        // Vertical Movement
        this.velocity.y = Clamp(
            this.velocity.y + this.gravity * elapsed,
            -this.maxFallSpeed,
            this.maxFallSpeed
        );
        this.velocity.y = this.Jump(this.velocity.y);

        // Handle KnockBack
        this.velocity = this.KnockBack(this.velocity);

        this.position.x += this.velocity.x * elapsed;
        this.position.x = Math.round(this.position.x);
        this.position.y += this.velocity.y * elapsed;
        this.position.y = Math.round(this.position.y);
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

        return velY;
    }

    KnockBack(vel) {
        const elapsed = GameTime.getElapsed();

        if (this.isKnockingBack) {

            if (this.knockBackTime < this.maxKnockBackTime) {
                vel.x = this.knockBackBurstAdj.x;
                if (!this.isOnGround) {
                    vel.y = this.knockBackBurstAdj.y;
                }
            } else {
                this.isKnockingBack = false;
            }
            this.knockBackTime += elapsed

        } else {
            this.knockBackTime = 0;
        }

        return vel;

    }

    // UPDATE and DRAW

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        this.ApplyPhysics();

        // Start some movement variables
        this.movement = 0;
        this.isJumping = false;

        // Sprite
        if (this.sprite) {
            this.sprite.Update(new Vector2(this.position.x, this.position.y));
            this.healthBar.Update(new Vector2(this.position.x, this.position.y - 20));
            
            // Damage Text
            for (let d = 0; d < this.damageText.length; d ++) {
                const dt = this.damageText[d];
    
                if (!dt.IsComplete()) {
                    dt.Update(currentGameTime);
                } else {
                    this.damageText.splice(d, 1);
                }
            }
        }
    }

    Draw() {
        if (this.sprite) {
            this.sprite.Draw();
            this.healthBar.Draw();

            for (const dt of this.damageText) {
                dt.Draw();
            }
        }
    }

}
