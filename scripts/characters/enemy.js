/******************************************
**************  ENEMY CLASS  **************
******************************************/
class Enemy extends Moveable {

    constructor(data = { start: new Vector2(150, 150), size: new Vector2(50, 68), region: { pos: new Vector2(0, 0), size: new Vector2(300, 1000) } }, scene) {
        // Call parent constructor
        super(data.start, data.size, scene);

        // Update some inherited vars
        this.maxMoveSpeed = 75.0;
        this.knockBackBurst = 250;

        // Animation sprites
        const spritesheet = document.createElement('img');
        spritesheet.setAttribute('src', 'images/spritesheets/Adventurer-1.5/enemy-spritesheet.png');

        this.runRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 6, 0, 0.15, 1, new Vector2(26, 7));
        this.runLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 6, 1, 0.15, 1, new Vector2(26, 7));
        this.idleRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 2, 0.3, 1, new Vector2(26, 7));
        this.idleLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 3, 0.3, 1, new Vector2(26, 7));
        this.jumpLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 4, 0.25, 1, new Vector2(26, 7));
        this.jumpRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 5, 0.25, 1, new Vector2(26, 7));
        this.fallLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 2, 6, 0.25, 1, new Vector2(26, 7));
        this.fallRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 2, 7, 0.25, 1, new Vector2(26, 7));

        this.sprite = this.idleSprite;

        // member vars
        this.isMoving = true;

        this.region = data.region;
        this.region.bounds = new Rectangle(this.region.pos.x, this.region.pos.y, this.region.size.x, this.region.size.y);

        this.pitfalls = scene.GetPitfalls();

        this.isTrackingPlayer = false;

    }

    GetPosition() {
        return super.GetPosition();
    }

    GetIsTracking() {
        return this.isTrackingPlayer;
    }

    DoDamage(weapon) {
        super.DoDamage(weapon);
    }

    HandleCollision() {
        const bounds = new Rectangle(this.pos.x, this.pos.y, this.size.x, this.size.y);

        if (!this.isTrackingPlayer) {
            // Check if we've collided with our region. If so, switch directions.
            if (bounds.left <= this.region.bounds.left) {
                this.pos.x += 2;
                this.SwitchDirections();
            } else if (bounds.right >= this.region.bounds.right) {
                this.pos.x -= 2;
                this.SwitchDirections();
            }
        }

        // Handle Pitfalls
        this.isMoving = true; // Assume true until proven otherwise

        for (const pitfall of this.pitfalls) {

            const intersectionDepth = bounds.GetIntersectionDepth(pitfall);

            if (intersectionDepth.x !== 0 && intersectionDepth.y !== 0) {

                if (((bounds.center.x - pitfall.center.x) < 0 && this.dir === 1) || ((bounds.center.x - pitfall.center.x > 0) && this.dir === -1)) {

                    const absDepthX = Math.abs(intersectionDepth.x);
                    const absDepthY = Math.abs(intersectionDepth.y);

                    if (absDepthY < absDepthX || absDepthX < absDepthY) {
                        if (this.isTrackingPlayer) {
                            // Stop the enemy.
                            this.isMoving = false;
                        } else {
                            this.SwitchDirections();
                        }
                    }

                }

            }


        }

        // Call parent function
        super.HandleCollision();
    }

    SwitchDirections() {
        this.dir = (this.dir === 1) ? -1 : 1;
    }

    TrackPlayer(isTracking) {
        this.isTrackingPlayer = isTracking;

        if (isTracking) {
            this.SetMaxMoveSpeed(150.0);
            this.runRightSprite.SetSpeed(0.07);
            this.runRightSprite.SetSpeed(0.07);
        } else {
            this.SetMaxMoveSpeed(75.0);
            this.runRightSprite.SetSpeed(0.5);
            this.runRightSprite.SetSpeed(0.5);
        }
    }

    UpdatePosition(pos) {
        this.pos = new Vector2(pos.x, pos.y);
    }

    Update(playerPos) {
        this.sprite = this.idleSprite;

        // Jump, randomly
        // if (random(0, 500) === 5) this.isJumping = true;

        // Is tracking the player
        if (this.isTrackingPlayer) {

            // Move towards the player's x position. If we're hitting a wall, execute a jump.
            const posX = this.pos.x;
            const playerPosX = playerPos.x;
            const posXDiff = posX - playerPosX;

            if (posXDiff < 0 && this.dir === -1 || posXDiff > 0 && this.dir === 1) {
                this.SwitchDirections();
            }

            // If the enemy is right on top of the player, stop moving
            if (this.isMoving && posXDiff > -50 && posXDiff < 50) {
                this.isMoving = false;
            }

            // If we're outrun the enemy, tell them to stop tracking
            if (posXDiff < -1500 || posXDiff > 1500) {
                this.TrackPlayer(false);
            }

            if (this.isHittingWall) this.isJumping = true;

        } else {

            // We could see if the enemy is outside of their region and, if so, send them back.
            // Obviously this depends on how far they travelled and whether or not it's even possible to get back.

            // If we're not tracking the player and we're hitting a wall, switch directions
            if (this.isHittingWall) this.SwitchDirections();
        }

        if (this.isMoving) {
            this.movement = this.dir;
        }

        if (this.isJumping) {
            this.sprite = (this.dir === 1) ? this.jumpRightSprite : this.jumpLeftSprite;
        } else if (!this.isOnGround) {
            this.sprite = (this.dir === 1) ? this.fallRightSprite : this.fallLeftSprite;
        } else if (this.movement !== 0) {
            this.sprite = (this.dir === 1) ? this.runRightSprite : this.runLeftSprite;
        } else {
            this.sprite = (this.dir === 1) ? this.idleRightSprite : this.idleLeftSprite;
        }

        // Call parent function
        super.Update();
    }

    Draw() {

        // Call parent function
        super.Draw();

        // this.regionTexture.Draw();
    }

}