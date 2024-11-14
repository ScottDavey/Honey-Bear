/**********************************************
**************  ANIMATION CLASS  **************
**********************************************/

class Nimation {
    constructor(path, pos, frameHeight, frameWidth, totalFrames, animationSeq, speed, isLooping, offset) {
        this.path = path;
        this.pos = new Vector2(pos.x, pos.y);
        this.sprite = new Sprite(this.path, this.pos, new Vector2(0, 0));
        this.frameHeight = frameHeight;
        this.frameWidth = frameWidth;
        this.totalFrames = totalFrames;
        this.sheetWidth = this.totalFrames / this.frameWidth;
        this.isLooping = isLooping;
        this.isDone = false;
        this.clip = { 'left': 0, 'top': (animationSeq * this.frameHeight), 'right': this.frameWidth, 'bottom': this.frameHeight };
        this.frameCount = 0;
        this.previousFrameTime = 0;
        this.speed = speed;
        this.offset = offset;
    }

    GetPosition() {
        return this.pos;
    }

    SetSpeed(speed) {
        this.speed = speed;
    }

    SetImageOpacity(opacity) {
        this.sprite.SetImageOpacity(opacity);
    }

    SetPosition(pos) {
        this.position = new Vector2(pos.x, pos.y);
    }

    Animate(frameTime) {
        // Set the previous frame time to the current time (frameTime) if this is the first go around
        this.previousFrameTime = (this.previousFrameTime === 0) ? frameTime : this.previousFrameTime;
        // Every 0.5 seconds, switch frames
        if ((frameTime - this.previousFrameTime) >= this.speed) {

            this.clip.left = this.frameWidth * this.frameCount;
            this.clip.right = (this.frameWidth * this.frameCount) + this.frameWidth;
            // Advance a frame
            if (this.frameCount === (this.totalFrames - 1)) {
                // We've completed a full loop.
                if (!this.isLooping) {
                    this.isDone = true;
                } else {
                    this.frameCount = 0;
                }
            } else {
                this.frameCount += 1;
            }

            // Set the new previous frame time
            this.previousFrameTime = frameTime;
        }
    }

    GetIsDone() {
        return this.isDone;
    }

    Reset() {
        this.isDone = false;
        this.frameCount = 0;
    }

    Update(pos) {
        this.pos = new Vector2(pos.x, pos.y);

        // Get a snap shot of the time in seconds
        const d = new Date();
        const frameTime = d.getTime() / 1000;
        this.Animate(frameTime);
    }

    Draw() {
        this.sprite.DrawSpriteSheet(
            this.clip,
            {
                width: this.frameWidth,
                height: this.frameHeight
            },
            new Vector2(
                this.pos.x - this.offset.x,
                this.pos.y - this.offset.y
            )
        );
    }

}