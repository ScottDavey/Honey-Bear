/*******************************************
**************  WEAPON CLASS  **************
*******************************************/
class Weapon {

    constructor(pos, dir, scene) {
        this.pos = pos;
        this.size = new Vector2(15, 15);
        this.dir = dir;
        this.scene = scene;
        this.velocity = new Vector2(0, 0);
        this.moveSpeed = 1000.0;
        this.moveAcceleration = 15000.0;

        this.sprite = new Texture(this.pos, this.size, '#EBAFC4', 1, '#EBAFC4');

        /*

            All weapons will:
                - have a cooldown
                - deal damage
                - have sprite/animation
                - movement
                - direction

        */
    }

    ApplyPhysics() {
        const elapsed = GameTime.getElapsed();

        this.velocity.x += this.dir * this.moveAcceleration * elapsed;
        this.velocity.x = Clamp(
            this.velocity.x,
            -this.moveSpeed,
            this.moveSpeed
        );

        this.pos.x += this.velocity.x * elapsed;
        this.pos.x = Math.round(this.pos.x);
    }

    Update() {

        this.ApplyPhysics();

        this.sprite.Update(this.pos);
    }

    Draw() {
        this.sprite.Draw();
    }

}