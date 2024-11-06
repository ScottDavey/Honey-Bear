
/*******************************************
**************  PLAYER CLASS  **************
*******************************************/

class Player extends Character {
    constructor(position, size) {
        super(position, size, true);

        this.isInvincible = false;
        this.invincibilityDuration = 1;
        this.invincibilityTimer = undefined;

        // Nimation: img, pos, frameHeight, frameWidth, totalFrames, animationSeq, speed, isLooping, offset
        const spritesheet = 'images/spritesheets/Adventurer-1.5/adventurer-spritesheet.png';
        const honeyBearSpriteSheet = 'images/spritesheets/HoneyBear.png';
        this.defaultRunAnimationSpeed = 0.09;
        this.animations = {
            runRightSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 0, this.defaultRunAnimationSpeed, true, new Vector2(0, 0)),
            runLeftSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 1, this.defaultRunAnimationSpeed, true, new Vector2(0, 0)),
            idleRightSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 4, 2, 0.25, true, new Vector2(0, 0)),
            idleLeftSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 4, 3, 0.25, true, new Vector2(0, 0)),
            jumpRightSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 2, 4, 0.2, false, new Vector2(0, 0)),
            jumpLeftSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 2, 5, 0.2, false, new Vector2(0, 0)),
            fallRightSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 1, 6, 0.08, false, new Vector2(0, 0)),
            fallLeftSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 1, 7, 0.08, false, new Vector2(0, 0)),
            idleThrowRightSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 8, 0.02, false, new Vector2(0, 0)),
            idleThrowLeftSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 9, 0.02, false, new Vector2(0, 0)),
            runThrowRightSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 10, this.defaultRunAnimationSpeed, false, new Vector2(0, 0)),
            runThrowLeftSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 11, this.defaultRunAnimationSpeed, false, new Vector2(0, 0)),
            deadRightSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 12, 0.05, false, new Vector2(0, 0)),
            deadLeftSprite: new Nimation(honeyBearSpriteSheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 13, 0.05, false, new Vector2(0, 0)),
            hurtLeftSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 3, 8, 0.25, false, new Vector2(26, 13)),
            hurtRightSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 3, 9, 0.25, false, new Vector2(26, 13)),
        };
        this.sprite = this.animations.idleSprite;

        this.throwStartTime = 0;
        this.throwSoundID = 0;
        this.globAnimationMaxTime = 0.12;
        this.globs = [];
        this.globCooldown = undefined;
        this.globCooldownDuration = 1;
        this.blast = undefined;
        this.blastCooldown = undefined;
        this.blastCooldownDuration = 5;

        this.health = 50000;
        this.maxHealth = 50000;
        
        this.LoadSoundEffects();
    }

    Reset(position) {
        if (this.isDead) {
            this.ResetHealth();
        }
        this.SetPosition(position);
        this.SetIsDead(false);
        this.SetIsDeathDone(false);
        this.animations.deadLeftSprite.Reset();
        this.animations.deadRightSprite.Reset();
        this.SetDirection(1);
    }

    LoadSoundEffects() {
        super.LoadSoundEffects();

        this.throwSoundID = `throw_${random(10000, 90000)}`;
        SOUND_MANAGER.AddEffect(this.throwSoundID, new Sound('sounds/effects/throw.ogg', 'SFX', false, null, false, 0.2, true));
    }

    UnloadContent() {
        
        SOUND_MANAGER.RemoveEffect(this.throwSoundID);

        super.UnloadContent();

    }

    // GETTERS AND SETTERS

    SetRandomPosition(randomPos) {
        this.SetPosition(randomPos);
    }

    GetHoneyGlobs() {
        return this.globs;
    }

    GetHoneyGlobCooldown() {
        const remainder = this.globCooldown ? this.globCooldown.GetRemainder() : 0;
        return remainder;
    }

    GetHoneyBlast() {
        return this.blast;
    }

    GetHoneyBlastCooldown() {
        const remainder = this.blastCooldown ? this.blastCooldown.GetRemainder() : 0;
        return remainder;
    }

    GetInput() {
        const currentGameTime = GameTime.getCurrentGameTime();
        const leftKeyBindingValue = INPUT.GetInput(KEY_BINDINGS.MOVE_LEFT);
        const rightKeyBindingValue = INPUT.GetInput(KEY_BINDINGS.MOVE_RIGHT);

        // Horizontal Movement (Either keyboard WASD/Arrows |OR| Game Pad D-Pad |OR| Game Pad Sticks)
        if (leftKeyBindingValue || 0 !== 0) {
            this.movement = -leftKeyBindingValue;
            this.SetDirection(-1);
        } else if (rightKeyBindingValue || 0 !== 0) {
            this.movement = rightKeyBindingValue;
            this.SetDirection(1);
        }
        
        this.isJumping = INPUT.GetInput(KEY_BINDINGS.JUMP);

        // Abilities
        if (INPUT.GetInput(KEY_BINDINGS.SHOOT)) {

            if (!this.globCooldown || this.globCooldown.IsComplete()) {
                this.throwStartTime = currentGameTime;
                this.isThrowing = true;
                this.isGlobLocked = true;
                const globPosX = (this.dir === 1) ? this.position.x + this.size.x - 10 : this.position.x;
                this.globs.push(new HoneyGlob(new Vector2(globPosX, this.position.y + (this.size.y / 2)), this.dir, this.velocity.x));
                this.globCooldown = new Timer(currentGameTime, this.globCooldownDuration);
                SOUND_MANAGER.PlayEffect(this.throwSoundID, this.position);
            }

        }
        
        if (INPUT.GetInput(KEY_BINDINGS.SPECIAL)) {

            if (!this.blastCooldown || this.blastCooldown.IsComplete()) {
                this.blast = new HoneyBlast(this.GetBounds());
                this.isBlastLocked = true;
                this.blastCooldown = new Timer(currentGameTime, this.blastCooldownDuration);
            }
            
        }
    }

    // BEHAVIOURS

    DoDamage(damage, ignoreInvincibility = false) {

        if (!this.isInvincible && !this.isDead) {
            super.DoDamage(damage);
            
            if (!ignoreInvincibility) {
                // Apply invincibility
                this.isInvincible = true;
                this.invincibilityTimer = new Timer(GameTime.getCurrentGameTime(), this.invincibilityDuration);
                
                if (!this.GetIsDead()) {
                    this.SetSpriteOpacity(0.5);
                }
            }
        }
        
    }

    Heal(amount) {
        this.health += amount;
        this.health = this.health > this.maxHealth ? this.maxHealth : this.health;
        
        this.statusText.push(new StatusText('HEAL', amount, false, this.position, true));
    }

    SetSpriteOpacity(opacity) {
        // Run through each animation sprite to set its opacity
        for (const sprite in this.animations) {
            this.animations[sprite].SetImageOpacity(opacity);
        }
    }

    HandleAnimations() {
        let isRunning = false;

        if (this.GetIsDead()) {
            this.SetSprite((this.dir === 1) ? this.animations.deadRightSprite : this.animations.deadLeftSprite);
        } else if (this.isKnockingBack) {
            this.SetSprite((this.dir === 1) ? this.animations.hurtRightSprite : this.animations.hurtLeftSprite);
        } else if (this.velocity.y < 0) {
            if (this.isThrowing) {
                this.SetSprite((this.dir === 1) ? this.animations.idleThrowRightSprite : this.animations.idleThrowLeftSprite);
            } else {
                this.SetSprite((this.dir === 1) ? this.animations.jumpRightSprite : this.animations.jumpLeftSprite);
            }
        } else if (!this.isOnGround) {
            if (this.isThrowing) {
                this.SetSprite((this.dir === 1) ? this.animations.idleThrowRightSprite : this.animations.idleThrowLeftSprite);
            } else {
                this.SetSprite((this.dir === 1) ? this.animations.fallRightSprite : this.animations.fallLeftSprite);
            }
        } else if (this.velocity.x !== 0) {
            if (this.isThrowing) {
                this.SetSprite((this.dir === 1) ? this.animations.runThrowRightSprite : this.animations.runThrowLeftSprite);
            } else {
                this.SetSprite((this.dir === 1) ? this.animations.runRightSprite : this.animations.runLeftSprite);
            }
            isRunning = true;
        } else {
            if (this.isThrowing) {
                this.SetSprite((this.dir === 1) ? this.animations.idleThrowRightSprite : this.animations.idleThrowLeftSprite);
            } else {
                this.SetSprite((this.dir === 1) ? this.animations.idleRightSprite : this.animations.idleLeftSprite);
            }
        }

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

    // UPDATE and DRAW

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        if (!INPUT.IsLocked()) {
            this.GetInput();
        } else {
            this.movement = 0;
            this.velocity = new Vector2(0, 0);
        }

        if (this.isThrowing) {
            const throwElapsedTime = currentGameTime - this.throwStartTime;

            // Handle Glob Throw Animation
            if (throwElapsedTime >= this.globAnimationMaxTime) {
                this.isThrowing = false;
                this.throwStartTime = 0;
                this.animations.idleThrowLeftSprite.Reset();
                this.animations.idleThrowRightSprite.Reset();
                this.animations.runThrowLeftSprite.Reset();
                this.animations.runThrowRightSprite.Reset();
            } else if (throwElapsedTime >= 0.05 && !this.isGlobLocked) {
                // Dp mptj
            }
        }

        // HONEY BLAST
        if (this.blast) {
            if (!this.blast.IsComplete()) {
                this.blast.Update(this.bounds.center);
            } else {
                this.blast = undefined;
            }
        }

        this.HandleAnimations();

        // Handle Invincibility
        if (this.isInvincible && this.invincibilityTimer && this.invincibilityTimer.IsComplete()) {
            this.isInvincible = false;
            this.SetSpriteOpacity(1);
        }

        // GLOBS
        for (let g = 0; g < this.globs.length; g++) {
            const glob = this.globs[g];

            if (!glob.GetHasHit()) {
                glob.Update();
            } else {
                this.globs.splice(g, 1);
            }
        }

        // Handle Cooldowns
        if (this.globCooldown && this.globCooldown.IsComplete()) {
            this.globCooldown = undefined;
        }
        
        if (this.blastCooldown && this.blastCooldown.IsComplete()) {
            this.blastCooldown = undefined;
        }
        
        super.Update();
    }

    Draw() {

        for (const glob of this.globs) {
            glob.Draw();
        }

        if (this.blast) {
            this.blast.Draw();
        }

        if (this.healthTextTimer && !this.healthTextTimer.IsComplete()) {
            this.healthText.Draw();
        }

        super.Draw();
    }
}