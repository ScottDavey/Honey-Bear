/*************************************************
 *****  SCENE: Sets the stage for each level  *****
 *************************************************/

class Scene {
    constructor(selectedLevel, playerCheckpoint) {
        this.selectedLevel = selectedLevel;
        this.backToHUB = false;
        this.isLevelComplete = false;
        this.level = stages[selectedLevel];
        this.transition = new Transition('0, 0, 0', 3, 'in');
        this.exitTransition = undefined;
        this.introTextBackground = new Texture(
            new Vector2(0, (CANVAS_HEIGHT / 2 - 75)),
            new Vector2(CANVAS_WIDTH, 150),
            '#5831a0AA',
            1,
            '#FFC436'
        );
        this.worldWidth = this.level.worldWidth;
        this.worldHeight = this.level.worldHeight;
        this.backgroundImgs = this.level.backgrounds;
        this.parallax = undefined;
        this.collision = this.level.collision;
        this.lines = [];
        this.enemyArr = this.level.enemies;
        this.enemies = [];
        this.eventCollision = this.level.eventCollision;
        this.isLevelEndSequence = false;
        this.exit = this.eventCollision.exit;
        this.exitVolume = new Rectangle(
            this.exit.pos[0],
            this.exit.pos[1],
            this.exit.size[0],
            this.exit.size[1]
        );
        // pos, size, fillColor, lineWidth, lineColor
        this.exitTexture = new Texture(
            new Vector2(this.exit.pos[0], this.exit.pos[1]),
            new Vector2(this.exit.size[0], this.exit.size[1]),
            'rgba(0, 0, 0, 0.5)',
            1,
            '#fe9000'
        );

        // PitFalls
        this.pitfallsArr = this.level.eventCollision.pitfalls;
        this.pitfalls = [];
        this.pitfallTextures = [];

        // Events
        this.eventsArr = this.level.eventCollision.generic;
        this.events = [];

        this.leftButton = new Button('images/Touch_Button.png', new Vector2(20, CANVAS_HEIGHT - 120), new Vector2(100, 100));
        this.rightButton = new Button('images/Touch_Button.png', new Vector2(140, CANVAS_HEIGHT - 120), new Vector2(100, 100));
        this.AButton = new Button('images/Touch_Button.png', new Vector2(CANVAS_WIDTH - 240, CANVAS_HEIGHT - 120), new Vector2(100, 100));
        this.BButton = new Button('images/Touch_Button.png', new Vector2(CANVAS_WIDTH - 120, CANVAS_HEIGHT - 140), new Vector2(100, 100));

        this.camera = new Camera();

        // const playerStart = playerCheckpoint || this.level.player.start;
        // this.player = new Player(playerCheckpoint, this.level.player.size, this);
        this.player = new Player(
            new Vector2(this.level.player.start[0], this.level.player.start[1]),
            new Vector2(this.level.player.size[0], this.level.player.size[1]),
            this
        );

        this.bush = new ThornBush(new Vector2(1000, 460), new Vector2(75, 64));

        this.showDebug = false;
        this.isDebugKeyLocked = false;

        this.isCameraShakeKeyLocked = false;

        this.isPlayerRandomPositionKeyLocked = false;

        this.backgroundMusic = undefined;
        this.backgroundMusicSources = [
            { path: 'MUSIC_The-Forgotten_Forest.mp3', defaultVolume: 0.2 },
            { path: 'Caretaker_DRAFT.wav', defaultVolume: 0.4 },
            { path: 'Kenopsia-DeepSea.wav', defaultVolume: 0.4 },
            { path: 'Kenopsia-DeepSpace.wav', defaultVolume: 0.4 },
            { path: 'Kenopsia-Existential.wav', defaultVolume: 0.4 },
            { path: 'Kenopsia-Falling-NewKick.wav', defaultVolume: 0.4 },
            { path: 'Kenopsia-SoundsOftheQuantum_Draft.wav', defaultVolume: 0.4 },
        ];

        // TEXT
        const introTextSource = this.level.introText;
        const centeredText = CenterText(introTextSource, 17, new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT));
        this.introText = new Text(introTextSource, centeredText.x, centeredText.y, 'normal 30px "Poiret One", sans-serif', '#FFFFFF');
        this.enemiesShowingText = new Text(`Enemies Showing: 0 / 0`, (CANVAS_WIDTH - 250), 20, 'normal 8pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');
        this.linesShowingText = new Text(`Lines Showing: 0 / 0`, (CANVAS_WIDTH - 250), 35, 'normal 8pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');
        this.isPushingAText = new Text(`Is Pushing A: FALSE`, (CANVAS_WIDTH - 250), 50, 'normal 8pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');
        this.isPushingBText = new Text(`Is Pushing B: FALSE`, (CANVAS_WIDTH - 250), 65, 'normal 8pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');
        this.isPushingLText = new Text(`Is Pushing L: FALSE`, (CANVAS_WIDTH - 250), 80, 'normal 8pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');
        this.isPushingRText = new Text(`Is Pushing R: FALSE`, (CANVAS_WIDTH - 250), 95, 'normal 8pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');
        this.isTouchingText = new Text(`Is Touching: FALSE`, (CANVAS_WIDTH - 250), 110, 'normal 8pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');
        this.touchesText = new Text(`Touches: x0 y0`, (CANVAS_WIDTH - 250), 125 + (7 * 15), 'normal 8pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');
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

        return true;
    }

    LoadContent() {
        this.parallax = new Parallax(this.backgroundImgs, this.worldWidth);

        this.LoadCollision();

        this.pitfalls = this.pitfallsArr.map(pitfall => {
            this.pitfallTextures.push(
                new Texture(
                    new Vector2(pitfall.pos[0], pitfall.pos[1]),
                    new Vector2(pitfall.size[0], pitfall.size[1]),
                    '#FF990066',
                    1,
                    '#FF9900FF'
                )
            );
            return new Rectangle(pitfall.pos[0], pitfall.pos[1], pitfall.size[0], pitfall.size[1]);
        });

        this.enemies = this.enemyArr.map(enemy => {
            //{ start: new Vector2(150, 150), size: new Vector2(50, 68), region: { pos: new Vector2(0, 0), size: new Vector2(300, 1000) } }
            return new Enemy(
                {
                    start: new Vector2(enemy.start[0], enemy.start[1]),
                    size: new Vector2(enemy.size[0], enemy.size[1]),
                    region: {
                        pos: new Vector2(enemy.region.pos[0], enemy.region.pos[1]),
                        size: new Vector2(enemy.region.size[0], enemy.region.size[1]),
                    },
                },
                this
            );
        });

        this.events = this.eventsArr.map(event => new Rectangle(event.pos[0], event.pos[1], event.size[0], event.size[1]));

        const backgroundMusicChoice = this.backgroundMusicSources[random(0, this.backgroundMusicSources.length - 1)];
        this.backgroundMusic = new Sound(
            `sounds/music/${backgroundMusicChoice.path}`,
            true,
            true,
            false,
            backgroundMusicChoice.defaultVolume,
            1.5
        );
        this.backgroundMusic.Play();
        
        return true;
    }

    LoadCollision() {
        this.lines = this.collision.map(collision => {
            return new Line(
                new Vector2(collision.sx, collision.sy),    // Start position vector
                new Vector2(collision.ex, collision.ey),    // End position vector
                collision.h,                                // Line color
                collision.c,                                // Collision type (FLOOR, WALL, CEILING)
                collision.n,                                // Line Normal (which way to push the entity)
                collision.s,                                // Line Sound (when collided with)
                collision.sl,                               // Slope (or, the m in y = mx + b)
                collision.b                                 // Y Intercept (or, the b in y = mx + b)
            );
        });
    }

    GetPitfalls() {
        return this.pitfalls;
    }

    GetEvents() {
        return this.events;
    }

    IsPlayerDead() {
        return this.player.IsDead();
    }

    HasGlobCollidedWithEnvironment(line, globs) {

        const slope = line.slope;
        const b = line.b;

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
            const globDir = glob.GetDirection();

            if (intersectionDepth.x !== 0 && intersectionDepth.y !== 0) {

                const absDepthX = Math.abs(intersectionDepth.x);
                const absDepthY = Math.abs(intersectionDepth.y);

                if (absDepthY < absDepthX || absDepthX < absDepthY) {
                    entity.DoDamage(glob);
                    entity.SetKnockBack(globDir);
                    glob.SetHasHit(true);
                    if (!entity.GetIsTracking()) {
                        entity.TrackPlayer(true);
                    }
                }

            }
        }
    }

    CheckBushCollisionWithPlayer(bush) {

        const bushPos = bush.GetPos();
        const bushSize = bush.GetSize();
        const bushBounds = new Rectangle(bushPos.x, bushPos.y, bushSize.x, bushSize.y);
        const playerPos = this.player.GetPos();
        const playerSize = this.player.GetSize();
        const playerBounds = new Rectangle(playerPos.x, playerPos.y, playerSize.x, playerSize.y);
        const knockBackDir = ((playerBounds.center.x - bushBounds.center.x) < 0) ? -1 : 1;

        const intersectionDepth = bushBounds.GetIntersectionDepth(playerBounds);

        if (intersectionDepth.x !== 0 && intersectionDepth.y !== 0) {

            const absDepthX = Math.abs(intersectionDepth.x);
            const absDepthY = Math.abs(intersectionDepth.y);

            if (absDepthY < absDepthX || absDepthX < absDepthY) {
                this.player.DoDamage(bush);
                this.player.SetKnockBack(knockBackDir);
                this.camera.shake(0.2, new Vector2(5, 5));
            }

        }

    }

    CheckPlayerEventCollision(event) {
        
    }

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

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
        } else if (cameraPosY + CANVAS_HEIGHT > this.worldHeight) {
            cameraPosY = this.worldHeight - CANVAS_HEIGHT;
        }

        this.camera.moveTo(cameraPosX, cameraPosY);

        // Based on the camera's position, update the parallax backgrounds
        const cameraLookAt = this.camera.getlookat();
        this.parallax.Update(new Vector2(cameraLookAt[0], cameraLookAt[1]));

        /****************************
        *****  FADE IN (exits)  *****
        ****************************/
        if (!this.transition.IsComplete()) {
            this.transition.update(currentGameTime);
            this.player.LockInput(true);
            return;
        }

        /**********************
        *****  GAME PLAY  *****
        **********************/

        if (this.player.IsInputLocked() && !this.isLevelEndSequence) {
            this.player.LockInput(false);
        }

        if (Input.Keys.GetKey(Input.Keys.M)) {
            if (!this.isPlayerRandomPositionKeyLocked) {
                const randPos = new Vector2();
                randPos.x = random(0, this.worldWidth - 300);
                randPos.y = random(-this.worldHeight - 500, -this.worldHeight);
                this.player.SetRandomPosition(randPos);
                this.isPlayerRandomPositionKeyLocked = true;
            }
        } else {
            this.isPlayerRandomPositionKeyLocked = false;
        }


        this.player.Update();
        const globs = this.player.GetGlobs();

        // Enemies
        for (let e = 0; e < this.enemies.length; e++) {
            const enemy = this.enemies[e];
            if (!enemy.IsDead()) {
                enemy.Update(this.player.GetPosition());
                // If the enemy falls for some reason, throw him back up
                if (enemy.GetPosition().y > (this.worldHeight + 100)) {
                    enemy.UpdatePosition(new Vector2(enemy.GetPosition().x, -300));
                }
                if (globs.length) this.CheckGlobCollisionWithEntity(enemy, globs);
            } else {
                this.enemies.splice(e, 1);
            }
        }

        // Check glob collision with environment
        for (const line of this.lines) {
            this.HasGlobCollidedWithEnvironment(line, globs);
        }

        // Event Collisions with player
        const playerBounds = new Rectangle(
            this.player.pos.x,
            this.player.pos.y,
            this.player.size.x,
            this.player.size.y
        );

        this.bush.Update();
        this.CheckBushCollisionWithPlayer(this.bush);

        // Level Complete
        if (playerBounds.right > this.exitVolume.left && playerBounds.bottom > this.exitVolume.top) {
            this.isLevelEndSequence = true;
            
            if (!this.exitTransition) {
                const exitTransitionPosition = new Vector2(
                    this.player.GetPosition().x - CANVAS_WIDTH / 2,
                    0
                );
                this.exitTransition = new Transition('0, 0, 0', 1.5, 'out', exitTransitionPosition);
            }

            if (!this.exitTransition.IsComplete()) {
                this.exitTransition.update(currentGameTime);
            }

            this.player.LockInput(true);
            
            if (this.backgroundMusic.FadeOut(currentGameTime)) {
                this.backgroundMusic.Stop();
                this.backgroundMusic = undefined;
                this.isLevelComplete = true;
            }
        }

        if (IS_MOBILE) {
            this.leftButton.Update();
            this.rightButton.Update();
            this.AButton.Update();
            this.BButton.Update();
        }

        // Show or Hide Debug Info
        if (Input.Keys.GetKey(Input.Keys.R)) {
            if (!this.isDebugKeyLocked) {
                this.isDebugKeyLocked = true;
                this.showDebug = !this.showDebug;
            }
        } else {
            this.isDebugKeyLocked = false;
        }

    }

    Draw() {
        const cameraPos = this.camera.getlookat();
        let enemyShowCount = 0;
        let lineShowCount = 0;

        this.camera.begin();

        this.parallax.Draw();

        if (+this.selectedLevel > 0) {
            this.exitTexture.Draw();
        }

        // Enemies
        for (const enemy of this.enemies) {
            const enemyPos = enemy.GetPos();
            // Only render the enemy if he's inside the camera's view
            if (enemyPos.x > cameraPos[0] && enemyPos.x < (cameraPos[0] + CANVAS_WIDTH)) {
                enemyShowCount++;
                enemy.Draw();
            }
        }

        if (+this.selectedLevel > 0) {
            
            for (const line of this.lines) {
                const linePos = line.GetPos();
                // Only render if the lines are visible.
                // ** This is obviously temporary as the line won't be drawn once the artwork is added. ** //
                if ((linePos.start.x > cameraPos[0] && linePos.start.x < (cameraPos[0] + CANVAS_WIDTH)) || (linePos.end.x > cameraPos[0] && linePos.end.x < (cameraPos[0] + CANVAS_WIDTH))) {
                    lineShowCount++;
                    line.Draw();
                }
            }

        }

        this.player.Draw();
        this.bush.Draw();

        this.camera.end();

        if (IS_MOBILE) {
            this.leftButton.Draw();
            this.rightButton.Draw();
            this.AButton.Draw();
            this.BButton.Draw();
        }

        // Fade IN
        if (!this.transition.IsComplete()) {
            if (this.introText.GetString()) {
                this.introTextBackground.Draw();
                this.introText.Draw();
            }
            this.transition.draw();
        }

        // FADE OUT
        if (this.exitTransition && !this.exitTransition.IsComplete()) {
            this.exitTransition.draw();
        }

        if (this.showDebug) {
            this.enemiesShowingText.UpdateString(`Enemies Showing: ${enemyShowCount} / ${this.enemies.length}`);
            this.linesShowingText.UpdateString(`Lines Showing: ${lineShowCount} / ${this.lines.length}`);
            this.isPushingAText.UpdateString(`Is Pushing A: ${this.AButton.IsPushed()}`);
            this.isPushingBText.UpdateString(`Is Pushing B: ${this.BButton.IsPushed()}`);
            this.isPushingLText.UpdateString(`Is Pushing L: ${this.leftButton.IsPushed()}`);
            this.isPushingRText.UpdateString(`Is Pushing R: ${this.rightButton.IsPushed()}`);
            this.isTouchingText.UpdateString(`Is Touching: ${Input.Touch.IsTouching()}`);

            this.enemiesShowingText.Draw();
            this.linesShowingText.Draw();
            this.isPushingAText.Draw();
            this.isPushingBText.Draw();
            this.isPushingLText.Draw();
            this.isPushingRText.Draw();
            this.isTouchingText.Draw();
            const touches = Input.Touch.GetPositions();
            for (const touch of touches) {
                const circ = new Circle(new Vector2(touch.x, touch.y), 10, '#990000ff', '#99000066'); //center, radius, lineColor, fillColor
                this.touchesText.UpdateString(`Touches: x${touch.x} y${touch.y}`);
                this.touchesText.Draw();
                circ.Draw();
            }
        }



    }
}
