/*************************************************
 *****  SCENE: Sets the stage for each level  *****
 *************************************************/

class Scene {
    constructor(selectedLevel) {
        this.selectedLevel = selectedLevel;
        this.backToHUB = false;
        this.isLevelComplete = false;
        this.level = stages[selectedLevel];
        this.transition = new Transition('0, 0, 0', 3, 'in');
        this.introText = this.level.introText;
        this.worldWidth = this.level.worldWidth;
        this.worldHeight = this.level.worldHeight;
        this.backgroundImgs = this.level.backgrounds;
        this.parallax = undefined;
        this.collision = this.level.collision;
        this.lines = [];
        this.enemyArr = this.level.enemies;
        this.enemies = [];
        this.eventCollision = this.level.eventCollision;
        this.exit = this.eventCollision.exit;
        this.exitVolume = new Rectangle(
            this.exit.pos.x,
            this.exit.pos.y,
            this.exit.size.x,
            this.exit.size.y
        );
        // pos, size, fillColor, lineWidth, lineColor
        this.exitTexture = new Texture(
            this.exit.pos,
            this.exit.size,
            'rgba(0, 0, 0, 0.5)',
            1,
            '#fe9000'
        );

        this.camera = new Camera();
        this.player = new Player(this, this.level.player.start, this.level.player.size);

        this.LoadContent();
    }

    UnloadContent() {
        this.selectedLevel = undefined;
        this.backToHUB = undefined;
        this.level = undefined;
        this.worldWidth = undefined;
        this.worldHeight = undefined;
        this.playerStart = undefined;
        this.backgroundImgs = undefined;
        this.backgrounds = undefined;
        this.collision = undefined;
        this.lines = undefined;

        this.camera = undefined;
        this.player = undefined;
        this.globs = undefined;
    }

    async LoadContent() {
        this.parallax = new Parallax(this.backgroundImgs);

        this.LoadCollision();

        this.enemies = this.enemyArr.map(enemy => {
            return new Enemy(this, enemy);
        });

        return true;
    }

    LoadCollision() {
        this.lines = this.collision.map(collision => {
            return new Line(
                new Vector2(collision.sx, collision.sy),
                new Vector2(collision.ex, collision.ey),
                collision.h,
                collision.c,
                collision.n,
                collision.s
            );
        });
    }

    HasGlobCollidedWithEnvironment(line, globs) {

        const slope = (line.endPos.y - line.startPos.y) / (line.endPos.x - line.startPos.x);
        const b = line.startPos.y - (slope * line.startPos.x);

        for (const glob of globs) {

            const globPos = glob.pos;
            const globSize = glob.size;
            const bounds = new Rectangle(globPos.x, globPos.y, globSize.x, globSize.y);
            const yc = (slope * bounds.center.x) + b;

            if ((line.collision == 'FLOOR' || line.collision == 'CEILING') && bounds.center.x >= line.startPos.x && bounds.center.x <= line.endPos.x) {

                if (Math.abs(yc - bounds.center.y) <= bounds.halfSize.y + 5) {
                    glob.SetHasHit(true);
                }

            } else if (line.collision == 'WALL' && bounds.center.y > line.startPos.y && bounds.center.y < line.endPos.y) {

                const xDiff = Math.abs(bounds.center.x - line.startPos.x);
                if (xDiff <= bounds.halfSize.x + 5) {
                    glob.SetHasHit(true);
                }

            }

        }

    }

    CheckGlobCollisionWithEntity(entity, globs) {
        const bounds = new Rectangle(entity.pos.x, entity.pos.y, entity.size.x, entity.size.y);

        for (const glob of globs) {
            const globBounds = new Rectangle(glob.pos.x, glob.pos.y, glob.size.x, glob.size.y);
            const intersectionDepth = bounds.GetIntersectionDepth(globBounds);

            if (intersectionDepth.x !== 0 && intersectionDepth.y !== 0) {

                const absDepthX = Math.abs(intersectionDepth.x);
                const absDepthY = Math.abs(intersectionDepth.y);

                if (absDepthY < absDepthX || absDepthX < absDepthY) {
                    entity.DoDamage(glob);
                    glob.SetHasHit(true);
                }

            }
        }
    }

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        // Fade IN
        if (!this.transition.IsComplete()) {
            this.transition.update(currentGameTime);
            this.player.LockInput(true);
        } else if (this.player.IsInputLocked()) {
            this.player.LockInput(false);
        }


        this.player.Update();
        const globs = this.player.GetGlobs();

        // Camera
        let cameraPosX = this.player.pos.x + this.player.size.x / 2 - CANVAS_WIDTH / 2;
        let cameraPosY = this.player.pos.y + this.player.size.y / 2 - CANVAS_HEIGHT / 2;

        if (cameraPosX < 0) {
            cameraPosX = 0;
        } else if (cameraPosX > this.worldWidth - CANVAS_WIDTH) {
            cameraPosX = this.worldWidth - CANVAS_WIDTH;
        }

        if (cameraPosY < 0) {
            cameraPosY = 0;
        } else if (cameraPosY > this.worldHeight - CANVAS_HEIGHT) {
            cameraPosY = this.worldHeight - CANVAS_HEIGHT;
        }

        this.camera.moveTo(cameraPosX, cameraPosY);

        // Based on the camera's position, update the parallax backgrounds
        const cameraLookAt = this.camera.getlookat();
        this.parallax.Update(new Vector2(cameraLookAt[0], cameraLookAt[1]));

        // Enemies
        for (let e = 0; e < this.enemies.length; e++) {
            const enemy = this.enemies[e];
            if (!enemy.GetIsDead()) {
                this.enemies[e].Update();
                if (globs.length) this.CheckGlobCollisionWithEntity(enemy, globs);
            } else {
                this.enemies.splice(e, 1);
            }
        }

        // Check glob collision with environment
        for (let l = 0; l < this.lines.length; l++) {
            this.HasGlobCollidedWithEnvironment(this.lines[l], globs);
        }

        // Event Collisions with player
        const playerBounds = new Rectangle(
            this.player.pos.x,
            this.player.pos.y,
            this.player.size.x,
            this.player.size.y
        );

        // Level Complete
        if (playerBounds.right > this.exitVolume.left && playerBounds.bottom > this.exitVolume.top) {
            this.isLevelComplete = true;
        }

    }

    Draw() {
        this.camera.begin();

        this.parallax.Draw();

        this.exitTexture.Draw();

        // Enemies
        for (let e = 0; e < this.enemies.length; e++) {
            this.enemies[e].Draw();
        }

        for (let l = 0; l < this.lines.length; l++) {
            this.lines[l].Draw();
        }

        this.player.Draw();

        this.camera.end();

        // Fade IN
        if (!this.transition.IsComplete()) {
            if (this.introText) {
                const centeredText = CenterText(this.introText, 14, new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT));
                DrawText(this.introText, centeredText.x, centeredText.y, 'normal 20px "Montserrat-Regular", sans-serif', '#222222');
            }
            this.transition.draw();
        }
    }
}
