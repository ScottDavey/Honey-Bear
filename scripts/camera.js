/****************************************************************************************************
******************************************  CAMERA CLASS  *******************************************
**************  Adapted from robashton on Github: https://github.com/robashton/camera  **************
****************************************************************************************************/

class Camera {

	constructor() {
		this.distance = 0.0;
		this.lookat = [0, 0];
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
		this.viewport.left = this.lookat[0] - (this.viewport.width / 2.0);
		this.viewport.top = this.lookat[1] - (this.viewport.height / 2.0);
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
		// this.lookat[0] = x;
		this.lookat[0] += (x - this.lookat[0]) * 0.05;
		this.lookat[0] = (this.lookat[0] < 0.5) ? 0 : this.lookat[0];
		this.lookat[1] += (y - this.lookat[1]) * 0.05;
		this.lookat[1] = (this.lookat[1] < 0.5) ? 0 : this.lookat[1];
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

}