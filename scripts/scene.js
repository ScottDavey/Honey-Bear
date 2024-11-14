/*************************************************
*****  SCENE: Sets the stage for each level  *****
*************************************************/

class Scene {
    constructor(selectedLevel) {
        this.selectedLevel = selectedLevel;
        this.player = undefined;
        this.isPlayerRandomPositionKeyLocked = false;

        this.level = STAGES[this.selectedLevel];
        this.isLevelComplete = false;
        this.isLevelEndSequence = false;
        this.worldWidth = this.level.worldWidth;
        this.worldHeight = this.level.worldHeight;
        this.collision = new Collision(this.level.collision);
        this.eventCollision = this.level.eventCollision;

        this.bossData = this.level.boss;
        this.boss = undefined;
        this.bossName = undefined;
        this.bossHealth = undefined;
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
            new Vector2(0, CANVAS_HEIGHT / 2 - 100),
            new Vector2(CANVAS_WIDTH, 200),
            '#5831a0AA',
            1,
            '#FFC436'
        );

        this.pitFallData = this.eventCollision.pitfalls;
        this.pitfalls = [];

        this.genericEventData = this.eventCollision.generic;
        this.genericEvents = [];

        this.checkpointEventData = this.eventCollision.checkpoints;
        this.checkpoints = [];
        this.checkpointReached = undefined;

        this.enemyJumpData = this.eventCollision.enemyjump;
        this.enemyJumps = [];

        this.camera = new Camera();
        this.parallax = new Parallax(this.level.backgrounds, this.worldWidth);

        this.playerHealthBar = undefined;

        this.showDeathText = false;
        this.deathTextBackground = new Texture(
            new Vector2(0, (CANVAS_HEIGHT / 2) - 100),
            new Vector2(CANVAS_WIDTH, 200),
            '#000000AA',
            1,
            '#990000'
        );
        this.deathText = new Text(
            'YOU DIED',
            new Vector2(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2)),
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

        // Sounds Effect IDs
        this.birdSoundID = `birds_${random(10000, 90000)}`;
        this.healSoundID = `heal_${random(10000, 90000)}`;

        this.fronts = [];

    }

    Restart() {

        for (const bear of this.bears) {
            bear.Reset();
        }

        for (const hive of this.beeHives) {
            hive.ResetBees();
        }

        if (this.boss) {
            this.isBossSequence = false;
            SOUND_MANAGER.SetBossSequence(false);
            this.boss.Reset();
        }

        this.player.Reset(this.checkpointReached);

        this.showDeathText = false;
    }

    LoadContent(playerHealth) {
        this.player = new Player(
            new Vector2(this.level.player.start[0], this.level.player.start[1]),
            new Vector2(this.level.player.size[0], this.level.player.size[1])
        );

        const playerMaxHealth = this.player.GetMaxHealth();

        this.playerHealthBar = new StatusBar(
            new Vector2(10, 35),
            new Vector2(200, 30),
            playerMaxHealth,
            '#f8b61d',
            1,
            '#5831a0',
            true
        );

        if (this.level.levelName === 'The Forest') {
            SOUND_MANAGER.AddEffect(this.birdSoundID, new Sound('sounds/effects/birds.ogg', 'SFX', false, null, true, 0.1, false));
            SOUND_MANAGER.PlayEffect(this.birdSoundID);
        }

        SOUND_MANAGER.AddEffect(this.healSoundID, new Sound('sounds/effects/heal.ogg', 'SFX', false, null, false, 0.4, true));

        this.player.SetCurrentHealth(playerHealth || playerMaxHealth);

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

        // ENEMY JUMPS
        this.enemyJumps = this.enemyJumpData.map(jump => {
            return new Rectangle(jump.pos[0], jump.pos[1], jump.size[0], jump.size[1]);
        });

        // CHECKPOINTS
        this.checkpoints = this.checkpointEventData.map(checkpoint => {
            return new Rectangle(checkpoint.pos[0], checkpoint.pos[1], checkpoint.size[0], checkpoint.size[1]);
        });

        // BOSS
        switch (this.bossData.name) {
            case 'Tree Monster':
                this.boss = new TreeMonster(
                    new Vector2(this.bossData.start[0], this.bossData.start[1]),
                    new Vector2(this.bossData.size[0], this.bossData.size[1]),
                    this.camera.getlookat()
                );
        }
        this.boss.Initialize();

        // ENVIRONMENTAL ENTITIES (FRONTS)
        this.fronts = this.level.environmental.map(front => {
            return new Sprite(front.path, new Vector2(front.start[0], front.start[1]), new Vector2(front.size[0], front.size[1]));
        });

        // Clear level data from memory
        this.level = undefined;

        return true;
    }

    UnloadContent() {
        this.player.UnloadContent();

        for (const bear of this.bears) {
            bear.UnloadContent();
        }

        for (const hive of this.beeHives) {
            hive.UnloadContent();
        }

        SOUND_MANAGER.RemoveEffect(this.birdSoundID);
        SOUND_MANAGER.RemoveEffect(this.healSoundID);

        return;
    }

    IsPlayerDead() {
        return (this.player.GetIsDead() && this.player.GetIsDeathDone());
    }

    GetPlayerPosition() {
        return this.player.GetPosition();
    }

    GetPlayerHealth() {
        return this.player.GetCurrentHealth();
    }

    GetBossSequence() {
        return this.isBossSequence;
    }

    // BEHAVIOURS

    CheckHoneyGlobCollisions() {

        const globs = this.player.GetHoneyGlobs();

        for (let g = 0; g < globs.length; g++) {
            const glob = globs[g];
            const globBounds = glob.GetRect();
            const globDamage = glob.GetDamage();

            // If we've already hit but we're waiting on the animation, continue to next glob
            if (glob.GetHasHit()) {
                continue;
            }

            // Check against environment
            if (this.collision.CheckLineCollisionRect(globBounds) ||
                glob.position.x < 0 ||
                glob.position.x > this.worldWidth ||
                glob.position.y > this.worldHeight
            ) {
                glob.SetHasHit(true);
                continue;
            }

            // Only if it's the boss sequence, and the boss isn't dying/dead
            if (this.isBossSequence && this.boss.GetState() > BOSS_STATE.INTRO && this.boss.GetState() < BOSS_STATE.DYING) {

                const bossBounds = this.boss.GetBounds();

                if (this.collision.CheckBoxCollision(globBounds, bossBounds)) {
                    this.boss.DoDamage(globDamage);
                    this.camera.shake(0.3);
                    glob.SetHasHit(true);
                }

            } else {

                // Check against emenies
                for (let b = 0; b < this.bears.length; b++) {
                    const bear = this.bears[b];
                    const bearBounds = bear.GetBounds();

                    if (!bear.GetIsDead()) {

                        if (this.collision.CheckBoxCollision(globBounds, bearBounds)) {
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
                    this.camera.shake(isCrit ? 0.5 : 0.3);

                    if (!bear.GetIsTracking()) {
                        bear.TrackPlayer(true);
                    }
                }
            }

            // Check BOSS
            if (this.isBossSequence
                && this.boss.GetState() > BOSS_STATE.INTRO
                && this.boss.GetState() < BOSS_STATE.DYING
                && this.collision.CheckBoxToRadius(this.boss.GetBounds(), blastCircle)
            ) {
                this.boss.DoDamage(blastDamage);
                this.camera.shake(isCrit ? 0.5 : 0.3);
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

                    if (!bear.GetIsTracking()) {
                        bear.SwitchDirections();
                    }
                }
            }

        }

    }

    CheckEnemyJumpCollision() {

        for (const bear of this.bears) {
            // Only proceed if the bear is tracking the player
            if (!bear.GetIsTracking()) {
                continue;
            }

            for (const jump of this.enemyJumps) {

                const bearBounds = bear.GetBounds();

                // If the bear is colliding with a jump box: Jump
                if (this.collision.CheckBoxCollision(bearBounds, jump)) {
                    bear.SetIsJumping();
                }

            }

        }

    }

    CheckGenericEventCollision() {
        const playerBounds = this.player.GetBounds();

        for (const gen of this.genericEvents) {

            if (this.collision.CheckBoxCollision(playerBounds, gen.bounds)) {

                if (gen.name === 'BOSS' && !this.isBossDefeated && !this.isBossSequence) {
                    this.isBossSequence = true;
                    SOUND_MANAGER.SetBossSequence(true);

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
                } else if (gen.name === 'PIT') {

                    // If the player fell into a pit, take full damage
                    this.player.DoDamage({ amount: this.player.GetCurrentHealth(), isCrit: true });

                }

            }

        }

        // Keep player within the boss area until the fight is over
        //  If the player dies, they'll be returned to the checkpoint
        if (!this.player.GetIsDead() && this.isBossSequence && !this.isBossDefeated) {
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

    CheckCheckpointCollision() {

        const playerBounds = this.player.GetBounds();

        for (const checkpoint of this.checkpoints) {

            if (this.collision.CheckBoxCollision(playerBounds, checkpoint)) {

                this.checkpointReached = new Vector2(checkpoint.left, checkpoint.top);

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

    UpdateCamera() {

        // Camera
        let cameraPosX = (this.player.position.x + this.player.size.x / 2) - CANVAS_WIDTH / 2;
        let cameraPosY = (this.player.position.y + this.player.size.y / 2) - CANVAS_HEIGHT / 2;

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
                randPos.x = random(300, this.worldWidth - 300);
                randPos.y = -500;
                this.player.SetRandomPosition(randPos);
                this.isPlayerRandomPositionKeyLocked = true;
            }
        } else {
            this.isPlayerRandomPositionKeyLocked = false;
        }

        // Check player projectiles (Honey Globs)
        this.CheckHoneyGlobCollisions();
        this.CheckHoneyBlastCollision();
        // Check for Pitfalls
        this.CheckEntityPitfallCollision();
        // Check for enemy jumping
        this.CheckEnemyJumpCollision();
        // Check for Generic Events
        this.CheckGenericEventCollision();
        // Check for Checkpoints
        this.CheckCheckpointCollision();

        // Update Player
        this.player.Update();
        this.playerHealthBar.Update(this.player.GetCurrentHealth());
        this.collision.CheckLineCollisionEntity(this.player);

        // Update Cooldown Text
        this.globAbilityCooldown.SetString(`${this.player.GetHoneyGlobCooldown() || ''}`);
        this.blastAbilityCooldown.SetString(`${this.player.GetHoneyBlastCooldown() || ''}`);

        // Check if the player fell through the collision (and it's not a pit), throw him back up
        if (this.player.GetBounds().top > this.worldHeight && !this.player.GetIsDead()) {
            this.player.SetPosition(new Vector2(this.player.GetPosition().x, -300));
        }

        if (this.isBossSequence) {

            const bossState = this.boss.GetState();

            this.boss.Update(this.player.GetBounds());

            if (bossState === BOSS_STATE.PREINTRO || bossState === BOSS_STATE.INTRO) {
                INPUT.ClearInputs();
                INPUT.SetLocked(true);

                if (bossState === BOSS_STATE.INTRO) {
                    this.camera.shake(0.5);
                }

            } else if (bossState === BOSS_STATE.DEAD) {
                this.isBossSequence = false;
                this.isBossDefeated = true;
                SOUND_MANAGER.SetBossSequence(false);
            }

            // Check for various attacks, only if the player is not invincible
            if (!this.player.GetIsInvincible()) {
                const attackResult = this.boss.CheckAttack(this.collision);

                if (attackResult.hasHit) {
                    this.player.DoDamage(attackResult.damage);
                }
            }

            if (this.boss.GetIsBranchSmash()) {
                this.camera.shake(0.5);
            }

        } else {

            // BEARS
            for (let b = 0; b < this.bears.length; b++) {
                const bear = this.bears[b];

                if (bear.GetIsDead() && bear.GetIsDeathDone()) {
                    bear.UnloadContent();
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

                const collisionGroundType = this.collision.CheckLineCollisionRect(beeHiveBounds, true);

                if (beeHiveState === HIVE_STATE.FALLING && collisionGroundType) {
                    beeHive.SetGroundState(collisionGroundType);
                }

                beeHive.Interact(INPUT.GetInput(KEY_BINDINGS.INTERACT));

                if (beeHive.IsCollecting()) {
                    this.player.Heal(beeHive.GetHoneyPrize(this.player.GetMaxHealth()));
                    SOUND_MANAGER.PlayEffect(this.healSoundID);
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

        DEBUG.Update('PLAYER', `Position X: ${this.player.GetPosition().x}`);
        DEBUG.Update('INVINCIBLE', `Player Invincible: ${this.player.GetIsInvincible() ? 'YES' : 'NO'}`);
        DEBUG.Update('ENEMIESLEFT', `Enemies Remaining: ${this.bears.length}`);
        DEBUG.Update('BOSSSEQ', `Boss Sequence: ${this.isBossSequence ? 'YES' : 'NO'}`);

        // Next Level Cheat
        if (INPUT.GetInput(KEY_BINDINGS.NEXTLEVEL)) {
            this.isLevelComplete = true;
        }

    }

    Draw() {
        const cameraPos = this.camera.getlookat();
        const cameraPlusCanvas = new Vector2(cameraPos.x + CANVAS_WIDTH, cameraPos.y + CANVAS_HEIGHT);

        /***********************
        ***** BEGIN CAMERA *****
        ***********************/

        this.camera.begin();

        this.parallax.Draw();

        if (+this.selectedLevel > 1) {
            this.collision.DrawCollisionLines(cameraPos);
        }

        this.boss.Draw();

        if (!this.isBossSequence) {
            // Bee Hive - before rummaged draw order
            for (const beeHive of this.beeHives) {
                if (beeHive.GetDrawOrder() === 0) {
                    const beeHive0PositionX = beeHive.GetPosition().x;
                    beeHive.Draw();
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
                    beeHive.Draw();
                }
            }
        }

        // FRONT BGs
        for (const front of this.fronts) {
            front.Draw();
        }

        this.camera.end();

        /*******************
        ***** BEGIN UI *****
        *******************/

        if (this.isBossSequence) {
            const bossName = this.boss.GetNameBar();
            const bossHealthBar = this.boss.GetHealthBar();
            if (bossName) {
                bossName.Draw();
            }

            if (bossHealthBar) {
                bossHealthBar.Draw();
            }
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