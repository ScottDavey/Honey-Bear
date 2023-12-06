/*****************************
*****  BACKGROUND CLASS  *****
*****************************/
class Background {

    constructor(path, pos, size, isRepeating = false, parallax = new Vector2(0, 0), worldWidth) {
        this.path = path;
		this.pos = pos;
		this.size = size;
		this.isRepeating = isRepeating;
		this.parallax = parallax;
		this.sprites = [];
        this.worldWidth = worldWidth;

		this.refreshRepeatingSprites();
    }

    GetPos() {
        return this.pos;
    }

    GetSize() {
        return this.size;
    }

	Update(pos) {
		for (let i = 0; i < this.sprites.length; i++) {
			this.sprites[i].Update(
				new Vector2(
					pos.x + (i * this.size.x),
					pos.y
				)
			);
		}
	}

	refreshRepeatingSprites() {
		let numberOfBackgrounds = 1;

		// First delete all sprite before re-creating them
		this.sprites = [];
		
		if (this.isRepeating) {
			numberOfBackgrounds = Math.ceil(this.worldWidth / this.size.x);
		}

		for (let i = 0; i < numberOfBackgrounds; i++) {
			this.sprites.push(
				new Sprite(
					this.path,
					new Vector2(this.pos.x + (i * this.size.x), this.pos.y),
					new Vector2(this.size.x, this.size.y)
				)
			);
		}

	}

	Draw() {
		for (const sprite of this.sprites) {
			sprite.Draw();
		}
	}

}