/**********************
*****  BEE HIVES  *****
**********************/

class BeeHive {

    constructor(position) {
        this.position = position;
        this.size = new Vector2(30, 40);
        this.center = new Vector2(
            this.position.x + 15,
            this.position.y + 20
        );
        this.numberOfBees = random(5, 10);
        this.bees = [];
        this.isCollected = false;
        this.texture = new Texture(
            new Vector2(this.position.x, this.position.y),
            new Vector2(30, 40),
            '#88FF0077',
            1,
            '#88FF00'
        );
        this.hintTexture = new Texture(
            new Vector2(0, 0),
            new Vector2(20, 20),
            '#00000044',
            1,
            '#000000'
        );
        this.hintText = new Text(
            'R',
            this.hintTexture.pos.x,
            this.hintTexture.pos.y,
            'normal 10pt "Gasoek One"',
            '#F8B61D'
        );
        this.showHint = false;

        this.LoadBees();
    }

    LoadBees() {
        for (let b = 0; b < this.numberOfBees; b++) {
            this.bees.push(
                new Bee(new Vector2(this.position.x, this.position.y))
            );
        }
    }

    Update(playerCenter) {
        // Check if the player is within collection distance
        const diffPos = new Vector2(
            Math.abs(playerCenter.x - this.center.x),
            Math.abs(playerCenter.y - this.center.y)
        );

        this.showHint = false;

        if (diffPos.x < 75 && diffPos.y < 75) {
            this.showHint = true;
            this.hintTexture.Update(
                new Vector2(
                    this.position.x + 5,
                    this.position.y - 40
                )
            );
            this.hintText.UpdatePos(
                new Vector2(
                    this.position.x + 10,
                    this.position.y - 25
                )
            );
        }

        for (const bee of this.bees) {
            bee.Update();
        }

    }

    Draw() {
        this.texture.Draw();
        
        for (const bee of this.bees) {
            bee.Draw();
        }

        if (this.showHint) {
            this.hintTexture.Draw();
            this.hintText.Draw();
        }
    }

}