// GLOBAL VARIABLES
const CANVAS_WIDTH = 1300;
const CANVAS_HEIGHT = 500;

const DEBUG = new Debug();
const SOUND_MANAGER = new SoundManager();
const INPUT_TYPES = {
    KEYBOARD: 0,
    GAMEPAD: 1,
    TOUCH: 2
};

let FPS = new FPSClass();
let GAME = undefined;
let GAME_PAD_DIV = undefined;
let GAME_PAD = undefined;
let IS_RUNNING = true;
let CANVAS = undefined;
let CONTEXT = undefined;
let IS_MOBILE = false;
let HAS_GAME_PAD = false;
let INPUT_TYPE = INPUT_TYPES.KEYBOARD;

// SETTINGS
let IS_MUSIC_ON = true;
let IS_SFX_ON = true;

function main() {
    // Set up canvas and viewport dimensions
    CANVAS = document.getElementById('viewport');
    CANVAS.width = CANVAS_WIDTH;
    CANVAS.height = CANVAS_HEIGHT;
    CONTEXT = CANVAS.getContext('2d');

    const WRAPPER_DIV = document.getElementById('wrapper')
    WRAPPER_DIV.style.width = `${CANVAS_WIDTH + 4}px`;
    // WRAPPER_DIV.style.height = `${CANVAS_HEIGHT}px`;

    GAME_PAD_DIV = document.getElementById('GamePad');

    // Event Listeners (Keyboad / Mouse / Gamepad / Touch (phone/tablet))
    window.addEventListener('keyup', e => { Input.Keys.onKeyUp(e); }, false);
    window.addEventListener('keydown', e => { Input.Keys.onKeyDown(e); }, false);
    CANVAS.addEventListener('mousemove', e => { Input.Mouse.OnMouseMove.SetPosition(e); }, false);
    CANVAS.addEventListener('mousedown', e => { Input.Mouse.OnMouseDown(e); }, false);
    CANVAS.addEventListener('mouseup', e => { Input.Mouse.OnMouseUp(e); }, false);

    window.addEventListener('gamepadconnected', e => { Input.GamePad.init(); console.log('gamepadconnected'); }, false);
    window.addEventListener('gamepaddisconnected', e => { Input.GamePad.deinit(); console.log('gamepaddisconnected'); }, false);

    CANVAS.addEventListener('touchstart', e => { Input.Touch.OnTouchStart(e); }, false);
    CANVAS.addEventListener('touchend', e => { Input.Touch.OnTouchEnd(e); }, false);
    CANVAS.addEventListener('touchmove', e => { Input.Touch.OnTouchMove(e); }, false);

    // Get the gamepad started if it hasn't been already
    Input.GamePad.init();

    GAME = new Game();
    GAME.initialize();
    run();
}

function run() {
    FPS.Update();

    if (IS_RUNNING) {
        GAME.update();
        GAME.draw();
    }
    requestAnimationFrame(run);
}