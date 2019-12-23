/*****************************************
**************  GLOB CLASS  **************
*****************************************/

// class HoneyGlob extends Projectile {
class HoneyGlob {
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
        this.size = new Vector2(10, 5);
        this.damage = 10;

        this.velocity = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.movementAcceleration = 9000.0;
        this.maxSpeed = 1200.0;

        this.airDrag = 0.9;

        // Vertical
        this.gravity = 300.0;
        this.maxFallSpeed = 250.0;

        this.hasHit = false;

        this.sprite = new Texture(
            pos,
            this.size,
            '#ebaf4c',
            1,
            '#ebaf4c'
        );

        // Call parent constructor
        // super(pos, this.size, this.damage, this.sprite);
    }

    GetDirection() {
        return this.dir;
    }

    GetDamage() {
        return this.damage;
    }

    GetHasHit() {
        return this.hasHit;
    }

    GetPos() {
        return this.pos;
    }

    SetHasHit(hasHit) {
        this.hasHit = hasHit;
    }

    Update() {
        const elapsed = GameTime.getElapsed();

        // Horizontal Movement
        this.velocity.x += this.dir * this.movementAcceleration;
        this.velocity.x *= this.airDrag;
        this.velocity.x = Clamp(
            this.velocity.x,
            -this.maxSpeed,
            this.maxSpeed
        );

        this.pos.x += this.velocity.x * elapsed;
        this.pos.x = Math.round(this.pos.x);

        // Vertical Movement
        this.velocity.y = Clamp(
            this.velocity.y + this.gravity * elapsed,
            -this.maxFallSpeed,
            this.maxFallSpeed
        );
        // this.velocity.y = this.Arc(this.velocity.y);
        this.pos.y += this.velocity.y * elapsed;
        this.pos.y = Math.round(this.pos.y);

        this.sprite.Update(this.pos);

        // Call parent update
        // super.Update();
    }

    Draw() {

        this.sprite.Draw();

        // Call parent draw
        // super.Draw();
    }

}