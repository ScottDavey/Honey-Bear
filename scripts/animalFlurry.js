/**************************************************
**************  ANIMAL FLURRY CLASS  **************
**************************************************/

class AnimalFlurry {

    constructor(position, dir) {
        this.dir = dir;
        this.size = new Vector2(150, 150);
        this.position = new Vector2(
            (this.dir < 1) ? position.x - 40 : position.x + (this.size.x + 40),
            position.y + this.size.y + 15
        );
        this.hasHitPlayer = false;
        this.damage = random(5000, 10000);
        
        this.moveSpeed = 300;
        this.acceleration = 1000;
        this.friction = 0.8;
        this.velocityX = 0;

        this.sprite = new Nimation(
            'images/spritesheets/AnimalFlurry.png',
            new Vector2(this.position.x + 20, this.position.y + (this.size.y - 75)),
            150,
            150,
            2,
            0,
            0.1,
            true,
            new Vector2(0, 0)
        );
        this.boundsOffset = this.GetBoundsOffset();
        this.bounds = new Rectangle(
            this.boundsOffset.position.x,
            this.boundsOffset.position.y,
            this.boundsOffset.size.x,
            this.boundsOffset.size.y
        );
    }

    GetBoundsOffset() {
        return {
            position: new Vector2(
                this.position.x + 30,
                this.position.y + 30
            ),
            size: new Vector2(
                this.size.x - 50,
                this.size.y - 50
            )
        };
    }

    GetPosition() {
        return this.position;
    }

    GetBounds() {
        return this.bounds;
    }

    GetHasHitPlayer() {
        this.hasHitPlayer;
    }

    GetDamage() {
        return {
            amount: this.damage,
            isCrit: false
        };
    }

    SetHasHitPlayer(hasHit) {
        this.hasHitPlayer = hasHit;
    }

    Update() {
        const elapsed = GameTime.getElapsed();

        // Apply movement
        this.velocityX += this.dir * this.acceleration;
        this.velocityX *= this.friction;
        this.velocityX = Clamp(
            this.velocityX,
            -this.moveSpeed,
            this.moveSpeed
        );

        this.position.x += this.velocityX * elapsed;
        this.position.x = Math.round(this.position.x);

        this.sprite.Update(this.position);
        
        const boundsOffset = this.GetBoundsOffset();
        this.bounds.Update(boundsOffset.position);
    }

    Draw() {
        this.sprite.Draw();
    }

}