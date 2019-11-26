/***********************************************
**************  PROJECTILE CLASS  **************
***********************************************/

class Projectile extends Ability {
    constructor(pos, size, damage, sprite) {
        this.pos = pos;
        this.size = size;
        this.damage = damage;
        this.sprite = sprite;

        super();
    }

    GetProjectiles() {

    }

    Fire() {

        super.Fire();
    }

    DoDamage() {

        super.DoDamage();
    }

    Update(pos) {
        this.pos = pos;
    }

}