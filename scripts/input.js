/*****************************************************
**************  INPUT DEFAULT BINDINGS  **************
*****************************************************/

/*
    OTHER BINDING VALUES:
        - GAMEPAD:
            - Y: 3
            - Left Bumper: 4
            - Right Bumper: 5
            - Left Thumbstick (press): 10
            - Right Thumbstick (press): 11
        - KEYBOARD:
            - R: 82
            - F: 70
            - S: 83
*/

const KEY_BINDINGS = {
    CONFIRM: {
        KEYBOARD: { name: 'ENTER', value: 13, },
        GAMEPAD: { name: 'A', value: 0, },
    },
    PAUSE: {
        KEYBOARD: { name: 'ESCAPE', value: 27, },
        GAMEPAD: { name: 'START', value: 9, },
    },
    UP: {
        KEYBOARD: { name: 'UP', value: 38, },
        GAMEPAD: { name: 'UP', value: 12, },
    },
    DOWN: {
        KEYBOARD: { name: 'DOWN', value: 40, },
        GAMEPAD: { name: 'DOWN', value: 13, },
    },
    MOVE_LEFT: {
        KEYBOARD: { name: 'A', value: 65, },
        GAMEPAD: { name: 'LEFT', value: 14, },
    },
    MOVE_RIGHT: {
        KEYBOARD: { name: 'D', value: 68, },
        GAMEPAD: { name: 'RIGHT', value: 15, },
    },
    JUMP: {
        KEYBOARD: { name: 'SPACE', value: 32, },
        GAMEPAD: { name: 'A', value: 0, },
    },
    RANDOM_POSITION: {
        KEYBOARD: { name: 'M', value: 77, },
        GAMEPAD: { name: 'LEFT TRIGGER', value: 6, },
    },
    INTERACT: {
        // KEYBOARD: { name: 'E', value: 69 },
        KEYBOARD: { name: 'F', value: 70 },
        GAMEPAD: { name: 'RIGHT TRIGGER', value: 5 },
    },
    SHOOT: {
        KEYBOARD: { name: 'ENTER', value: 13 },
        GAMEPAD: { name: 'X', value: 2 },
    },
    SPECIAL: {
        KEYBOARD: { name: 'SHIFT', value: 16 },
        GAMEPAD: { name: 'B', value: 1 },
    },
    DEBUG: {
        KEYBOARD: { name: 'CONTROL', value: 17 },
        GAMEPAD: { name: 'BACK', value: 8 },
    }
};

const INPUT_TYPE = {
    KEYBOARD: 'KEYBOARD',
    GAMEPAD: 'GAMEPAD'
};

/******************************************
**************  INPUT CLASS  **************
******************************************/
class Input {

    constructor() {
        this.inputType = INPUT_TYPE.KEYBOARD;
        this.inputs = {};
        this.mousePosition = new Vector2(0, 0);
        this.isMouseDown = false;
        this.isLeftClickPressed = false;
        this.gamePadDiv = document.getElementById('GamePad');
        this.gamePad = undefined;
        this.hasGamePad = false;

        this.GamePadInit();
    }

    GamePadInit() {
        this.gamePad = navigator.getGamepads()[0];

        if (this.gamePad) {
            this.inputType = INPUT_TYPE.GAMEPAD;
            this.hasGamePad = true;
            this.gamePadDiv.childNodes[0].src = 'images/GamePad_Connected.png';
        }
    }

    GamePadDeInit() {
        this.inputType = INPUT_TYPE.KEYBOARD;
        this.gamePad = undefined;
        this.hasGamePad = false;
        this.gamePadDiv.childNodes[0].src = 'images/GamePad_Disconnected.png';
    }

    GetInputType() {
        return this.inputType;
    }

    GetInput(binding) {
        return this.inputs[binding[this.inputType].name];
    }

    GetMousePosition() {
        return this.mousePosition;
    }

    IsMouseDown() {
        return this.isMouseDown;
    }

    OnInputEvent(e, type) {
        
        if (type === 'keydown' || type === 'keyup') {
            const code = e.keyCode;
            let keyBinding;
            
            for (const binding in KEY_BINDINGS) {

                const bindingByType = KEY_BINDINGS[binding][this.inputType];
                if (code === bindingByType.value) {
                    // If we're pressing the key, set to true. Otherwise, false
                    this.inputs[bindingByType.name] = type === 'keydown';
                    break;
                }

            }

        }

        if (type === 'mousemove') {
            this.mousePosition = new Vector2(e.offsetX, e.offsetY);
        }
        
        if (type === 'mousedown') {
            this.isMouseDown = true;
        } else if (type === 'mouseup') {
            this.isMouseDown = false;
        }

    }

    SwitchInputType(inputType = INPUT_TYPE.KEYBOARD) {
        this.inputType = inputType;
        this.inputs = {};   // Clear input list so we don't have cross over
    }

    Update() {

        DEBUG.Update('INPUT', `Input Type: ${Object.keys(INPUT_TYPE).find(key => INPUT_TYPE[key] === this.inputType)}`);
        const mousePos = this.GetMousePosition();
        DEBUG.Update('MOUSE_POS', `Mouse Position: ${mousePos.x}x ${mousePos.y}y`);
        DEBUG.Update('MOUSE_CLICK', `Mouse Click: ${this.isMouseDown ? 'YES' : 'NO'}`);
        DEBUG.Update('ESCAPE', `Escape Key Down: ${this.GetInput(KEY_BINDINGS.PAUSE) ? 'YES' : 'NO'}`);
    }

}