/****************************************
*****  TREE MONSTER (Level 1 Boss)  *****
****************************************/

class TreeMonster {

    constructor(position, size, worldBounds) {
        this.position = position;
        this.size = size;
        this.worldBounds = worldBounds;
        this.state = BOSS_STATE.PREINTRO;
        this.bounds = new Rectangle(this.position.x + 365, this.position.y + 240, 200, 150);
        this.initialHealth = 100000;
        this.health = this.initialHealth;
        this.isCloseToPlayer = false;
        this.playerBounds = undefined;

        // STATE DURATIONS
        this.stateTimer = undefined;
        this.preIntroDuration = 3;
        this.introDuration = 2;
        this.attackIntroDuration = 0;   // Determined by the attack type
        this.dyingDuration = 3;

        // SPRITE
        const spritesheet = 'images/spritesheets/TreeMonster_Spritesheet.png';

        // path, pos, frameHeight, frameWidth, totalFrames, animationSeq, speed, isLooping, offset
        this.animations = {
            preIntro: new Nimation(spritesheet,     new Vector2(this.position.x, this.position.y),      439, 936, 1,    0, 0.1,     false,  new Vector2(0, 0)),
            intro: new Nimation(spritesheet,        new Vector2(this.position.x, this.position.y),      439, 936, 11,   1, 0.15,    false,  new Vector2(0, 0)),
            idle: new Nimation(spritesheet,         new Vector2(this.position.x, this.position.y),      439, 936, 2,    2, 0.5,     true,   new Vector2(0, 0)),
            dying: new Nimation(spritesheet,        new Vector2(this.position.x, this.position.y),      439, 936, 6,    3, 0.15,    false,  new Vector2(0, 0)),
            dead: new Nimation(spritesheet,         new Vector2(this.position.x, this.position.y),      439, 936, 1,    4, 0.5,     true,   new Vector2(0, 0)),
            acornDrop: new Nimation(spritesheet,    new Vector2(this.position.x, this.position.y),      439, 936, 1,    5, 0.5,     true,   new Vector2(0, 0)),
        };
        this.sprite = undefined;

        this.eyesPositionCenter = new Vector2(this.bounds.x + 42, this.bounds.y + 45);
        this.eyes = new Sprite('images/entities/TreeMonster_Eyes.png', this.eyesPositionCenter, new Vector2(113, 21));
        this.eyeWhites = new Texture(new Vector2(this.bounds.x, this.bounds.y + 20), new Vector2(200, 75), '#FFFFFF', 1, '#FFFFFF');

        // ATTACKS
        this.moveList = [
            {
                name: 'ACORN_DROP',
                fn: this.AcornDrop,
                duration: 5,
                isProximityBased: false,
                animationSprite: this.animations.acornDrop
            },
            {
                name: 'BRANCH_SMASH',
                fn: this.BranchSmash,
                duration: 5,
                isProximityBased: true,
                animationSprite: this.animations.acornDrop
            },
        ];

        // NAME AND HEALTH
        this.name = new Text('Tree Monster', new Vector2(CANVAS_WIDTH / 2 - 200, 35), 'Lobster, Raleway', 'normal', 20, '#FFFFFF', 'left');
        this.healthBar = new StatusBar(new Vector2(CANVAS_WIDTH / 2 - 200, 50), new Vector2(400, 30), 0, '#990000', 2, '#550000', true, '#FFFFFF');
        this.healthBar.SetMaxValue(this.initialHealth);
        this.statusText = [];
    }

    Initialize() {
        this.sprite = this.animations.preIntro;
    }

    GetNameBar() {
        return this.name;
    }

    GetHealthBar() {
        return this.healthBar;
    }

    GetBounds() {
        return this.bounds;
    }

    GetIsDead() {
        return this.state === BOSS_STATE.DEAD;
    }

    GetState() {
        return this.state;
    }

    SetIsDying() {
        this.state = BOSS_STATE.DYING;
    }

    SetIsDead() {
        this.state = BOSS_STATE.DEAD;
    }

    ResetHealth() {
        this.health = this.initialHealth;
    }

    DoDamage(initialDamage) {
        this.health -= initialDamage.amount;
        this.health = (this.health < 0) ? 0 : this.health;

        this.statusText.push(
            new StatusText(
                'DAMAGE',
                initialDamage.amount,
                initialDamage.isCrit,
                new Vector2(this.bounds.x + (this.bounds.width / 2) - 30, this.bounds.y),
                this.isPlayer
            )
        );

        if (this.state <= BOSS_STATE.STUNNED && this.health <= 0) {
            this.SetIsDying();
            this.deathStartTime = GameTime.getCurrentGameTime();
        }
    }

    HandleEyeMovement() {

        // const currentEyePosition = this.eyes.GetPosition();
        // const targetEyePosition = this.playerBounds;
        // const diff = currentEyePosition.subtract(targetEyePosition);
        // const newEyePosition = new Vector2(
        //     currentEyePosition.x += diff.x * 0.8,
        //     currentEyePosition.y += diff.y * 0.8
        // );

        DEBUG.Update('NEWEYE', `Boss Eyes: X${this.eyes.GetPosition().x} Y${this.eyes.GetPosition().y}`);

        this.eyes.Update(
            new Vector2(
                Clamp(this.playerBounds.x, this.eyesPositionCenter.x - 12, this.eyesPositionCenter.x + 12),
                Clamp(this.playerBounds.y, this.eyesPositionCenter.y - 4, this.eyesPositionCenter.y + 7)
            )
        );

    }

    HandleAnimations() {

        if (!this.sprite) {
            this.sprite = this.animations.intro;
        }

        if (this.state === BOSS_STATE.PREINTRO) {
            this.sprite = this.animations.preIntro;
        } else if (this.state === BOSS_STATE.INTRO) {
            this.sprite = this.animations.intro;
        } else if (this.state === BOSS_STATE.IDLE) {
            this.sprite = this.animations.idle;
            this.HandleEyeMovement();
        } else if (this.state === BOSS_STATE.ATTACKINTRO) {
            // this.sprite = this.animations.acornDrop;
            // These are set during the attack
        } else if (this.state === BOSS_STATE.ATTACK) {
            // this.sprite = this.animations.acornDrop;
            // These are set during the attack
        } else if (this.state === BOSS_STATE.DYING) {
            this.sprite = this.animations.dying;
        } else if (this.state === BOSS_STATE.DEAD) {
            this.sprite = this.animations.dead;
        } else {
            this.sprite = this.animations.idle;
        }

        this.sprite.Update(this.position);

    }

    HandleHealthAndStatusText(currentGameTime) {
        this.healthBar.Update(this.health);

        for (let d = 0; d < this.statusText.length; d ++) {
            const dt = this.statusText[d];

            if (!dt.IsComplete()) {
                dt.Update(currentGameTime);
            } else {
                this.statusText.splice(d, 1);
            }
        }
    }

    Update(playerBounds) {
        const currentGameTime = GameTime.getCurrentGameTime();

        this.playerBounds = playerBounds;

        const playerPosDiff = new Vector2(
            this.bounds.center.x - this.playerBounds.center.x,
            this.bounds.center.y - this.playerBounds.center.y
        );

        this.isCloseToPlayer = (Math.abs(playerPosDiff.x) < 250);

        // HANDLE STATES

        if (!this.state) {
            this.state = BOSS_STATE.PREINTRO;
        }

        if (this.state === BOSS_STATE.PREINTRO) {
            
            if (!this.stateTimer) {
                this.stateTimer = new Timer(currentGameTime, this.preIntroDuration);
            }

            if (this.stateTimer.IsComplete()) {
                this.state = BOSS_STATE.INTRO;
                this.stateTimer = undefined;
            }

        } else if (this.state === BOSS_STATE.INTRO) {

            if (!this.stateTimer) {
                this.stateTimer = new Timer(currentGameTime, this.introDuration);
            }

            if (this.stateTimer.IsComplete()) {
                this.state = BOSS_STATE.IDLE;
                this.stateTimer = undefined;
            }

        } else if (this.state === BOSS_STATE.ATTACKINTRO) {
        
        
        } else if (this.state === BOSS_STATE.ATTACKING) {



        } else if (this.state === BOSS_STATE.DYING) {
            if (!this.stateTimer) {
                this.stateTimer = new Timer(currentGameTime, this.dyingDuration);
            }

            if (this.stateTimer.IsComplete()) {
                this.state = BOSS_STATE.DEAD;
                this.stateTimer = undefined;
            }
        }

        this.HandleAnimations();

        this.HandleHealthAndStatusText(currentGameTime);

        // DEBUG

        DEBUG.Update('BOSSSTATE', `Boss State: ${Object.keys(BOSS_STATE).find(key => BOSS_STATE[key] === this.state)}`);
        if (this.stateTimer) {
            DEBUG.Update('INTROTIMER', `BOSS Timer: ${this.stateTimer.GetRemainder(2)}`);
        }

    }

    Draw () {

        if (this.sprite) {  
            if (this.state === BOSS_STATE.IDLE) {
                this.eyeWhites.Draw();
                this.eyes.Draw();
            }
            this.sprite.Draw();
        }

        for (const dt of this.statusText) {
            dt.Draw();
        }

    }

}