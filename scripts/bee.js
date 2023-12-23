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

        this.BEE_STATE = {
            HOME: {
                CALM: 0,
                HIGH_ALERT: 1,
            },
            AGGRESSIVE: 2,
            DYING: 3,
            DEAD: 4
        };
        this.state = this.BEE_STATE.HOME.CALM;

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

        this.isDead = false;
        this.health = 800;
        this.statusText = [];

        this.dirX = 1;
        this.dirY = 1;
        this.trackingMoveSpeed = 200;
        this.moveSpeed = 100;
        this.wanderSpeed = 100;

        this.aggressiveSpeed = 200;
        this.aggressiveVolume = 0.3;
        this.stingDamage = random(5, 10);
        this.stingCooldownDuration = 2;
        this.stingDelay = +((this.stingCooldownDuration * (random(1, 100) / 100)).toFixed(1));
        this.isStinging = false;
        this.stingCooldown = undefined;

        this.buzzSound = new Sound(`sounds/effects/bee_${random(1, 4)}.ogg`, true, true, false, 0, 0);
        this.buzzSound.Play();
        this.maxVolumneDistance = 400;
        this.buzzDefaultVolume = 0.15;
        this.buzzMaxVolume = this.buzzDefaultVolume;
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

    GetIsAggressive() {
        return this.state === this.BEE_STATE.AGGRESSIVE;
    }

    GetIsDead() {
        return this.isDead;
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
            this.state = this.BEE_STATE.AGGRESSIVE;
            speed = this.aggressiveSpeed;
            volume = this.aggressiveVolume;
        } else if (this.state === this.BEE_STATE.AGGRESSIVE) {
            this.state = this.BEE_STATE.HOME.HIGH_ALERT;
            speed = this.wanderSpeed;
            volume = this.buzzDefaultVolume;
        }

        this.moveSpeed = speed;
        this.buzzMaxVolume = volume;
    }

    SetIsDead() {
        this.buzzSound.Stop();
        this.buzzSound = undefined;
        this.isDead = true;
    }

    StingAttack() {
        this.isStinging = false;
        
        if (this.stingCooldown && this.stingCooldown.IsComplete()) {
            this.isStinging = true;
        }

        if (!this.stingCooldown || this.stingCooldown.IsComplete()) {
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

        if (this.health <= 0) {
            this.SetIsDead();
        }
    }
    
    UpdateProximityVolume() {
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
        this.buzzSound.SetVolumne(volume);
    }

    UpdateHivePosition(position) {
        this.hivePosition = new Vector2(position.x, position.y);
        // this.UpdateWanderArea(this.hivePosition);
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
                this.state !== this.BEE_STATE.AGGRESSIVE &&
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

    Update(hivePosition, playerCenter) {
        this.hivePosition = hivePosition;
        this.playerCenter = playerCenter;

        const diffPlayerPos = new Vector2(
            this.position.x - this.playerCenter.x,
            this.position.y - this.playerCenter.y
        );
        const isCloseToPlayer = (Math.abs(diffPlayerPos.x) < 50 && Math.abs(diffPlayerPos.y) < 50);

        if (this.state < this.BEE_STATE.AGGRESSIVE) {
            this.UpdateWanderArea(this.hivePosition);
        }

        if (this.state === this.BEE_STATE.AGGRESSIVE) {
            this.UpdateWanderArea(this.playerCenter);
    
            if (isCloseToPlayer) {
                this.StingAttack();
            }
        }
        
        if (isCloseToPlayer && this.state === this.BEE_STATE.HOME.HIGH_ALERT) {
            console.log('HIGH ALERT');
            this.SetAggressive(true);
        }

        this.ApplyMovement();
        this.bounds.Update(new Vector2(this.position.x, this.position.y), this.size);
        this.UpdateProximityVolume();
    }

    Draw() {
        this.texture.Draw();
    }

}