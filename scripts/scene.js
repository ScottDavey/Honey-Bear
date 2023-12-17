/*************************************************
 *****  SCENE: Sets the stage for each level  *****
 *************************************************/

 class Scene {
    constructor(selectedLevel, player) {
        this.selectedLevel = selectedLevel;
        this.player = player;
        this.isPlayerRandomPositionKeyLocked = false;
        this.isPlayerDamageKeyLocked = false;

        this.level = stages[this.selectedLevel];
        this.isLevelComplete = false;
        this.isLevelEndSequence = false;
        this.worldWidth = this.level.worldWidth;
        this.worldHeight = this.level.worldHeight;
        this.collision = new Collision(this.level.collision);
        this.eventCollision = this.level.eventCollision;
        this.exit = new Rectangle(
            this.eventCollision.exit.pos[0],
            this.eventCollision.exit.pos[1],
            this.eventCollision.exit.size[0],
            this.eventCollision.exit.size[1]
        );
        this.exitTransition = undefined;
        this.exitLogBack = new Sprite('images/level_assets/FOREST_ExitLog_BACK.png', new Vector2(3801, 464), new Vector2(199, 94));
        this.exitLogFront = new Sprite('images/level_assets/FOREST_ExitLog_FRONT.png', new Vector2(3801, 464), new Vector2(199, 94));
        this.isLevelEndSequence = false;
        this.intoTransition = new Transition('0, 0, 0', 3, 'in');
        const introTextSource = this.level.introText;
        const centeredText = CenterText(introTextSource, 50, new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT));
        this.introText = new Text(introTextSource, centeredText.x, centeredText.y, 'normal 50pt "Poiret One", sans-serif', '#FFFFFF');
        this.introTextBackground = new Texture(
            new Vector2(0, CANVAS_HEIGHT / 2 - 50),
            new Vector2(CANVAS_WIDTH, 100),
            '#5831a0AA',
            1,
            '#FFC436'
        );
        
        this.pitFallData = this.level.eventCollision.pitfalls;
        this.pitfalls = [];
        
        this.camera = new Camera();
        this.parallax = new Parallax(this.level.backgrounds, this.worldWidth);

        this.player.Initialize(
            new Vector2(this.level.player.start[0], this.level.player.start[1]),
            new Vector2(this.level.player.size[0], this.level.player.size[1])
        );
        this.playerHealthBar = new StatusBar(
            new Vector2(10, 35),
            new Vector2(200, 30),
            this.player.GetMaxHealth(),
            '#f8b61d',
            1
        );
        // Ability Icons / Cooldowns
        this.globAbilityIcon = new Sprite('images/level_assets/AbilityIcon_Glob.png', new Vector2(10, 70), new Vector2(31, 31));
        this.globAbilityCooldownOverlay = new Texture(new Vector2(10, 70), new Vector2(31, 31), '#00000088', 1, '#00000088');
        this.globAbilityCooldown = new Text('', 20, 90, 'normal 12pt Jura, Verdana', '#FFFFFF');
        this.blastAbilityIcon = new Sprite('images/level_assets/AbilityIcon_Blast.png', new Vector2(46, 70), new Vector2(31, 31));
        this.BlastAbilityCooldownOverlay = new Texture(new Vector2(46, 70), new Vector2(31, 31), '#00000088', 1, '#00000088');
        this.blastAbilityCooldown = new Text('', 56, 90, 'normal 12pt Jura, Verdana', '#FFFFFF');
        
        this.bears = [];

        // MUSIC
        this.backgroundMusic = undefined;
        this.backgroundMusicSources = [
            { path: 'Seneca.mp3', defaultVolume: 0.4 },
            { path: 'MUSIC_The-Forgotten_Forest.mp3', defaultVolume: 0.2 },
            { path: 'BloodOnBlood.mp3', defaultVolume: 0.4 },
            { path: 'Halloween.mp3', defaultVolume: 0.4 },
            { path: 'MUSIC_The-Forgotten_Forest.mp3', defaultVolume: 0.2 }
        ];

        this.birds = undefined;

        this.caveFront = new Sprite('images/backgrounds/FOREST_CAVE-FRONT.png', new Vector2(0, 0), new Vector2(123, 648));
        this.twilightExit = new Texture(
            new Vector2(5877, 458),
            new Vector2(123, 170),
            '#141414',
            1,
            '#141414'
        );
    }

    LoadContent() {
        // LOAD BEARS
        this.bears = this.level.enemies.map(bear => {
            return new Bear(
                new Vector2(bear.start[0], bear.start[1]),
                new Vector2(bear.size[0], bear.size[1])
            );
        });

        // PITFALLS
        this.pitfalls = this.pitFallData.map(pitfall => {
            return new Rectangle(pitfall.pos[0], pitfall.pos[1], pitfall.size[0], pitfall.size[1]);
        });

        // LOAD SONG
        const backgroundMusicChoice = this.backgroundMusicSources[this.selectedLevel];
        this.backgroundMusic = new Sound(
            `sounds/music/${backgroundMusicChoice.path}`,
            true,
            true,
            false,
            backgroundMusicChoice.defaultVolume,
            1.5
        );
        this.backgroundMusic.Play();

        if (+this.selectedLevel === 0) {
            this.birds = new Sound('sounds/effects/birds.ogg', true, true, false, 0.2, 1.5);
            this.birds.Play();
        }

        return true;
    }

    UnloadContent() {
        return;
    }

    IsPlayerDead() {
        return (this.player.GetIsDead() && this.player.GetIsDeathDone());
    }

    // BEHAVIOURS

    CheckHoneyGlobCollisions() {

        const globs = this.player.GetHoneyGlobs();

        for (let g = 0; g < globs.length; g++) {
            const glob = globs[g];
            const globBounds = glob.GetRect();
            const globDamage = {
                amount: glob.GetDamage(),
                isCrit: false
            };
            
            // Check against environment
            if (this.collision.CheckLineCollisionRect(globBounds) ||
                glob.position.x < 0 ||
                glob.position.x > this.worldWidth ||
                glob.position.y > this.worldHeight
            ) {
                glob.SetHasHit(true);
                continue;
            }

            // Check against emenies
            for (let b = 0; b < this.bears.length; b++) {
                const bear = this.bears[b];
                const bearBounds = bear.GetBounds();
                const bearHeadBounds = bear.GetHeadBounds();

                if (!bear.GetIsDead()) {

                    const isHeadShot = this.collision.CheckBoxCollision(globBounds, bearHeadBounds);
                    const isBodyShot = this.collision.CheckBoxCollision(globBounds, bearBounds);

                    // If it's a head shot, add crit damage
                    if (isHeadShot) {
                        console.log('HEAD SHOT!');
                        globDamage.amount = glob.GetCritDamage();
                        globDamage.isCrit = true;
                    }
                    
                    if (isHeadShot || isBodyShot) {
                        bear.DoDamage(globDamage);
                        this.camera.shake(globDamage.isCrit ? 0.3 : 0.1);
                        glob.SetHasHit(true);

                        if (!bear.GetIsTracking()) {
                            bear.TrackPlayer(true);
                            continue;
                        }
                    }
                }
            }
        }

    }

    CheckHoneyBlastCollision() {
        const blast = this.player.GetHoneyBlast();

        // If there's an active honey blast...
        if (blast) {
            const blastDamage = blast.GetDamage();
            const isCrit = blastDamage.isCrit;

            // Loop over Bears to see if it's hit any
            for (let b = 0; b < this.bears.length; b++) {
                const bear = this.bears[b];
                const bearBounds = bear.GetBounds();
                const bearKnockbackDir = (bearBounds.center.x > this.player.GetBounds().center.x) ? 1 : -1;

                if (!bear.GetIsDead() && !bear.GetIsStunned() && this.collision.CheckBoxToRadius(bearBounds, blast.GetCircle())) {
                    bear.DoDamage(blastDamage);
                    bear.SetKnockBack(bearKnockbackDir, 1000);
                    this.camera.shake(isCrit ? 0.3 : 0.1);
    
                    if (!bear.GetIsTracking()) {
                        bear.TrackPlayer(true);
                    }
                }
            }
        }
    }

    CheckEntityPitfallCollision() {

        // Loop over Pitfalls
        for (const pitfall of this.pitfalls) {

            // Check Bears
            for (const bear of this.bears) {
                const bearBounds = bear.GetBounds();

                if (this.collision.CheckBoxCollision(bearBounds, pitfall)) {
                    bear.SwitchDirections();
                }
            }

        }

    }

    FadeOutMusic() {
        const currentGameTime = GameTime.getCurrentGameTime();

        if (this.backgroundMusic.FadeOut(currentGameTime)) {
            this.backgroundMusic.Stop();
            this.backgroundMusic = undefined;
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
        this.parallax.Update(new Vector2(cameraLookAt.x, cameraLookAt.y));
    }
    
    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        this.UpdateCamera();

        /****************************
        *****  FADE IN (exits)  *****
        ****************************/
        if (!this.intoTransition.IsComplete()) {
            this.intoTransition.update(currentGameTime);
            this.player.SetInputLock(true);
            return;
        }

        /************************
        *****  PLAYER DEAD  *****
        ************************/
        if (this.player.GetIsDead()) {
            this.player.SetInputLock(true);
        }

        /**********************
        *****  GAME PLAY  *****
        **********************/

        if (this.player.GetInputLock() && !this.isLevelEndSequence && !this.player.GetIsDead()) {
            this.player.SetInputLock(false);
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

        
        if (Input.Keys.GetKey(Input.Keys.R)) {
            if (!this.isPlayerDamageKeyLocked) {
                this.player.DoDamage({ amount: 100, isCrit: true });
                this.isPlayerDamageKeyLocked = true;
            }
        } else {
            this.isPlayerDamageKeyLocked = false
        }

        this.player.Update();

        this.playerHealthBar.Update(this.player.GetCurrentHealth());
        this.collision.CheckLineCollisionEntity(this.player);
        // Check player projectiles (Honey Globs)
        this.CheckHoneyGlobCollisions();
        this.CheckHoneyBlastCollision();
        // Update Cooldown Text
        this.globAbilityCooldown.UpdateString(`${this.player.GetHoneyGlobCooldown() || ''}`);
        this.blastAbilityCooldown.UpdateString(`${this.player.GetHoneyBlastCooldown() || ''}`);

        // Check for Pitfalls
        this.CheckEntityPitfallCollision();

        if (this.player.GetIsDead() && !this.player.GetIsDeathDone()) {
            this.backgroundMusic.SetFadeOutDuration(this.player.GetDeathMaxTime() * 2);
            this.FadeOutMusic();
        }

        // BEARS
        for (let b = 0; b < this.bears.length; b++) {
            const bear = this.bears[b];

            if (bear.GetIsDead() && bear.GetIsDeathDone()) {
                this.bears.splice(b, 1);
                continue;
            }

            bear.Update(this.player.GetPosition());
            this.collision.CheckLineCollisionEntity(bear);

            if (bear.IsAttacking() && !this.player.GetIsDead()) {
                this.player.DoDamage({ amount: bear.GetMeleeAttackDamage(), isCrit: false });
            }

            // If the Bear falls, throw it back up
            if (bear.GetPosition().y > (this.worldHeight + 100)) {
                bear.SetPosition(new Vector2(bear.GetPosition().x, -300));
            }
        }

        // EXIT
        if (this.collision.CheckBoxCollision(this.player.GetBounds(), this.exit)) {
            this.isLevelEndSequence = true;
            this.player.SetInputLock(true);

            if (!this.exitTransition) {
                const exitTransitionPosition = new Vector2(
                    this.player.GetPosition.x - CANVAS_WIDTH / 2,
                    0
                );
                this.exitTransition = new Transition('0, 0, 0', 1.5, 'out', exitTransitionPosition);
            }

            if (!this.exitTransition.IsComplete()) {
                this.exitTransition.update(currentGameTime);
                this.FadeOutMusic();
            } else {
                this.isLevelComplete = true;
            }
        }
        
    }

    Draw() {
        const cameraPos = this.camera.getlookat();

        this.camera.begin();

        this.parallax.Draw();

        if (+this.selectedLevel > 1) {
            this.collision.DrawCollisionLines(cameraPos);
        }

        if (+this.selectedLevel === 0) {
            this.exitLogBack.Draw();
        }

        for (const bear of this.bears) {
            bear.Draw();
        }

        this.player.Draw();
        
        if (+this.selectedLevel === 0) {
            this.caveFront.Draw();
            this.exitLogFront.Draw();
        } else if (+this.selectedLevel === 1) {
            this.twilightExit.Draw();
        }

        this.camera.end();

        this.playerHealthBar.Draw();
        this.globAbilityIcon.Draw();
        if (+this.player.GetHoneyGlobCooldown() > 0) {
            this.globAbilityCooldownOverlay.Draw();
            this.globAbilityCooldown.Draw();
        }
        
        this.blastAbilityIcon.Draw();
        if (+this.player.GetHoneyBlastCooldown() > 0) {
            this.BlastAbilityCooldownOverlay.Draw();
            this.blastAbilityCooldown.Draw();
        }

        // Fade IN
        if (!this.intoTransition.IsComplete()) {
            if (this.introText.GetString()) {
                this.introTextBackground.Draw();
                this.introText.Draw();
            }
            this.intoTransition.draw();
        }

        // FADE OUT
        if (this.exitTransition && !this.exitTransition.IsComplete()) {
            this.exitTransition.draw();
        }
    }

 }