/****************************************************************************************************
******************************************  CAMERA CLASS  *******************************************
**************  Adapted from robashton on Github: https://github.com/robashton/camera  **************
****************************************************************************************************/

class Camera {

	constructor() {
		this.distance = 0.0;
		this.lookat = new Vector2(0, 0);
		this.fieldOfView = Math.PI / 4.0;
		this.viewport = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: 0,
			height: 0,
			scale: [1.0, 1.0]
		};

		// this.velocity = new Vector2(0, 0);
		// this.movementX = 0;
		// this.movementY = 0;
		// this.friction = 0.2;
		// this.moveAcceleration = 2000;
		// this.maxMoveSpeed = 1500;


		this.isShaking = false;
		this.shakeStart = 0;
		this.shakeMaxTime = 0.5;
		this.shakeStrength = new Vector2(3, 3);
		this.updateViewport();
	}

	getlookat() {
		return this.lookat;
	}

	begin() {
		CONTEXT.save();
		this.applyScale();
		this.applyTranslation();
	};

	end() {
		CONTEXT.restore();
	};

	applyScale() {
		CONTEXT.scale(this.viewport.scale[0], this.viewport.scale[1]);
	};

	applyTranslation() {
		CONTEXT.translate(-this.viewport.left, -this.viewport.top);
	};

	updateViewport() {
		this.aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
		this.viewport.width = this.distance * Math.tan(this.fieldOfView);
		this.viewport.height = this.viewport.width / this.aspectRatio;
		this.viewport.left = this.lookat.x - (this.viewport.width / 2.0);
		this.viewport.top = this.lookat.y - (this.viewport.height / 2.0);
		this.viewport.right = this.viewport.left + this.viewport.width;
		this.viewport.bottom = this.viewport.top + this.viewport.height;
		this.viewport.scale[0] = CANVAS_WIDTH / this.viewport.width;
		this.viewport.scale[1] = CANVAS_HEIGHT / this.viewport.height;
	};

	zoomTo(z) {
		this.distance = z;
		this.updateViewport();
	};

	moveTo(x, y) {
		const elapsed = GameTime.getElapsed();
		const currentGameTime = GameTime.getCurrentGameTime();

		/*
		const distanceX = this.lookat.x - x;
		const distanceY = this.lookat.y - y;

		// Assume the camera is moving until proven otherwise.
		this.movementX = (distanceX < 0) ? 1 : -1;
		this.movementY = (distanceY < 0) ? 1 : -1;

		// If we're in the same position as our x and y, stop moving.
		if (Math.abs(distanceX) < 10) {
			this.movementX = 0;
		}
		
		if (Math.abs(distanceY) < 10) {
			this.movementY = 0;
		}

		this.velocity.x += this.movementX * this.moveAcceleration;
		this.velocity.x *= this.friction;
		this.velocity.x = Clamp(this.velocity.x, -this.maxMoveSpeed, this.maxMoveSpeed);
		this.velocity.x = (Math.abs(this.velocity.x) < 5) ? 0 : this.velocity.x;

		this.velocity.y += this.movementY * this.moveAcceleration;
		this.velocity.y *= this.friction;
		this.velocity.y = Clamp(this.velocity.y, -this.maxMoveSpeed, this.maxMoveSpeed);
		this.velocity.y = (Math.abs(this.velocity.y) < 5) ? 0 : this.velocity.y;

		this.lookat.x += Math.round(this.velocity.x * elapsed);
		this.lookat.y += Math.round(this.velocity.y * elapsed);

		*/

		this.lookat.x += (x - this.lookat.x) * 0.05;
		this.lookat.x = (this.lookat.x < 0.5) ? 0 : this.lookat.x;
		this.lookat.y += (y - this.lookat.y) * 0.05;
		this.lookat.y = (this.lookat.y < 0.5) ? 0 : this.lookat.y;

		if (this.isShaking) {
			if ((currentGameTime - this.shakeStart) < this.shakeMaxTime) {

				this.lookat.x += random(-this.shakeStrength.x, this.shakeStrength.x);
				this.lookat.y += random(-this.shakeStrength.y, this.shakeStrength.y);

			} else {
				this.isShaking = false;
			}
		}

		this.updateViewport();
	};

	screenToWorld(x, y, obj) {
		obj = obj || {};
		obj.x = (x / this.viewport.scale[0]) + this.viewport.left;
		obj.y = (y / this.viewport.scale[1]) + this.viewport.top;
		return obj;
	};

	worldToScreen(x, y, obj) {
		obj = obj || {};
		obj.x = (x - this.viewport.left) * (this.viewport.scale[0]);
		obj.y = (y - this.viewport.top) * (this.viewport.scale[1]);
		return obj;
	};

	shake(duration = 0.5, strength = new Vector2(3, 3)) {

		if (!this.isShaking) {
			this.shakeMaxTime = duration;
			this.shakeStrength = strength;
			this.isShaking = true;
			this.shakeStart = GameTime.getCurrentGameTime();
		}

	}

}