/**********************
*****  BEE HIVES  *****
**********************/

class BeeHive {

    constructor(position, collisionPositionY) {
        this.position = position;
        this.size = new Vector2(30, 40);
        this.collisionPositionY = collisionPositionY - this.size.y;
        this.center = new Vector2(
            this.position.x + 10,
            this.position.y + 30
        );
        this.numberOfBees = random(5, 10);
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
        
        this.HIVE_STATES = {
            NEW: 0,
            PARTIALLY_RUMMAGED: 1,
            FALLING: 2,
            ON_GROUND: 3,
            COLLECTING: 4,
            EMPTY: 5
        };
        this.state = this.HIVE_STATES.NEW;

        this.isRummaging = false;
        this.rummageProgress = 0;
        this.rummageRate = 30;
        this.rummageSound = new Sound('sounds/effects/foliage_rustle.ogg', false, true, false, 0.1, 0);
        this.rummageSoundTimer = undefined;
        this.fallSpeed = 175;

        this.isPlayerInRange = false;
        this.honeyPrize = random(50, 120);

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
        this.hintTextRummage = new HintText('E', 'Rummage', new Vector2(this.position.x, this.position.y), new Vector2(4, -40));
        this.showRummageHint = false;
        this.hintTextCollect = new HintText('E', 'Collect Honey (+)', new Vector2(this.position.x, this.position.y), new Vector2(4, -40));
        this.showCollectHint = false;

        this.LoadBees();
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
        this.hintTextRummage.Update(this.position);
        this.hintTextCollect.Update(this.position);

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

    GetState() {
        return this.state;
    }

    GetPosition() {
        return this.position;
    }

    GetCenter() {
        return this.center;
    }

    GetBees() {
        return this.bees;
    }

    GetHoneyPrize() {
        return this.honeyPrize;
    }

    GetDrawOrder() {
        return (this.state < this.HIVE_STATES.FALLING) ? 0 : 1;
    }

    LoadBees() {
        for (let b = 0; b < this.numberOfBees; b++) {
            this.bees.push(
                new Bee(new Vector2(this.position.x + 20, this.position.y + 25))
            );
        }
    }

    IsCollecting() {
        return this.state === this.HIVE_STATES.COLLECTING;
    }

    Interact(isPresseingActionButton = false) {

        this.showRummageHint = false;
        this.showCollectHint = false;

        if (!this.isPlayerInRange) {
            return;
        }

        if (this.state < this.HIVE_STATES.FALLING) {

            this.showRummageHint = true;

            if (isPresseingActionButton) {
                this.Rummage();
                this.hintTextRummage.SetBorder(this.hintBorder.active, 1);
            } else {
                this.hintTextRummage.SetBorder(this.hintBorder.normal, 1);
            }

        } else if (this.state === this.HIVE_STATES.ON_GROUND) {

            this.showCollectHint = true;

            if (isPresseingActionButton) {
                this.state = this.HIVE_STATES.COLLECTING;
            }

        } else if (this.state === this.HIVE_STATES.COLLECTING) {
            this.state = this.HIVE_STATES.EMPTY;
        }
    }

    Rummage() {
        
        if (this.rummageProgress >= 100) {
            this.state = this.HIVE_STATES.FALLING;
            return;
        }

        const elapsed = GameTime.getElapsed();

        this.isRummaging = true;
        this.state = this.HIVE_STATES.PARTIALLY_RUMMAGED;
        this.RummageSprite.Update(new Vector2(this.position.x, this.position.y));
        this.rummageProgress += this.rummageRate * elapsed;

        this.progressBar.Update(this.rummageProgress);

        this.rummageSound.Play();
    }

    HandleRummagedSequence() {
        const elapsed = GameTime.getElapsed();

        // Step 1: FALLING
        this.position.y += this.fallSpeed * elapsed;

        this.SetHintPosition();

        if (this.position.y >= this.collisionPositionY) {
            this.position.y = this.collisionPositionY;
            this.state = this.HIVE_STATES.ON_GROUND;
            this.SetBeeAggression(true);
        }

    }

    Update(playerCenter) {

        this.isRummaging = false;

        // Check if the player is within rummaging distance
        const diffPos = new Vector2(
            Math.abs(playerCenter.x - this.center.x),
            Math.abs(playerCenter.y - this.center.y)
        );
        this.isPlayerInRange = (diffPos.x < 75 && diffPos.y < 75);

        if (this.state === this.HIVE_STATES.FALLING) {
            this.HandleRummagedSequence();
        }

        for (let b = 0; b < this.bees.length; b++) {
            const bee = this.bees[b];

            if (bee.GetIsDead()) {
                this.bees.splice(b, 1);
                continue;
            }

            bee.Update(this.position, playerCenter);
        }

        this.sprite.Update(this.position);

    }

    Draw() {
        if (this.isRummaging) {
            this.RummageSprite.Draw();
        } else {
            this.sprite.Draw();
        }

        if (this.showRummageHint) {

            this.hintTextRummage.Draw();

            if (this.state < this.HIVE_STATES.FALLING) {
                this.progressBar.Draw();
            }
        }

        if (this.showCollectHint) {
            this.hintTextCollect.Draw();
        }

        for (const bee of this.bees) {
            bee.Draw();
        }
    }

}