/*****************
*****  BEES  *****
*****************/

class Bee {

    constructor(position) {
        this.position = position;
        this.hivePosition = new Vector2(this.position.x, this.position.y);
        this.playerCenter = new Vector2(0, 0);
        this.size = new Vector2(2.5, 5);
        this.bounds = new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);

        this.state = BEE_STATE.HOME.CALM;

        this.minWanderDistance = undefined;
        this.maxWanderDistance = undefined;
        this.UpdateWanderArea(this.hivePosition);

        this.texture = new Texture(
            this.position,
            this.size,
            '#FFC43666',
            1,
            '#000000'
        );
        this.currentTarget = this.GetRandomTarget();
        this.isPausing = false;
        this.pauseChance = 5;
        this.pauseTimer = undefined;

        this.health = 800;
        this.statusText = [];

        this.dirX = 1;
        this.dirY = 1;
        this.trackingMoveSpeed = 200;
        this.moveSpeed = 100;
        this.wanderSpeed = 100;

        // For death sequence
        this.velocity = new Vector2(0, 0);
        this.gravity = 3000;
        this.fallSpeed = 1000;
        this.isOnGround = false;
        this.groundType = undefined;
        this.isHittingWall = false;

        this.aggressiveSpeed = 200;
        this.aggressiveVolume = 0.2;
        this.stingDamage = random(50, 100);
        this.stingCooldownDuration = 2;

        this.stingDelay = +((this.stingCooldownDuration * (random(1, 100) / 100)).toFixed(1));
        this.isStinging = false;
        this.stingCooldown = undefined;

        this.deathTimer = undefined;

        this.buzzSound = new Sound(`sounds/effects/bee_${random(1, 4)}.ogg`, 'SFX', true, true, 0, 0);
        this.buzzSound.Play();
        this.maxVolumneDistance = 400;
        this.buzzDefaultVolume = 0.1;
        this.buzzMaxVolume = this.buzzDefaultVolume;
    }
    
    UnloadContent() {
        this.buzzSound.Stop();
        this.buzzSound = undefined;
    }

    Reset() {
        this.SetAggressive(false);
        this.buzzMaxVolume = this.buzzDefaultVolume;
        this.UpdateWanderArea(this.hivePosition);
        this.isStinging = false;
        this.stingCooldown = undefined;
        this.moveSpeed = this.wanderSpeed;
    }

    GetRandomTarget() {
        return new Vector2(
            random(this.minWanderDistance.x, this.maxWanderDistance.x),
            random(this.minWanderDistance.y, this.maxWanderDistance.y)
        );
    }

    GetDamage() {
        return { amount: this.stingDamage, isCrit: false };
    }

    GetBounds() {
        return this.bounds;
    }

    GetState() {
        return this.state;
    }

    SetAggressive(isAggressive) {
        let speed, volume;
        
        if (isAggressive) {
            this.state = BEE_STATE.AGGRESSIVE;
            speed = this.aggressiveSpeed;
            volume = this.aggressiveVolume;
        } else if (this.state === BEE_STATE.AGGRESSIVE) {
            this.state = BEE_STATE.HOME.HIGH_ALERT;
            speed = this.wanderSpeed;
            volume = this.buzzDefaultVolume;
        }

        this.moveSpeed = speed;
        this.buzzMaxVolume = volume;
    }

    SetGroundType(groundType) {
        this.groundType = groundType;
    }

    StingAttack() {
        this.isStinging = false;

        if (!this.isStinging && (!this.stingCooldown || this.stingCooldown.IsComplete())) {
            this.isStinging = true;
            this.stingCooldown = new Timer(GameTime.getCurrentGameTime(), this.stingCooldownDuration);
        }
    }

    IsStinging() {
        return this.isStinging;
    }

    DoDamage(damage) {       
        this.health -= damage.amount;
        this.health = (this.health < 0) ? 0 : this.health;

        this.statusText.push(
            new StatusText(
                'DAMAGE',
                damage.amount,
                damage.isCrit,
                this.position,
                0
            )
        );

        if (this.health <= 0 && this.state !== BEE_STATE.DEAD) {
            this.buzzSound.Stop();
            this.buzzSound = undefined;
            this.state = BEE_STATE.DYING;
        }
    }

    UpdateHivePosition(position) {
        this.hivePosition = new Vector2(position.x, position.y);
    }

    UpdateWanderArea(area) {
        this.minWanderDistance = new Vector2(
            area.x - 50,
            area.y - 20
        );
        this.maxWanderDistance = new Vector2(
            area.x + 15 + 50,
            area.y + 20 + 20
        );
    }

    ApplyMovement() {
        const elapsed = GameTime.getElapsed();

        if (this.pauseTimer && this.pauseTimer.IsComplete()) {
            this.isPausing = false;
        }

        if (!this.isPausing) {

            // Get the difference between current position and target
            const posDiff = new Vector2(
                this.position.x - this.currentTarget.x,
                this.position.y - this.currentTarget.y
            );
            const shouldPause = 
                this.state !== BEE_STATE.AGGRESSIVE &&
                random(0 ,100) < this.pauseChance;
            
            this.dirX = posDiff.x < 0 ? 1 : -1;
            this.dirY = posDiff.y < 0 ? 1 : -1;

            this.position.x += this.dirX * this.moveSpeed * elapsed;
            this.position.y += this.dirY * this.moveSpeed * elapsed;

            if (Math.abs(posDiff.x) < 5 && Math.abs(posDiff.y) < 5) {

                if (shouldPause) {
                    this.isPausing = true;
                    this.pauseTimer = new Timer(GameTime.getCurrentGameTime(), 1);
                } else {
                    this.currentTarget = this.GetRandomTarget();
                }
            }

        }
    }

    HandleDeath() {
        const elapsed = GameTime.getElapsed();
        // Apply gravity. The level will check for collision and set "isOnGround"
        this.velocity.y = Clamp(
            this.velocity.y + this.gravity * elapsed,
            -this.fallSpeed,
            this.fallSpeed
        );
        this.position.y += this.velocity.y * elapsed;
        this.position.y = Math.round(this.position.y);

        if (this.isOnGround) {
            if (!this.deathTimer) {
                this.deathTimer = new Timer(GameTime.getCurrentGameTime(), 3);
            }

            if (this.deathTimer.IsComplete()) {
                this.deathTimer = undefined;
                this.state = BEE_STATE.DEAD;
            }
        }
    }

    UpdateProximityVolume() {

        if (!this.buzzSound) {
            return;
        }

        const deltaX = Math.pow(this.position.x - this.playerCenter.x, 2);
        const deltaY = Math.pow(this.position.y - this.playerCenter.y, 2);
        const delta = Math.sqrt(deltaX + deltaY);

        let volume = 0;

        if (delta < this.maxVolumneDistance) {

            if (!this.buzzSound.IsPlaying()) {
                this.buzzSound.Play();
            }

            volume = this.buzzMaxVolume - (this.buzzMaxVolume * (delta / this.maxVolumneDistance));
            volume = (volume >= this.buzzMaxVolume) ? this.buzzMaxVolume : volume;
        } else {

            this.buzzSound.Stop();

        }

        // Based on the player's distance from the bee, set volume
        this.buzzSound.SetVolume(volume);
    }

    Update(hivePosition, hiveState, playerCenter) {
        this.hivePosition = hivePosition;
        this.playerCenter = playerCenter;

        // Get the difference in position between the bee and the player
        const diffPlayerPos = new Vector2(
            this.position.x - this.playerCenter.x,
            this.position.y - this.playerCenter.y
        );
        const isCloseToPlayer = (Math.abs(diffPlayerPos.x) < 50 && Math.abs(diffPlayerPos.y) < 50);

        if (this.state < BEE_STATE.AGGRESSIVE) {
            this.UpdateWanderArea(this.hivePosition);
        }

        if (this.state === BEE_STATE.AGGRESSIVE) {
            this.UpdateWanderArea(this.playerCenter);
    
            if (isCloseToPlayer) {
                this.StingAttack();
            }

        }
        
        // Regardless of state, make sure we reset bee's stinging
        if (this.isStinging) {
            if (this.stingCooldown && this.stingCooldown.IsComplete()) {
                this.isStinging = false; // Reset after the cooldown
            }
        }
        
        if (isCloseToPlayer && this.state === BEE_STATE.HOME.HIGH_ALERT) {
            this.SetAggressive(true);
        }

        if (this.state === BEE_STATE.DYING) {
            this.HandleDeath();
        }

        this.ApplyMovement();
        this.bounds.Update(new Vector2(this.position.x, this.position.y), this.size);

        this.UpdateProximityVolume();
    }

    Draw() {
        this.texture.Draw();
    }

}