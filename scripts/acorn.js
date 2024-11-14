/******************************************
**************  ACORN CLASS  **************
******************************************/

class Acorn {

    constructor(position) {
        this.position = position;
        this.size = new Vector2(27, 35);

        this.velocityY = 0;
        this.gravity = 3000;
        this.maxFallSpeed = 500;
        this.hasHitGround = false;
        this.hasHitPlayer = false;

        this.timer = undefined;
        this.postHitDuration = 2;

        this.damage = random(5000, 10000);

        this.sprite = new Sprite(
            // this.spriteOptions[random(0, this.spriteOptions.length - 1)],
            'images/level_assets/Acorn_1.png',
            this.position,
            this.size
        );
        this.bounds = new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);

        this.newAcornSoundID = `acorn-new-${random(10000, 90000)}`;
        SOUND_MANAGER.AddEffect(this.newAcornSoundID, new Sound(`sounds/effects/ACORN_NEW_${random(1, 3)}.ogg`, 'SFX', true, CANVAS_WIDTH, false, 0.2, false));
        SOUND_MANAGER.PlayEffect(this.newAcornSoundID, this.position);

        this.hitAcornSoundID = `acorn-hit-${random(10000, 90000)}`;
        SOUND_MANAGER.AddEffect(this.hitAcornSoundID, new Sound(`sounds/effects/ACORN_HIT.ogg`, 'SFX', false, null, false, 0.2, false));
    }

    UnloadContent() {
        SOUND_MANAGER.RemoveEffect(this.newAcornSoundID, true);
        SOUND_MANAGER.RemoveEffect(this.hitAcornSoundID, true);
    }
    
    GetPosition() {
        return this.position;
    }

    GetHasHitPlayer() {
        return this.hasHitPlayer;
    }

    GetHasHitGround() {
        return this.hasHitGround;
    }

    GetHasHit() {
        return this.hasHitGround || this.hasHitPlayer;
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
        if (!this.hasHitPlayer) {
            SOUND_MANAGER.PlayEffect(this.hitAcornSoundID);
            this.hasHitPlayer = hasHit;
        }
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
        this.bounds.Update(this.position);

        if (this.position.y > CANVAS_HEIGHT) {
            this.hasHitGround = true;
        }
    }

    Draw() {
        if (!this.hasHitPlayer && !this.hasHitGround) {
            this.sprite.Draw();
        }
    }

}