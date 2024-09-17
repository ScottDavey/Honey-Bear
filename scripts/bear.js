/*****************************************
**************  BEAR CLASS  **************
*****************************************/
class Bear extends Character {

    constructor(position, size) {
        super(position, size, false);

        this.isTrackingPlayer = false;
        this.isAttacking = false;
        this.attackTimer = undefined;
        this.meleeAttackDamage = 75;
        this.meleeCooldown = undefined;
        this.meleeCooldownDuration = 5;

        this.maxMoveSpeed = 75;
        this.isMoving = true;

        // Sprites        
        const spritesheet = 'images/spritesheets/Bear.png';
        this.runRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 0, 0.2, true, new Vector2(0, 0)),
        this.runLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 1, 0.2, true, new Vector2(0, 0)),
        this.idleRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 4, 2, 0.25, true, new Vector2(0, 0)),
        this.idleLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 4, 3, 0.25, true, new Vector2(0, 0)),
        this.jumpRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 2, 4, 0.2, false, new Vector2(0, 0)),
        this.jumpLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 2, 5, 0.2, false, new Vector2(0, 0)),
        this.fallRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 1, 6, 0.08, false, new Vector2(0, 0)),
        this.fallLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 1, 7, 0.08, false, new Vector2(0, 0)),
        this.deadRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 12, 0.05, false, new Vector2(0, 0)),
        this.deadLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 13, 0.05, false, new Vector2(0, 0)),
        
        this.sprite = this.idleRightSprite;
    }

    Reset() {
        this.position = new Vector2(this.levelStartPosition.x, this.levelStartPosition.y);
        this.isMoving = true;
        this.isAttacking = false;
        this.meleeCooldown = undefined;
        this.TrackPlayer(false);
    }

    // GETTERS AND SETTERS

    SetSize(size) {
        this.size = size;
        const healthBarSizeX = (this.size.x * (this.health / this.maxHealth) < 0) ? 0 : this.size.x * (this.health / this.maxHealth);
        this.healthBar.Update(new Vector2(this.position.x, this.position.y - 15));
        this.healthBar.SetSize(new Vector2(healthBarSizeX, 10));
    }

    SetIsTracking(isTracking) {
        this.isTrackingPlayer = isTracking;
    }

    GetIsTracking() {
        return this.isTrackingPlayer;
    }

    GetMeleeAttackDamage() {
        return random(this.meleeAttackDamage, this.meleeAttackDamage * 2);
    }

    // BEHAVIOURS

    IsAttacking() {
        return this.isAttacking;
    }

    SwitchDirections() {
        if (!this.isDead){
            this.dir = (this.dir === 1) ? -1 : 1;
        }
    }

    TrackPlayer(isTracking) {
        this.isTrackingPlayer = isTracking;

        if (isTracking) {
            this.SetMaxMoveSpeed(150);
            this.runRightSprite.SetSpeed(0.07);
            this.runLeftSprite.SetSpeed(0.07);
        } else {
            this.SetMaxMoveSpeed(100);
            this.runRightSprite.SetSpeed(0.3);
            this.runLeftSprite.SetSpeed(0.3);
        }
    }

    MeleeAttack() {

        this.isAttacking = false;

        if (!this.meleeCooldown || this.meleeCooldown.IsComplete()) {
            this.meleeCooldown = new Timer(GameTime.getCurrentGameTime(), 3);
        }

        if (this.meleeCooldown && this.meleeCooldown.GetRemainder(1) === 2.5) {
            this.isAttacking = true;
        }

    }

    HandleAnimations() {
        let isRunning = false;

        if (this.isDead) {
            this.sprite = (this.dir === 1) ? this.deadRightSprite : this.deadLeftSprite;
        } else if (this.isJumping) {
            this.sprite = (this.dir === 1) ? this.jumpRightSprite : this.jumpLeftSprite;
        } else if (!this.isOnGround) {
            this.sprite = (this.dir === 1) ? this.fallRightSprite : this.fallLeftSprite;
        } else if (this.movement !== 0) {
            this.sprite = (this.dir === 1) ? this.runRightSprite : this.runLeftSprite;
            isRunning = true;
        } else {
            this.sprite = (this.dir === 1) ? this.idleRightSprite : this.idleLeftSprite;
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

    Update(playerPosition) {
        this.movement = 0;

        if (!this.isDead) {

            const playerPos = new Vector2(playerPosition.x, playerPosition.y);
            const posDiff = new Vector2(Math.abs(this.position.x - playerPos.x), Math.abs(this.position.y - playerPos.y));

            // Is tracking the player
            if (this.isTrackingPlayer) {

                const isCloseToPlayer = (posDiff.x < 75 && posDiff.y < 75);

                if ((this.position.x - playerPos.x) < 0 && this.dir === -1 || (this.position.x - playerPos.x) > 0 && this.dir === 1) {
                    this.SwitchDirections();
                }

                this.isMoving = true;

                // If the enemy is right on top of the player, stop moving
                if (posDiff.x < 75 && this.isMoving) {
                    this.isMoving = false;
                }

                // Attach if tracking and in striking distance
                if (isCloseToPlayer) {
                    this.MeleeAttack();
                } else {
                    this.isAttacking = false;
                }

                // If we've outrun the enemy, tell them to stop tracking
                if (posDiff.x < -1500 || posDiff.x > 1500) {
                    this.TrackPlayer(false);
                }

                if (this.isHittingWall && !this.isKnockingBack && !this.GetIsStunned()) this.isJumping = true;

            } else {

                // We could see if the enemy is outside of their region and, if so, send them back.
                // Obviously this depends on how far they travelled and whether or not it's even possible to get back.

                // If 
                if (Math.abs(posDiff.x < 300 && Math.abs(posDiff.y < 300))) {
                    this.TrackPlayer(true);
                }

                // If we're not tracking the player and we're hitting a wall, switch directions
                if (this.isHittingWall) this.SwitchDirections();
            }

            // Stun the bear if they're being knocked back
            if (this.isKnockingBack && !this.GetIsStunned()) {
                this.SetIsStunned(true);
            }

            if (this.GetIsStunned()) {
                
                this.isMoving = false;
            }

            if (this.isMoving) {
                this.movement = this.dir;
            }

        } else {
            this.isAttacking = false;
        }

        this.HandleAnimations();

        super.Update();
    }

    Draw() {
        super.Draw();
    }

}