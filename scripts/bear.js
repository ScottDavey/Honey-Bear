/*****************************************
**************  BEAR CLASS  **************
*****************************************/
class Bear extends Character {

    constructor(position, size) {
        super(position, size, false);

        this.isTrackingPlayer = false;

        this.maxMoveSpeed = 75.0;
        this.isMoving = true;

        // Sprites
        const spritesheet = 'images/spritesheets/Adventurer-1.5/adventurer-spritesheet.png';
        this.runRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 6, 0, 0.15, 1, new Vector2(26, 7));
        this.runLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 6, 1, 0.15, 1, new Vector2(26, 7));
        this.idleRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 4, 2, 0.3, 1, new Vector2(26, 7));
        this.idleLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 4, 3, 0.3, 1, new Vector2(26, 7));
        this.jumpLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 4, 4, 0.25, 1, new Vector2(26, 7));
        this.jumpRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 4, 5, 0.25, 1, new Vector2(26, 7));
        this.fallLeftSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 2, 6, 0.25, 1, new Vector2(26, 7));
        this.fallRightSprite = new Nimation(spritesheet, new Vector2(this.position.x, this.position.y), 74, 100, 2, 7, 0.25, 1, new Vector2(26, 7));
        this.sprite = this.idleSprite;
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

    // BEHAVIOURS

    SwitchDirections() {
        this.dir = (this.dir === 1) ? -1 : 1;
    }

    TrackPlayer(isTracking) {
        this.isTrackingPlayer = isTracking;

        if (isTracking) {
            this.SetMaxMoveSpeed(150.0);
            this.runRightSprite.SetSpeed(0.07);
            this.runLeftSprite.SetSpeed(0.07);
        } else {
            this.SetMaxMoveSpeed(75.0);
            this.runRightSprite.SetSpeed(0.5);
            this.runLeftSprite.SetSpeed(0.5);
        }
    }

    HandleAnimations() {
        if (this.isDead) {
            this.sprite = (this.dir === 1) ? this.idleRightSprite : this.idleLeftSprite;
        } else if (this.isJumping) {
            this.sprite = (this.dir === 1) ? this.jumpRightSprite : this.jumpLeftSprite;
        } else if (!this.isOnGround) {
            this.sprite = (this.dir === 1) ? this.fallRightSprite : this.fallLeftSprite;
        } else if (this.movement !== 0) {
            this.sprite = (this.dir === 1) ? this.runRightSprite : this.runLeftSprite;
        } else {
            this.sprite = (this.dir === 1) ? this.idleRightSprite : this.idleLeftSprite;
        }
    }

    Update(playerPosition) {
        this.movement = 0;

        if (!this.isDead) {

            // Is tracking the player
            if (this.isTrackingPlayer) {

                // Move towards the player's x position. If we're hitting a wall, execute a jump.
                const posX = this.position.x;
                const playerPosX = playerPosition.x;
                const posXDiff = posX - playerPosX;

                if (posXDiff < 0 && this.dir === -1 || posXDiff > 0 && this.dir === 1) {
                    this.SwitchDirections();
                }

                this.isMoving = true;

                // If the enemy is right on top of the player, stop moving
                if (this.isMoving && posXDiff > -75 && posXDiff < 75) {
                    this.isMoving = false;
                }

                // If we've outrun the enemy, tell them to stop tracking
                if (posXDiff < -1500 || posXDiff > 1500) {
                    this.TrackPlayer(false);
                }

                if (this.isHittingWall && !this.isKnockingBack && !this.GetIsStunned()) this.isJumping = true;

            } else {

                // We could see if the enemy is outside of their region and, if so, send them back.
                // Obviously this depends on how far they travelled and whether or not it's even possible to get back.

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

        }

        this.HandleAnimations();

        super.Update();
    }

    Draw() {
        super.Draw();
    }

}