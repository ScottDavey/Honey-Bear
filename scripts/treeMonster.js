/****************************************
*****  TREE MONSTER (Level 1 Boss)  *****
****************************************/

class TreeMonster {

    constructor(position, size, worldBounds) {
        this.position = position;
        this.size = size;
        this.worldBounds = worldBounds;
        this.state = BOSS_STATE.PREINTRO;
        this.bounds = new Rectangle(this.position.x + 365, this.position.y + 240, 200, 150);
        this.initialHealth = HEALTH.TREE_MONSTER;
        this.health = this.initialHealth;
        this.isInvincible = false;
        this.invincibilityDuration = 1;
        this.invincibilityTimer = undefined;
        this.isCloseToPlayer = false;
        this.playerBounds = undefined;

        // STATE DURATIONS
        this.stateTimer = undefined;
        this.preIntroDuration = 3;
        this.introDuration = 2;
        this.idleDuration = [2, 3];
        this.attackIntroDuration = 0;   // Determined by the attack type
        this.dyingDuration = 3;

        // SPRITESHEET
        const spritesheet = 'images/spritesheets/TreeMonster_Spritesheet.png';

        // path, pos, frameHeight, frameWidth, totalFrames, animationSeq, speed, isLooping, offset
        this.animations = {
            preIntro:           new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 1,   0, 0.1,     false,  new Vector2(0, 0)),
            intro:              new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 11,  1, 0.15,    false,  new Vector2(0, 0)),
            idle:               new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 2,   2, 0.5,     true,   new Vector2(0, 0)),
            dying:              new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 6,   3, 0.15,    false,  new Vector2(0, 0)),
            dead:               new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 1,   4, 0.5,     true,   new Vector2(0, 0)),
            acornDrop:          new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 8,   5, 0.2,     true,   new Vector2(0, 0)),
            cannonIntro:        new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 4,   6, 0.05,    false,  new Vector2(0, 0)),
            cannon:             new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 11,  7, 0.07,    false,  new Vector2(0, 0)),
            branchSmashIntro:   new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 9,   8, 0.05,    false,  new Vector2(0, 0)),
            branchSmash:        new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 439, 936, 8,   9, 0.1,    false,  new Vector2(0, 0)),
        };
        this.sprite = undefined;

        // ARMS
        this.drawArmCannons = false;
        this.drawCannonStartTime = 0.28;
        this.leftArmVelocity = new Vector2(0, 0);
        this.rightArmVelocity = new Vector2(0, 0);
        this.armCannonAcceleration = 9000.0;
        this.armCannonMaxSpeed = 1500;
        this.airDrag = 0.09;

        this.leftArmStartPosition = new Vector2(this.position.x, this.position.y + 355);
        this.rightArmStartPosition = new Vector2(this.position.x + 597, this.position.y + 355);
        this.armSize = new Vector2(307, 61);
        this.armBoundSize = new Vector2(this.armSize.x * 0.5, this.armSize.y / 2);
        this.leftArmBoundOffset = new Vector2(0, this.armSize.y / 2);
        this.rightArmBoundOffset = new Vector2(this.armSize.x - this.armBoundSize.x, this.armSize.y / 2);

        this.leftArmSprite = new Sprite('images/entities/TreeMonster_Arm_Left.png', this.leftArmStartPosition, this.armSize);
        this.leftArmRect = new Rectangle(this.leftArmStartPosition.x + this.leftArmBoundOffset.x, this.leftArmStartPosition.y + this.leftArmBoundOffset.y, this.armBoundSize.x, this.armBoundSize.y);        
        this.rightArmRect = new Rectangle(this.rightArmStartPosition.x + this.rightArmBoundOffset.x, this.rightArmStartPosition.y + this.rightArmBoundOffset.y, this.armBoundSize.x, this.armBoundSize.y);        
        this.rightArmSprite = new Sprite('images/entities/TreeMonster_Arm_Right.png', this.rightArmStartPosition, this.armSize);       

        // EYES
        this.eyesPositionCenter = new Vector2(this.bounds.x + 42, this.bounds.y + 45);
        this.eyes = new Sprite('images/entities/TreeMonster_Eyes.png', this.eyesPositionCenter, new Vector2(113, 21));
        this.eyeWhites = new Texture(new Vector2(this.bounds.x, this.bounds.y + 20), new Vector2(200, 75), '#FFFFFF', 1, '#FFFFFF');

        // ATTACKS
        this.moveList = [
            {
                name: 'ACORN_DROP',
                fn: this.AcornDrop,
                isProximityBased: false,
                introDuration: 1,
                duration: 5,
                introSprite: this.animations.acornDrop,
                attackSprite: this.animations.acornDrop
            },
            {
                name: 'CANNON',
                fn: this.Cannon,
                isProximityBased: false,
                introDuration: 1.5,
                duration: 1.5,
                introSprite: this.animations.cannonIntro,
                attackSprite: this.animations.cannon
            },
            {
                name: 'BRANCH_SMASH',
                fn: this.BranchSmash,
                isProximityBased: true,
                introDuration: 0.55,
                duration: 2,
                introSprite: this.animations.branchSmashIntro,
                attackSprite: this.animations.branchSmash
            },
            // Double up the branch smash to make it more likely to get chosen if the player is close by
            {
                name: 'BRANCH_SMASH',
                fn: this.BranchSmash,
                isProximityBased: true,
                introDuration: 0.55,
                duration: 2,
                introSprite: this.animations.branchSmashIntro,
                attackSprite: this.animations.branchSmash
            },
        ];
        this.isAttackIntro = true;
        this.currentAttack = undefined;
        this.attackCooldown = 0;    // Set by specific attack
        this.attackCooldownTimer = undefined;
        this.previousAttackEventTime = 0;

        // ATTACK SPECIFIC
        this.acorns = [];
        this.branchSmashHitZoneLeft = new Rectangle(this.position.x, this.position.y + 300, 222, 139);
        this.branchSmashHitZoneRight = new Rectangle(this.position.x + 677, this.position.y + 300, 222, 139);
        this.isBranchSmashAttack = false;
        this.branchHitTimeRange = { start: 0.15, end: 0.55 };

        // NAME AND HEALTH
        this.showInfo = false;
        this.name = new Text('Tree Monster', new Vector2(CANVAS_WIDTH / 2 - 200, 35), 'Lobster, Raleway', 'normal', 20, '#FFFFFF', 'left');
        this.healthBar = new StatusBar(new Vector2(CANVAS_WIDTH / 2 - 200, 50), new Vector2(400, 30), 0, '#990000', 2, '#550000', true, '#FFFFFF');
        this.healthBar.SetMaxValue(this.initialHealth);
        this.statusText = [];

        // SOUNDS
        this.introSoundID = `intro-${random(10000, 90000)}`;
        SOUND_MANAGER.AddEffect(this.introSoundID, new Sound('sounds/effects/TREE_MONSTER_INTRO.ogg', 'SFX', false, null, false, 0.6, false));
        this.branchSmashSoundID = `branch-smash-${random(10000, 90000)}`;
        SOUND_MANAGER.AddEffect(this.branchSmashSoundID, new Sound('sounds/effects/TREE_MONSTER_BRANCH_SMASH.ogg', 'SFX', false, null, false, 0.4, false));
        this.cannonSoundID = `cannon-${random(10000, 90000)}`;
        SOUND_MANAGER.AddEffect(this.cannonSoundID, new Sound('sounds/effects/TREE_MONSTER_CANNON.ogg', 'SFX', false, null, false, 0.6, false));
    }

    Initialize() {
        this.sprite = this.animations.preIntro;
    }

    Reset() {
        this.state = BOSS_STATE.IDLE;
        this.stateTimer = undefined;
        this.health = this.initialHealth;
        this.isInvincible = false;
        this.invincibilityTimer = undefined;
        this.drawArmCannons = false;
        this.isAttackIntro = true;
        this.currentAttack = undefined;
        this.attackCooldownTimer = undefined;
        this.previousAttackEventTime = 0;
        this.acorns = [];
        this.isBranchSmashAttack = false;
    }

    GetNameBar() {
        if (this.state > BOSS_STATE.INTRO) {
            return this.name;
        }
    }

    GetHealthBar() {
        if (this.state > BOSS_STATE.INTRO) {
            return this.healthBar;
        }
    }

    GetBounds() {
        return this.bounds;
    }

    GetIsDead() {
        return this.state === BOSS_STATE.DEAD;
    }

    GetState() {
        return this.state;
    }

    GetAcorns() {
        return this.acorns;
    }

    GetIsBranchSmash() {
        return this.isBranchSmashAttack;
    }

    SetIsDying() {
        this.stateTimer = undefined;
        this.state = BOSS_STATE.DYING;
    }

    SetIsDead() {
        this.state = BOSS_STATE.DEAD;
    }

    ResetHealth() {
        this.health = this.initialHealth;
    }

    CheckAttack(collision) {
        let attackResult = { hasHit: false, damage: { amount: 0, isCrit: false } };

        for (const acorn of this.acorns) {
            const acornBounds = acorn.GetBounds();

            if (collision.CheckBoxCollision(this.playerBounds, acornBounds)) {
                acorn.SetHasHitPlayer(true);
                attackResult.hasHit = true; 
                attackResult.damage = acorn.GetDamage();
            }
        } 
        
        if (this.drawArmCannons) {

            // ARMS
            if (collision.CheckBoxCollision(this.leftArmRect, this.playerBounds) || collision.CheckBoxCollision(this.rightArmRect, this.playerBounds)) {
                attackResult.hasHit = true;
                attackResult.damage = {
                    amount: DAMAGE.ARM_CANNON,
                    isCrit: false,
                };
            }

        } else if (this.isBranchSmashAttack) {

            if (collision.CheckBoxCollision(this.branchSmashHitZoneLeft, this.playerBounds) || collision.CheckBoxCollision(this.branchSmashHitZoneRight, this.playerBounds)) {
                attackResult.hasHit = true;
                attackResult.damage = {
                    amount: DAMAGE.BRANCH_SMASH,
                    isCrit: false,
                };
            }

        }

        return attackResult;

    }

    DoDamage(initialDamage) {

        if (!this.isInvincible) {

            this.health -= initialDamage.amount;
            this.health = (this.health < 0) ? 0 : this.health;

            this.isInvincible = true;
            this.invincibilityTimer = new Timer(GameTime.getCurrentGameTime(), this.invincibilityDuration);

            this.statusText.push(
                new StatusText(
                    'DAMAGE',
                    initialDamage.amount,
                    initialDamage.isCrit,
                    new Vector2(this.bounds.x + (this.bounds.width / 2) - 30, this.bounds.y),
                    this.isPlayer
                )
            );

        }
        
        if (this.state <= BOSS_STATE.STUNNED && this.health <= 0) {
            this.SetIsDying();
            this.deathStartTime = GameTime.getCurrentGameTime();
        }
    }

    HandleEyeMovement() {

        this.eyes.Update(
            new Vector2(
                Clamp(this.playerBounds.x, this.eyesPositionCenter.x - 12, this.eyesPositionCenter.x + 12),
                Clamp(this.playerBounds.y, this.eyesPositionCenter.y - 4, this.eyesPositionCenter.y + 7)
            )
        );

    }

    HandleAnimations() {

        if (!this.sprite) {
            this.sprite = this.animations.intro;
        }

        if (this.state === BOSS_STATE.PREINTRO) {
            this.sprite = this.animations.preIntro;
        } else if (this.state === BOSS_STATE.INTRO) {
            this.sprite = this.animations.intro;
        } else if (this.state === BOSS_STATE.IDLE) {
            this.sprite = this.animations.idle;
        } else if (this.state === BOSS_STATE.ATTACK_INTRO) {
            if (this.currentAttack) {
                this.sprite = this.currentAttack.introSprite;
            }
        } else if (this.state === BOSS_STATE.ATTACKING) {
            if (this.currentAttack) {
                this.sprite = this.currentAttack.attackSprite;
            }
        } else if (this.state === BOSS_STATE.DYING) {
            this.sprite = this.animations.dying;
        } else if (this.state === BOSS_STATE.DEAD) {
            this.sprite = this.animations.dead;
        } else {
            this.sprite = this.animations.idle;
        }

        this.HandleEyeMovement();
        this.sprite.Update(this.position);

    }

    HandleHealthAndStatusText(currentGameTime) {
        this.healthBar.Update(this.health);

        for (let d = 0; d < this.statusText.length; d ++) {
            const dt = this.statusText[d];

            if (!dt.IsComplete()) {
                dt.Update(currentGameTime);
            } else {
                this.statusText.splice(d, 1);
            }
        }
    }

    AcornDrop() {
        
        const currentGameTime = GameTime.getCurrentGameTime();
        const timeSincelastAcornDrop = +(currentGameTime - this.previousAttackEventTime);

        if (this.previousAttackEventTime === 0) {
            this.previousAttackEventTime = currentGameTime;
        }

        if (+(timeSincelastAcornDrop.toFixed(2)) >= 0.10) {
            this.previousAttackEventTime = currentGameTime;

            const acornPosition = new Vector2(random(this.worldBounds.x, this.worldBounds.x + CANVAS_WIDTH), -100);
            this.acorns.push(
                new Acorn(acornPosition)
            );
        }

    }

    Cannon() {

        // Play sound right away
        SOUND_MANAGER.PlayEffect(this.cannonSoundID);

        // If we're at or past the draw start time and we're not already drawing, switch draw flag to true
        if (this.stateTimer && this.stateTimer.GetElapsed() >= this.drawCannonStartTime && !this.drawArmCannons) {
            this.drawArmCannons = true;
        }

        if (this.drawArmCannons) {
            const elapsed = GameTime.getElapsed();

            // Move each arm towards the edge of the screen
            // LEFT
            this.leftArmVelocity.x += -1 * this.armCannonAcceleration;
            this.leftArmVelocity.x *= this.airDrag;
            this.leftArmVelocity.x = Clamp(
                this.leftArmVelocity.x,
                -this.armCannonMaxSpeed,
                this.armCannonMaxSpeed
            );

            let leftArmPosition = new Vector2(this.leftArmSprite.GetPosition().x, this.leftArmStartPosition.y);
            leftArmPosition.x += this.leftArmVelocity.x * elapsed;
            leftArmPosition.x = Math.round(leftArmPosition.x);

            this.leftArmSprite.Update(leftArmPosition);
            this.leftArmRect.Update(new Vector2(leftArmPosition.x + this.leftArmBoundOffset.x, leftArmPosition.y + this.leftArmBoundOffset.y));
            
            // RIGHT
            this.rightArmVelocity.x += this.armCannonAcceleration;
            this.rightArmVelocity.x *= this.airDrag;
            this.rightArmVelocity.x = Clamp(
                this.rightArmVelocity.x,
                -this.armCannonMaxSpeed,
                this.armCannonMaxSpeed
            );

            let rightArmPosition = new Vector2(this.rightArmSprite.GetPosition().x, this.rightArmStartPosition.y);
            rightArmPosition.x += this.rightArmVelocity.x * elapsed;
            rightArmPosition.x = Math.round(rightArmPosition.x);

            this.rightArmSprite.Update(rightArmPosition);
            this.rightArmRect.Update(new Vector2(rightArmPosition.x + this.rightArmBoundOffset.x, rightArmPosition.y + this.rightArmBoundOffset.y));

            // If the arms leave the screen, stop drawing and reset their position
            if (leftArmPosition.x + this.armSize.x < this.worldBounds.x &&
                rightArmPosition.x > this.worldBounds.x + CANVAS_WIDTH
            ) {
                this.drawArmCannons = false;
            }

        } else {
            this.leftArmVelocity.x = 0;
            this.rightArmVelocity.x = 0;
        }

    }

    BranchSmash() {

        SOUND_MANAGER.PlayEffect(this.branchSmashSoundID)
        
        // NOTE: this.isBranchSmashAttack is set to false every frame in Update, before this is called.  
        
        if (this.stateTimer && this.stateTimer.GetElapsed() >= this.branchHitTimeRange.start && this.stateTimer.GetElapsed(2) <= this.branchHitTimeRange.end) {
            this.isBranchSmashAttack = true;
        }


    }

    HandleAttackIntro(gameTime) {

        /*************************
        ***** FIND AN ATTACK *****
        *************************/
        if (!this.currentAttack) {

            // Choose a random move.
            // To provide a wider range of numbers, it'll be a random number out of 1000

            // If the player is close, filter out any non-proximity moves.
            //  Otherwise, only get non-proximity based moves
            const moveList = this.moveList.filter(move => {
                if (this.isCloseToPlayer) {
                    return move.isProximityBased;
                } else {
                    return !move.isProximityBased;
                }
            });

            // Get the total move list length
            const moveListLength = moveList.length;
            // Get the percetange range each move will have of being chosen. ex: out of 3 moves, each will have 33%
            const moveListSpreadPercentage = Math.floor(1000 / moveListLength);
            // Choose random number out of 1000
            const randomNumber = random(1, 1000);
            // Go through the move list to find the move that falls inside the random number range
            const randomMove = moveList.find((move, index) => {
                // Get upper range of percentage based on the move's index value
                const upperPercentRange = (index + 1) * moveListSpreadPercentage;
                // Also get the lower range. This will just be the index * the max range - the range spread
                // ex: index 0, range spread 33% -> { lower: 0, upper: 33 }
                const movePercentRange = { lower: upperPercentRange - moveListSpreadPercentage, upper: upperPercentRange };
                // Check to see if the random number falls within the range
                const isInRange = (randomNumber > movePercentRange.lower && randomNumber <= movePercentRange.upper);

                return isInRange;
            });

            this.currentAttack = randomMove;


        }

        /***********************
        ***** ATTACK INTRO *****
        ***********************/
        // There's nothing to do here other than letting the timer (and animation) run
        if (!this.stateTimer) {
            this.stateTimer = new Timer(gameTime, this.currentAttack.introDuration);
        }

        // In the future, if something else is supposed to happen that's attack dependent
        // it'll be called here

        if (this.stateTimer.IsComplete()) {
            this.stateTimer = undefined;
            this.state = BOSS_STATE.ATTACKING;
        }

    }

    HandleAttack(gameTime) {

        /*****************
        ***** ATTACK *****
        *****************/
        
        if (!this.stateTimer) {
            this.stateTimer = new Timer(gameTime, this.currentAttack.duration);
        }

        // If our attack timer is still running, keep attacking.
        //  Else reset everything and send boss to idle state
        if (!this.stateTimer.IsComplete()) {
            this.currentAttack.fn.apply(this);
        } else {
            this.stateTimer = undefined;
            this.attackIntro = true;
            this.currentAttack = undefined;
            this.state = BOSS_STATE.IDLE;
            this.animations.cannonIntro.Reset();
            this.animations.cannon.Reset();
            this.animations.branchSmashIntro.Reset();
            this.animations.branchSmash.Reset();

            this.leftArmSprite.Update(this.leftArmStartPosition);
            this.leftArmRect.Update(new Vector2(this.leftArmStartPosition.x + this.leftArmBoundOffset.x, this.leftArmStartPosition.y + this.leftArmBoundOffset.y));            
            this.rightArmSprite.Update(this.rightArmStartPosition);
            this.rightArmRect.Update(new Vector2(this.rightArmStartPosition.x + this.rightArmBoundOffset.x, this.rightArmStartPosition.y + this.rightArmBoundOffset.y));
        }

    }

    HandleAttackEntities() {
        // Update all acorns
        for (let a = 0; a < this.acorns.length; a++) {
            const acorn = this.acorns[a];

            acorn.Update();

            if (acorn.GetHasHit()) {
                acorn.UnloadContent();
                this.acorns.splice(a, 1);
            }
        }
    }

    Update(playerBounds) {
        const currentGameTime = GameTime.getCurrentGameTime();

        this.playerBounds = playerBounds;

        const playerPosDiff = new Vector2(
            this.bounds.center.x - this.playerBounds.center.x,
            this.bounds.center.y - this.playerBounds.center.y
        );

        this.isCloseToPlayer = (Math.abs(playerPosDiff.x) < (this.size.x / 2));

        this.isBranchSmashAttack = false;   // Always start as false. If it's the Branch Smash, it will set to true at the right time.

        // HANDLE STATES

        if (!this.state) {
            this.state = BOSS_STATE.PREINTRO;
        }

        switch(this.state) {
            case BOSS_STATE.PREINTRO:

                if (!this.stateTimer) {
                    this.stateTimer = new Timer(currentGameTime, this.preIntroDuration);
                }

                if (this.stateTimer.IsComplete()) {
                    this.state = BOSS_STATE.INTRO;
                    this.stateTimer = undefined;
                }

                break;
            case BOSS_STATE.INTRO:

                if (!this.stateTimer) {
                    this.stateTimer = new Timer(currentGameTime, this.introDuration);
                }

                SOUND_MANAGER.PlayEffect(this.introSoundID);

                if (this.stateTimer.IsComplete()) {
                    this.state = BOSS_STATE.IDLE;
                    this.stateTimer = undefined;
                    SOUND_MANAGER.RemoveEffect(this.introSoundID);
                }

                break;
            case BOSS_STATE.IDLE:

                if (!this.stateTimer) {
                    // Pick a random duration between two given limits
                    this.stateTimer = new Timer(currentGameTime, random(this.idleDuration[0], this.idleDuration[1]));
                }

                if (this.stateTimer.IsComplete()) {
                    this.state = BOSS_STATE.ATTACK_INTRO;
                    this.stateTimer = undefined;
                }

                break;
            case BOSS_STATE.ATTACK_INTRO:

                this.HandleAttackIntro(currentGameTime);

                break;
            case BOSS_STATE.ATTACKING:

                this.HandleAttack(currentGameTime);

                break;
            case BOSS_STATE.DYING:

                if (!this.stateTimer) {
                    this.stateTimer = new Timer(currentGameTime, this.dyingDuration);
                }

                if (this.stateTimer.IsComplete()) {
                    this.state = BOSS_STATE.DEAD;
                    this.stateTimer = undefined;
                }

                break;
            default:
                break;
        }

        // Handle Invincibility
        if (this.isInvincible && this.invincibilityTimer && this.invincibilityTimer.IsComplete()) {
            this.isInvincible = false;
        }

        this.HandleAnimations();
        this.HandleHealthAndStatusText(currentGameTime);
        this.HandleAttackEntities();

        // DEBUG
        DEBUG.Update('BOSSSTATE', `Boss State: ${Object.keys(BOSS_STATE).find(key => BOSS_STATE[key] === this.state)}`);
        DEBUG.Update('BOSSATK', `Boss Attack: ${this.currentAttack ? this.currentAttack.name : 'NONE'}`);
        if (this.stateTimer) DEBUG.Update('INTROTIMER', `BOSS Timer: ${this.stateTimer.GetRemainder(2)}`);
        DEBUG.Update('BOSSCLOSE', `Is Close To Player: ${this.isCloseToPlayer ? 'YES': 'NO'}`);

    }

    Draw () {

        if (this.sprite) {
            this.eyeWhites.Draw();
            this.eyes.Draw();
            this.sprite.Draw();

            if (this.drawArmCannons) {
                this.leftArmSprite.Draw();
                this.rightArmSprite.Draw();
            }
        }

        for (const dt of this.statusText) {
            dt.Draw();
        }

        for (const acorn of this.acorns) {
            acorn.Draw();
        }

    }

}