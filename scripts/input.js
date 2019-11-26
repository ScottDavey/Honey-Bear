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
        GetKey: function (keyCode) {
            return Input.Keys._isPressed[keyCode];
        },
        onKeyDown: function (e) {
            Input.Keys._isPressed[e.keyCode] = true;
        },
        onKeyUp: function (e) {
            delete Input.Keys._isPressed[e.keyCode];
        }
    },
    Mouse: {
        _isPressed: {},
        pos: new Vector2(0, 0),
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2,
        GetButton: function (button) {
            return Input.Mouse._isPressed[button];
        },
        GetPosition: function () {
            return Input.Mouse.pos;
        },
        OnMouseDown: function (e) {
            Input.Mouse.pos.x = e.offsetX;
            Input.Mouse.pos.y = e.offsetY;
            Input.Mouse._isPressed[e.button] = true;
        },
        OnMouseUp: function (e) {
            delete Input.Mouse._isPressed[e.button];
        },
        OnMouseMove: {
            pos: new Vector2(0, 0),
            GetPosition: function () { return Input.Mouse.OnMouseMove.pos; },
            SetPosition: function (e) {
                Input.Mouse.OnMouseMove.pos.x = e.offsetX;
                Input.Mouse.OnMouseMove.pos.y = e.offsetY;
            }
        }
    },
    GamePad: { 
        init: function () {
            GAME_PAD = navigator.getGamepads()[0];
            if (GAME_PAD) {
                HAS_GAME_PAD = true;
                GAME_PAD_DIV.childNodes[0].src = 'images/GamePad_Connected.png';
                console.log('Game Pad is connected');
            }
        },
        deinit: function () {
            GAME_PAD = null;
            HAS_GAME_PAD = false;
            GAME_PAD_DIV.childNodes[0].src = 'images/GamePad_Disconnected.png';
            console.log('Game Pad has disconnected');
        },
        Update: function () {
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
    }
};