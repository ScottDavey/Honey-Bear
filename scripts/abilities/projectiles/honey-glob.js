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
        this.movementAcceleration = 9000.0;
        this.maxSpeed = 900.0;

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

    GetDamage() {
        return this.damage;
    }

    GetHasHit() {
        return this.hasHit;
    }

    SetHasHit(hasHit) {
        this.hasHit = hasHit;
    }

    Update() {
        const elapsed = GameTime.getElapsed();

        this.velocity.x += this.dir * this.movementAcceleration * elapsed;
        this.velocity.x = Clamp(
            this.velocity.x,
            -this.maxSpeed,
            this.maxSpeed
        );

        this.pos.x += this.velocity.x * elapsed;
        this.pos.x = Math.round(this.pos.x);

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