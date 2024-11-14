/*****************************************
**************  GLOB CLASS  **************
*****************************************/

class HoneyGlob {
    constructor(pos, dir, playerVelocityX) {
        this.position = pos;
        this.dir = dir;
        this.size = new Vector2(4, 4);
        this.damage = random(DAMAGE.HONEY_GLOB[0], DAMAGE.HONEY_GLOB[1]);
        this.critPercent = 30;
        this.critDamagePercent = 2;

        this.velocity = new Vector2(0, -100);
        this.movementAcceleration = 9000.0;
        this.playerVelocityX = Math.abs(playerVelocityX);
        this.maxSpeed = 400.0 + (this.playerVelocityX || 0);

        this.airDrag = 0.09;

        // Vertical
        this.gravity = 300.0;
        this.maxFallSpeed = 250.0;

        this.hasHit = false;
        this.hitLocation = new Vector2(0, 0);
        this.isDone = false;
        this.hitAnimation = new Nimation('images/spritesheets/HoneyGlob_Splat_Spritesheet.png', this.position, 20, 20, 5, 0, 0.01, false, new Vector2(0, 0));

        this.sprite = new Circle(pos, 4, '#ebaf4c', '#ebaf4c');

        this.rect = new Rectangle(this.position.x + 2, this.position.y + 2, this.size.x - 2, this.size.y - 2);

        // SOUNDS
        this.honeyGlobSoundID = `glob-${random(10000, 90000)}`;
        SOUND_MANAGER.AddEffect(this.honeyGlobSoundID, new Sound(`sounds/effects/SPLAT_${random(1, 3)}.ogg`, 'SFX', true, CANVAS_WIDTH, false, 0.2, true));
        
    }

    UnloadContent() {
        SOUND_MANAGER.RemoveEffect(this.honeyGlobSoundID, true);
    }

    GetDirection() {
        return this.dir;
    }

    GetDamage() {
        const isCrit = (random(0, 100) <= this.critPercent);
        const critPercent = isCrit ? this.critDamagePercent : 1;
        const amount = this.damage * critPercent;
        return { amount, isCrit };
    }

    GetCritDamage() {
        return this.damage * this.critDamagePercent;
    }

    GetHasHit() {
        return this.hasHit;
    }

    GetIsDone() {
        return this.isDone;
    }

    GetPosition() {
        return this.position;
    }

    GetSize() {
        return this.size;
    }

    GetRect() {
        return this.rect;
    }

    SetHasHit(hasHit) {            
        SOUND_MANAGER.PlayEffect(this.honeyGlobSoundID, this.position);
        this.hasHit = hasHit;
        this.hitLocation = new Vector2(this.position.x, this.position.y);
    }

    Update() {
        const elapsed = GameTime.getElapsed();

        if (!this.hasHit) {
            // Horizontal Movement
            this.velocity.x += this.dir * this.movementAcceleration;
            this.velocity.x *= this.airDrag;
            this.velocity.x = Clamp(
                this.velocity.x,
                -this.maxSpeed,
                this.maxSpeed
            );
    
            this.position.x += this.velocity.x * elapsed;
            this.position.x = Math.round(this.position.x);
    
            // Vertical Movement
            this.velocity.y = Clamp(
                this.velocity.y + this.gravity * elapsed,
                -this.maxFallSpeed,
                this.maxFallSpeed
            );
            // this.velocity.y = this.Arc(this.velocity.y);
            this.position.y += this.velocity.y * elapsed;
            this.position.y = Math.round(this.position.y);
    
            this.sprite.SetCenter(this.position);
            this.rect.Update(this.position);

            this.hitAnimation.SetPosition(this.position);

        } else if (!this.isDone && !this.hitAnimation.GetIsDone()) {
            this.hitAnimation.Update(new Vector2(this.hitLocation.x - 10, this.hitLocation.y - 10));

            if (this.hitAnimation.GetIsDone()) {
                this.isDone = true;
            }
        }
    }

    Draw() {    
        
        if (!this.hasHit) {
            this.sprite.Draw();
        } else if (!this.isDone && !this.hitAnimation.GetIsDone()) {
            this.hitAnimation.Draw();
        }
    }

}