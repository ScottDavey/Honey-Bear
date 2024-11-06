/*******************
*****  STATES  *****
*******************/

const GAME_STATES = {
    PRIMARY: {
        INTRO: 0,
        MAIN_MENU: 1,
        PLAYING: 2,
        OUTRO: 3,
        LOADING: 4
    },
    SECONDARY: {
        GAME_MENU: 0,
        OPTIONS_MENU: 1,
        TRANSITION: 2
    },
    LEVEL: {
        HUB: 0,
        SCENE: 1,
        BOSS: 2
    }
};

const GAME_MENU = {
    EXIT: -1,
    MAIN: 0,
    OPTIONS: 1,
    SOUND: 2
};

const MAIN_MENU = {
    MAIN: 0,
    OPTIONS: 1,
};

const HIVE_STATE = {
    NEW: 0,
    PARTIALLY_RUMMAGED: 1,
    FALLING: 2,
    ON_GROUND: 3,
    COLLECTING: 4,
    EMPTY: 5
};

const BEE_STATE = {
    HOME: {
        CALM: 0,
        HIGH_ALERT: 1,
    },
    AGGRESSIVE: 2,
    DYING: 3,
    DEAD: 4
};

const BOSS_STATE = {
    PREINTO: 0,
    INTRO: 1,
    IDLE: 2,
    ATTACKINTRO: 3,
    ATTACKING: 4,
    CHASING: 5,
    STUNNED: 6,
    DYING: 7,
    DEAD: 8
};