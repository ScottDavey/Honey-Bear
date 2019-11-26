// GLOBAL VARIABLES
const CANVAS_WIDTH = 1300;
const CANVAS_HEIGHT = 540;
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

let GAME = undefined;
let GAME_PAD_DIV = undefined;
let GAME_PAD = undefined;
let IS_RUNNING = true;
let CANVAS = undefined;
let CONTEXT = undefined;
let HAS_GAME_PAD = false;

function main() {
    // Set up canvas and viewport dimensions
    CANVAS = document.getElementById('viewport');
    CANVAS.width = CANVAS_WIDTH;
    CANVAS.height = CANVAS_HEIGHT;
    CONTEXT = CANVAS.getContext('2d');

    const WRAPPER_DIV = document.getElementById('wrapper')
    WRAPPER_DIV.style.width = `${CANVAS_WIDTH}px`;
    WRAPPER_DIV.style.height = `${CANVAS_HEIGHT}px`;

    GAME_PAD_DIV = document.getElementById('GamePad');

    // Event Listeners (Keyboad / Mouse)
    window.addEventListener('keyup', function (e) { Input.Keys.onKeyUp(e); }, false);
    window.addEventListener('keydown', function (e) { Input.Keys.onKeyDown(e); }, false);
    CANVAS.addEventListener('mousemove', function (e) { Input.Mouse.OnMouseMove.SetPosition(e); }, false);
    CANVAS.addEventListener('mousedown', function (e) { Input.Mouse.OnMouseDown(e); }, false);
    CANVAS.addEventListener('mouseup', function (e) { Input.Mouse.OnMouseUp(e); }, false);

    window.addEventListener('gamepadconnected', function (e) { Input.GamePad.init(); console.log('gamepadconnected'); }, false);
    window.addEventListener('gamepaddisconnected', function (e) { Input.GamePad.deinit(); console.log('gamepaddisconnected'); }, false);

    // Get the gamepad started if it hasn't been already
    Input.GamePad.init();

    GAME = new Game();
    GAME.initialize();
    run();
}

function run() {
    if (IS_RUNNING) {
        GAME.update();
        GAME.draw();
    }
    requestAnimationFrame(run);
}