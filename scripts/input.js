/*****************************************************
**************  INPUT DEFAULT BINDINGS  **************
*****************************************************/
const INPUT = {
    CONFIRM: {
        KEYBOARD: ['ENTER', 'LEFT_CLICK'],
        GAMEPAD: 'A',
        TOUCH: 'IS_TOUCHING'
    },
    BACK: {
        KEYBOARD: 'ESCAPE',
        GAMEPAD: ['BACK', 'B'],
        TOUCH: false
    },
    MOVE: {
        LEFT: {
            KEYBOARD: ['A', 'LEFT_ARROW'],
            GAMEPAD: ['LEFT_D_PAD', ['THUMBSTICK', -1]]
        }
    }
};

/*******************************************
**************  INPUT CLASS  **************
*******************************************/

const Input = {};