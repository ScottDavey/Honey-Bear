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

        // VITALITY
        this.maxHealth = HEALTH.BEAR;
        this.health = this.maxHealth;
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
        this.maxKnockBackTime = 0.1;
        this.knockBackBurst = 1000;
        this.knockBackBurstAdj = new Vector2(this.knockBackBurst * this.dir, -this.knockBackBurst);

        // STUN
        this.isStunned = false;
        this.stunStartTime = 0;
        this.stunDuration = 1;

        // Sound Effects
        this.stepTimer = undefined;
        this.previousStepTime = 0;
        this.previousStepID = undefined;
        this.stepSpeed = 0.3;

        // Add all sound effects to SOUND_MANAGER
        this.walkSounds = [];
        this.walkSoundTypes = ['GRASS', 'WOOD', 'STONE'];
        
    }

    LoadSoundEffects() {
        const stepVolume = this.isPlayer ? 0.3 : 0.2;

        for (const type of this.walkSoundTypes) {
            for(let i = 1; i <= 4; i++) {
                const id = `${type}-${random(10000, 90000)}`;
                SOUND_MANAGER.AddEffect(id, new Sound(`sounds/effects/FOOTSTEPS/${type}_${i}.OGG`, 'SFX', true, 750, false, stepVolume, true));
                this.walkSounds.push({ id, groundType: type });
            }
        }
    }

    UnloadContent() {
        
        for (const walkSound of this.walkSounds) {
            SOUND_MANAGER.RemoveEffect(walkSound.id);
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

    SetGroundType(groundType) {
        this.groundType = groundType;
    }
    
    SetCurrentHealth(health) {
        this.health = health;
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

        if (this.isPlayer) {
            DEBUG.Update('PLAYDEAD', `Y VEL: ${(this.velocity.y).toFixed(2)}`);
        }
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

        // WALKING - note that it will always be an array of sounds (even if 1)

        const stepsArray = this.walkSounds.filter(effect => effect.groundType === this.groundType);

        if (stepsArray && stepsArray.length > 0) {

            if (!this.stepTimer) {
                this.stepTimer = new Timer(GameTime.getCurrentGameTime());
            }

            const walkTimerElapsed = this.stepTimer.GetElapsed();

            if (walkTimerElapsed - this.previousStepTime >= this.stepSpeed) {
                
                if (this.isOnGround && Math.abs(this.velocity.x) > 0) {

                    // Get a random step, but make sure it's not the same as the previous one
                    const stepsExcludingPrevious = stepsArray.filter(step => step.id !== this.previousStepID || this.walkSounds[0].id);
                    const randomStepSoundID = stepsExcludingPrevious[random(0, stepsArray.length - 1)].id;
                    this.previousStepID = randomStepSoundID;
                
                    SOUND_MANAGER.PlayEffect(randomStepSoundID, this.position);
                    this.previousStepTime = walkTimerElapsed;
                }

            }

        }
    }

    // UPDATE and DRAW

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        this.ApplyPhysics();

        this.bounds.Update(this.position);

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
