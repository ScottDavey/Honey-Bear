/****************************************
*****  TREE MONSTER (Level 1 Boss)  *****
****************************************/

class TreeMonster extends Character {

    constructor(position, size) {
        super(position, size, false);
        this.size = size;
        this.health = 1500;
        this.maxMoveSpeed = 100;

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
                duration: 3,
                isProximityBased: false,
                damage: []
            },
            {
                name: 'BRANCH_SMASH',
                duration: 3,
                isProximityBased: true,
                damage: []
            },
            {
                name: 'BEE_FLURRY',
                duration: 3,
                isProximityBased: false,
                damage: []
            }
        ];

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

    Attack() {

        if (!this.attackTimer && !this.attackCooldown) {
            console.log("START ATTACK TIMER!");
            
            this.attackTimer = new Timer(
                GameTime.getCurrentGameTime(),
                this.currentAttack.duration
            );
        } else if (this.attackTimer.IsComplete()) {
            this.attackTimer = undefined;

            console.log("START COOLDOWN");
            this.attackCooldown = new Timer(
                GameTime.getCurrentGameTime(),
                random(attackCooldownDuration[0], attackCooldownDuration[1])
            );
        }
    }

    Update(playerPosition) {

        /*
        
            IDLE: sequence starts in IDLE state.

            IDLE: attack cooldown timer starts, with random duration

            CHASING: while attack cooldown is running, chase player

            ATTACK_READY: when ready, pick random attack

            ATTACKING: perform attack

            CHASING: go back to chasing
        
        */

        const playerPosDiff = new Vector2(
            this.position.x - playerPosition.x,
            this.position.y - playerPosition.y
        );

        this.movement = 0;

        // Check if we can attack
        if ((!this.attackCooldown || this.attackCooldown.IsComplete()) && this.state !== BOSS_STATE.ATTACKING) {

            // Choose a random attack based on where the payer is
            let moveList = this.moveList.map(move => move);

            if (Math.abs(playerPosDiff.x) > 150) {
                moveList = this.moveList.filter(move => !move.isProximityBased);
            }

            // Set our current attack
            this.currentAttack = moveList[random(0, moveList.length - 1)];

            this.Attack();

        } else {

            switch(this.state) {
                case BOSS_STATE.IDLE:
                    if (this.idleTimer.IsComplete()) {
                        this.idleTime = undefined;
                        this.state = BOSS_STATE.CHASING;
                    }
                    break;
                case BOSS_STATE.CHASING:
                    this.dir = playerPosDiff.x < 0 ? 1 : -1;
                    this.movement = this.dir;
                    break;
                default:
                    break;
            }

        }

        super.Update();
    }

    Draw() {
        super.Draw();
    }

}