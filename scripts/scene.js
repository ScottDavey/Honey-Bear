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

        this.boss = undefined;
        this.bossName = new TextC(
            'Tree Monster',
            new Vector2(CANVAS_WIDTH / 2 - 200, 15),
            'Lobster, Raleway',
            'normal',
            20,
            '#FFFFFF',
            'left'
        );
        this.bossHealth = new StatusBar(
            new Vector2(CANVAS_WIDTH / 2 - 200, 30),
            new Vector2(400, 40),
            0,
            '#990000',
            2,
            '#550000',
            true
        );
        this.isBossSequence = false;
        this.bossSequenceIntro = undefined;
        this.bossSequenceIntroComplete = false;
        this.bossAreaBounds = undefined;
        this.isBossDefeated = false;
        
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
        this.introText = new TextC(
            this.level.introText,
            new Vector2(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
            'Poiret One, Verdana',
            'normal',
            60,
            '#FFFFFF',
            'center'
        );
        this.introTextBackground = new Texture(
            new Vector2(0, CANVAS_HEIGHT / 2 - 50),
            new Vector2(CANVAS_WIDTH, 100),
            '#5831a0AA',
            1,
            '#FFC436'
        );
        
        this.pitFallData = this.eventCollision.pitfalls;
        this.pitfalls = [];

        this.genericEventData = this.eventCollision.generic;
        this.genericEvents = [];
        
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
            1,
            '#5831a0',
            true
        );

        this.showDeathText = false;
        this.deathTextBackground = new Texture(
            new Vector2(0, (CANVAS_HEIGHT / 2) - 150),
            new Vector2(CANVAS_WIDTH, 100),
            '#000000AA',
            1,
            '#990000'
        );
        this.deathText = new TextC(
            'YOU DIED',
            new Vector2(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) - 100),
            'Joesfin Sans, Verdana',
            'normal',
            36,
            '#990000',
            'center'
        );

        // Ability Icons / Cooldowns
        this.globAbilityIcon = new Sprite('images/level_assets/AbilityIcon_Glob.png', new Vector2(10, 70), new Vector2(31, 31));
        this.globAbilityCooldownOverlay = new Texture(new Vector2(10, 70), new Vector2(31, 31), '#00000088', 1, '#00000088');
        this.globAbilityCooldown = new TextC(
            '0',
            new Vector2(
                this.globAbilityIcon.GetPosition().x + (this.globAbilityIcon.GetSize().x / 2),
                this.globAbilityIcon.GetPosition().y + (this.globAbilityIcon.GetSize().y / 2)
            ),
            'Jura, Verdana',
            'normal',
            12,
            '#FFFFFF',
            'center'
        );
        this.blastAbilityIcon = new Sprite('images/level_assets/AbilityIcon_Blast.png', new Vector2(46, 70), new Vector2(31, 31));
        this.BlastAbilityCooldownOverlay = new Texture(new Vector2(46, 70), new Vector2(31, 31), '#00000088', 1, '#00000088');
        this.blastAbilityCooldown = new TextC(
            '0',
            new Vector2(
                this.blastAbilityIcon.GetPosition().x + (this.blastAbilityIcon.GetSize().x / 2),
                this.blastAbilityIcon.GetPosition().y + (this.blastAbilityIcon.GetSize().y / 2)
            ),
            'Jura, Verdana',
            'normal',
            12,
            '#FFFFFF',
            'center'
        );
        
        this.bears = [];

        // Collectibles
        this.beeHives = [];

        // MUSIC
        this.backgroundMusic = undefined;
        this.backgroundMusicSources = [
            { path: 'Seneca.mp3', defaultVolume: 0.4 },
            { path: 'MUSIC_The-Forgotten_Forest.mp3', defaultVolume: 0.2 },
            { path: 'BloodOnBlood.mp3', defaultVolume: 0.4 },
            { path: 'Halloween.mp3', defaultVolume: 0.4 },
            { path: 'MUSIC_The-Forgotten_Forest.mp3', defaultVolume: 0.2 }
        ];

        // Sounds Effects
        this.birds = undefined;
        this.honeyGlobHitSound = new Sound('sounds/effects/splat.ogg', false, true, false, 0.2, 0);

        this.caveFront = new Sprite('images/backgrounds/FOREST_CAVE-FRONT.png', new Vector2(0, 0), new Vector2(123, 648));
        this.twilightExit = new Texture(
            new Vector2(5877, 458),
            new Vector2(123, 170),
            '#141414',
            1,
            '#141414'
        );
    }

    Restart() {
        
        for (const bear of this.bears) {
            bear.Reset();
        }

        for (const hive of this.beeHives) {
            hive.ResetBees();
        }

        this.player.Initialize(
            new Vector2(this.level.player.start[0], this.level.player.start[1]),
            new Vector2(this.level.player.size[0], this.level.player.size[1])
        );
        this.showDeathText = false;
    }

    LoadContent() {
        // LOAD BEARS
        this.bears = this.level.bears.map(bear => {
            return new Bear(
                new Vector2(bear.start[0], bear.start[1]),
                new Vector2(bear.size[0], bear.size[1])
            );
        });

        this.beeHives = this.level.beeHives.map(hive => {
            const position = new Vector2(hive.start[0], hive.start[1]);
            const collisionPositionY = this.collision.GetLineYCollisionFromPosition(position);
            
            return new BeeHive(position, collisionPositionY);
        });

        // PITFALLS
        this.pitfalls = this.pitFallData.map(pitfall => {
            return new Rectangle(pitfall.pos[0], pitfall.pos[1], pitfall.size[0], pitfall.size[1]);
        });

        // GENERIC EVENTS
        this.genericEvents = this.genericEventData.map(gen => {
            
            const bounds = new Rectangle(gen.pos[0], gen.pos[1], gen.size[0], gen.size[1]);

            if (gen.name === 'BOSS') {
                this.bossAreaBounds = bounds;
            }

            return {
                bounds,
                name: gen.name
            };
        });

        // LOAD SONG
        const backgroundMusicChoice = this.backgroundMusicSources[this.selectedLevel];
        this.backgroundMusic = new Sound(
            `sounds/music/${backgroundMusicChoice.path}`,
            true,
            true,
            false,
            backgroundMusicChoice.defaultVolume,
            1.0
        );
        // this.backgroundMusic.Play();

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
            const globDamage = glob.GetDamage();
            
            // Check against environment
            if (this.collision.CheckLineCollisionRect(globBounds) ||
                glob.position.x < 0 ||
                glob.position.x > this.worldWidth ||
                glob.position.y > this.worldHeight
            ) {
                glob.SetHasHit(true);
                continue;
            }

            if (this.isBossSequence) {
                
                const bossBounds = this.boss.GetBounds();

                if (this.collision.CheckBoxCollision(globBounds, bossBounds)) {
                    this.boss.DoDamage(globDamage);
                    this.honeyGlobHitSound.Play();
                    this.camera.shake(0.3);
                    glob.SetHasHit(true);

                    if (this.boss.GetIsDead()) {
                        this.isBossDefeated = true;
                        this.isBossSequence = false;
                    }
                }

            } else {

                // Check against emenies
                for (let b = 0; b < this.bears.length; b++) {
                    const bear = this.bears[b];
                    const bearBounds = bear.GetBounds();

                    if (!bear.GetIsDead()) {

                        if (this.collision.CheckBoxCollision(globBounds, bearBounds)) {
                            bear.DoDamage(globDamage);
                            this.honeyGlobHitSound.Play();
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

    }

    CheckHoneyBlastCollision() {
        const blast = this.player.GetHoneyBlast();

        // If there's an active honey blast...
        if (blast) {
            const blastCircle = blast.GetCircle();
            const blastDamage = blast.GetDamage();
            const isCrit = blastDamage.isCrit;

            // Loop over Bears to see if it's hit any
            for (let b = 0; b < this.bears.length; b++) {
                const bear = this.bears[b];
                const bearBounds = bear.GetBounds();
                const bearKnockbackDir = (bearBounds.center.x > this.player.GetBounds().center.x) ? 1 : -1;

                if (!bear.GetIsDead() && !bear.GetIsStunned() && this.collision.CheckBoxToRadius(bearBounds, blastCircle)) {
                    bear.DoDamage(blastDamage);
                    bear.SetKnockBack(bearKnockbackDir, 1000);
                    this.camera.shake(isCrit ? 0.3 : 0.1);
    
                    if (!bear.GetIsTracking()) {
                        bear.TrackPlayer(true);
                    }
                }
            }

            // Loop over Bee Hives, then Bees
                // can only kill them if they're aggressive
            for (const hive of this.beeHives) {
                for (const bee of hive.GetBees()) {

                    const beeBounds = bee.GetBounds();

                    if (bee.GetIsAggressive() && !bee.GetIsDead() && this.collision.CheckBoxToRadius(beeBounds, blastCircle)) {
                        bee.DoDamage(blastDamage);
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

    CheckGenericEventCollision() {
        const playerBounds = this.player.GetBounds();

        this.isBossSequence = false;

        for (const gen of this.genericEvents) {

            if (this.collision.CheckBoxCollision(playerBounds, gen.bounds)) {

                if (gen.name === 'BOSS' && !this.isBossDefeated) {
                    this.isBossSequence = true;
                    
                    // Set enemies to stop tracking player
                    for (const bear of this.bears) {
                        bear.TrackPlayer(false);
                        
                        // Send bears the other way if they're in the boss area
                        if (bear.GetPosition().x >= gen.bounds.left) {
                            bear.SetDirection(-1);
                        }
                    }

                    for (const hive of this.beeHives) {
                        for (const bee of hive.GetBees()) {
                            const isAggressive = bee.GetIsAggressive();

                            if (isAggressive) {
                                bee.Reset();
                            }
                        }
                    }
                } else if (gen.name === 'PIT' && playerBounds.top >= gen.bounds.top) {
                    this.player.DoDamage({ amount: this.player.GetCurrentHealth(), isCrit: false }, true);
                }

            }

        }

        // Keep player within the boss area until the fight is over
        if (this.isBossSequence && !this.isBossDefeated) {
            const playerPosition = this.player.GetPosition();
            const playerVelocity = this.player.GetVelocity();
            let newPosX = playerPosition.x;
            let newVelX = playerVelocity.x;

            if (playerPosition.x <= this.bossAreaBounds.left) {
                newPosX = this.bossAreaBounds.left;
                newVelX = 0;
            } else if (playerPosition.x >= this.bossAreaBounds.right - this.player.GetSize().x) {
                newPosX = this.bossAreaBounds.right - this.player.GetSize().x;
                newVelX = 0;
            }

            this.player.SetPosition(new Vector2(newPosX, playerPosition.y));
            this.player.SetVelocity(new Vector2(newVelX, playerVelocity.y));
        }
    }

    CheckAcornCollisionWithPlayer() {

        const acorns = this.boss.GetAcorns();
        const playerBounds = this.player.GetBounds();

        for (const acorn of acorns) {
            const acornBounds = acorn.GetBounds();

            if (this.collision.CheckBoxCollision(playerBounds, acornBounds)) {
                acorn.SetHasHitPlayer(true);
                this.player.DoDamage(acorn.GetDamage());
            }
        }

    }

    CheckBeeAggression(bees) {

        for (const bee of bees) {

            if (bee.IsStinging() && !this.player.GetIsDead()) {
                this.player.DoDamage(bee.GetDamage(), true);
            }
        }
    }

    FadeOutSound() {
        const currentGameTime = GameTime.getCurrentGameTime();

        if (this.backgroundMusic && this.backgroundMusic.FadeOut(currentGameTime)) {
            this.backgroundMusic.Stop();
            this.backgroundMusic = undefined;
        }

        if (this.birds && this.birds.FadeOut(currentGameTime)) {
            this.birds.Stop();
            this.birds = undefined;
        }
    }

    UpdateCamera() {
        // Camera
        let cameraPosX = this.player.position.x + this.player.size.x / 2 - CANVAS_WIDTH / 2;
        let cameraPosY = this.player.position.y + this.player.size.y / 2 - CANVAS_HEIGHT / 2;

        // Keep camera within specified bounds. This can be either canvas or boss area
        const xLimit = {
            left: this.isBossSequence ? this.bossAreaBounds.left : 0,
            right: this.isBossSequence ? this.bossAreaBounds.right : this.worldWidth
        };

        if (cameraPosX < xLimit.left) {
            cameraPosX = xLimit.left;
        } else if (cameraPosX > xLimit.right - CANVAS_WIDTH) {
            cameraPosX = xLimit.right - CANVAS_WIDTH;
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
            this.showDeathText = true;

            if (this.player.GetIsDeathDone()) {
                this.Restart();    
            }
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

        this.player.Update();

        this.playerHealthBar.Update(this.player.GetCurrentHealth());
        this.collision.CheckLineCollisionEntity(this.player);
        // Check player projectiles (Honey Globs)
        this.CheckHoneyGlobCollisions();
        this.CheckHoneyBlastCollision();
        // Update Cooldown Text
        this.globAbilityCooldown.SetString(`${this.player.GetHoneyGlobCooldown() || ''}`);
        this.blastAbilityCooldown.SetString(`${this.player.GetHoneyBlastCooldown() || ''}`);

        // Check for Pitfalls
        this.CheckEntityPitfallCollision();
        // Check for Generic Events
        this.CheckGenericEventCollision();

        if (this.isBossSequence) {

            if (!this.boss) {
                this.boss = new TreeMonster(
                    new Vector2(3500, 180),
                    new Vector2(200, 300),
                    this.camera.getlookat()
                );
                this.bossHealth.SetMaxValue(this.boss.GetCurrentHealth());
            }

            this.boss.Update(this.player.GetPosition());
            this.bossHealth.Update(this.boss.GetCurrentHealth());
            this.collision.CheckLineCollisionEntity(this.boss);

            this.CheckAcornCollisionWithPlayer();
        } else {

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

            // BEE HIVES
            for (const beeHive of this.beeHives) {
                const beeHiveState = beeHive.GetState();
                const beeHiveBounds = beeHive.GetBounds();

                beeHive.Update(this.player.GetBounds().center);

                if (beeHiveState === HIVE_STATE.FALLING && this.collision.CheckLineCollisionRect(beeHiveBounds)) {
                    beeHive.SetGroundState();
                }

                this.player.SetInputLock(false);

                beeHive.Interact(Input.Keys.GetKey(Input.Keys.E) || Input.GamePad.Y.pressed);
                
                if (beeHive.IsCollecting()) {
                    this.player.Heal(beeHive.GetHoneyPrize());
                }

                // Check if Bees are aggressive and within range. If so, do damage to the player
                this.CheckBeeAggression(beeHive.GetBees());
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
                    this.FadeOutSound();
                } else {
                    this.isLevelComplete = true;
                }
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

        if (this.isBossSequence) {
            this.boss.Draw();
        }
        
        if (!this.isBossSequence) {
            // Bee Hive - before rummaged draw order
            for (const beeHive of this.beeHives) {
                if (beeHive.GetDrawOrder() === 0) {
                    beeHive.Draw();
                }
            }
        }

        if (!this.isBossSequence) {
            for (const bear of this.bears) {
                bear.Draw();
            }
        }

        this.player.Draw();

        if (!this.isBossSequence) {
            // Bee Hive - after rummaged draw order
            for (const beeHive of this.beeHives) {
                if (beeHive.GetDrawOrder() === 1) {
                    beeHive.Draw();
                }
            }
        }
        
        if (+this.selectedLevel === 0) {
            this.caveFront.Draw();
            this.exitLogFront.Draw();
        } else if (+this.selectedLevel === 1) {
            this.twilightExit.Draw();
        }

        this.camera.end();

        if (this.isBossSequence) {
            this.bossName.Draw();
            this.bossHealth.Draw();
        }

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

        // DEATH
        if (this.showDeathText) {
            this.deathTextBackground.Draw();
            this.deathText.Draw();
        }
    }

 }