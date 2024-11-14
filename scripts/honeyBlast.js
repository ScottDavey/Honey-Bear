/************************************************
**************  HONEY BLAST CLASS  **************
************************************************/

class HoneyBlast {

    constructor(playerBounds) {
        this.playerBounds = playerBounds;
        this.position = this.playerBounds.center;
        this.duration = 0.75;
        this.delay = 0.2;
        this.startTime = GameTime.getCurrentGameTime();
        this.hasStarted = false;
        this.isComplete = false;
        this.blastGrowRate = 20;
        this.damage = random(DAMAGE.HONEY_BLAST[0], DAMAGE.HONEY_BLAST[1]);
        this.critPercent = 50;
        this.critDamagePercent = 2;
        this.blast = new Circle(
            new Vector2(this.position.x, this.position.y),
            0,
            '#ebaf4cAA',
            '#ebaf4c55'
        );
        this.spriteSize = new Vector2(250, 250);
        this.spritePosition = new Vector2(this.position.x - this.spriteSize.x / 2, this.position.y - this.spriteSize.y / 2);
        this.sprite = new Nimation(
            'images/spritesheets/HoneyBlast_Spritesheet.png',
            new Vector2(this.spritePosition.x, this.spritePosition.y),
            this.spriteSize.y,
            this.spriteSize.x,
            5,
            0,
            0.03,
            false,
            new Vector2(0, 0)
        );
        this.soundID = `honey-blast-${10000, 90000}`;
        SOUND_MANAGER.AddEffect(this.soundID, new Sound('sounds/effects/HONEY_BLAST.ogg', 'SFX', false, null, false, 0.3, false));
    }

    GetCircle() {
        return this.blast;
    }

    GetDamage() {
        const isCrit = (random(0, 100) <= this.critPercent);
        const critPercent = isCrit ? this.critDamagePercent : 1;
        const amount = this.damage * critPercent;
        return { amount, isCrit };
    }

    GetPosition() {
        return this.position;
    }

    GetBlastRadius() {
        return this.blast.GetRadius();
    }

    IsComplete() {
        return this.isComplete;
    }

    Update(playerCenter) {
        const currentGameTime = GameTime.getCurrentGameTime();
        const elapsed = currentGameTime - this.startTime;
        const currentRadius = this.blast.GetRadius();
        const newRadius = currentRadius + this.blastGrowRate;
        
        // this.position = playerCenter;

        if (elapsed >= this.delay) {
            this.hasStarted = true;

            SOUND_MANAGER.PlayEffect(this.soundID);

            if (!this.isComplete && elapsed < this.duration) {
                // this.blast.SetCenter(this.position);
                this.sprite.Update(this.spritePosition);
                this.blast.SetRadius(newRadius * 0.8);
            } else {
                this.isComplete = true;
                SOUND_MANAGER.RemoveEffect(this.soundID);
            }
        }
    }

    Draw() {
        if (!this.isComplete && this.hasStarted) {
            this.blast.Draw();
            this.sprite.Draw();
        }
    }

}