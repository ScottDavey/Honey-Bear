/**************************
*****  ENTITY STATES  *****
**************************/

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