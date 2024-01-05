/****************************************
*****  TREE MONSTER (Level 1 Boss)  *****
****************************************/

class TreeMonster extends Character {

    constructor(position, size, worldBounds) {
        super(position, size, false);
        this.worldBounds = worldBounds;
        this.size = size;
        this.initialHealth = 6000;
        this.health = this.initialHealth;
        this.maxMoveSpeed = 100;
        this.isCloseToPlayer = false;
        this.playerPosition = new Vector2(0, 0);
        this.shouldMoveTowardsPlayer = false;

        this.state = BOSS_STATE.IDLE;

        const currentGameTime = GameTime.getCurrentGameTime();
        this.idleTimer = new Timer(currentGameTime, 5);
        this.isAttacking = false;
        this.isMeleeAttack = false;
        this.meleeAttackDamage = 0;
        this.meleeAttackDamageRange = [200, 300];
        this.currentAttack = undefined;
        this.attackTimer = undefined;
        this.attackCooldownDuration = [1, 3];
        this.attackCooldown = new Timer(currentGameTime, 5);
        this.moveList = [
            {
                name: 'ACORN_DROP',
                fn: this.AcornDrop,
                duration: 5,
                isProximityBased: false,
                damage: []
            },
            {
                name: 'BRANCH_SMASH',
                fn: this.BranchSmash,
                duration: 4,
                isProximityBased: true,
                damage: []
            },
            {
                name: 'ANIMAL_FLURRY',
                fn: this.AnimalFlurry,
                duration: 3,
                isProximityBased: false,
                damage: []
            }
        ];
        this.acorns = [];
        this.previousAcornDropTime = 0;
        this.animalFlurry = undefined;
        this.canThrowAnimalFlurry = false;

        this.spritesheet = 'images/spritesheets/TreeMonster.png';
        this.animations = {
            idleLeft: new Nimation(
                this.spritesheet,
                new Vector2(this.position.x, this.position.y),
                300,
                300,
                6,
                0,
                0.1,
                true,
                new Vector2(0, 0)),
            idleRight: new Nimation(
                this.spritesheet,
                new Vector2(this.position.x, this.position.y),
                300,
                300,
                6,
                1,
                0.1,
                true,
                new Vector2(0, 0))
        };
    }

    ResetHealth() {
        this.health = this.initialHealth;
    }

    AcornDrop() {

        const currentGameTime = GameTime.getCurrentGameTime();
        const timeSincelastAcornDrop = +(currentGameTime - this.previousAcornDropTime);

        if (this.previousAcornDropTime === 0) {
            this.previousAcornDropTime = currentGameTime;
        }

        // Every 0.25 seconds, release an acorn
        if (+(timeSincelastAcornDrop.toFixed(2)) === 0.25) {
            this.previousAcornDropTime = currentGameTime;

            const position = new Vector2(random(this.worldBounds.x, this.worldBounds.x + CANVAS_WIDTH), -100);
            this.acorns.push(
                new Acorn(position)
            )
        }
    }

    GetAcorns() {
        return this.acorns;
    }

    BranchSmash() {

        this.isMeleeAttack = false;

        if (this.attackTimer.GetRemainder(1) === 3 && this.isCloseToPlayer) {
            this.isMeleeAttack = true;
            this.meleeAttackDamage = random(this.meleeAttackDamageRange[0], this.meleeAttackDamageRange[1]);
        }
    }

    GetIsMeleeAttack() {
        return this.isMeleeAttack;
    }

    GetMeleeAttackDamage() {
        return {
            amount: this.meleeAttackDamage,
            isCrit: false
        };
    }

    AnimalFlurry() {
        if (!this.animalFlurry && this.canThrowAnimalFlurry) {
            this.animalFlurry = new AnimalFlurry(
                this.position,
                this.dir
            );
            this.canThrowAnimalFlurry = false;
        }
    }

    GetAnimalFlurry() {
        return this.animalFlurry;
    }

    HandleAttack() {
        const currentGameTime = GameTime.getCurrentGameTime();

        // COOLDOWN & NEW ATTACK
        if (this.attackCooldown && this.attackCooldown.IsComplete()) {
            this.attackCooldown = undefined;

            // Choose a random move.
            // To provide a wider range of numbers, it'll be a random number out of 1000

            // Get the total move list length
            const moveListLength = this.moveList.length;
            // Get the percetange range each move will have of being chosen. ex: out of 3 moves, each will have 33%
            const moveListSpreadPercentage = Math.floor(1000 / moveListLength);
            // Choose random number out of 1000
            const randomNumber = random(1, 1000);
            // Go through the move list to find the move that falls inside the random number range
            const randomMove = this.moveList.find((move, index) => {
                // Get upper range of percentage based on the move's index value
                const upperPercentRange = (index + 1) * moveListSpreadPercentage;
                // Also get the lower range. This will just be the index * the max range - the range spread
                // ex: index 0, range spread 33% -> { lower: 0, upper: 33 }
                const movePercentRange = { lower: upperPercentRange - moveListSpreadPercentage, upper: upperPercentRange };
                // Check to see if the random number falls within the range
                const isInRange = (randomNumber > movePercentRange.lower && randomNumber <= movePercentRange.upper);

                return isInRange;
            });

            this.currentAttack = randomMove;

            if (this.currentAttack.name === 'ANIMAL_FLURRY') {
                this.canThrowAnimalFlurry = true;
            }

            DEBUG.Update('NEXTATTACK', `Next Attack: ${this.currentAttack.name}`);
        }

        // If we're not yet attacking but we have our next attack ready,
        //  check to see if it's proximity based. If so, move towards player
        //  before starting. Else, start attack
        if (!this.isAttacking && this.currentAttack) {
            if (this.currentAttack.isProximityBased) {
                if (this.isCloseToPlayer) {
                    this.attackTimer = new Timer(currentGameTime, this.currentAttack.duration);                
                    this.shouldMoveTowardsPlayer = false;
                    this.isAttacking = true;
                } else {
                    this.shouldMoveTowardsPlayer = true;
                }
            } else {
                this.attackTimer = new Timer(currentGameTime, this.currentAttack.duration);
                this.isAttacking = true;
            }            
        }

        // If attacking and the timer has completed, reset attack and start cooldown
        if (this.isAttacking && this.attackTimer && this.attackTimer.IsComplete()) {
            this.isAttacking = false;
            this.isMeleeAttack = false;
            this.meleeAttackDamage = 0;
            this.animalFlurry = undefined;
            this.previousAcornDropTime = 0;
            this.attackTimer = undefined;
            this.currentAttack = undefined;

            this.attackCooldown = new Timer(currentGameTime, random(this.attackCooldownDuration[0], this.attackCooldownDuration[1]));
        }

        // WE'RE ATTACKING. call the attack function
        if (this.isAttacking && this.attackTimer && !this.attackTimer.IsComplete() && this.currentAttack) {
            this.currentAttack.fn.apply(this);
        }

        DEBUG.Update('COOLDOWN', `Cooldown: ${this.attackCooldown ? this.attackCooldown.GetRemainder(2) : 'N/A'}`);

    }

    Update(playerPosition) {

        this.playerPosition = playerPosition;

        const playerPosDiff = new Vector2(
            this.bounds.center.x - this.playerPosition.x,
            this.bounds.center.y - this.playerPosition.y
        );

        this.isCloseToPlayer = (Math.abs(playerPosDiff.x) < 100);

        this.movement = 0;

        // Always face the player, unless the current attack is "BRANCH_SMASH" and the attack has begun
        if (!(this.currentAttack && this.currentAttack.name === 'BRANCH_SMASH' && this.isAttacking)) {
            if (playerPosDiff.x < 0) {
                this.sprite = this.animations.idleRight;
                this.dir = 1;
            } else {
                this.sprite = this.animations.idleLeft;
                this.dir = -1;
            }
        }

        if (this.shouldMoveTowardsPlayer) {
            this.movement = this.dir;
        }

        // Handle attacks
        this.HandleAttack();

        for (let a = 0; a < this.acorns.length; a++) {
            const acorn = this.acorns[a];

            acorn.Update();

            if (acorn.GetPosition().y > this.worldBounds.y + CANVAS_HEIGHT || acorn.GetHasHitPlayer()) {
                this.acorns.splice(a, 1);
            }
        }

        if (this.animalFlurry) {
            const animalFlurryPositionX = this.animalFlurry.GetPosition().x;

            this.animalFlurry.Update();

            if (this.animalFlurry.GetHasHitPlayer() ||
                animalFlurryPositionX < this.worldBounds.x ||
                this.animalFlurryPositionX > this.worldBounds.x + CANVAS_WIDTH
            ) {
                this.animalFlurry = undefined;
            }
        }

        super.Update();
    }

    Draw() {
        super.Draw();

        for (const acorn of this.acorns) {
            acorn.Draw();
        }

        if (this.animalFlurry) {
            this.animalFlurry.Draw();
        }
    }

}