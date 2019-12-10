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
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32,
        SHIFT: 16,
        CONTROL: 17,
        ESCAPE: 27,
        ENTER: 13,
        SHIFT: 16,
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
        pos: new Vector2(0, 0),
        IsTouching() {
            return Input.Touch._isPressed;
        },
        GetPosition() {
            return Input.Touch.pos;
        },
        OnTouchStart(e) {
            // const touch = e.touches[0];
            // Input.Touch.pos = new Vector2(touch.screenX, touch.screenY);
            Input.Touch.pos = Input.Mouse.OnMouseMove.GetPosition();
            Input.Touch._isPressed = true;
        },
        OnTouchEnd() {
            Input.Touch._isPressed = false;
        },
        OnTouchMove(e) {
            // const touch = e.touches[0];
            // Input.Touch.pos = new Vector2(touch.screenX, touch.screenY);
            Input.Touch.pos = Input.Mouse.OnMouseMove.GetPosition();
        }
    }
};