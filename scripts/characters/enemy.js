/******************************************
**************  ENEMY CLASS  **************
******************************************/
class Enemy extends Moveable {

    constructor(data = { start: new Vector2(150, 150), size: new Vector2(50, 68), region: { pos: new Vector2(0, 0), size: new Vector2(300, 1000) } }, scene) {
        // Call parent constructor
        super(data.start, data.size, scene);

        // Update some ingerited vars
        this.maxMoveSpeed = 75.0;

        // Animation sprites
        const spritesheet = document.createElement('img');
        spritesheet.setAttribute('src', 'images/spritesheets/Adventurer-1.5/enemy-spritesheet.png');

        this.runRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 6, 0, 0.15, 1, new Vector2(26, 7));
        this.runLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 6, 1, 0.15, 1, new Vector2(26, 7));
        this.idleRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 2, 0.3, 1, new Vector2(26, 7));
        this.idleLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 3, 0.3, 1, new Vector2(26, 7));
        this.jumpLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 4, 0.25, 1, new Vector2(26, 7));
        this.jumpRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 4, 5, 0.25, 1, new Vector2(26, 7));
        this.fallLeftSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 2, 6, 0.25, 1, new Vector2(26, 7));
        this.fallRightSprite = new Nimation(spritesheet, new Vector2(this.pos.x, this.pos.y), 74, 100, 2, 7, 0.25, 1, new Vector2(26, 7));

        this.sprite = this.idleSprite;

        // member vars
        this.region = data.region;
        this.region.bounds = new Rectangle(this.region.pos.x, this.region.pos.y, this.region.size.x, this.region.size.y);
        this.regionTexture = new Texture(
            this.region.pos,
            this.region.size,
            `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.2)`,
            1,
            '#333333'
        );

    }

    DoDamage(weapon) {
        super.DoDamage(weapon);
    }

    HandleCollision() {

        // Check if we've collided with our region. If so, switch directions.
        const bounds = new Rectangle(this.pos.x, this.pos.y, this.size.x, this.size.y);
        if (bounds.left <= this.region.bounds.left) {
            this.pos.x += 2;
            this.SwitchDirections();
        } else if (bounds.right >= this.region.bounds.right) {
            this.pos.x -= 2;
            this.SwitchDirections();
        }

        super.HandleCollision();
    }

    SwitchDirections() {
        this.dir = (this.dir === 1) ? -1 : 1;
    }

    Update() {

        this.sprite = this.idleSprite;

        // Jump, randomly
        if (random(0, 500) === 5) this.isJumping = true;
        if (this.isHittingWall) this.SwitchDirections();

        this.movement = this.dir;

        if (this.isJumping) {
            this.sprite = (this.dir === 1) ? this.jumpRightSprite : this.jumpLeftSprite;
        } else if (!this.isOnGround) {
            this.sprite = (this.dir === 1) ? this.fallRightSprite : this.fallLeftSprite;
        } else if (this.movement !== 0) {
            this.sprite = (this.dir === 1) ? this.runRightSprite : this.runLeftSprite;
        } else {
            this.sprite = (this.dir === 1) ? this.idleRightSprite : this.idleLeftSprite;
        }

        // Call parent function
        super.Update();
    }

    Draw() {

        // Call parent function
        super.Draw();

        // this.regionTexture.Draw();
    }

}