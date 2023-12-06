/*******************************************
**************  INPUT OBJECT  **************
*******************************************/
var Input = {
    Keys: {
        _isPressed: {},
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        R: 82,
        M: 77,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32,
        SHIFT: 16,
        CONTROL: 17,
        ESCAPE: 27,
        ENTER: 13,
        GetKey(keyCode) {
            return Input.Keys._isPressed[keyCode];
        },
        onKeyDown(e) {
            Input.Keys._isPressed[e.keyCode] = true;
        },
        onKeyUp(e) {
            delete Input.Keys._isPressed[e.keyCode];
        }
    },
    Mouse: {
        _isPressed: {},
        pos: new Vector2(0, 0),
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2,
        GetButton(button) {
            return Input.Mouse._isPressed[button];
        },
        GetPosition() {
            return Input.Mouse.pos;
        },
        OnMouseDown(e) {
            Input.Mouse.pos.x = e.offsetX;
            Input.Mouse.pos.y = e.offsetY;
            Input.Mouse._isPressed[e.button] = true;
        },
        OnMouseUp(e) {
            delete Input.Mouse._isPressed[e.button];
        },
        OnMouseMove: {
            pos: new Vector2(0, 0),
            GetPosition() { return Input.Mouse.OnMouseMove.pos; },
            SetPosition(e) {
                Input.Mouse.OnMouseMove.pos.x = e.offsetX;
                Input.Mouse.OnMouseMove.pos.y = e.offsetY;
            }
        }
    },
    GamePad: {
        init() {
            GAME_PAD = navigator.getGamepads()[0];
            if (GAME_PAD) {
                HAS_GAME_PAD = true;
                GAME_PAD_DIV.childNodes[0].src = 'images/GamePad_Connected.png';
                console.log('Game Pad is connected');
            }
        },
        deinit() {
            GAME_PAD = null;
            HAS_GAME_PAD = false;
            GAME_PAD_DIV.childNodes[0].src = 'images/GamePad_Disconnected.png';
            console.log('Game Pad has disconnected');
        },
        Update() {
            if (HAS_GAME_PAD) {

                GAME_PAD = navigator.getGamepads()[0];

                // Refresh GamePad Buttons
                Input.GamePad.A = GAME_PAD.buttons[0];
                Input.GamePad.B = GAME_PAD.buttons[1];
                Input.GamePad.X = GAME_PAD.buttons[2];
                Input.GamePad.Y = GAME_PAD.buttons[3];
                Input.GamePad.START = GAME_PAD.buttons[9];
                Input.GamePad.UP = GAME_PAD.buttons[12];
                Input.GamePad.DOWN = GAME_PAD.buttons[13];
                Input.GamePad.LEFT = GAME_PAD.buttons[14];
                Input.GamePad.RIGHT = GAME_PAD.buttons[15];
                Input.GamePad.AXES.HORIZONTAL = parseFloat(GAME_PAD.axes[0].toFixed(1));
                Input.GamePad.AXES.VERTICAL = parseFloat(GAME_PAD.axes[1].toFixed(1));
            }
        },
        A: {},
        B: {},
        X: {},
        Y: {},
        UP: {},
        DOWN: {},
        LEFT: {},
        RIGHT: {},
        START: {},
        AXES: {
            VERTICAL: {},
            HORIZONTAL: {}
        }
    },
    Touch: {
        _isPressed: false,
        positions: [],
        IsTouching() {
            return Input.Touch._isPressed;
        },
        GetPositions() {
            return Input.Touch.positions;
        },
        SetPosition(touches) {
            Input.Touch.positions = [];

            if (touches.length > 0) {
                Input.Touch._isPressed = true;

                for (const touch of touches) {
                    // Not sure why but the position of the sprite on screen seems to be slightly different from the touch position
                    // We need to offset it accordingly
                    const xOffset = Math.round(touch.clientX) - 42;
                    const yOffset = Math.round(touch.clientY) - 14;
                    Input.Touch.positions.push(new Vector2(xOffset, yOffset));
                }
            } else {
                Input.Touch._isPressed = false;
            }
        },
        OnTouchStart(e) {
            // On the first touch, set IS_MOBILE to true
            if (!IS_MOBILE) IS_MOBILE = true;

            const touches = e.touches;
            Input.Touch.SetPosition(touches);
            e.preventDefault(); // This prevents bring up the context menu on a long-hold touch
        },
        OnTouchEnd(e) {
            const touches = e.touches;
            Input.Touch.SetPosition(touches);
        },
        OnTouchMove(e) {
            const touches = e.touches;
            Input.Touch.SetPosition(touches);
        }
    }
};