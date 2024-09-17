/**********************************************
**************  CHARACTER CLASS  **************
**********************************************/

class Character {
    constructor(position, size, isPlayer = false) {
        this.position = position;
        this.levelStartPosition = new Vector2(this.position.x, this.position.y);
        this.size = size;
        this.headSize = new Vector2(this.size.x, this.size.y * 0.3);
        this.isPlayer = isPlayer;
        this.sprite = undefined;
        this.bounds = new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
        this.headBounds = new Rectangle(this.position.x, this.position.y, this.headSize.x, this.headSize.y);

        // VITALITY
        this.health = 500;
        this.maxHealth = 500;
        this.isDead = false;
        this.deathStartTime = 0;
        this.deathMaxTime = 3;
        this.isDeathDone = false;
        this.statusText = [];

        // HORIZONTAL MOVEMENT
        this.dir = 1;
        this.isHittingWall = false;
        this.velocity = new Vector2(0, 0);
        this.movement = 0;
        this.friction = 0.85;
        this.moveAcceleration = 4000;
        this.maxMoveSpeed = 250;
        
        // VERTICAL MOVEMENT
        this.gravity = 3000;
        this.maxFallSpeed = 1000;
        this.jumpBurst = -900;
        this.isOnGround = false;
        this.wasOnGround = false;
        this.lastGroundTime = 0;
        this.lateJumpMaxTime = 0.08;
        this.groundType = undefined;
        this.isJumping = false;
        this.maxJumpTime = 0.1;
        this.jumpTime = 0;
        
        // KNOCK BACK
        this.isKnockingBack = false;
        this.knockBackDir = -1;
        this.knockBackTime = 0;
        this.maxKnockBackTime = 0.3;
        this.knockBackBurst = 500;
        this.knockBackBurstAdj = new Vector2(this.knockBackBurst * this.dir, -500);

        // STUN
        this.isStunned = false;
        this.stunStartTime = 0;
        this.stunDuration = 1;

        // Sound Effects
        this.walkSounds = {
            GRASS: new Sound('sounds/effects/WALK_Grass.OGG', 'SFX', false, true, 0.5, 0),
        };
    }

    UnloadContent() {
        if (this.walkSounds) {
            // this.walkSounds.GRASS.Stop();
            this.walkSounds.GRASS = undefined;
        }
        this.sprite = undefined;
    }

    // GETTERS AND SETTERS

    SetSprite(sprite) {
        this.sprite = sprite;
    }

    SetPosition(position) {
        this.position = position;
    }

    SetVelocity(vel) {
        this.velocity = vel;
    }

    SetSize(size) {
        this.size = size;
    }

    SetMaxMoveSpeed(speed) {
        this.maxMoveSpeed = speed;
    }

    SetDirection(dir) {
        this.dir = dir;
    }

    SetKnockBack(dir, burst = this.knockBackBurst) {
        this.knockBackDir = dir;
        this.knockBackBurstAdj = new Vector2(burst * this.knockBackDir, this.knockBackBurstAdj.y);
        this.isKnockingBack = true;
    }

    SetIsDead(isDead = true) {
        this.isDead = isDead;
    }

    SetIsDeathDone(isDone) {
        this.isDeathDone = isDone;
    }

    SetIsStunned(stunned) {
        // Set stun start time if it's not set already
        if (stunned && !this.isStunned) {
            this.stunStartTime = GameTime.getCurrentGameTime();
        }

        this.isStunned = stunned;
    }

    GetPosition() {
        return this.position;
    }
    
    GetLevelStartPosition() {
        return this.levelStartPosition;
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

    GetIsDeathDone() {
        return this.isDeathDone;
    }

    GetSprite() {
        return this.sprite;
    }

    GetBounds() {
        return this.bounds;
    }

    GetHeadBounds() {
        return this.headBounds;
    }

    GetCurrentHealth() {
        return this.health;
    }

    GetMaxHealth() {
        return this.maxHealth;
    }

    GetDeathMaxTime() {
        return this.deathMaxTime;
    }

    GetIsStunned() {
        return this.isStunned;
    }

    // BEHAVIOURS

    ResetHealth() {
        this.health = this.maxHealth;
    }

    DoDamage(initialDamage) {
        this.health -= initialDamage.amount;
        this.health = (this.health < 0) ? 0 : this.health;

        this.statusText.push(
            new StatusText(
                'DAMAGE',
                initialDamage.amount,
                initialDamage.isCrit,
                this.position,
                this.isPlayer
            )
        );

        if (this.health <= 0) {
            this.SetIsDead();
            this.deathStartTime = GameTime.getCurrentGameTime();
        }
    }

    HandleDeath() {
        const currentGameTime = GameTime.getCurrentGameTime();
        const elapsed = currentGameTime - this.deathStartTime;

        if (elapsed >= this.deathMaxTime) {
            this.isDeathDone = true;
        }
    }

    ApplyPhysics() {
        const elapsed = GameTime.getElapsed();
        const dynamicMaxMoveSpeed = Math.abs(this.movement * this.maxMoveSpeed);

        // Horizontal Movement
        this.velocity.x += Math.round(this.movement) * this.moveAcceleration;
        this.velocity.x *= this.friction;
        this.velocity.x = Clamp(
            this.velocity.x,
            -dynamicMaxMoveSpeed,
            dynamicMaxMoveSpeed
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
            // If character is on the ground or was recently on the ground (coyote time), and hasn't exceeded the jump time
            if (
                (
                    this.isOnGround ||
                    (this.wasOnGround && GameTime.getCurrentGameTime() - this.lastGroundTime <= this.lateJumpMaxTime)
                ) &&
                this.jumpTime < this.maxJumpTime
            ) {
                this.wasOnGround = false;
                this.lastGroundTime = 0;
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

    HandleSoundEffects() {
        if (this.isPlayer) {
            const walkSound = this.walkSounds[this.groundType];

            DEBUG.Update('WALK SOUND:', `WALK SOUND OFF: ${this.groundType}`);

            // WALK
            if (walkSound) {
                if (this.isOnGround && Math.abs(this.velocity.x) > 0) {
                    DEBUG.Update('WALK SOUND:', 'WALK SOUND ON');
                    this.walkSounds[this.groundType].Play();
                } else {
                    this.walkSounds[this.groundType].Stop();
                }
            }
        }
    }

    // UPDATE and DRAW

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        this.ApplyPhysics();

        this.bounds.Update(this.position, this.size);
        this.headBounds.Update(this.position, this.headSize);

        // Start some movement variables
        this.movement = 0;
        this.isJumping = false;

        // Sprite
        if (this.sprite) {
            
            this.sprite.Update(new Vector2(this.position.x, this.position.y));            
            
            // Stunning!
            if (this.isStunned && (currentGameTime - this.stunStartTime) >= this.stunDuration) {
                this.isStunned = false;
            }
            
            // Damage Text
            for (let d = 0; d < this.statusText.length; d ++) {
                const dt = this.statusText[d];
    
                if (!dt.IsComplete()) {
                    dt.Update(currentGameTime);
                } else {
                    this.statusText.splice(d, 1);
                }
            }

            if (this.isDead && !this.isDeathDone) {
                this.HandleDeath();
            }

            this.HandleSoundEffects();
        }
    }

    Draw() {
        if (this.sprite) {
            this.sprite.Draw();

            for (const dt of this.statusText) {
                dt.Draw();
            }
        }
    }

}
