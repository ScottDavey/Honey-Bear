/*****************************************
**************  BEAR CLASS  **************
*****************************************/
class Bear extends Character {

    constructor(position, size) {
        super(position, size, false);

        this.aggroDistance = 300;
        this.losLostDuration = 10;
        this.losLostTimer = undefined;
        this.losRay = new Line(
            this.GetBounds().center,
            this.GetBounds().center,
            '#00000066',
            null,
            null,
            null,
            null,
            null
        );
        this.hasLOSOnPlayer = false;
        this.playerLastLocation = new Vector2(0, 0);
        this.isTrackingPlayer = false;
        this.isAttacking = false;
        this.attackRange = 75;
        this.attackTimer = undefined;
        this.meleeAttackDamage = DAMAGE.BEAR_MELEE;
        this.meleeCooldown = undefined;
        this.meleeCooldownDuration = 5;

        this.maxRunSpeed = 215;
        this.maxWalkSpeed = 75;
        this.maxMoveSpeed = this.maxWalkSpeed;
        this.isMoving = true;
        this.isNoChase = false;

        // Sprites        
        const spritesheet = 'images/spritesheets/Bear.png';
        this.animations = {
            runRightSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 0, 0.2, true, new Vector2(0, 0)),
            runLeftSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 1, 0.2, true, new Vector2(0, 0)),
            idleRightSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 4, 2, 0.25, true, new Vector2(0, 0)),
            idleLeftSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 4, 3, 0.25, true, new Vector2(0, 0)),
            idleSwipeRightSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 8, 1.5, false, new Vector2(0, 0)),
            idleSwipeLeftSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 9, 1.5, false, new Vector2(0, 0)),
            jumpRightSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 2, 4, 0.2, false, new Vector2(0, 0)),
            jumpLeftSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 2, 5, 0.2, false, new Vector2(0, 0)),
            fallRightSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 1, 6, 0.08, false, new Vector2(0, 0)),
            fallLeftSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 1, 7, 0.08, false, new Vector2(0, 0)),
            deadRightSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 12, 0.05, false, new Vector2(0, 0)),
            deadLeftSprite: new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 65, 45, 6, 13, 0.05, false, new Vector2(0, 0)),
        };

        this.sprite = this.animations.idleRightSprite;

        super.LoadSoundEffects();
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

    SetIsJumping() {
        this.isJumping = true;
    }

    SetNoChase(shouldNotChase) {
        this.isNoChase = shouldNotChase;
    }

    SetHasLOS(hasLOS, playerLocation) {
        // If we had LOS, but just lost it, set the player's last known location
        // if (this.hasLOSOnPlayer && !hasLOS) {
        //     this.playerLastLocation = new Vector2(playerLocation.x, playerLocation.y);
        // }
        
        this.hasLOSOnPlayer = hasLOS;
    }

    GetLOS() {
        return this.losRay;
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
            this.SetMaxMoveSpeed(this.maxRunSpeed);
            this.animations.runRightSprite.SetSpeed(0.07);
            this.animations.runLeftSprite.SetSpeed(0.07);
        } else {
            this.SetMaxMoveSpeed(this.maxWalkSpeed);
            this.animations.runRightSprite.SetSpeed(0.3);
            this.animations.runLeftSprite.SetSpeed(0.3);
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
            this.SetSprite((this.dir === 1) ? this.animations.deadRightSprite : this.animations.deadLeftSprite);
        } else if (this.isJumping) {
            this.SetSprite((this.dir === 1) ? this.animations.jumpRightSprite : this.animations.jumpLeftSprite);
        } else if (!this.isOnGround) {
            this.SetSprite((this.dir === 1) ? this.animations.fallRightSprite : this.animations.fallLeftSprite);
        } else if (this.isAttacking) {
            this.SetSprite((this.dir === 1) ? this.animations.idleSwipeRightSprite : this.animations.idleSwipeLeftSprite);
        } else if (this.movement !== 0) {
            this.SetSprite((this.dir === 1) ? this.animations.runRightSprite : this.animations.runLeftSprite);
            isRunning = true;
        } else {
            this.SetSprite((this.dir === 1) ? this.animations.idleRightSprite : this.animations.idleLeftSprite);
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

    UpdateLOSRay(playerPos) {
        const bounds = this.GetBounds();

        this.losRay.SetStartPos(bounds.center);
        this.losRay.SetEndPos(playerPos);
    }

    UpdateLastPlayerPosition(playerPos) {
        // Always update the last player location if we have LOS.
        if (this.hasLOSOnPlayer) {
            this.playerLastLocation = new Vector2(playerPos.x, playerPos.y);
        }

        if (this.isTrackingPlayer) {
            console.log(playerPos.x, this.playerLastLocation.x);
        }
    }

    Update(playerPosition) {
        this.movement = 0;

        if (!this.isDead) {

            const playerPos = new Vector2(playerPosition.x, playerPosition.y);
            const bounds = this.GetBounds();
            const xDelta = Math.pow((bounds.center.x - playerPos.x), 2);
            const yDelta = Math.pow((bounds.center.y - playerPos.y), 2);
            const distanceFromPlayer = Math.sqrt(xDelta + yDelta);

            this.UpdateLOSRay(playerPos);
            this.UpdateLastPlayerPosition(playerPos);

            this.isMoving = true;

            // Is tracking the player
            if (this.isTrackingPlayer) {

                // If we still have line of sight, track the player's current movement.
                //  Else track to the last known location
                const trackingPosition = this.hasLOSOnPlayer ? playerPos : this.playerLastLocation;

                // Make sure the bear is running towards the player
                if (
                    (bounds.center.x < trackingPosition.x && this.dir === -1) ||
                    (bounds.center.x > trackingPosition.x && this.dir === 1)
                ) {
                    this.SwitchDirections();
                }

                if (this.isMoving &&
                    this.isOnGround &&
                    (this.isNoChase || Math.abs(bounds.center.x - trackingPosition.x) <= this.attackRange)
                ) {
                    this.isMoving = false;
                }

                // Attack if tracking and in striking distance
                if (distanceFromPlayer <= this.attackRange) {
                    this.MeleeAttack();
                } else {
                    this.isAttacking = false;
                }

                // If we've outrun the enemy, tell them to stop tracking
                if (distanceFromPlayer > 1500) {
                    this.TrackPlayer(false);
                }

                // If the enemy lost line of sight, start a timer and set
                //  tracking to false when it runs out
                if (!this.hasLOSOnPlayer) {

                    if (!this.losLostTimer) {
                        this.losLostTimer = new Timer(GameTime.getCurrentGameTime(), this.losLostDuration);
                    }

                    if (this.losLostTimer.IsComplete()) {
                        this.TrackPlayer(false);
                        this.losLostTimer = undefined;
                    }

                }

            } else {

                this.losLostTimer = undefined;

                // We could see if the enemy is outside of their region and, if so, send them back.
                // Obviously this depends on how far they travelled and whether or not it's even possible to get back.

                // If the player gets too close, go after them
                if (this.hasLOSOnPlayer && distanceFromPlayer <= this.aggroDistance) {
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