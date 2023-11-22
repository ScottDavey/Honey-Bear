/*******************************************
**************  ENTITY CLASS  **************
*******************************************/

class Entity {
    constructor(pos, size, canBeDamaged = true, isPlayer = false) {

        // Create some default variables
        this.isPlayer = isPlayer;
        this.pos = new Vector2(pos.x, pos.y);
        this.size = new Vector2(size.x, size.y);
        this.canBeDamaged = canBeDamaged;

        if (this.canBeDamaged) {
            // Health
            this.isDead = false;
            this.isInvincible = false;
            this.invincibilityStart = 0;
            this.health = 300000;
            this.maxHealth = 300000;
            this.healthBar = new Texture(
                new Vector2(this.pos.x, this.pos.y - 15),
                new Vector2(this.size.x, 10),
                '#009900',
                0,
                null
            );
        }

        this.sprite = undefined;
        this.damageText = [];

    }

    //  GETTERS and SETTERS

    SetSprite(sprite) {
        this.sprite = sprite;
    }

    SetPos(pos) {
        this.pos = pos;
    }

    SetSize(size) {
        this.size = size;
        if (this.canBeDamaged) {
            this.healthBar.SetSize(new Vector2(size.x, 10));
        }
    }

    GetPos() {
        return this.pos;
    }

    GetSize() {
        return this.size;
    }

    SetColor(fill, borderSize, border) {
        this.sprite.SetColor(fill);
        this.sprite.SetBorder(border, borderSize);
    }

    IsDead() {
        return this.isDead;
    }

    // BEHAVIOURS

    DoDamage(weapon) {
        const damage = weapon.GetDamage();

        if (this.canBeDamaged) {
            this.health = this.health - damage.amount;
            this.damageText.push(new DamageText(damage.amount, damage.isCrit, this.pos, this.isPlayer));
            const healthBarSizeX = (this.size.x * (this.health / this.maxHealth) < 0) ? 0 : this.size.x * (this.health / this.maxHealth);
            this.health = (this.health < 0) ? 0 : this.health;
            this.healthBar.SetSize(new Vector2(healthBarSizeX, 10));

            if (this.health <= 0) {
                this.isDead = true;
            }
        }

    }

    // UPDATE and DRAW

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        // Update our health bar and sprite textures
        if (this.canBeDamaged) {
            this.healthBar.Update(new Vector2(this.pos.x, this.pos.y - 15));
        }
        if (this.sprite) this.sprite.Update(this.pos);

        for (let d = 0; d < this.damageText.length; d ++) {
            const dt = this.damageText[d];

            if (!dt.IsComplete()) {
                dt.Update(currentGameTime);
            } else {
                this.damageText.splice(d, 1);
                console.log(`${d} was deleted!`);
            }
        }

    }

    Draw() {
        if (this.sprite) this.sprite.Draw();
        if (this.canBeDamaged) {
            this.healthBar.Draw();
        }
        for (const dt of this.damageText) {
            dt.Draw();
        }
    }

}