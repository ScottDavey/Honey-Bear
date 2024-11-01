/*****************************
*****  BACKGROUND CLASS  *****
*****************************/
class Background {

    constructor(path, pos, size, isRepeating = false, parallaxMultiplier = new Vector2(0, 0), worldWidth) {
        this.path = path;
		this.pos = pos;
		this.size = size;
		this.isRepeating = isRepeating;
		this.parallaxMultiplier = parallaxMultiplier;
		this.sprites = [];
        this.worldWidth = worldWidth;
		this.cameraPos = new Vector2(0, 0);

		this.refreshRepeatingSprites();
    }

    GetPos() {
        return this.pos;
    }

    GetSize() {
        return this.size;
    }

	GetParallaxMultiplier() {
		return this.parallaxMultiplier;
	}

	Update(cameraPos, adjustedCameraPosition) {
		this.cameraPos = cameraPos;

		for (let i = 0; i < this.sprites.length; i++) {
			this.sprites[i].Update(
				new Vector2(
					adjustedCameraPosition.x + (i * this.size.x),
					adjustedCameraPosition.y
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
			const spritePosition = sprite.GetPosition();

			// Only draw if it's in view
			if ((spritePosition.x < this.cameraPos.x && spritePosition.x + this.size.x > this.cameraPos.x) ||
				(spritePosition.x >= this.cameraPos.x && spritePosition.x < this.cameraPos.x + CANVAS_WIDTH) ||
				!this.isRepeating
			) {
				sprite.Draw();
			}

		}
	}

}