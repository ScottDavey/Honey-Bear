/*************************************************
 *****  SCENE: Sets the stage for each level  *****
 *************************************************/

 class Scene {
    constructor(selectedLevel, player) {
        this.selectedLevel = selectedLevel;
        this.player = player;
        this.isPlayerRandomPositionKeyLocked = false;

        this.level = stages[this.selectedLevel];
        this.isLevelComplete = false;
        this.isLevelEndSequence = false;
        this.worldWidth = this.level.worldWidth;
        this.worldHeight = this.level.worldHeight;
        this.collision = new Collision(this.level.collision);
        this.eventCollision = this.level.eventCollision;
        this.exitData = this.eventCollision.exit;
        this.exitVolume = new Rectangle(
            this.exitData.pos[0],
            this.exitData.pos[1],
            this.exitData.size[0],
            this.exitData.size[1]
        );

        this.transition = new Transition('0, 0, 0', 3, 'in');
        this.exitTransition = undefined;
        const introTextSource = this.level.introText;
        const centeredText = CenterText(introTextSource, 17, new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT));
        this.introText = new Text(introTextSource, centeredText.x, centeredText.y, 'normal 30px "Poiret One", sans-serif', '#FFFFFF');
        this.introTextBackground = new Texture(
            new Vector2(0, CANVAS_HEIGHT / 2 - 75),
            new Vector2(CANVAS_WIDTH, 150),
            '#5831a0AA',
            1,
            '#FFC436'
        );
        
        this.camera = new Camera();
        this.parallax = new Parallax(this.level.backgrounds, this.worldWidth);

        this.player.Initialize(
            new Vector2(this.level.player.start[0], this.level.player.start[1]),
            new Vector2(this.level.player.size[0], this.level.player.size[1])
        );
    }

    LoadContent() {
        // Do nothing
        return true;
    }

    IsPlayerDead() {
        return this.player.GetIsDead();
    }

    // BEHAVIOURS

    CheckHoneyGlobCollisions() {

        const globs = this.player.GetHoneyGlobs();

        for (let g = 0; g < globs.length; g++) {
            const glob = globs[g];
            const globBounds = glob.GetRect();
            
            // Check against environment
            if (this.collision.CheckLineCollisionRect(globBounds) ||
                glob.position.x < 0 ||
                glob.position.x > this.worldWidth ||
                glob.position.y > this.worldHeight
            ) {
                globs.splice(g, 1);
            }
        }

    }

    UpdateCamera() {
        // Camera
        let cameraPosX = this.player.position.x + this.player.size.x / 2 - CANVAS_WIDTH / 2;
        let cameraPosY = this.player.position.y + this.player.size.y / 2 - CANVAS_HEIGHT / 2;

        // Keep camera within canvas bounds
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
    }
    
    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        this.UpdateCamera();

        /****************************
        *****  FADE IN (exits)  *****
        ****************************/
        if (!this.transition.IsComplete()) {
            this.transition.update(currentGameTime);
            this.player.SetInputLock(true);
            return;
        }

        if (this.player.GetInputLock() && !this.isLevelEndSequence) {
            this.player.SetInputLock(false);
        }

        /**********************
        *****  GAME PLAY  *****
        **********************/

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
        this.collision.CheckLineCollisionEntity(this.player);
        // Check player projectiles (Honey Globs)
        this.CheckHoneyGlobCollisions();
        
    }

    Draw() {
        const cameraPos = this.camera.getlookat();

        this.camera.begin();

        this.parallax.Draw();

        if (+this.selectedLevel > 0) {
            this.collision.DrawCollisionLines(cameraPos);
        }

        this.player.Draw();

        this.camera.end();

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
    }

 }