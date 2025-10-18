/*********************
*****  ENEMY AI  *****
*********************/

class EnemyAI {
    constructor(bounds, json) {
        this.bounds = bounds;
        this.jump = +(json.jump.enabled || false) === 1 ? true : false;
        this.jumpDirection = +(json.jump.direction || ENEMY_AI_DIRECTIONS.BOTH);
        this.patrol = +(json.patrol.enabled || false) === 1 ? true : false;
        this.patrolDirection = +(json.patrol.direction || ENEMY_AI_DIRECTIONS.BOTH);
        this.noChase = +(json.noChase.enabled || false) === 1 ? true : false;
        this.noChaseDirection = +(json.noChase.direction || ENEMY_AI_DIRECTIONS.BOTH);
    }

    GetBounds() {
        return this.bounds;
    }

    GetJump() {
        return { enabled: this.jump, direction: this.jumpDirection };
    }
    
    GetPatrol() {
        return { enabled: this.patrol, direction: this.patrolDirection };
    }
    
    GetNoChase() {
        return { enabled: this.noChase, direction: this.noChaseDirection };
    }
}