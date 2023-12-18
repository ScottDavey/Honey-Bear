/*****************
*****  BEES  *****
*****************/

class Bee {

    constructor(position) {
        this.position = position;
        this.hivePosition = new Vector2(this.position.x, this.position.y);
        this.size = new Vector2(2.5, 5);
        this.hiveCenter = new Vector2(
            this.hivePosition.x + 15,
            this.hivePosition.y + 20
        );
        this.texture = new Texture(
            this.position,
            this.size,
            '#88000066',
            1,
            '#880000'
        );
        this.currentTarget = this.GetRandomTarget();
        this.isPausing = false;
        this.pauseChance = 5;
        this.pauseTimer = undefined;

        this.dirX = 1;
        this.dirY = 1;
        this.moveSpeed = 10;
    }

    GetRandomTarget() {
        return new Vector2(
            random(this.hiveCenter.x, this.hiveCenter.x + 200),
            random(this.hiveCenter.y, this.hiveCenter.y + 200)
        );
    }

    Update() {
        const elapsed = GameTime.getElapsed();

        if (this.pauseTimer && this.pauseTimer.IsComplete()) {
            this.isPausing = false;
        }

        if (!this.isPausing) {

            // Get the difference between current position and target
            const posDiff = new Vector2(
                this.position.x - this.currentTarget.x,
                this.position.y - this.currentTarget.y
            );
            
            this.dirX = posDiff.x < 0 ? 1 : -1;
            this.dirY = posDiff.y < 0 ? 1 : -1;

            this.position.x += this.dirX * this.moveSpeed * elapsed;
            this.position.y += this.dirY * this.moveSpeed * elapsed;

            if (posDiff.x < 5 && posDiff.y < 5) {

                if (random(0 ,100) < this.pauseChance) {
                    console.log('IS PAUSING');
                    this.isPausing = true;
                    this.pauseTimer = new Timer(GameTime.getCurrentGameTime(), 2);
                } else {
                    this.currentTarget = this.GetRandomTarget();
                }
            }

        }
        /*
            if (this.isPausing && this.pauseTimer && this.pauseTimer.IsComplete()) {
                this.isPausing = false;
            }

            if (!this.isPausing) {
                // Move towards currentTarget
                // set direction based on currentTarget
                this.dirX = ((this.position.x - this.currentTarget.x) < 0) ? 1 : -1;
                this.dirY = ((this.position.y - this.currentTarget.y) < 0) ? 1 : -1;
                this.position.x += (this.dirX < 0) ? -this.moveSpeed : this.moveSpeed;
                this.position.y += (this.dirY < 0) ? -this.moveSpeed : this.moveSpeed;

                const diffPos = new Vector2(
                    Math.abs(this.position.x - this.currentTarget.x),
                    Math.abs(this.position.y - this.currentTarget.y)
                );

                // if target is reached, either pause or move to next
                if (diffPos.x < 1 && diffPos.y < 1) {
                    
                    // this.isPausing = random(0, 100) <= this.pauseChance;

                    if (!this.isPausing) {
                        this.pauseTimer = new Timer(GameTime.getCurrentGameTime(), 2);
                        this.currentTarget = this.GetRandomTarget();
                    }

                }

                this.texture.Update(this.position);
            }

            console.log(
                {
                    direction: `x: ${this.dirX}, y: ${this.dirY}`,
                    position: this.position,
                    curTar: this.currentTarget,
                    hPos: this.hivePosition
                }
            );

        */

    }

    Draw() {
        this.texture.Draw();
    }

}