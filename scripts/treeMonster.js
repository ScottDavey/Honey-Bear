/****************************************
*****  TREE MONSTER (Level 1 Boss)  *****
****************************************/

class TreeMonster extends Character {

    constructor(position, size) {
        super(position, size, false);
        this.size = size;
        this.health = 1500;
        this.maxMoveSpeed = 100;

        this.texture = new Texture(this.position, this.size, '#9900088', 1, '#99000');
    }

    Update(playerPosition) {
        super.Update();
    }

    Draw() {
        this.texture.Draw();
        super.Draw();
    }

}