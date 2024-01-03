/****************************************
*****  TREE MONSTER (Level 1 Boss)  *****
****************************************/

class TreeMonster extends Character {

    constructor(position, size, worldBounds) {
        super(position, size, false);
        this.worldBounds = worldBounds;
        this.size = size;
        this.health = 2500;
        this.maxMoveSpeed = 100;
        this.isCloseToPlayer = false;
        this.shouldMoveTowardsPlayer = false;

        this.state = BOSS_STATE.IDLE;

        const currentGameTime = GameTime.getCurrentGameTime();
        this.idleTimer = new Timer(currentGameTime, 5);
        this.isAttacking = false;
        this.currentAttack = undefined;
        this.attackTimer = undefined;
        this.attackCooldownDuration = [3, 7];
        this.attackCooldown = new Timer(currentGameTime, 5);
        this.moveList = [
            {
                name: 'ACORN_DROP',
                fn: this.AcornDrop,
                duration: 3,
                isProximityBased: false,
                damage: []
            },
            {
                name: 'BRANCH_SMASH',
                fn: this.BranchSmash,
                duration: 3,
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

        this.sprite = new Nimation(
            'images/spritesheets/TreeMonster.png',
            new Vector2(this.position.x, this.position.y),
            300,
            300,
            6,
            0,
            0.1,
            true,
            new Vector2(0, 0)
        );
    }

    AcornDrop() {
        console.log('AcornDrop');

        if (this.acorns.length === 0) {
            const numberOfAcorns = random(5, 10);
            for (let i = 0; i <= numberOfAcorns; i++) {
                const position = new Vector2(random(this.worldBounds.x, this.worldBounds.x + CANVAS_WIDTH), -100);
                this.acorns.push(
                    new Acorn(position)
                );
            }
        }
    }

    GetAcorns() {
        return this.acorns;
    }

    BranchSmash() {
        console.log('BranchSmash');
    }

    AnimalFlurry() {
        console.log('AnimalFlurry');
    }

    HandleAttack() {
        const currentGameTime = GameTime.getCurrentGameTime();

        // COOLDOWN & NEW ATTACK
        if (this.attackCooldown && this.attackCooldown.IsComplete()) {
            this.attackCooldown = undefined;
            this.currentAttack = this.moveList[random(0, this.moveList.length-1)];
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
            this.attackTimer = undefined;
            this.currentAttack = undefined;

            this.attackCooldown = new Timer(currentGameTime, random(this.attackCooldownDuration[0], this.attackCooldownDuration[1]));
        }

        // WE'RE ATTACKING. call the attack function
        if (this.isAttacking && this.attackTimer && !this.attackTimer.IsComplete()) {
            this.currentAttack.fn.apply(this);
        }

    }

    Update(playerPosition) {

        const playerPosDiff = new Vector2(
            this.position.x - playerPosition.x,
            this.position.y - playerPosition.y
        );

        this.isCloseToPlayer = (Math.abs(playerPosDiff.x) < 150);

        this.movement = 0;

        if (this.shouldMoveTowardsPlayer) {
            this.dir = (playerPosDiff.x < 0) ? 1 : -1;
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

        super.Update();
    }

    Draw() {
        super.Draw();

        for (const acorn of this.acorns) {
            acorn.Draw();
        }
    }

}