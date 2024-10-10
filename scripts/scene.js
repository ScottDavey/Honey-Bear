/*************************************************
*****  SCENE: Sets the stage for each level  *****
*************************************************/

 class Scene {
    constructor(selectedLevel, player) {
        this.selectedLevel = selectedLevel;
        this.player = player;
        this.isPlayerRandomPositionKeyLocked = false;

        this.level = STAGES[this.selectedLevel];
        this.isLevelComplete = false;
        this.isLevelEndSequence = false;
        this.worldWidth = this.level.worldWidth;
        this.worldHeight = this.level.worldHeight;
        this.collision = new Collision(this.level.collision);
        this.eventCollision = this.level.eventCollision;

        this.boss = undefined;
        this.bossData = this.level.boss;
        this.bossStart = new Vector2(this.bossData.start[0], this.bossData.start[1]);
        this.bossSize = new Vector2(this.bossData.size[0], this.bossData.size[1]);
        this.bossName = new Text(
            this.bossData.name,
            new Vector2(CANVAS_WIDTH / 2 - 200, 35),
            'Lobster, Raleway',
            'normal',
            20,
            '#FFFFFF',
            'left'
        );
        this.bossHealth = new StatusBar(
            new Vector2(CANVAS_WIDTH / 2 - 200, 50),
            new Vector2(400, 30),
            0,
            '#990000',
            2,
            '#550000',
            true,
            '#FFFFFF'
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
        this.introText = new Text(
            this.level.introText,
            new Vector2(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
            'Poiret One, "Century Gothic", sans-serif',
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
        this.deathText = new Text(
            'YOU DIED',
            new Vector2(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) - 100),
            'Joesfin Sans, "Century Gothic", sans-serif',
            'normal',
            36,
            '#990000',
            'center'
        );

        // Ability Icons / Cooldowns
        this.inputType = INPUT.GetInputType();

        this.globAbilityIcon = new Sprite('images/level_assets/AbilityIcon_Glob.png', new Vector2(10, 70), new Vector2(31, 31));
        this.globAbilityCooldownOverlay = new Texture(new Vector2(10, 70), new Vector2(31, 31), '#00000088', 1, '#00000088');
        this.globAbilityCooldown = new Text(
            '0',
            new Vector2(
                this.globAbilityIcon.GetPosition().x + (this.globAbilityIcon.GetSize().x / 2),
                this.globAbilityIcon.GetPosition().y + (this.globAbilityIcon.GetSize().y / 2)
            ),
            'Jura, "Century Gothic", sans-serif',
            'normal',
            12,
            '#FFFFFF',
            'center'
        );
        this.honeyGlobKeyIcon = new Sprite(KEY_BINDINGS.SHOOT[this.inputType].path, new Vector2(15, 103), new Vector2(20, 20));

        this.blastAbilityIcon = new Sprite('images/level_assets/AbilityIcon_Blast.png', new Vector2(46, 70), new Vector2(31, 31));
        this.BlastAbilityCooldownOverlay = new Texture(new Vector2(46, 70), new Vector2(31, 31), '#00000088', 1, '#00000088');
        this.blastAbilityCooldown = new Text(
            '0',
            new Vector2(
                this.blastAbilityIcon.GetPosition().x + (this.blastAbilityIcon.GetSize().x / 2),
                this.blastAbilityIcon.GetPosition().y + (this.blastAbilityIcon.GetSize().y / 2)
            ),
            'Jura, "Century Gothic", sans-serif',
            'normal',
            12,
            '#FFFFFF',
            'center'
        );
        this.honeyBlastKeyIcon = new Sprite(KEY_BINDINGS.SPECIAL[this.inputType].path, new Vector2(51, 103), new Vector2(20, 20));
        
        this.bears = [];

        // Collectibles
        this.beeHives = [];

        // Sounds Effects
        this.birds = undefined;
        this.honeyGlobHitSound = new Sound('sounds/effects/splat.ogg', 'SFX', false, false, 0.2, 0);

        // this.caveFront = new Sprite('images/backgrounds/FOREST_CAVE-FRONT.png', new Vector2(0, 0), new Vector2(123, 648));
        this.forestForegroundFront = new Sprite('images/backgrounds/Forest_Foreground_Fronts.png', new Vector2(0, 0), new Vector2(10000, 648));
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

        if (this.boss) {
            this.boss.ResetHealth();
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

        if (+this.selectedLevel === 0) {
            this.birds = new Sound('sounds/effects/birds.ogg', 'SFX', false, true, 0.1, 1.5);
            this.birds.Play();
        }

        return true;
    }

    UnloadContent() {
        if (this.birds) {
            this.birds.Stop();
        }
        
        this.player.UnloadContent();
        
        for (const bear of this.bears) {
            bear.UnloadContent();
        }

        for (const hive of this.beeHives) {
            hive.UnloadContent();
        }

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

            // Check BOSS
            if (this.isBossSequence && !this.isBossDefeated && this.collision.CheckBoxToRadius(this.boss.GetBounds(), blastCircle)) {
                this.boss.DoDamage(blastDamage);
            }

            // Loop over Bee Hives, then Bees
                // can only kill them if they're aggressive
            for (const hive of this.beeHives) {
                for (const bee of hive.GetBees()) {

                    const beeBounds = bee.GetBounds();

                    if (bee.GetState() === BEE_STATE.AGGRESSIVE && this.collision.CheckBoxToRadius(beeBounds, blastCircle)) {
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

                if (gen.name === 'BOSS' && !this.isBossDefeated && !this.isBossSequence) {
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
                            const isAggressive = bee.GetState() === BEE_STATE.AGGRESSIVE;

                            if (isAggressive) {
                                bee.Reset();
                            }
                        }
                    }
                }
                
                /*else if (gen.name === 'PIT' && playerBounds.top >= gen.bounds.top) {
                    this.player.DoDamage({ amount: this.player.GetCurrentHealth(), isCrit: false }, true);
                }*/

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
            } else if (playerPosition.x >= (this.bossAreaBounds.left + CANVAS_WIDTH) - this.player.GetSize().x) {
                newPosX = (this.bossAreaBounds.left + CANVAS_WIDTH) - this.player.GetSize().x;
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

    CheckAnimalFlurryCollisionWithPlayer() {

        const animalFlurry = this.boss.GetAnimalFlurry();

        if (animalFlurry) {
            const animalFlurryBounds = animalFlurry.GetBounds();
            const playerBounds = this.player.GetBounds();

            if (this.collision.CheckBoxCollision(animalFlurryBounds, playerBounds)) {
                this.player.DoDamage(animalFlurry.GetDamage());
                animalFlurry.SetHasHitPlayer(true);
            }
        }
    }

    CheckBees(bees) {
        for (const bee of bees) {

            // Sting player if the bees are stining and they're not dying or in a dying state
            if (bee.GetState() < BEE_STATE.DYING && bee.IsStinging() && !this.player.GetIsDead()) {
                this.player.DoDamage(bee.GetDamage(), true);
            }

            // If the bees are dying, check collision
            if (bee.GetState() === BEE_STATE.DYING) {
                this.collision.CheckLineCollisionEntity(bee)
            }
        }
    }

    FadeOutSound() {
        const currentGameTime = GameTime.getCurrentGameTime();
    }

    UpdateCamera() {
        
        // Camera
        let cameraPosX = this.player.position.x + this.player.size.x / 2 - CANVAS_WIDTH / 2;
        let cameraPosY = this.player.position.y + this.player.size.y / 2 - CANVAS_HEIGHT / 2;

        if (this.isBossSequence) {
            
            // Keep camera within specified bounds. This can be either canvas or boss area
            this.camera.moveTo(this.bossAreaBounds.left, this.worldHeight - CANVAS_HEIGHT);
            
            return;
        }

        // Make sure X and Y camera position stops at world edges
        if (cameraPosX < 0) {
            cameraPosX = 0;
        } else if (cameraPosX + CANVAS_WIDTH > this.worldWidth) {
            cameraPosX = this.worldWidth - CANVAS_WIDTH;
        }

        if (cameraPosY < 0) {
            cameraPosY = 0;
        } else if (cameraPosY + CANVAS_HEIGHT > this.worldHeight) {
            cameraPosY = this.worldHeight - CANVAS_HEIGHT;
        }

        // Move camera
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
            INPUT.SetLocked(true);
            return;
        }

        /************************
        *****  PLAYER DEAD  *****
        ************************/
        if (this.player.GetIsDead()) {
            INPUT.SetLocked(true);
            this.showDeathText = true;

            if (this.player.GetIsDeathDone()) {
                this.Restart();    
            }
        }

        /**********************
        *****  GAME PLAY  *****
        **********************/

        if (INPUT.IsLocked() && !this.isLevelEndSequence && !this.player.GetIsDead()) {
            INPUT.SetLocked(false);
        }

        if (INPUT.GetInput(KEY_BINDINGS.RANDOM_POSITION)) {
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
        // Check if the player fell into a pit
        if (this.player.GetBounds().top > this.worldHeight) {
            this.player.DoDamage({ amount: this.player.GetCurrentHealth(), isCrit: true });
        }

        // Check for Pitfalls
        this.CheckEntityPitfallCollision();
        // Check for Generic Events
        this.CheckGenericEventCollision();

        if (this.isBossSequence) {

            if (!this.boss) {
                this.boss = new TreeMonster(
                    this.bossStart,
                    this.bossSize,
                    this.camera.getlookat()
                );
                this.bossHealth.SetMaxValue(this.boss.GetCurrentHealth());
            }

            this.boss.Update(this.player.GetBounds());
            this.bossHealth.Update(this.boss.GetCurrentHealth());
            this.collision.CheckLineCollisionEntity(this.boss);

            this.CheckAcornCollisionWithPlayer();
            this.CheckAnimalFlurryCollisionWithPlayer();

            const branchSmashBounds = this.boss.GetBranchSmashBounds();

            if (branchSmashBounds && this.collision.CheckBoxCollision(branchSmashBounds, this.player.GetBounds())) {
                this.player.DoDamage(this.boss.GetBranchSmashDamage());
            }
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

                //INPUT.SetLocked(false);

                beeHive.Interact(INPUT.GetInput(KEY_BINDINGS.INTERACT));
                
                if (beeHive.IsCollecting()) {
                    this.player.Heal(beeHive.GetHoneyPrize(this.player.GetMaxHealth()));
                }

                this.CheckBees(beeHive.GetBees());
            }

            // EXIT
            if (this.collision.CheckBoxCollision(this.player.GetBounds(), this.exit)) {
                this.isLevelEndSequence = true;
                INPUT.SetLocked(true);

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

        // Update our ability icons if our input source changes
        if (this.inputType !== INPUT.GetInputType()) {
            this.inputType = INPUT.GetInputType();

            this.honeyGlobKeyIcon.SetImage(KEY_BINDINGS.SHOOT[this.inputType].path);
            this.honeyBlastKeyIcon.SetImage(KEY_BINDINGS.SPECIAL[this.inputType].path);
        }

        // DEBUG.Update('PLAYER', `Position X: ${this.player.GetPosition().x}`);
        // DEBUG.Update('ENEMIESLEFT', `Enemies Remaining: ${this.bears.length}`);
        // DEBUG.Update('BOSSSEQ', `Boss Sequence: ${this.isBossSequence ? 'YES' : 'NO'}`);
        
        const totalHives = this.beeHives.length;
        let hivesRumaged = 0;
        let hivesCollected = 0;

        for (const hive of this.beeHives) {
            const hiveState = hive.GetState();
            hivesRumaged += hiveState >= HIVE_STATE.FALLING ? 1 : 0;
            hivesCollected += hiveState === HIVE_STATE.EMPTY;
        }
        
        // DEBUG.Update('HIVES', `Hives T: ${totalHives} | R: ${hivesRumaged} | C: ${hivesCollected}`);
        
    }

    Draw() {
        const cameraPos = this.camera.getlookat();
        const cameraPlusCanvas = new Vector2(cameraPos.x + CANVAS_WIDTH, cameraPos.y + CANVAS_HEIGHT);

        this.camera.begin();

        this.parallax.Draw();

        if (+this.selectedLevel > 1) {
            this.collision.DrawCollisionLines(cameraPos);
        }

        if (+this.selectedLevel === 1) {
            const exitLogPositionX = this.exitLogBack.GetPosition().x;
            if (exitLogPositionX > cameraPos.x && exitLogPositionX < cameraPlusCanvas.x) {
                this.exitLogBack.Draw();
            }
        }

        if (this.isBossSequence) {
            this.boss.Draw();
        }
        
        if (!this.isBossSequence) {
            // Bee Hive - before rummaged draw order
            for (const beeHive of this.beeHives) {
                if (beeHive.GetDrawOrder() === 0) {
                    const beeHive0PositionX = beeHive.GetPosition().x;
                    
                    // if (beeHive0PositionX > cameraPos.x && beeHive0PositionX < cameraPlusCanvas.x) {
                        beeHive.Draw();
                    // }
                }
            }
        
            for (const bear of this.bears) {
                const bearPositionX = bear.GetPosition().x;
                if (bearPositionX > cameraPos.x && bearPositionX < cameraPlusCanvas.x) {
                    bear.Draw();
                }
            }
        }

        this.player.Draw();

        if (!this.isBossSequence) {
            // Bee Hive - after rummaged draw order
            for (const beeHive of this.beeHives) {
                if (beeHive.GetDrawOrder() === 1) {
                    const beeHive1PositionX = beeHive.GetPosition().x;
                    
                    // if (beeHive1PositionX > cameraPos.x && beeHive1PositionX < cameraPlusCanvas.x) {
                        beeHive.Draw();
                    // }
                }
            }
        }
        
        if (+this.selectedLevel === 0) {
            this.forestForegroundFront.Draw();
        } else if (+this.selectedLevel === 1) {
            // this.caveFront.Draw();
            this.exitLogFront.Draw();
        } else if (+this.selectedLevel === 2) {
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
        this.honeyGlobKeyIcon.Draw();
        
        this.blastAbilityIcon.Draw();
        if (+this.player.GetHoneyBlastCooldown() > 0) {
            this.BlastAbilityCooldownOverlay.Draw();
            this.blastAbilityCooldown.Draw();
        }
        this.honeyBlastKeyIcon.Draw();

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