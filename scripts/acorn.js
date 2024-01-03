/******************************************
**************  ACORN CLASS  **************
******************************************/

class Acorn {

    constructor(position) {
        this.position = position;
        this.size = new Vector2(15, 15);

        this.velocityY = 0;
        this.gravity = 3000;
        this.maxFallSpeed = 500;
        this.hasHitGround = false;
        this.hasHitPlayer = false;

        this.damage = random(50, 100);
        
        this.sprite = new Texture(
            new Vector2(this.position.x, this.position.y),
            new Vector2(this.size.x, this.size.y),
            '#FF880088',
            1,
            '#FF8800'
        );
        this.bounds = new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }
    
    GetPosition() {
        return this.position;
    }

    GetHasHitPlayer() {
        return this.hasHitPlayer;
    }

    GetBounds() {
        return this.bounds;
    }

    GetDamage() {
        return {
            amount: this.damage,
            isCrit: false
        }
    }

    SetHasHitPlayer(hasHit) {
        this.hasHitPlayer = hasHit;
    }

    Update() {
        const elapsed = GameTime.getElapsed();

        this.velocityY = Clamp(
            this.velocityY + this.gravity * elapsed,
            -this.maxFallSpeed,
            this.maxFallSpeed
        );

        this.position.y += this.velocityY * elapsed;
        this.position.y = Math.round(this.position.y);

        this.sprite.Update(this.position);
        this.bounds.Update(this.position, this.size);
    }

    Draw() {
        this.sprite.Draw();
    }

}