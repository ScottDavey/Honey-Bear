/****************************************
*****  TREE MONSTER (Level 1 Boss)  *****
****************************************/

class TreeMonster extends Character {

    constructor(position, size) {
        super(position, size, false);
        this.size = size;
        this.health = 1500;
        this.maxMoveSpeed = 100;

        this.sprite = new Nimation(
            'images/spritesheets/TreeMonster.png',
            new Vector2(this.position.x, this.position.y),
            300,
            300,
            6,
            0,
            0.1,
            true,
            new Vector2(0, 0)
        );
    }

    Update(playerPosition) {
        super.Update();
    }

    Draw() {
        super.Draw();
    }

}