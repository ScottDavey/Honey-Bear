/**********************
*****  BEE HIVES  *****
**********************/

class BeeHive {

    constructor(position, collisionPositionY) {
        this.position = position;
        this.size = new Vector2(30, 40);
        this.collisionPositionY = collisionPositionY - this.size.y;
        this.bounds = new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
        this.center = new Vector2(
            this.position.x + 10,
            this.position.y + 30
        );
        this.numberOfBees = random(5, 15);
        this.bees = [];
        this.sprite = new Sprite('images/level_assets/BeeHive.png', new Vector2(this.position.x, this.position.y), new Vector2(this.size.x, this.size.y));
        this.RummageSprite = new Nimation(
            'images/spritesheets/BeeHive_Spritesheet.png',
            new Vector2(this.position.x, this.position.y),
            40,
            30,
            8,
            0,
            0.05,
            true,
            new Vector2(0, 0)
        );
        
        this.state = HIVE_STATE.NEW;

        this.isRummaging = false;
        this.rummageProgress = 0;
        this.rummageRate = 30;
        this.rummageSound = new Sound('sounds/effects/foliage_rustle.ogg', 'SFX', false, false, 0.1, 0);
        this.rummageSoundTimer = undefined;

        this.doesPhysicsApply = false;
        this.gravity = 9000;
        this.maxFallSpeed = 500;
        this.velocityY = 0;

        this.isPlayerInRange = false;
        this.honeyPrize = random(15, 30);

        this.progressBar = new StatusBar(
            new Vector2(this.position.x + 4, this.position.y - 50),
            new Vector2(20, 5),
            100,
            '#F8B61D',
            0,
            '#000000',
            false
        );
        this.progressBar.Update(0);

        this.hintBorder = {
            normal: '#000000',
            active: '#F8B61D'
        };
        const hintKey = KEY_BINDINGS.INTERACT;
        this.hiveHint = new HintText(hintKey, 'Rummage', new Vector2(this.position.x, this.position.y), new Vector2(4, -40));
        this.shouldShowHint = false;
        this.isInteractKeyReleased = true;

        this.LoadBees();
    }

    UnloadContent() {
        for (const bee of this.bees) {
            bee.UnloadContent();
        }
    }

    ResetBees() {
        for (const bee of this.bees) {
            bee.Reset();
        }
    }

    SetIsRummaging(isRummaging) {
        this.isRummaging = isRummaging;
    }

    SetHintPosition() {
        this.hiveHint.Update(this.position);

        this.progressBar.SetPosition(new Vector2(
            this.position.x + 2.5,
            this.position.y - 50
        ));
    }

    SetIsPlayerInRange(isInRange) {
        this.isPlayerInRange = isInRange;
    }

    SetBeeAggression(isAggressive) {
        for (const bee of this.bees) {
            bee.SetAggressive(isAggressive);
        }
    }

    SetGroundState() {
        if (this.state !== HIVE_STATE.ON_GROUND) {
            this.state = HIVE_STATE.ON_GROUND;
            this.SetBeeAggression(true);
        }
    }

    GetBounds() {
        return this.bounds;
    }

    GetState() {
        return this.state;
    }

    GetPosition() {
        return this.position;
    }

    GetCenter() {
        return this.bounds.center;
    }

    GetBees() {
        return this.bees;
    }

    GetHoneyPrize(playerMaxHealth) {
        return playerMaxHealth * (this.honeyPrize / 100);
    }

    GetDrawOrder() {
        return (this.state < HIVE_STATE.FALLING) ? 0 : 1;
    }

    LoadBees() {
        for (let b = 0; b < this.numberOfBees; b++) {
            this.bees.push(
                new Bee(new Vector2(this.position.x + 20, this.position.y + 25))
            );
        }
    }

    IsCollecting() {
        return this.state === HIVE_STATE.COLLECTING;
    }

    Interact(isPressingActionButton = false) {

        if (!this.isPlayerInRange) {
            return;
        }

        if (isPressingActionButton) {

            if (this.state < HIVE_STATE.FALLING) {
                this.Rummage();
            } else if (this.state === HIVE_STATE.ON_GROUND) {
                if (this.isInteractKeyReleased) {
                    this.state = HIVE_STATE.COLLECTING;
                }
            } else if (this.state === HIVE_STATE.COLLECTING) {
                this.state = HIVE_STATE.EMPTY;
            }

            this.isInteractKeyReleased = false;

        } else {

            this.isInteractKeyReleased = true;

        }
    }

    Rummage() {
        
        if (this.rummageProgress >= 100) {
            this.state = HIVE_STATE.FALLING;
            this.hiveHint.SetString('Collect Honey (+)');
            return;
        }

        const elapsed = GameTime.getElapsed();

        this.isRummaging = true;
        this.state = HIVE_STATE.PARTIALLY_RUMMAGED;
        this.RummageSprite.Update(new Vector2(this.position.x, this.position.y));
        this.rummageProgress += this.rummageRate * elapsed;

        this.progressBar.Update(this.rummageProgress);

        this.rummageSound.Play();
    }

    HandleHintVisibility() {

        if (this.isPlayerInRange && this.state !== HIVE_STATE.EMPTY) {
            this.shouldShowHint = true;
        } else {
            this.shouldShowHint = false;
        }

    }

    HandleRummagedSequence() {
        const elapsed = GameTime.getElapsed();

        this.velocityY = Clamp(
            this.velocityY + this.gravity * elapsed,
            -this.maxFallSpeed,
            this.maxFallSpeed
        );

        this.position.y += this.velocityY * elapsed;
        this.position.y = Math.round(this.position.y);

        this.SetHintPosition();

    }

    Update(playerCenter) {

        this.isRummaging = false;

        // Check if the player is within rummaging distance
        const diffPos = new Vector2(
            Math.abs(playerCenter.x - this.bounds.center.x),
            Math.abs(playerCenter.y - this.bounds.center.y)
        );
        this.isPlayerInRange = (diffPos.x < 75 && diffPos.y < 75);

        this.HandleHintVisibility();

        if (this.state === HIVE_STATE.FALLING) {
            this.HandleRummagedSequence();
        }

        for (let b = 0; b < this.bees.length; b++) {
            const bee = this.bees[b];

            if (bee.GetState() === BEE_STATE.DEAD) {
                this.bees.splice(b, 1);
                continue;
            }

            bee.Update(this.position, this.state, playerCenter);
        }

        this.bounds.Update(this.position, this.size);
        this.sprite.Update(this.position);

    }

    Draw() {
        if (this.isRummaging) {
            this.RummageSprite.Draw();
        } else {
            this.sprite.Draw();
        }

        if (this.shouldShowHint) {
            this.hiveHint.Draw();

            if (this.state < HIVE_STATE.FALLING) {
                this.progressBar.Draw();
            }
        }

        for (const bee of this.bees) {
            bee.Draw();
        }
    }

}