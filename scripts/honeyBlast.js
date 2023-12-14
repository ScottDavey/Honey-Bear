/************************************************
**************  HONEY BLAST CLASS  **************
************************************************/

class HoneyBlast {

    constructor(playerBounds) {
        this.playerBounds = playerBounds;
        this.position = this.playerBounds.center;
        this.duration = 0.5;
        this.startTime = GameTime.getCurrentGameTime();
        this.isComplete = false;
        this.blastGrowRate = 20;
        this.damage = random(50, 100);
        this.critPercent = 50;
        this.critDamagePercent = 3;
        this.blast = new Circle(
            new Vector2(this.position.x, this.position.y),
            50,
            '#ebaf4cAA',
            '#ebaf4c55'
        );
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
        
        if (!this.isComplete && elapsed < this.duration) {
            this.position = playerCenter;
            this.blast.SetCenter(this.position);
            this.blast.SetRadius(newRadius * 0.8);
        } else {
            this.isComplete = true;
        }
    }

    Draw() {
        if (!this.isComplete) {
            this.blast.Draw();
        }
    }

}